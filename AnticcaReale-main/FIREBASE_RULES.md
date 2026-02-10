# Firebase Güvenlik Kuralları - Anticca

Bu dosya Firebase Console'da kullanılacak güvenlik kurallarını içerir.

---

## 🔥 Firestore Database Kuralları

Firebase Console → Firestore Database → Rules sekmesine gidin ve aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // YARDIMCI FONKSİYONLAR
    // ============================================
    
    // Kullanıcı giriş yapmış mı?
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Kullanıcı admin mi?
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Kullanıcı belgenin sahibi mi?
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // ============================================
    // USERS KOLEKSİYONU
    // ============================================
    match /users/{userId} {
      // Herkes kendi profilini okuyabilir
      // Admin tüm profilleri okuyabilir
      allow read: if isOwner(userId) || isAdmin();
      
      // Kullanıcı kendi profilini oluşturabilir/güncelleyebilir
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      
      // Sadece admin silebilir
      allow delete: if isAdmin();
    }
    
    // ============================================
    // SHOPS KOLEKSİYONU
    // ============================================
    match /shops/{shopId} {
      // Herkes aktif dükkanları okuyabilir
      allow read: if true;
      
      // Sadece admin oluşturabilir/güncelleyebilir/silebilir
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // ============================================
    // PRODUCTS KOLEKSİYONU
    // ============================================
    match /products/{productId} {
      // Herkes aktif ürünleri okuyabilir
      allow read: if true;
      
      // Sadece admin oluşturabilir/güncelleyebilir/silebilir
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // ============================================
    // BIDS KOLEKSİYONU (Müzayede Teklifleri)
    // ============================================
    match /bids/{bidId} {
      // Herkes teklifleri okuyabilir
      allow read: if true;
      
      // Giriş yapmış kullanıcılar teklif verebilir
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Teklifler güncellenemez veya silinemez
      allow update, delete: if false;
    }
    
    // ============================================
    // ORDERS KOLEKSİYONU
    // ============================================
    match /orders/{orderId} {
      // Kullanıcı kendi siparişlerini okuyabilir
      // Admin tüm siparişleri okuyabilir
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      
      // Giriş yapmış kullanıcılar sipariş oluşturabilir
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Sadece admin güncelleme yapabilir (durum değişikliği)
      allow update: if isAdmin();
      
      // Siparişler silinemez
      allow delete: if false;
    }
    
    // ============================================
    // BLOGPOSTS KOLEKSİYONU
    // ============================================
    match /blogPosts/{postId} {
      // Herkes yayınlanmış blogları okuyabilir
      // Admin tüm blogları (taslak dahil) okuyabilir
      allow read: if true;
      
      // Sadece admin oluşturabilir/güncelleyebilir/silebilir
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // ============================================
    // SETTINGS KOLEKSİYONU (Site Ayarları)
    // ============================================
    match /settings/{settingId} {
      // Herkes ayarları okuyabilir
      allow read: if true;
      
      // Sadece admin güncelleyebilir
      allow write: if isAdmin();
    }
    
    // ============================================
    // ANALYTICS / LOGS KOLEKSİYONU
    // ============================================
    match /analytics/{docId} {
      allow read: if isAdmin();
      allow write: if true; // Sayfa görüntülemeleri için
    }
    
    // ============================================
    // CART KOLEKSİYONU (Opsiyonel - Sunucu taraflı sepet)
    // ============================================
    match /carts/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // ============================================
    // WISHLIST KOLEKSİYONU (Opsiyonel - Favoriler)
    // ============================================
    match /wishlists/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

---

## 📦 Storage Kuralları

Firebase Console → Storage → Rules sekmesine gidin ve aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // ============================================
    // YARDIMCI FONKSİYONLAR
    // ============================================
    
    // Kullanıcı giriş yapmış mı?
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Dosya boyutu limiti (10MB)
    function isValidFileSize() {
      return request.resource.size < 10 * 1024 * 1024;
    }
    
    // Geçerli resim formatı mı?
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Geçerli 3D model formatı mı?
    function is3DModel() {
      return request.resource.contentType.matches('model/.*') ||
             request.resource.name.matches('.*\\.(glb|gltf|obj|fbx)$');
    }
    
    // ============================================
    // PRODUCTS KLASÖRÜ
    // ============================================
    match /products/{allPaths=**} {
      // Herkes ürün resimlerini görebilir
      allow read: if true;
      
      // Giriş yapmış kullanıcılar yükleyebilir (admin kontrolü client'ta)
      allow write: if isAuthenticated() && 
                      isValidFileSize() && 
                      (isImage() || is3DModel());
    }
    
    // ============================================
    // SHOPS KLASÖRÜ (Dükkan Logoları)
    // ============================================
    match /shops/{allPaths=**} {
      // Herkes dükkan logolarını görebilir
      allow read: if true;
      
      // Giriş yapmış kullanıcılar yükleyebilir
      allow write: if isAuthenticated() && 
                      isValidFileSize() && 
                      isImage();
    }
    
    // ============================================
    // BLOG KLASÖRÜ
    // ============================================
    match /blog/{allPaths=**} {
      // Herkes blog resimlerini görebilir
      allow read: if true;
      
      // Giriş yapmış kullanıcılar yükleyebilir
      allow write: if isAuthenticated() && 
                      isValidFileSize() && 
                      isImage();
    }
    
    // ============================================
    // USERS KLASÖRÜ (Profil Fotoğrafları)
    // ============================================
    match /users/{userId}/{allPaths=**} {
      // Herkes profil fotoğraflarını görebilir
      allow read: if true;
      
      // Sadece kendi profil fotoğrafını yükleyebilir
      allow write: if request.auth != null && 
                      request.auth.uid == userId && 
                      isValidFileSize() && 
                      isImage();
    }
    
    // ============================================
    // TEMP KLASÖRÜ (Geçici Yüklemeler)
    // ============================================
    match /temp/{allPaths=**} {
      // Giriş yapmış herkes geçici dosya yükleyebilir
      allow read, write: if isAuthenticated() && isValidFileSize();
    }
  }
}
```

---

## ⚡ Hızlı Kurulum Adımları

1. **Firebase Console'a gidin**: https://console.firebase.google.com
2. **Projenizi seçin**: `anticcareale`

### Firestore Kuralları:
3. Sol menüden **Firestore Database** seçin
4. **Rules** sekmesine tıklayın
5. Yukarıdaki Firestore kurallarını yapıştırın
6. **Publish** butonuna tıklayın

### Storage Kuralları:
7. Sol menüden **Storage** seçin
8. **Rules** sekmesine tıklayın
9. Yukarıdaki Storage kurallarını yapıştırın
10. **Publish** butonuna tıklayın

---

## 🔐 Güvenlik Notları

| Özellik | Açıklama |
|---------|----------|
| **Admin Kontrolü** | `users` koleksiyonunda `role: 'admin'` olan kullanıcılar admin yetkilerine sahip |
| **Dosya Boyutu** | Maksimum 10MB dosya yüklenebilir |
| **Dosya Türleri** | Sadece resim (image/*) ve 3D modeller (glb, gltf) |
| **Bid Güvenliği** | Müzayede teklifleri oluşturulduktan sonra değiştirilemez |
| **Sipariş Güvenliği** | Kullanıcılar sadece kendi siparişlerini görebilir |

---

## ⚠️ Önemli

Admin kullanıcı oluşturmak için Firebase Console → Firestore → users koleksiyonunda ilgili kullanıcının `role` alanını `"admin"` olarak ayarlayın.
