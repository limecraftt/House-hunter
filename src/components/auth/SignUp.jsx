import React, { useState } from 'react';
import { Home, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../lib/supabase';

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', role: 'tenant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });

      if (error) {
        setErrors({ general: error.message || 'Sign up failed. Please try again.' });
        setIsLoading(false);
        return;
      }

      if (onLogin) onLogin(formData.role);

      if (formData.role === 'landlord') navigate('/landlord-dashboard');
      else navigate('/tenant-dashboard');

    } catch (err) {
      setErrors({ general: 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Create your House Hunter account</p>
          </div>

          <div className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => handleChange('role', 'tenant')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'tenant' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400 text-gray-700'}`}>
                  <User className={`w-8 h-8 mb-2 ${formData.role === 'tenant' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Tenant</span>
                  <span className="text-xs mt-1 text-gray-500">Looking for a home</span>
                </button>
                <button type="button" onClick={() => handleChange('role', 'landlord')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'landlord' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400 text-gray-700'}`}>
                  <Building2 className={`w-8 h-8 mb-2 ${formData.role === 'landlord' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-semibold">Landlord</span>
                  <span className="text-xs mt-1 text-gray-500">Managing properties</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition`}
                  placeholder="John Doe" />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition`}
                  placeholder="you@example.com" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => handleChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition`}
                  placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition`}
                  placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-start">
              <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

            <button onClick={handleSubmit} disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Creating Account...' : `Create ${formData.role === 'tenant' ? 'Tenant' : 'Landlord'} Account`}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/signin')} className="text-blue-600 hover:text-blue-700 font-semibold">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;