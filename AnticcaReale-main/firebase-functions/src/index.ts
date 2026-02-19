/**
 * Firebase Cloud Functions for Anticca
 * Shopier Payment Integration
 * 
 * Functions:
 * - createShopierPayment: Ödeme oturumu oluşturur
 * - shopierWebhook: Shopier'dan gelen ödeme bildirimlerini işler
 * - shopierCallback: Ödeme sonrası kullanıcı yönlendirmesi
 * - syncOrderStatus: Shopier V2 API ile sipariş durumu senkronizasyonu
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import cors from 'cors';

// Firebase Admin SDK'yı başlat
admin.initializeApp();
const db = admin.firestore();

// CORS middleware
const corsHandler = cors({ origin: true });

// ============================================
// CONFIGURATION
// ============================================

function getConfig() {
  return {
    apiKey: process.env.SHOPIER_API_KEY || '',
    apiSecret: process.env.SHOPIER_API_SECRET || '',
    accessToken: process.env.SHOPIER_ACCESS_TOKEN || '',
    callbackUrl: process.env.SHOPIER_CALLBACK_URL || '',
    frontendUrl: process.env.FRONTEND_URL || 'https://anticcareale.web.app',
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Shopier HMAC-SHA256 signature hesaplama
 * PHP SDK ile aynı algoritma
 */
function generateShopierSignature(data: string, apiSecret: string): string {
  return crypto
    .createHmac('sha256', apiSecret)
    .update(data)
    .digest('base64');
}

/**
 * Shopier callback signature doğrulama
 */
function verifyShopierSignature(
  randomNr: string,
  platformOrderId: string,
  status: string,
  signature: string,
  apiSecret: string
): boolean {
  const data = `${randomNr}${platformOrderId}${status}`;
  const expectedSignature = generateShopierSignature(data, apiSecret);
  return signature === expectedSignature;
}

/**
 * Rastgele string üretici
 */
function generateRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// ============================================
// SHOPIER V2 REST API
// ============================================

const SHOPIER_V2_BASE_URL = 'https://api.shopier.com/v2';

/**
 * Shopier V2 API'den sipariş durumu sorgulama
 */
async function getShopierOrderStatus(orderId: string, accessToken: string): Promise<any> {
  try {
    const response = await fetch(`${SHOPIER_V2_BASE_URL}/orders?platform_order_id=${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Shopier V2 API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Shopier V2 API request failed:', error);
    return null;
  }
}

/**
 * Shopier V2 API'den tüm siparişleri çekme
 */
async function getShopierOrders(accessToken: string, page: number = 1): Promise<any> {
  try {
    const response = await fetch(`${SHOPIER_V2_BASE_URL}/orders?page=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Shopier V2 API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Shopier V2 API request failed:', error);
    return null;
  }
}

// ============================================
// SHOPIER PAYMENT ENDPOINTS
// ============================================

/**
 * Shopier ödeme oturumu oluşturma
 * POST /createShopierPayment
 * 
 * Body:
 * - orderId: Firebase order ID
 * - amount: Ödeme tutarı (TRY)
 * - buyer: { name, email, phone, address, city }
 * - productName: Ürün/sipariş adı
 */
export const createShopierPayment = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      // Sadece POST kabul et
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      try {
        const config = getConfig();

        if (!config.apiKey || !config.apiSecret || !config.callbackUrl) {
          console.error('Shopier configuration missing', {
            hasApiKey: !!config.apiKey,
            hasApiSecret: !!config.apiSecret,
            hasCallbackUrl: !!config.callbackUrl,
          });
          res.status(500).json({ error: 'Payment configuration error' });
          return;
        }

        const { orderId, amount, buyer, productName } = req.body;

        // Validasyon
        if (!orderId || !amount || !buyer || !buyer.email) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }

        // Random number (Shopier gereksinimleri)
        const randomNr = generateRandomString(32);

        // Buyer bilgilerini hazırla
        const buyerData = {
          id: buyer.id || orderId,
          product_name: productName || `Sipariş #${orderId}`,
          first_name: buyer.name?.split(' ')[0] || 'Müşteri',
          last_name: buyer.name?.split(' ').slice(1).join(' ') || '',
          email: buyer.email,
          phone: buyer.phone || '',
          address: buyer.address || '',
          city: buyer.city || 'İstanbul',
          country: 'TR',
          postal_code: ''
        };

        // Module ve callback verileri
        const moduleData = {
          module_version: '1.0.0',
          random_nr: randomNr
        };

        // Signature için data string - PHP SDK ile aynı format
        const signatureData = [
          config.apiKey,
          buyerData.id,
          buyerData.product_name,
          amount.toFixed(2),
          'TRY',
          randomNr
        ].join('');

        const signature = generateShopierSignature(signatureData, config.apiSecret);

        // Shopier form verileri
        const formData = {
          API_key: config.apiKey,
          website_index: '0', // Site 1
          platform_order_id: orderId,
          product_name: buyerData.product_name,
          product_type: 1, // Fiziksel ürün
          buyer_name: buyerData.first_name,
          buyer_surname: buyerData.last_name,
          buyer_email: buyerData.email,
          buyer_phone: buyerData.phone,
          buyer_address: buyerData.address,
          buyer_city: buyerData.city,
          buyer_country: buyerData.country,
          buyer_postal_code: buyerData.postal_code,
          total_order_value: amount.toFixed(2),
          currency: 'TRY',
          platform: 'Firebase',
          is_in_frame: '0', // Iframe değil, redirect
          current_language: 'tr-TR',
          modul_version: moduleData.module_version,
          random_nr: randomNr,
          signature: signature,
          callback_url: config.callbackUrl
        };

        // Firestore'a ödeme kaydı oluştur
        await db.collection('payments').doc(orderId).set({
          orderId,
          amount,
          buyer: buyerData,
          randomNr,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Form verilerini ve Shopier URL'ini döndür
        res.status(200).json({
          success: true,
          shopierUrl: 'https://www.shopier.com/ShowProduct/api_pay4.php',
          formData,
          orderId
        });

      } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ error: 'Payment creation failed' });
      }
    });
  });

