import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Bookmark, Plus, MessageSquare, User, Heart, MapPin,
  CheckCircle, SlidersHorizontal, ChevronDown, X, Grid, List,
  ChevronRight, Bell, Mail, Lock, Eye, EyeOff, Home, Building2,
  ArrowLeft, Send, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  signIn, signUp, signOut, getProfile,
  fetchProperties, fetchSavedProperties,
  saveProperty, unsaveProperty, sendMessage,
  fetchTenantMessages
} from '../lib/supabase';
import PropertyDetailPage from './PropertyDetailPage';

const COUNTIES = [
  'All Counties','Nairobi','Mombasa','Kisumu','Nakuru','Embu',
  "Murang'a",'Kiambu','Machakos','Kajiado','Nyeri','Meru',
  'Kilifi','Uasin Gishu','Kakamega','Bungoma','Kericho','Bomet'
];

// Fallback static properties if DB is empty
const STATIC_PROPERTIES = [
  { id: 1, title: "Modern 2BR Apartment", location: "Westlands, Nairobi", county: "Nairobi", price: 45000, size: 85, bedrooms: 2, bathrooms: 2, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"], amenities: ["Parking", "WiFi", "Gym"], type: "Apartment", verified: true },
  { id: 2, title: "Cozy Studio with City View", location: "Kilimani, Nairobi", county: "Nairobi", price: 28000, size: 45, bedrooms: 1, bathrooms: 1, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"], amenities: ["WiFi", "24/7 Security"], type: "Studio", verified: true },
  { id: 3, title: "Spacious 3BR Family House", location: "Karen, Nairobi", county: "Nairobi", price: 85000, size: 150, bedrooms: 3, bathrooms: 3, images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"], amenities: ["Parking", "Garden", "Pet-Friendly"], type: "House", verified: true },
  { id: 4, title: "Affordable 1BR Near Town", location: "Embu Town, Embu", county: "Embu", price: 12000, size: 50, bedrooms: 1, bathrooms: 1, images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"], amenities: ["WiFi", "Security"], type: "Apartment", verified: false },
  { id: 5, title: "Luxury Penthouse Suite", location: "Upper Hill, Nairobi", county: "Nairobi", price: 120000, size: 180, bedrooms: 3, bathrooms: 3, images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"], amenities: ["Parking", "Pool", "Gym", "WiFi"], type: "Penthouse", verified: true },
  { id: 6, title: "Student-Friendly Bedsitter", location: "Embu University Area, Embu", county: "Embu", price: 8000, size: 30, bedrooms: 1, bathrooms: 1, images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"], amenities: ["WiFi", "Water 24/7"], type: "Bedsitter", verified: false },
  { id: 7, title: "Farmhouse with Scenic Views", location: "Kenol, Murang'a", county: "Murang'a", price: 25000, size: 120, bedrooms: 3, bathrooms: 2, images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"], amenities: ["Garden", "Security", "Parking"], type: "House", verified: true },
  { id: 8, title: "Cozy 2BR in Quiet Estate", location: "Gatanga, Murang'a", county: "Murang'a", price: 18000, size: 75, bedrooms: 2, bathrooms: 2, images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"], amenities: ["Parking", "WiFi", "Security"], type: "Apartment", verified: true },
  { id: 9, title: "Modern Studio Apartment", location: "Embu Town, Embu", county: "Embu", price: 15000, size: 40, bedrooms: 1, bathrooms: 1, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"], amenities: ["WiFi", "Parking"], type: "Studio", verified: true },
  { id: 10, title: "Family Home Near Schools", location: "Mwea, Embu", county: "Embu", price: 20000, size: 100, bedrooms: 3, bathrooms: 2, images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"], amenities: ["Garden", "Parking", "Security"], type: "House", verified: true },
  { id: 11, title: "Town Center Apartment", location: "Murang'a Town, Murang'a", county: "Murang'a", price: 22000, size: 65, bedrooms: 2, bathrooms: 1, images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"], amenities: ["WiFi", "Security", "Water 24/7"], type: "Apartment", verified: true },
  { id: 12, title: "Executive Villa", location: "Runda, Nairobi", county: "Nairobi", price: 150000, size: 220, bedrooms: 4, bathrooms: 4, images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"], amenities: ["Pool", "Garden", "Security", "Parking", "Gym"], type: "Villa", verified: true },
];

// Helper to get image from property (handles both DB and static)
const getPropertyImage = (property) => {
  if (property.images && Array.isArray(property.images) && property.images.length > 0) return property.images[0];
  if (property.image) return property.image;
  return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop';
};

// ── Auth Modal ────────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin, defaultRole = 'landlord', title = 'Landlord Access', subtitle = 'List & manage your properties' }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('choose');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupData, setSignupData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isTenant = defaultRole === 'tenant';

  const handleSignIn = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    const { data, error } = await signIn({ email, password });

    if (error) {
      setErrors({ general: error.message || 'Invalid email or password' });
      setIsLoading(false);
      return;
    }

    const { data: profile } = await getProfile(data.user.id);
    const role = profile?.role || data.user.user_metadata?.role || defaultRole;

    if (onLogin) onLogin(role);
    setIsLoading(false);
    onClose();

    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'landlord') navigate('/landlord-dashboard');
    // tenant stays on current page
  };

  const handleSignUp = async () => {
    const newErrors = {};
    if (!signupData.fullName) newErrors.fullName = 'Full name is required';
    if (!signupData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Email is invalid';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    const { data, error } = await signUp({
      email: signupData.email,
      password: signupData.password,
      fullName: signupData.fullName,
      role: defaultRole
    });

    if (error) {
      setErrors({ general: error.message || 'Sign up failed. Please try again.' });
      setIsLoading(false);
      return;
    }

    if (onLogin) onLogin(defaultRole);
    setIsLoading(false);
    onClose();

    if (defaultRole === 'landlord') navigate('/landlord-dashboard');
    // tenant stays on current page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {mode !== 'choose' && (
              <button onClick={() => { setMode('choose'); setErrors({}); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              {isTenant ? <User className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{title}</p>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5">
          {mode === 'choose' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isTenant ? 'Sign in to continue' : 'Welcome, Landlord!'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isTenant ? 'Create an account to save properties and message landlords' : 'Sign in or create an account to list your properties'}
                </p>
              </div>
              <div className="space-y-3">
                <button onClick={() => setMode('signin')}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" /> Sign In to My Account
                </button>
                <button onClick={() => setMode('signup')}
                  className="w-full border-2 border-blue-600 text-blue-600 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  {isTenant ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  Create {isTenant ? 'Tenant' : 'Landlord'} Account
                </button>
              </div>
              {!isTenant && (
                <p className="text-center text-xs text-gray-400 mt-5">Only landlords need an account. Tenants browse freely.</p>
              )}
            </div>
          )}

          {mode === 'signin' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Sign In</h2>
              <div className="space-y-4">
                {errors.general && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{errors.general}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                      className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                <button onClick={handleSignIn} disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <p className="text-center text-sm text-gray-600">
                  No account?{' '}
                  <button onClick={() => { setMode('signup'); setErrors({}); }} className="text-blue-600 font-semibold hover:underline">Create one</button>
                </p>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Create {isTenant ? 'Tenant' : 'Landlord'} Account</h2>
              <div className="space-y-4">
                {errors.general && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{errors.general}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={signupData.fullName} onChange={e => setSignupData({ ...signupData, fullName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="John Doe" />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="you@example.com" />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                      className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="Create a password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={signupData.confirmPassword} onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm`}
                      placeholder="Confirm your password" />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="w-4 h-4 mt-0.5 accent-blue-600" />
                  <span className="text-xs text-gray-600">I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a></span>
                </label>
                {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
                <button onClick={handleSignUp} disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                  {isLoading ? 'Creating Account...' : `Create ${isTenant ? 'Tenant' : 'Landlord'} Account`}
                </button>
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('signin'); setErrors({}); }} className="text-blue-600 font-semibold hover:underline">Sign In</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Message Modal ─────────────────────────────────────────────────────────────
const MessageModal = ({ property, user, onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    const { error } = await sendMessage({
      propertyId: property.id,
      senderId: user.id,
      landlordId: property.landlord_id,
      message: message.trim()
    });
    if (error) {
      setError('Failed to send message. Please try again.');
    } else {
      setSent(true);
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Message Landlord</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-500">About</p>
          <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
          <p className="text-xs text-gray-500">{property.location}</p>
        </div>
        {sent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-bold text-gray-900">Message Sent!</p>
            <p className="text-sm text-gray-500 mt-1">The landlord will get back to you soon.</p>
            <button onClick={onClose} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm">Done</button>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Hi, I'm interested in this property. When can I schedule a viewing?"
            />
            <button onClick={handleSend} disabled={sending || !message.trim()}
              className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Property Card ─────────────────────────────────────────────────────────────
const PropertyCard = ({ property, isFavorite, onToggleFavorite, onViewDetails, view, user }) => {
  const image = getPropertyImage(property);

  if (view === 'list') {
    return (
      <div onClick={() => onViewDetails(property)} className="bg-white rounded-xl overflow-hidden border border-gray-200 flex cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative w-40 md:w-52 flex-shrink-0">
          <img src={image} alt={property.title} className="w-full h-full object-cover" style={{ minHeight: '120px' }} />
          <button onClick={e => { e.stopPropagation(); onToggleFavorite(property.id); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow">
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
          {property.verified && (
            <span className="absolute top-2 left-2 bg-white text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow">
              <CheckCircle className="w-2.5 h-2.5" /> Verified
            </span>
          )}
        </div>
        <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="text-blue-600 font-bold text-base">KSh {property.price?.toLocaleString()} <span className="text-xs text-gray-500 font-normal">per month</span></div>
            <div className="text-gray-900 font-semibold text-sm mt-0.5 line-clamp-2">{property.title}</div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">{property.location}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onViewDetails(property)} className="bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group">
      <div className="relative overflow-hidden">
        <img src={image} alt={property.title} className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
        <button onClick={e => { e.stopPropagation(); onToggleFavorite(property.id); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
        {property.verified && (
          <span className="absolute bottom-2 right-2 bg-white text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow">
            <CheckCircle className="w-2.5 h-2.5" /> Verified ID
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-blue-600 font-bold text-base">KSh {property.price?.toLocaleString()} <span className="text-xs text-gray-500 font-normal">per month</span></div>
        <div className="text-gray-900 font-semibold text-sm mt-0.5 line-clamp-2">{property.title}</div>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">{property.location}</span>
        </div>
      </div>
    </div>
  );
};

// ── Mobile Filter Chips ───────────────────────────────────────────────────────
const MobileFilterChips = ({ filters, setFilters, selectedCounty, onCountyChange, propertyCounts }) => {
  const [openPanel, setOpenPanel] = useState(null);
  const priceOptions = [
    { label: 'Any Price', value: '' },
    { label: 'Under 10K', value: '0-10000' },
    { label: '10K – 20K', value: '10000-20000' },
    { label: '20K – 30K', value: '20000-30000' },
    { label: '30K – 50K', value: '30000-50000' },
    { label: '50K – 80K', value: '50000-80000' },
    { label: '80K – 120K', value: '80000-120000' },
    { label: 'Above 120K', value: '120000-999999999' },
  ];
  const typeOptions = ['Any Type', 'Apartment', 'House', 'Studio', 'Bedsitter', 'Villa', 'Penthouse'];
  const regionLabel = selectedCounty === 'All Counties' ? 'Region' : selectedCounty;
  const priceLabel = filters.priceRange ? (priceOptions.find(p => p.value === filters.priceRange)?.label || 'Price, KSh') : 'Price, KSh';
  const typeLabel = filters.propertyType || 'Property Type';
  const toggle = (panel) => setOpenPanel(prev => prev === panel ? null : panel);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 px-4" style={{ scrollbarWidth: 'none' }}>
        {[
          { id: 'all', label: 'All filters', icon: <SlidersHorizontal className="w-3.5 h-3.5" />, active: openPanel === 'all' },
          { id: 'region', label: regionLabel, active: selectedCounty !== 'All Counties' || openPanel === 'region' },
          { id: 'price', label: priceLabel, active: !!filters.priceRange || openPanel === 'price' },
          { id: 'type', label: typeLabel, active: !!filters.propertyType || openPanel === 'type' },
        ].map(chip => (
          <button key={chip.id} onClick={() => toggle(chip.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-full border text-sm font-medium transition-all flex-shrink-0 ${chip.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            {chip.icon}{chip.label}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openPanel === chip.id ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>
      {openPanel === 'region' && (
        <div className="mx-4 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-30 relative">
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
            {COUNTIES.map(county => {
              const count = propertyCounts[county] || 0;
              const isSelected = selectedCounty === county;
              return (
                <button key={county} onClick={() => { onCountyChange(county); setOpenPanel(null); }}
                  disabled={county !== 'All Counties' && count === 0}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-left transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'} ${county !== 'All Counties' && count === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  {county} <span className={isSelected ? 'text-blue-100' : 'text-gray-400'}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {openPanel === 'price' && (
        <div className="mx-4 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-30 relative">
          {priceOptions.map(opt => (
            <button key={opt.value}
              onClick={() => {
                if (opt.value === '') { setFilters(f => ({ ...f, minPrice: '', maxPrice: '', priceRange: '' })); }
                else { const [min, max] = opt.value.split('-'); setFilters(f => ({ ...f, minPrice: min, maxPrice: max, priceRange: opt.value })); }
                setOpenPanel(null);
              }}
              className={`block w-full py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all ${filters.priceRange === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {openPanel === 'type' && (
        <div className="mx-4 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-30 relative">
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map(type => (
              <button key={type}
                onClick={() => { setFilters(f => ({ ...f, propertyType: type === 'Any Type' ? '' : type })); setOpenPanel(null); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${(filters.propertyType === type || (type === 'Any Type' && !filters.propertyType)) ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-blue-50'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
      {openPanel === 'all' && (
        <div className="mx-4 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-30 relative">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Bedrooms</h3>
          <div className="flex gap-2 flex-wrap mb-4">
            {['Any', '1', '2', '3', '4+'].map(b => (
              <button key={b} onClick={() => setFilters(f => ({ ...f, bedrooms: b === 'Any' ? '' : b === '4+' ? '4' : b }))}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${(b === 'Any' && !filters.bedrooms) || filters.bedrooms === (b === '4+' ? '4' : b) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                {b}
              </button>
            ))}
          </div>
          <button onClick={() => { setFilters({ minPrice: '', maxPrice: '', bedrooms: '', priceRange: '', propertyType: '' }); onCountyChange('All Counties'); setOpenPanel(null); }}
            className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

// ── Desktop Sidebar ───────────────────────────────────────────────────────────
const DesktopSidebar = ({ filters, setFilters, selectedCounty, onCountyChange, propertyCounts }) => {
  const typeOptions = ['Apartment', 'House', 'Studio', 'Bedsitter', 'Villa', 'Penthouse'];
  return (
    <aside className="w-72 flex-shrink-0 space-y-4 pt-6 px-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">Location</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-4 py-2"><p className="text-sm text-blue-600 font-medium">{selectedCounty}</p></div>
        <div className="px-3 pb-3 max-h-52 overflow-y-auto">
          {COUNTIES.map(county => {
            const count = propertyCounts[county] || 0;
            const isSelected = selectedCounty === county;
            return (
              <button key={county} onClick={() => onCountyChange(county)}
                disabled={county !== 'All Counties' && count === 0}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'} ${county !== 'All Counties' && count === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <span>{county}</span><span className="text-xs text-gray-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <span className="font-semibold text-gray-900 text-sm block mb-3">Price, KSh</span>
        <div className="flex gap-2 mb-4">
          <input type="number" placeholder="min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, priceRange: '' }))} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="text-gray-400 self-center text-xs">—</span>
          <input type="number" placeholder="max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, priceRange: '' }))} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {[{ label: 'Under 11 K', value: '0-11000' }, { label: '11 - 35 K', value: '11000-35000' }, { label: '35 - 85 K', value: '35000-85000' }, { label: '85 - 290 K', value: '85000-290000' }, { label: 'More than 290 K', value: '290000-999999999' }].map(opt => (
          <label key={opt.value} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input type="radio" name="price" checked={filters.priceRange === opt.value} onChange={() => { const [min, max] = opt.value.split('-'); setFilters(f => ({ ...f, minPrice: min, maxPrice: max, priceRange: opt.value })); }} className="accent-blue-600 w-4 h-4" />
            <span className="text-sm text-gray-700 group-hover:text-blue-600">{opt.label}</span>
          </label>
        ))}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
          <button onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '', priceRange: '' }))} className="text-xs text-blue-600 hover:underline font-semibold">CLEAR</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <span className="font-semibold text-gray-900 text-sm block mb-3">Property Type</span>
        {typeOptions.map(type => (
          <label key={type} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.propertyType === type} onChange={() => setFilters(f => ({ ...f, propertyType: f.propertyType === type ? '' : type }))} className="accent-blue-600 w-4 h-4 rounded" />
            <span className="text-sm text-gray-700 group-hover:text-blue-600">{type}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = ({ onLogout, onLogin, user, userRole }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(STATIC_PROPERTIES);
  const [savedIds, setSavedIds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [detailProperty, setDetailProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', bedrooms: '', priceRange: '', propertyType: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ role: 'landlord', title: 'Landlord Access', subtitle: 'List & manage your properties' });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageProperty, setMessageProperty] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const isLoggedIn = !!user;
  const isTenant = userRole === 'tenant';

  // Load properties from Supabase
  useEffect(() => {
    const loadProperties = async () => {
      const { data, error } = await fetchProperties();
      if (data && data.length > 0) {
        setProperties(data);
      }
      setLoadingProperties(false);
    };
    loadProperties();
  }, []);

  // Load saved properties if tenant is logged in
  useEffect(() => {
    if (isLoggedIn && isTenant) {
      fetchSavedProperties(user.id).then(({ data }) => {
        if (data) setSavedIds(data.map(s => s.property_id));
      });
      fetchTenantMessages(user.id).then(({ data }) => {
        if (data) setMessages(data);
      });
    }
  }, [isLoggedIn, isTenant, user]);

  const handleToggleFavorite = async (propertyId) => {
    if (!isLoggedIn) {
      setAuthModalConfig({ role: 'tenant', title: 'Save Properties', subtitle: 'Sign in to bookmark properties you love' });
      setShowAuthModal(true);
      return;
    }
    const isSaved = savedIds.includes(propertyId);
    if (isSaved) {
      setSavedIds(prev => prev.filter(id => id !== propertyId));
      await unsaveProperty(user.id, propertyId);
    } else {
      setSavedIds(prev => [...prev, propertyId]);
      await saveProperty(user.id, propertyId);
    }
  };

  const handleMessageLandlord = (property) => {
    if (!isLoggedIn) {
      setAuthModalConfig({ role: 'tenant', title: 'Message Landlord', subtitle: 'Sign in to contact landlords' });
      setShowAuthModal(true);
      return;
    }
    setMessageProperty(property);
    setShowMessageModal(true);
  };

  const handleLandlordAccess = () => {
    setAuthModalConfig({ role: 'landlord', title: 'Landlord Access', subtitle: 'List & manage your properties' });
    setShowAuthModal(true);
  };

  const handleLogoutClick = async () => {
    await signOut();
    if (onLogout) onLogout();
  };

  const propertyCounts = useMemo(() => {
    const counts = { 'All Counties': properties.length };
    properties.forEach(p => { counts[p.county] = (counts[p.county] || 0) + 1; });
    return counts;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (selectedCounty !== 'All Counties' && p.county !== selectedCounty) return false;
      if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
      if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.propertyType && p.type !== filters.propertyType) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [properties, selectedCounty, filters, searchQuery]);

  const savedProperties = properties.filter(p => savedIds.includes(p.id));
  const clearFilters = () => { setFilters({ minPrice: '', maxPrice: '', bedrooms: '', priceRange: '', propertyType: '' }); setSelectedCounty('All Counties'); };

  if (detailProperty) {
    return (
      <PropertyDetailPage
        property={detailProperty}
        onBack={() => setDetailProperty(null)}
        isFavorite={savedIds.includes(detailProperty.id)}
        onToggleFavorite={handleToggleFavorite}
        onMessage={() => handleMessageLandlord(detailProperty)}
        user={user}
      />
    );
  }

  const PropertyGrid = ({ items }) => (
    items.length === 0 ? (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No properties found</p>
        <button onClick={clearFilters} className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">Clear Filters</button>
      </div>
    ) : (
      <div className={view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
        {items.map(p => (
          <PropertyCard key={p.id} property={p} isFavorite={savedIds.includes(p.id)}
            onToggleFavorite={handleToggleFavorite} onViewDetails={setDetailProperty} view={view} user={user} />
        ))}
      </div>
    )
  );

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={onLogin}
          defaultRole={authModalConfig.role}
          title={authModalConfig.title}
          subtitle={authModalConfig.subtitle}
        />
      )}
      {showMessageModal && messageProperty && (
        <MessageModal
          property={messageProperty}
          user={user}
          onClose={() => { setShowMessageModal(false); setMessageProperty(null); }}
        />
      )}

      {/* ══════════ DESKTOP ══════════ */}
      <div className="hidden md:flex flex-col min-h-screen bg-gray-100">
        <header className="bg-blue-600 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo.png" alt="House Hunter" className="w-10 h-10 object-contain rounded-lg" onError={e => { e.target.style.display = 'none'; }} />
              <span className="text-xl font-black text-white tracking-tight">House Hunter</span>
            </div>
            <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
              <input type="text" placeholder="Search in Houses & Apartments For..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2.5 text-gray-700 text-sm outline-none" />
              <button className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 border-l border-blue-500 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 text-sm">
              {isLoggedIn ? (
                <button onClick={handleLogoutClick} className="text-white/80 hover:text-white font-medium flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <>
                  <button className="text-white/80 hover:text-white font-medium" onClick={handleLandlordAccess}>Sign in</button>
                  <span className="text-white/30">|</span>
                  <button className="text-white/80 hover:text-white font-medium" onClick={handleLandlordAccess}>Register</button>
                </>
              )}
              <button onClick={handleLandlordAccess} className="bg-white text-blue-600 font-bold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> SELL
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          <DesktopSidebar filters={filters} setFilters={setFilters} selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty} propertyCounts={propertyCounts} />
          <main className="flex-1 px-6 py-6 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}><Grid className="w-5 h-5" /></button>
                <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}><List className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-gray-500">{filteredProperties.length} properties</span>
              </div>
            </div>
            {loadingProperties ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <PropertyGrid items={filteredProperties} />
            )}
          </main>
        </div>
      </div>

      {/* ══════════ MOBILE ══════════ */}
      <div className="flex flex-col min-h-screen md:hidden bg-gray-50">
        <div className="sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 pt-10 pb-3"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/15 flex items-center justify-center shadow-lg border border-white/20">
                <img src="/logo.png" alt="House Hunter" className="w-9 h-9 object-contain"
                  onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:20px;font-weight:900;color:white;">HH</span>'; }} />
              </div>
              <div>
                <p className="text-white font-black text-lg leading-tight tracking-tight">House Hunter</p>
                <p className="text-blue-200 text-xs font-medium">Find your dream home 🏠</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-blue-600"></span>
            </button>
          </div>
          <div className="px-4 pb-4" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}>
            <div className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="pl-4"><Search className="w-4 h-4 text-blue-400" /></div>
              <input type="text" placeholder="Search properties, locations..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-3 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent" />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="pr-3"><X className="w-4 h-4 text-gray-400" /></button>
              ) : (
                <div className="px-3 py-2 mr-1"><div className="bg-blue-600 rounded-xl px-3 py-1.5"><Search className="w-4 h-4 text-white" /></div></div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white py-3 shadow-sm">
          <MobileFilterChips filters={filters} setFilters={setFilters} selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty} propertyCounts={propertyCounts} />
        </div>

        <div className="flex-1 pb-20">
          {activeTab === 'home' && (
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Properties For Rent</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{filteredProperties.length} listings in Kenya</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
              {loadingProperties ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No properties found</p>
                  <button onClick={clearFilters} className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">Clear Filters</button>
                </div>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
                  {filteredProperties.map(p => (
                    <PropertyCard key={p.id} property={p} isFavorite={savedIds.includes(p.id)}
                      onToggleFavorite={handleToggleFavorite} onViewDetails={setDetailProperty} view={view} user={user} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-gray-900 mb-4">Saved ({savedProperties.length})</h2>
              {!isLoggedIn ? (
                <div className="text-center py-16 px-4">
                  <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">Sign in to save properties</p>
                  <p className="text-gray-500 text-sm mb-4">Create an account to bookmark your favourite listings</p>
                  <button onClick={() => { setAuthModalConfig({ role: 'tenant', title: 'Save Properties', subtitle: 'Sign in to bookmark properties you love' }); setShowAuthModal(true); }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">Sign In / Sign Up</button>
                </div>
              ) : savedProperties.length === 0 ? (
                <div className="text-center py-16"><Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No saved properties yet</p></div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedProperties.map(p => <PropertyCard key={p.id} property={p} isFavorite={true} onToggleFavorite={handleToggleFavorite} onViewDetails={setDetailProperty} view="list" user={user} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-gray-900 mb-4">Messages</h2>
              {!isLoggedIn ? (
                <div className="text-center py-16 px-4">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">Sign in to view messages</p>
                  <p className="text-gray-500 text-sm mb-4">Create an account to message landlords</p>
                  <button onClick={() => { setAuthModalConfig({ role: 'tenant', title: 'Message Landlord', subtitle: 'Sign in to contact landlords' }); setShowAuthModal(true); }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">Sign In / Sign Up</button>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16"><MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm font-medium">No messages yet</p></div>
              ) : (
                <div className="space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{msg.properties?.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 mb-2">{new Date(msg.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="px-4 pt-6">
              {isLoggedIn && isTenant ? (
                <div>
                  <div className="bg-white rounded-2xl p-5 text-center mb-4 border border-gray-100">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-900">{user?.user_metadata?.full_name || 'Tenant'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Tenant Account</span>
                  </div>
                  <button onClick={handleLogoutClick} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm border border-red-100">Log Out</button>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 mb-4 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-base">Are you a Landlord?</p>
                        <p className="text-blue-100 text-xs">List your properties & reach tenants</p>
                      </div>
                    </div>
                    <button onClick={handleLandlordAccess} className="w-full bg-white text-blue-600 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition">
                      Sign In / Create Account
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Are you a Tenant?</p>
                        <p className="text-gray-500 text-xs">Save properties & message landlords</p>
                      </div>
                    </div>
                    <button onClick={() => { setAuthModalConfig({ role: 'tenant', title: 'Tenant Account', subtitle: 'Save properties and message landlords' }); setShowAuthModal(true); }}
                      className="w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition">
                      Sign In / Create Account
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4 px-4">
                    Tenants can browse freely without an account
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-5 py-2">
            {[
              { id: 'home', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>, label: 'Home' },
              { id: 'saved', icon: <Bookmark className="w-5 h-5" />, label: 'Saved', badge: savedIds.length },
              { id: 'sell', isCenter: true },
              { id: 'messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', badge: messages.length },
              { id: 'profile', icon: <User className="w-5 h-5" />, label: isLoggedIn ? (user?.user_metadata?.full_name?.split(' ')[0] || 'Me') : 'Profile' },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => {
                  if (tab.isCenter) { handleLandlordAccess(); return; }
                  setActiveTab(tab.id);
                }}
                className="flex flex-col items-center justify-center gap-0.5 py-1">
                {tab.isCenter ? (
                  <>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center -mt-5 shadow-lg"><Plus className="w-5 h-5 text-white" /></div>
                    <span className="text-[10px] font-medium text-gray-400 mt-0.5">Sell</span>
                  </>
                ) : (
                  <>
                    <div className={`relative ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {tab.icon}
                      {tab.badge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">{tab.badge}</span>}
                    </div>
                    <span className={`text-[10px] font-medium ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>{tab.label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;