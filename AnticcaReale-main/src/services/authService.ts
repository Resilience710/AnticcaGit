import { getAuthDeferred, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const signInWithGoogle = async () => {
    try {
        // Performans için auth modülünü ve providerı dinamik olarak yüklüyoruz
        const [authInstance, { GoogleAuthProvider, signInWithPopup }] = await Promise.all([
            getAuthDeferred(),
            import('firebase/auth')
        ]);

        const provider = new GoogleAuthProvider();
        // Kullanıcının her seferinde hesap seçmesi için opsiyonel
        provider.setCustomParameters({ prompt: 'select_account' });

        // Popup ile giriş işlemi
        const result = await signInWithPopup(authInstance, provider);
        const user = result.user;

        // Beklenen görev özelliği: Kullanıcı bilgilerini konsola yazdır
        console.log("Google ile giriş başarılı:", {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        });

        // Firestore veritabanında kullanıcı için belge oluştur veya kontrol et
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Eğer kullanıcı ilk defa Google ile giriş yapıyorsa kayıt oluştur
            const ADMIN_EMAILS = ['direncuy@gmail.com', 'admin@anticca.com.tr'];
            const isAdminEmail = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

            await setDoc(userRef, {
                name: user.displayName || 'Google Kullanıcısı',
                email: user.email,
                role: isAdminEmail ? 'admin' : 'user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        return user;
    } catch (error) {
        console.error("Popup kapatıldı veya Google girişi başarısız:", error);
        throw error;
    }
};
