import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, CheckCircle, ArrowRight, Loader2, ChevronLeft, Phone } from 'lucide-react';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.password_confirmation) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await register(userData);
      toast.success('Registration successful!');
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fff0f5] p-4">
      {/* Register Form */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg relative">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-polar-night/60 hover:text-polar-night transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mt-8 mb-8">
          <h1 className="font-heading text-3xl text-polar-night font-bold mb-2">Create Account</h1>
          <p className="text-text-primary/60 font-light text-sm">Join our community today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-polar-night ml-1" htmlFor="name">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                <User size={18} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                placeholder="Jane Doe"
                value={userData.name}
                onChange={handleChange}
              />
            </div>
          </div>

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
                value={userData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-polar-night ml-1" htmlFor="phone_number">Phone Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                <Phone size={18} />
              </div>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                placeholder="08xxxxxxxxxx"
                value={userData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-polar-night ml-1" htmlFor="password">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-polar-night ml-1" htmlFor="password_confirmation">Confirm</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-polar-night/40 group-focus-within:text-frost-byte transition-colors">
                  <CheckCircle size={18} />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  minLength={8}
                  className="w-full bg-white border border-polar-night/10 text-polar-night text-sm rounded-xl focus:ring-2 focus:ring-frost-byte/20 focus:border-frost-byte block w-full pl-10 p-3 placeholder-polar-night/30 transition-all shadow-sm group-hover:border-polar-night/30"
                  placeholder="••••••••"
                  value={userData.password_confirmation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input type="checkbox" id="terms" required className="mt-1 rounded border-polar-night/20 text-polar-night focus:ring-frost-byte cursor-pointer" />
            <label htmlFor="terms" className="text-xs text-polar-night/70 leading-snug cursor-pointer select-none">
              I agree to the <Link to="/terms" className="underline hover:text-polar-night font-medium transition-colors">Terms</Link> and <Link to="/privacy" className="underline hover:text-polar-night font-medium transition-colors">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-polar-night text-white font-medium rounded-xl py-3 px-4 hover:bg-polar-night/90 focus:ring-4 focus:ring-polar-night/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-polar-night/60 font-light">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-frost-byte hover:text-polar-night transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