/**
 * Shopier Webhook Handler
 * POST /shopierWebhook
 * 
 * Shopier ödeme tamamlandığında bu endpoint'e bildirim gönderir
 */
export const shopierWebhook = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Sadece POST kabul et
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const config = getConfig();

      if (!config.apiSecret) {
        console.error('API secret not configured');
        res.status(500).json({ error: 'Configuration error' });
        return;
      }

      // Shopier webhook verileri
      const {
        platform_order_id,
        status,
        payment_id,
        random_nr,
        signature,
        installment
      } = req.body;

      console.log('Webhook received:', {
        platform_order_id,
        status,
        payment_id,
        random_nr
      });

      // Signature doğrulama
      if (!verifyShopierSignature(random_nr, platform_order_id, status, signature, config.apiSecret)) {
        console.error('Invalid signature');
        res.status(400).json({ error: 'Invalid signature' });
        return;
      }

      // Ödeme kaydını güncelle
      const paymentRef = db.collection('payments').doc(platform_order_id);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        console.error('Payment not found:', platform_order_id);
        res.status(404).json({ error: 'Payment not found' });
        return;
      }

      // İdempotentlik kontrolü
      const paymentData = paymentDoc.data();
      if (paymentData?.shopierPaymentId === payment_id) {
        console.log('Webhook already processed:', payment_id);
        res.status(200).json({ success: true, message: 'Already processed' });
        return;
      }

      // Ödeme durumunu güncelle
      const newStatus = status === 'success' ? 'completed' : 'failed';
      await paymentRef.update({
        status: newStatus,
        shopierPaymentId: payment_id,
        shopierStatus: status,
        installment: installment || 0,
        webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Sipariş durumunu güncelle
      if (status === 'success') {
        const orderRef = db.collection('orders').doc(platform_order_id);
        await orderRef.update({
          status: 'Ödendi',
          shopierTransactionId: payment_id,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Order marked as paid:', platform_order_id);
      } else {
        // Başarısız ödeme — siparişi "İptal Edildi" olarak işaretle
        const orderRef = db.collection('orders').doc(platform_order_id);
        await orderRef.update({
          status: 'İptal Edildi',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Order marked as cancelled:', platform_order_id);
      }

      res.status(200).json({ success: true });

    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

/**
 * Shopier Callback Handler
 * GET/POST /shopierCallback
 * 
 * Kullanıcı ödeme sonrası bu sayfaya yönlendirilir
 */
export const shopierCallback = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    const config = getConfig();

    try {
      // Shopier callback verileri (GET veya POST)
      const data = req.method === 'POST' ? req.body : req.query;

      const {
        platform_order_id,
        status,
        payment_id,
        random_nr,
        signature,
        installment
      } = data;

      console.log('Callback received:', {
        platform_order_id,
        status,
        payment_id,
        installment,
        method: req.method
      });

      // Signature doğrulama (varsa)
      if (signature && config.apiSecret) {
        const isValid = verifyShopierSignature(
          random_nr as string,
          platform_order_id as string,
          status as string,
          signature as string,
          config.apiSecret
        );

        if (!isValid) {
          console.warn('Invalid callback signature');
          res.redirect(`${config.frontendUrl}/checkout/fail?error=signature_error&orderId=${platform_order_id}`);
          return;
        }
      }

      // Başarılı ödeme
      if (status === 'success') {
        // Ödeme kaydını güncelle
        if (platform_order_id) {
          const paymentRef = db.collection('payments').doc(platform_order_id as string);
          const paymentDoc = await paymentRef.get();

          if (paymentDoc.exists) {
            await paymentRef.update({
              callbackReceived: true,
              callbackStatus: status,
              shopierPaymentId: payment_id || '',
              installment: installment || 0,
              callbackReceivedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }

          // Sipariş durumunu da güncelle (callback webhook'tan önce gelebilir)
          const orderRef = db.collection('orders').doc(platform_order_id as string);
          const orderDoc = await orderRef.get();

          if (orderDoc.exists) {
            const orderData = orderDoc.data();
            if (orderData?.status === 'Ödeme Bekleniyor') {
              await orderRef.update({
                status: 'Ödendi',
                shopierTransactionId: payment_id || '',
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              });
            }
          }
        }

        const redirectParams = new URLSearchParams({
          orderId: (platform_order_id as string) || '',
          paymentId: (payment_id as string) || '',
          installment: (installment as string) || '0',
        });

        res.redirect(`${config.frontendUrl}/checkout/success?${redirectParams.toString()}`);
      } else {
        // Başarısız ödeme
        const redirectParams = new URLSearchParams({
          orderId: (platform_order_id as string) || '',
          error: 'payment_failed',
          status: (status as string) || 'failed',
        });

        res.redirect(`${config.frontendUrl}/checkout/fail?${redirectParams.toString()}`);
      }

    } catch (error) {
      console.error('Callback error:', error);
      res.redirect(`${config.frontendUrl}/checkout/fail?error=internal_error`);
    }
  });

// ============================================
// SHOPIER V2 API - ORDER SYNC
// ============================================

/**
 * Sipariş durumu senkronizasyonu
 * POST /syncOrderStatus
 * 
 * Shopier V2 API kullanarak belirli bir siparişin durumunu kontrol eder
 */
export const syncOrderStatus = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      try {
        const config = getConfig();

        if (!config.accessToken) {
          console.error('Shopier access token not configured');
          res.status(500).json({ error: 'Access token not configured' });
          return;
        }

        const { orderId } = req.body;

        if (!orderId) {
          res.status(400).json({ error: 'orderId is required' });
          return;
        }

        // Firestore'dan siparişi al
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
          res.status(404).json({ error: 'Order not found' });
          return;
        }

        // Shopier V2 API'den durumu sorgula
        const shopierData = await getShopierOrderStatus(orderId, config.accessToken);

        if (shopierData) {
          // Sipariş durumunu Shopier verisiyle güncelle
          const updateData: any = {
            shopierSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          // Shopier'dan gelen duruma göre Firestore'u güncelle
          if (shopierData.data && shopierData.data.length > 0) {
            const shopierOrder = shopierData.data[0];

            if (shopierOrder.payment_status === 'paid') {
              const currentStatus = orderDoc.data()?.status;
              if (currentStatus === 'Ödeme Bekleniyor') {
                updateData.status = 'Ödendi';
                updateData.shopierTransactionId = shopierOrder.payment_id || '';
                updateData.paidAt = admin.firestore.FieldValue.serverTimestamp();
              }
            }

            updateData.shopierOrderData = {
              paymentStatus: shopierOrder.payment_status,
              paymentId: shopierOrder.payment_id,
              totalAmount: shopierOrder.total_amount,
              installment: shopierOrder.installment,
            };
          }

          await orderRef.update(updateData);

          res.status(200).json({
            success: true,
            orderId,
            shopierData: shopierData.data?.[0] || null,
          });
        } else {
          res.status(200).json({
            success: true,
            orderId,
            shopierData: null,
            message: 'No Shopier data found for this order',
          });
        }
      } catch (error) {
        console.error('Sync order status error:', error);
        res.status(500).json({ error: 'Failed to sync order status' });
      }
    });
  });

/**
 * Tüm bekleyen siparişlerin durumunu toplu senkronize et
 * Scheduler veya admin tarafından tetiklenebilir
 */
export const syncAllPendingOrders = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      try {
        const config = getConfig();

        if (!config.accessToken) {
          res.status(500).json({ error: 'Access token not configured' });
          return;
        }

        // "Ödeme Bekleniyor" durumundaki siparişleri bul
        const pendingOrders = await db.collection('orders')
          .where('status', '==', 'Ödeme Bekleniyor')
          .get();

        const results: any[] = [];

        for (const orderDoc of pendingOrders.docs) {
          const orderId = orderDoc.id;
          const shopierData = await getShopierOrderStatus(orderId, config.accessToken);

          if (shopierData?.data?.length > 0) {
            const shopierOrder = shopierData.data[0];

            if (shopierOrder.payment_status === 'paid') {
              await db.collection('orders').doc(orderId).update({
                status: 'Ödendi',
                shopierTransactionId: shopierOrder.payment_id || '',
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                shopierSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
              results.push({ orderId, synced: true, newStatus: 'Ödendi' });
            } else {
              results.push({ orderId, synced: false, shopierStatus: shopierOrder.payment_status });
            }
          } else {
            results.push({ orderId, synced: false, reason: 'Not found in Shopier' });
          }
        }

        res.status(200).json({ success: true, results });
      } catch (error) {
        console.error('Sync all pending orders error:', error);
        res.status(500).json({ error: 'Failed to sync pending orders' });
      }
    });
  });
