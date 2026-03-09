import React, { useState } from 'react';
import {
  ArrowLeft, Heart, Bookmark, Share2, MapPin, Eye,
  Phone, MessageSquare, Flag, ChevronLeft, ChevronRight,
  CheckCircle, Bed, Bath, Maximize, Home, Droplets,
  Grid, Shield, Camera, X, User
} from 'lucide-react';

const PropertyDetailPage = ({ property, onBack, isFavorite, onToggleFavorite }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showAllDesc, setShowAllDesc] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = [
    property.image,
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  ];

  const details = [
    { label: 'PROPERTY ADDRESS', value: property.location },
    { label: 'PROPERTY SIZE', value: `${property.size} sqm` },
    { label: 'CONDITION', value: 'Fairly Used' },
    { label: 'FURNISHING', value: 'Unfurnished' },
    { label: 'TOILETS', value: String(property.bathrooms) },
    { label: 'SERVICE CHARGE COVERS', value: `KSh ${Math.round(property.price * 0.1).toLocaleString()} service charge` },
  ];

  const description = `This beautiful ${property.type.toLowerCase()} is located in ${property.location} and offers modern, comfortable living with ${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''} and ${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}. With ${property.size}m² of living space, this property is perfect for those seeking quality accommodation in a prime location.\n\nThe unit features ${property.amenities.join(', ')} and is well-maintained throughout. Situated in a secure compound with 24-hour security, this property provides everything you need for comfortable and convenient living. The spacious rooms are well-lit with natural light, and the modern finishes give the home a warm and contemporary feel.\n\nDon't miss this opportunity to secure a quality home in ${property.location.split(',')[0]}.`;

  const safetyTips = [
    "It's safer not to pay ahead for inspections",
    "Ask friends or somebody you trust to accompany you for viewing",
    "Look around the apartment to ensure it meets your expectations",
    "Don't pay beforehand if they won't let you move in immediately",
    "Verify that the account details belong to the right property owner before initiating payment",
  ];

  const similarProperties = [
    { id: 101, title: `2bdrm Apartment in ${property.location.split(',')[0]} for rent`, price: Math.round(property.price * 0.9), location: property.location, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', badge: '3+ YEARS ON HH' },
    { id: 102, title: `3bdrm House in ${property.location.split(',')[0]} for rent`, price: Math.round(property.price * 1.3), location: property.location, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop', badge: '5+ YEARS ON HH' },
    { id: 103, title: `Studio Apartment in ${property.location.split(',')[0]} for rent`, price: Math.round(property.price * 0.5), location: property.location, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Mobile Header */}
      <div className="md:hidden bg-blue-600 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 font-semibold text-sm truncate">{property.title}</span>
        <button onClick={() => onToggleFavorite(property.id)}>
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : 'text-white/70'}`} />
        </button>
      </div>

      {/* Desktop Header */}
      <header className="hidden md:block bg-blue-600 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-black text-sm">HH</span>
            </div>
            <span className="text-xl font-black tracking-tight">House Hunter</span>
          </div>
          <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
            <input type="text" placeholder="Search in Houses & Apartments For..." className="flex-1 px-4 py-2.5 text-gray-700 text-sm outline-none" />
            <button className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors border-l border-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 text-sm">
            <button className="text-white/80 hover:text-white font-medium">Sign in</button>
            <span className="text-white/30">|</span>
            <button className="text-white/80 hover:text-white font-medium">Registration</button>
            <button className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">SELL</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto md:px-6 md:py-6 md:flex md:gap-6">

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* Image Gallery */}
          <div className="bg-black">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <img
                src={images[currentImage]}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">TOP+</span>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Camera className="w-3 h-3" /> {currentImage + 1}/{images.length}
              </div>
              {currentImage > 0 && (
                <button onClick={() => setCurrentImage(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {currentImage < images.length - 1 && (
                <button onClick={() => setCurrentImage(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 p-2 bg-gray-900 overflow-x-auto">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-90'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="flex-shrink-0 w-24 h-16 rounded bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                <div className="text-center text-white">
                  <div className="text-lg font-bold">+5</div>
                  <div className="text-xs">images</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: price + contact */}
          <div className="md:hidden bg-white px-4 py-4 border-b border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-3">
              KSh {property.price.toLocaleString()}<span className="text-base text-gray-500 font-normal"> per month</span>
            </div>
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold text-sm mb-3 hover:bg-blue-50 transition-colors">
              Request call back
            </button>
            <div className="flex items-center gap-3 py-3 border-t border-gray-100">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">M</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900">HH Landlord</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> New on House Hunter</div>
                <div className="text-xs text-gray-400">Last seen 3 hours ago</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setShowContact(!showContact)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4" /> {showContact ? '0712 345 678' : 'Show contact'}
              </button>
              <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <MessageSquare className="w-4 h-4" /> Start chat
              </button>
            </div>
          </div>

          {/* Title & meta */}
          <div className="bg-white px-4 md:px-6 py-4 md:rounded-xl md:mt-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{property.title}</h1>
              <button onClick={() => onToggleFavorite(property.id)} className="hidden md:flex w-9 h-9 flex-shrink-0 items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-blue-600 text-blue-600' : 'text-gray-500'}`} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">Sponsored</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{property.location}, 11 hours ago</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />37 views</span>
            </div>
            {/* Type icons */}
            <div className="flex items-center gap-6 md:gap-10 py-4 border-t border-gray-100 overflow-x-auto">
              {[
                { icon: <Home className="w-5 h-5 text-gray-600" />, label: property.type },
                { icon: <Bed className="w-5 h-5 text-gray-600" />, label: `${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}` },
                { icon: <Bath className="w-5 h-5 text-gray-600" />, label: `${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}` },
                { icon: <Maximize className="w-5 h-5 text-gray-600" />, label: `${property.size} m²` },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-white px-4 md:px-6 py-5 mt-2 md:rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-gray-100 md:divide-y-0 md:gap-y-5">
              {details.slice(0, showAllDetails ? details.length : 4).map((d, i) => (
                <div key={i} className={`py-3 md:py-0 ${i % 2 !== 0 ? 'md:pl-8 md:border-l md:border-gray-200' : 'md:pr-8'}`}>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">{d.label}</div>
                  <div className="text-sm md:text-base text-gray-900 font-medium">{d.value}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAllDetails(!showAllDetails)} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              {showAllDetails ? 'Show less ▲' : 'Show more ▼'}
            </button>
          </div>

          {/* Amenities */}
          <div className="bg-white px-4 md:px-6 py-5 mt-2 md:rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...property.amenities, '24-hour Electricity', 'Hot Water', 'Tiled Floor'].map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white px-4 md:px-6 py-5 mt-2 md:rounded-xl">
            <p className={`text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line ${!showAllDesc ? 'line-clamp-4' : ''}`}>
              {description}
            </p>
            <button onClick={() => setShowAllDesc(!showAllDesc)} className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              {showAllDesc ? 'Show less ▲' : 'Show more ▼'}
            </button>
          </div>

          {/* Mobile sticky show contact */}
          <div className="md:hidden px-4 py-4 bg-white mt-2">
            <button onClick={() => setShowContact(!showContact)} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
              <Phone className="w-5 h-5" />
              {showContact ? '0712 345 678' : 'Show contact'}
            </button>
          </div>

          {/* Similar adverts */}
          <div className="bg-white px-4 md:px-0 py-5 mt-2 md:mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Similar adverts</h2>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-blue-600"><Grid className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {similarProperties.map(sp => (
                <div key={sp.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img src={sp.image} alt={sp.title} className="w-full h-36 md:h-48 object-cover" />
                    {sp.badge && (
                      <span className="absolute top-2 right-2 bg-white/90 text-gray-700 text-[9px] px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5 shadow">
                        <User className="w-2.5 h-2.5" /> {sp.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 md:p-3">
                    <div className="text-blue-600 font-bold text-sm">KSh {sp.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">per month</span></div>
                    <div className="text-gray-900 font-semibold text-xs md:text-sm mt-0.5 line-clamp-2">{sp.title}</div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{sp.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden md:block w-80 flex-shrink-0 space-y-4">

          {/* Price */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-gray-900 mb-4">
              KSh {property.price.toLocaleString()}<span className="text-sm text-gray-500 font-normal"> per month</span>
            </div>
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Request call back
            </button>
          </div>

          {/* Seller */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">M</div>
              <div>
                <div className="font-bold text-gray-900">HH Landlord</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><User className="w-3 h-3" /> New on House Hunter</div>
                <div className="text-xs text-gray-400">Last seen 3 hours ago</div>
              </div>
            </div>
            <button onClick={() => setShowContact(!showContact)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 mb-2 hover:bg-blue-700 transition-colors">
              <Phone className="w-4 h-4" />
              {showContact ? '0712 345 678' : 'Show contact'}
            </button>
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
              <MessageSquare className="w-4 h-4" /> Start chat
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-2">
            <button className="flex-1 border border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
              Mark unavailable
            </button>
            <button className="flex-1 border border-red-400 text-red-500 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 hover:bg-red-50 transition-colors">
              <Flag className="w-3.5 h-3.5" /> Report Abuse
            </button>
          </div>

          {/* Safety tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-center mb-3 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" /> Safety tips
            </h3>
            <ul className="space-y-2">
              {safetyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post ad */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Post Ad Like This
            </button>
          </div>

        </aside>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm">{currentImage + 1} / {images.length}</span>
            <button onClick={() => setLightboxOpen(false)} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-12">
            <img src={images[currentImage]} alt="" className="max-h-full max-w-full object-contain" />
            {currentImage > 0 && (
              <button onClick={() => setCurrentImage(i => i - 1)} className="absolute left-2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {currentImage < images.length - 1 && (
              <button onClick={() => setCurrentImage(i => i + 1)} className="absolute right-2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetailPage;