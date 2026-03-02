import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../services/authService';

interface GoogleLoginButtonProps {
    redirect?: string;
    label?: string;
}

export default function GoogleLoginButton({ redirect = '/dashboard', label = 'Google ile Devam Et' }: GoogleLoginButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            // Firebase auth servisimizi çağırıyoruz
            await signInWithGoogle();

            // Başarılı girişten sonra yönlendirme
            navigate(redirect);
        } catch (err: any) {
            console.error("Google Authentication Hatası:", err);
            // Hata durumunda kullanıcıya bilgi göster
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Giriş penceresi kapatıldı.');
            } else {
                setError('Google ile giriş yapılırken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full"></span>
                ) : (
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Logo"
                        className="w-5 h-5"
                    />
                )}
                <span>{label}</span>
            </button>

            {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
        </div>
    );
}
