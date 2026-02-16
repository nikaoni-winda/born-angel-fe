import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
      toast.success('Login successful!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fff0f5] p-4">
      <div className="max-w-md w-full bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg relative">
        {/* Back to Home Link */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-polar-night/60 hover:text-polar-night transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mt-8 mb-8">
          <h1 className="font-heading text-3xl text-polar-night font-bold mb-2">Welcome Back</h1>
          <p className="text-text-primary/60 font-light text-sm">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-polar-night ml-1" htmlFor="email">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-polar-night" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-frost-byte hover:text-polar-night transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-polar-night text-white font-medium rounded-xl py-3 px-4 hover:bg-polar-night/90 focus:ring-4 focus:ring-polar-night/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-polar-night/60 font-light">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-frost-byte hover:text-polar-night transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
