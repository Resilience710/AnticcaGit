import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, FileText, Eye, Calendar, Tag, Filter, X } from 'lucide-react';
import { useBlogPosts } from '../hooks/useFirestore';
import type { BlogPost, BlogCategory } from '../types';
import { BLOG_CATEGORIES, isVideoBlogPost } from '../types';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';

function BlogCard({ post }: { post: BlogPost }) {
  const isVideo = isVideoBlogPost(post);

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link
      to={`/blog/${post.slug || post.id}`}
      className="group bg-white rounded-sm shadow-sm hover:shadow-soft border border-linen-200 overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/2] overflow-hidden bg-linen-100">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-[0.85] group-hover:saturate-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mist-300 bg-linen-50">
            <span className="text-4xl opacity-50">🖋️</span>
          </div>
        )}

        {/* Type indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-olive-900 rounded-sm text-[10px] uppercase tracking-wider font-medium shadow-sm">
          {isVideo ? (
            <>
              <Video className="h-3 w-3 text-gold-600" />
              <span>Video</span>
            </>
          ) : (
            <>
              <FileText className="h-3 w-3 text-gold-600" />
              <span>Makale</span>
            </>
          )}
        </div>

        {/* Featured badge */}
        {post.isFeatured && (
          <div className="absolute top-3 right-3 bg-gold-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-medium shadow-sm">
            Öne Çıkan
          </div>
        )}

        {/* Video duration */}
        {isVideo && (post as any).videoDuration && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm text-xs font-mono">
            {(post as any).videoDuration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 border-t border-linen-100">
        {/* Category */}
        <div className="mb-3">
          <span className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-medium text-olive-900 line-clamp-2 group-hover:text-gold-700 transition-colors mb-3 leading-snug">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-espresso-500 line-clamp-2 mb-6 font-light leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between text-xs text-espresso-400 pt-4 border-t border-linen-100 font-light uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3" />
            <span>{post.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { posts, loading } = useBlogPosts({
    publishedOnly: true,
    category: selectedCategory || undefined,
  });

  const { posts: featuredPosts } = useBlogPosts({
    publishedOnly: true,
    featured: true,
    limitCount: 3,
  });

  const clearFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-linen-50">
      <SEO
        title="Antika Dünyası — Blog & Hikayeler"
        description="Antika dünyasına dair rehberler, koleksiyon hikayeleri, dönem analizleri ve uzman görüşleri. Anticca Blog."
        canonical="/blog"
      />
      {/* Header - Minimal & Elegant */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold-600 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 block animate-fade-in">Blog & Hikayeler</span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-olive-900 mb-6">Antika Dünyası</h1>
          <p className="text-espresso-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Tarihin tozlu sayfalarından günümüze uzanan yolculuklar, rehberler ve ilham verici hikayeler.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-espresso-900">Kategoriler</h2>
            {selectedCategory && (
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                <X className="h-4 w-4 mr-1" />
                Filtreyi Temizle
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-sm text-sm tracking-wide transition-all border ${!selectedCategory
                ? 'bg-olive-800 text-white border-olive-800 shadow-sm'
                : 'bg-white text-espresso-600 border-linen-300 hover:border-olive-500 hover:text-olive-700'
                }`}
            >
              Tümü
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-sm text-sm tracking-wide transition-all border ${selectedCategory === cat
                  ? 'bg-olive-800 text-white border-olive-800 shadow-sm'
                  : 'bg-white text-espresso-600 border-linen-300 hover:border-olive-500 hover:text-olive-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts Section (only show if no filter) */}
        {!selectedCategory && featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
              Öne Çıkan Yazılar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
            {selectedCategory ? `${selectedCategory}` : 'Tüm Yazılar'}
          </h2>

          {loading ? (
            <Loading />
          ) : posts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-sm border border-linen-200 shadow-soft">
              <span className="text-5xl mb-6 block opacity-20 contrast-0 grayscale">🖋️</span>
              <p className="text-olive-900 text-lg font-serif mb-2">Henüz blog yazısı bulunmuyor.</p>
              {selectedCategory && (
                <p className="text-espresso-500 font-light">
                  "{selectedCategory}" kategorisinde yazı yok.
                  <button
                    onClick={clearFilter}
                    className="text-gold-700 hover:text-gold-800 underline ml-2 font-medium"
                  >
                    Tüm yazıları görüntüle
                  </button>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
