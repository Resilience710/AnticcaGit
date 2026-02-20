import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TR } from '../constants/tr';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError(TR.auth.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(TR.auth.weakPassword);
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate(redirect);
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(TR.auth.emailInUse);
      } else if (err.code === 'auth/invalid-email') {
        setError(TR.auth.invalidEmail);
      } else if (err.code === 'auth/weak-password') {
        setError(TR.auth.weakPassword);
      } else {
        setError(TR.auth.registerError);
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
            {TR.auth.register}
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-linen-300 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-espresso-800 mb-1">
                {TR.auth.name}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-espresso-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                  placeholder="Ad Soyad"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                  placeholder="En az 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-espresso-800 mb-1">
                {TR.auth.confirmPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-espresso-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                  placeholder="Şifreyi tekrar girin"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {TR.auth.register}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-espresso-600">
            {TR.auth.hasAccount}{' '}
            <Link
              to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              className="text-espresso-800 hover:text-espresso-600 font-medium"
            >
              {TR.auth.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
