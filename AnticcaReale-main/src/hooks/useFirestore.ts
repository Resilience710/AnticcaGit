import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  runTransaction,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Shop, Product, Order, FilterState, BlogPost, BlogCategory, Bid, User } from '../types';

// Generic hook for fetching a single document
export function useDocument<T>(collectionName: string, id: string | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchDoc() {
      try {
        if (!id) return;
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [collectionName, id]);

  return { data, loading, error };
}

// Hook for fetching shops
export function useShops(activeOnly: boolean = true) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        // Fetch all shops and filter client-side to avoid index requirements
        const q = query(collection(db, 'shops'));
        const snapshot = await getDocs(q);

        let shopData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Shop[];

        // Filter active only if needed
        if (activeOnly) {
          shopData = shopData.filter(shop => shop.isActive === true);
        }

        // Sort by name
        shopData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        console.log('Fetched shops (activeOnly=' + activeOnly + '):', shopData);
        setShops(shopData);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, [activeOnly]);

  return { shops, loading, error };
}

// Hook for fetching products with filters
export function useProducts(filters?: FilterState, limitCount?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all products and filter client-side to avoid index requirements
        const q = query(collection(db, 'products'));
        const snapshot = await getDocs(q);

        let productData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        console.log('Raw products from Firestore:', productData);

        // Filter active only
        productData = productData.filter(p => p.isActive === true);

        // Apply filters client-side
        if (filters?.category) {
          productData = productData.filter(p => p.category === filters.category);
        }

        if (filters?.shopId) {
          productData = productData.filter(p => p.shopId === filters.shopId);
        }
        if (filters?.minPrice !== undefined) {
          productData = productData.filter((p) => p.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
          productData = productData.filter((p) => p.price <= filters.maxPrice!);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          productData = productData.filter(
            (p) =>
              (p.name || '').toLowerCase().includes(searchLower) ||
              (p.description || '').toLowerCase().includes(searchLower)
          );
        }
        if (filters?.saleType) {
          productData = productData.filter(p => p.saleType === filters.saleType);
        }

        // Sort
        if (filters?.sortBy === 'price-asc') {
          productData.sort((a, b) => a.price - b.price);
        } else if (filters?.sortBy === 'price-desc') {
          productData.sort((a, b) => b.price - a.price);
        } else {
          // Sort by newest (createdAt desc)
          productData.sort((a, b) => {
            const dateA = (a.createdAt as any)?.toDate?.() || a.createdAt || new Date(0);
            const dateB = (b.createdAt as any)?.toDate?.() || b.createdAt || new Date(0);
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
        }

        // Apply limit
        if (limitCount) {
          productData = productData.slice(0, limitCount);
        }

        console.log('Filtered products (isActive=true):', productData);
        setProducts(productData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters, limitCount]);

  return { products, loading, error, refetch: () => { } };
}

// Hook for fetching user orders
export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(orderData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  return { orders, loading, error };
}

// Hook for all orders (admin)
export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(orderData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}

// Admin functions
export async function createShop(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'shops'), {
    ...shopData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateShop(id: string, data: Partial<Shop>) {
  await updateDoc(doc(db, 'shops', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteShop(id: string) {
  await deleteDoc(doc(db, 'shops', id));
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// Fetch all products (admin)
export async function getAllProducts(activeOnly: boolean = false): Promise<Product[]> {
  const constraints: QueryConstraint[] = [];
  if (activeOnly) {
    constraints.push(where('isActive', '==', true));
  }
  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

// ============================================
// AUCTION & BIDDING HOOKS
// ============================================

// Real-time hook for a single auction product
export function useAuctionProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Subscribe to real-time updates
    const docRef = doc(db, 'products', id);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setProduct(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error in useAuctionProduct:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { product, loading, error };
}

// Real-time hook for bid history
export function useBidHistory(productId: string | undefined) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const bidsRef = collection(db, 'products', productId, 'bids');
    const q = query(bidsRef, orderBy('amount', 'desc'), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bidData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date if needed
        timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date(),
      })) as Bid[];
      setBids(bidData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  return { bids, loading };
}

// Transactional Bid Placement
export async function placeBid(productId: string, amount: number, user: User) {
  if (!user) throw new Error('User not authenticated');

  const productRef = doc(db, 'products', productId);
  const bidRef = doc(collection(db, 'products', productId, 'bids'));

  try {
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) throw new Error('Product not found');

      const product = productDoc.data() as Product;

      if (product.saleType !== 'auction') throw new Error('Not an auction');
      if (product.stock <= 0) throw new Error('Product out of stock');

      const now = new Date();
      const startTime = (product.auctionStartTime as any)?.toDate?.() || new Date(product.auctionStartTime || 0);
      const endTime = (product.auctionEndTime as any)?.toDate?.() || new Date(product.auctionEndTime || 0);

      if (now < startTime) throw new Error('Auction has not started yet');
      if (now > endTime) throw new Error('Auction has ended');

      const currentBid = product.currentHighestBid || product.startingBid || 0;
      const minIncrement = product.minimumBidIncrement || 0;

      if (amount < currentBid + minIncrement) {
        if (!product.currentHighestBid && amount < (product.startingBid || 0)) {
          throw new Error('Bid must be at least the starting price');
        }
        if (product.currentHighestBid) {
          throw new Error(`Bid must be at least ${currentBid + minIncrement}`);
        }
      }

      // If bid matches or exceeds buyNowPrice, it could be treated as a buy now or restricted
      if (product.buyNowPrice && amount >= product.buyNowPrice) {
        throw new Error(`Bid exceeds Buy Now price. Use 'Hemen Al' to purchase for ${product.buyNowPrice}`);
      }

      // Anti-sniping logic
      let newEndTime = product.auctionEndTime;
      if (product.auctionEndTime) {
        const endTimeDate = (product.auctionEndTime as any).toDate ? (product.auctionEndTime as any).toDate() : new Date(product.auctionEndTime);
        const timeDiff = endTimeDate.getTime() - now.getTime();

        if (timeDiff > 0 && timeDiff < 2 * 60 * 1000) {
          newEndTime = new Date(endTimeDate.getTime() + 2 * 60 * 1000);
        }
      }

      const updateData: any = {
        currentHighestBid: amount,
        currentHighestBidderId: user.uid,
        updatedAt: serverTimestamp(),
      };

      if (newEndTime !== product.auctionEndTime) {
        updateData.auctionEndTime = newEndTime;
      }

      transaction.update(productRef, updateData);

      transaction.set(bidRef, {
        productId,
        userId: user.uid,
        userName: `Katılımcı #${user.uid.substring(0, 4)}`,
        amount,
        timestamp: serverTimestamp(),
      });
    });
    return true;
  } catch (e) {
    console.error('Bid transaction failed:', e);
    throw e;
  }
}

// Transactional Buy Now Purchase
export async function buyNowPurchase(productId: string, user: User) {
  if (!user) throw new Error('User not authenticated');

  const productRef = doc(db, 'products', productId);
  const bidRef = doc(collection(db, 'products', productId, 'bids'));

  try {
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) throw new Error('Product not found');

      const product = productDoc.data() as Product;

      if (product.saleType !== 'auction') throw new Error('Not an auction');
      if (!product.buyNowPrice) throw new Error('Buy Now not available for this product');
      if (product.stock <= 0) throw new Error('Product out of stock');

      const now = new Date();
      const endTime = (product.auctionEndTime as any)?.toDate?.() || new Date(product.auctionEndTime || 0);
      if (now > endTime) throw new Error('Auction has already ended');

      // Update Product: End auction and set stock to 0
      transaction.update(productRef, {
        currentHighestBid: product.buyNowPrice,
        currentHighestBidderId: user.uid,
        stock: 0,
        auctionEndTime: serverTimestamp(), // End it now
        updatedAt: serverTimestamp(),
      });

      // Create a final "Buy Now" bid record
      transaction.set(bidRef, {
        productId,
        userId: user.uid,
        userName: `Hemen Al: Katılımcı #${user.uid.substring(0, 4)}`,
        amount: product.buyNowPrice,
        timestamp: serverTimestamp(),
        isBuyNow: true,
      });
    });
    return true;
  } catch (e) {
    console.error('Buy Now transaction failed:', e);
    throw e;
  }
}

