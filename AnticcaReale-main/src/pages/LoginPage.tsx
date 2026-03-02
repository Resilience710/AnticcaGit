import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TR } from '../constants/tr';
import Button from '../components/ui/Button';
import ReCAPTCHA from 'react-google-recaptcha';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recaptchaToken) {
      setError('Lütfen robot olmadığınızı doğrulayın.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify reCAPTCHA token with the backend
      const verifyRes = await fetch(
        'https://europe-west1-anticcareale.cloudfunctions.net/verifyRecaptcha',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: recaptchaToken }),
        }
      );

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setError('Robot doğrulaması başarısız oldu. Lütfen tekrar deneyin.');
        setRecaptchaToken(null);
        setLoading(false);
        return;
      }

      // 2. Proceed with Firebase login
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError(TR.auth.loginError);
      } else if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError(TR.auth.loginError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-4xl font-bold text-espresso-900">
              {TR.siteName}
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-espresso-900">
            {TR.auth.login}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-linen-300 p-8">
          {/* Google Login */}
          <GoogleLoginButton redirect={redirect} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-linen-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-espresso-500">veya e-posta ile</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-espresso-800 mb-1">
                {TR.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-espresso-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-espresso-800 mb-1">
                {TR.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-espresso-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le7V3ksAAAAAJGBISl8_Jrde_YM66U2yAC3nuMf'}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!recaptchaToken}>
              {TR.auth.login}
            </Button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-espresso-700">
            {TR.auth.noAccount}{' '}
            <Link
              to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-espresso-800 hover:text-espresso-600 font-medium"
            >
              {TR.auth.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