// Fetch all shops (admin)
export async function getAllShops(activeOnly: boolean = false): Promise<Shop[]> {
  try {
    let q;
    if (activeOnly) {
      q = query(collection(db, 'shops'), where('isActive', '==', true));
    } else {
      q = query(collection(db, 'shops'));
    }

    const snapshot = await getDocs(q);

    const shops = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Shop[];

    // Sort by name client-side
    return shops.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
}

// ============================================
// BLOG MODULE HOOKS & FUNCTIONS
// ============================================

// Hook for fetching blog posts (public)
export function useBlogPosts(options?: {
  publishedOnly?: boolean;
  category?: BlogCategory;
  featured?: boolean;
  limitCount?: number;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Fetch all blog posts and filter client-side to avoid index requirements
        const q = query(collection(db, 'blogPosts'));
        const snapshot = await getDocs(q);

        let postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];

        // Filter published only (default for public)
        if (options?.publishedOnly !== false) {
          postData = postData.filter(p => p.isPublished === true);
        }

        // Filter by category
        if (options?.category) {
          postData = postData.filter(p => p.category === options.category);
        }

        // Filter featured
        if (options?.featured) {
          postData = postData.filter(p => p.isFeatured === true);
        }

        // Sort by publishedAt/createdAt desc
        postData.sort((a, b) => {
          const dateA = (a.publishedAt as any)?.toDate?.() || (a.createdAt as any)?.toDate?.() || new Date(0);
          const dateB = (b.publishedAt as any)?.toDate?.() || (b.createdAt as any)?.toDate?.() || new Date(0);
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        // Apply limit
        if (options?.limitCount) {
          postData = postData.slice(0, options.limitCount);
        }

        setPosts(postData);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [options?.publishedOnly, options?.category, options?.featured, options?.limitCount]);

  return { posts, loading, error };
}

// Hook for fetching single blog post by slug or ID (auto-detect)
export function useBlogPost(identifier: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    async function fetchPost() {
      try {
        // First try to fetch by ID
        const docRef = doc(db, 'blogPosts', identifier as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
          return;
        }

        // If not found by ID, try by slug
        const q = query(collection(db, 'blogPosts'), where('slug', '==', identifier));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setPost({ id: docData.id, ...docData.data() } as BlogPost);
        } else {
          setPost(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [identifier]);

  return { post, loading, error };
}

// Increment view count
export async function incrementBlogViewCount(id: string) {
  const docRef = doc(db, 'blogPosts', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentCount = docSnap.data().viewCount || 0;
    await updateDoc(docRef, { viewCount: currentCount + 1 });
  }
}

// Admin: Fetch all blog posts
export async function getAllBlogPosts(publishedOnly: boolean = false): Promise<BlogPost[]> {
  try {
    const q = query(collection(db, 'blogPosts'));
    const snapshot = await getDocs(q);

    let posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    if (publishedOnly) {
      posts = posts.filter(p => p.isPublished === true);
    }

    // Sort by createdAt desc
    posts.sort((a, b) => {
      const dateA = (a.createdAt as any)?.toDate?.() || new Date(0);
      const dateB = (b.createdAt as any)?.toDate?.() || new Date(0);
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Admin: Create blog post
export async function createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) {
  const docRef = await addDoc(collection(db, 'blogPosts'), {
    ...postData,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: postData.isPublished ? serverTimestamp() : null,
  });
  return docRef.id;
}

// Admin: Update blog post
export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  const updateData: any = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // If publishing for the first time, set publishedAt
  if (data.isPublished) {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && !docSnap.data().publishedAt) {
      updateData.publishedAt = serverTimestamp();
    }
  }

  await updateDoc(doc(db, 'blogPosts', id), updateData);
}

// Admin: Delete blog post
export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, 'blogPosts', id));
}

// Helper: Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper: Extract video ID from URL
export function extractVideoInfo(url: string): { platform: 'youtube' | 'vimeo' | 'other'; embedUrl: string } {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch) {
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { platform: 'other', embedUrl: url };
}
