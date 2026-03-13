import React, { useState, useMemo } from 'react';
import {
  Search, Bookmark, Plus, MessageSquare, User, Heart, MapPin,
  CheckCircle, SlidersHorizontal, ChevronDown, X, Bed, Bath,
  Maximize, Phone, Mail, Grid, List, ChevronRight
} from 'lucide-react';
import PropertyDetailPage from './PropertyDetailPage';

const COUNTIES = [
  'All Counties','Nairobi','Mombasa','Kisumu','Nakuru','Embu',
  "Murang'a",'Kiambu','Machakos','Kajiado','Nyeri','Meru',
  'Kilifi','Uasin Gishu','Kakamega','Bungoma','Kericho','Bomet'
];

const PROPERTIES = [
  { id: 1, title: "Modern 2BR Apartment", location: "Westlands, Nairobi", county: "Nairobi", price: 45000, size: 85, bedrooms: 2, bathrooms: 2, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", amenities: ["Parking", "WiFi", "Gym"], type: "Apartment", verified: true },
  { id: 2, title: "Cozy Studio with City View", location: "Kilimani, Nairobi", county: "Nairobi", price: 28000, size: 45, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", amenities: ["WiFi", "24/7 Security"], type: "Studio", verified: true },
  { id: 3, title: "Spacious 3BR Family House", location: "Karen, Nairobi", county: "Nairobi", price: 85000, size: 150, bedrooms: 3, bathrooms: 3, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop", amenities: ["Parking", "Garden", "Pet-Friendly"], type: "House", verified: true },
  { id: 4, title: "Affordable 1BR Near Town", location: "Embu Town, Embu", county: "Embu", price: 12000, size: 50, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", amenities: ["WiFi", "Security"], type: "Apartment", verified: false },
  { id: 5, title: "Luxury Penthouse Suite", location: "Upper Hill, Nairobi", county: "Nairobi", price: 120000, size: 180, bedrooms: 3, bathrooms: 3, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", amenities: ["Parking", "Pool", "Gym", "WiFi"], type: "Penthouse", verified: true },
  { id: 6, title: "Student-Friendly Bedsitter", location: "Embu University Area, Embu", county: "Embu", price: 8000, size: 30, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", amenities: ["WiFi", "Water 24/7"], type: "Bedsitter", verified: false },
  { id: 7, title: "Farmhouse with Scenic Views", location: "Kenol, Murang'a", county: "Murang'a", price: 25000, size: 120, bedrooms: 3, bathrooms: 2, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", amenities: ["Garden", "Security", "Parking"], type: "House", verified: true },
  { id: 8, title: "Cozy 2BR in Quiet Estate", location: "Gatanga, Murang'a", county: "Murang'a", price: 18000, size: 75, bedrooms: 2, bathrooms: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", amenities: ["Parking", "WiFi", "Security"], type: "Apartment", verified: true },
  { id: 9, title: "Modern Studio Apartment", location: "Embu Town, Embu", county: "Embu", price: 15000, size: 40, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", amenities: ["WiFi", "Parking"], type: "Studio", verified: true },
  { id: 10, title: "Family Home Near Schools", location: "Mwea, Embu", county: "Embu", price: 20000, size: 100, bedrooms: 3, bathrooms: 2, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop", amenities: ["Garden", "Parking", "Security"], type: "House", verified: true },
  { id: 11, title: "Town Center Apartment", location: "Murang'a Town, Murang'a", county: "Murang'a", price: 22000, size: 65, bedrooms: 2, bathrooms: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", amenities: ["WiFi", "Security", "Water 24/7"], type: "Apartment", verified: true },
  { id: 12, title: "Executive Villa", location: "Runda, Nairobi", county: "Nairobi", price: 150000, size: 220, bedrooms: 4, bathrooms: 4, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", amenities: ["Pool", "Garden", "Security", "Parking", "Gym"], type: "Villa", verified: true },
];

// ── Property Card ─────────────────────────────────────────────────────────────
const PropertyCard = ({ property, isFavorite, onToggleFavorite, onViewDetails, view }) => {
  if (view === 'list') {
    return (
      <div onClick={() => onViewDetails(property)} className="bg-white rounded-xl overflow-hidden border border-gray-200 flex cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative w-40 md:w-52 flex-shrink-0">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" style={{ minHeight: '120px' }} />
          <button onClick={e => { e.stopPropagation(); onToggleFavorite(property.id); }} className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow">
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
            <div className="text-blue-600 font-bold text-base">KSh {property.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">per month</span></div>
            <div className="text-gray-900 font-semibold text-sm mt-0.5 line-clamp-2">{property.title}</div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden md:block">
              Beautiful {property.type.toLowerCase()} in {property.location} — {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}, {property.amenities.slice(0, 2).join(', ')}.
            </p>
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
        <img src={property.image} alt={property.title} className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
        <button onClick={e => { e.stopPropagation(); onToggleFavorite(property.id); }} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
        {property.verified && (
          <span className="absolute bottom-2 right-2 bg-white text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow">
            <CheckCircle className="w-2.5 h-2.5" /> Verified ID
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-blue-600 font-bold text-base">KSh {property.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">per month</span></div>
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
      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">Location</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="px-4 py-2">
          <p className="text-sm text-blue-600 font-medium">{selectedCounty}</p>
        </div>
        <div className="px-3 pb-3 max-h-52 overflow-y-auto">
          {COUNTIES.map(county => {
            const count = propertyCounts[county] || 0;
            const isSelected = selectedCounty === county;
            return (
              <button key={county} onClick={() => onCountyChange(county)}
                disabled={county !== 'All Counties' && count === 0}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'} ${county !== 'All Counties' && count === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <span>{county}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900 text-sm">Price, KSh</span>
        </div>
        <div className="flex gap-2 mb-4">
          <input type="number" placeholder="min" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, priceRange: '' }))}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="text-gray-400 self-center text-xs">—</span>
          <input type="number" placeholder="max" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, priceRange: '' }))}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {[
          { label: 'Under 11 K', value: '0-11000' },
          { label: '11 - 35 K', value: '11000-35000' },
          { label: '35 - 85 K', value: '35000-85000' },
          { label: '85 - 290 K', value: '85000-290000' },
          { label: 'More than 290 K', value: '290000-999999999' },
        ].map(opt => (
          <label key={opt.value} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input type="radio" name="price" checked={filters.priceRange === opt.value}
              onChange={() => { const [min, max] = opt.value.split('-'); setFilters(f => ({ ...f, minPrice: min, maxPrice: max, priceRange: opt.value })); }}
              className="accent-blue-600 w-4 h-4" />
            <span className="text-sm text-gray-700 group-hover:text-blue-600">{opt.label}</span>
          </label>
        ))}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
          <button onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '', priceRange: '' }))} className="text-xs text-blue-600 hover:underline font-semibold">CLEAR</button>
          <button className="text-xs text-blue-600 hover:underline font-semibold">SAVE</button>
        </div>
      </div>

      {/* Type */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900 text-sm">Property Type</span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Find Property Type" className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {typeOptions.map(type => (
          <label key={type} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.propertyType === type}
              onChange={() => setFilters(f => ({ ...f, propertyType: f.propertyType === type ? '' : type }))}
              className="accent-blue-600 w-4 h-4 rounded" />
            <span className="text-sm text-gray-700 group-hover:text-blue-600">{type}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = ({ onLogout }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [detailProperty, setDetailProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', bedrooms: '', priceRange: '', propertyType: '' });

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const propertyCounts = useMemo(() => {
    const counts = { 'All Counties': PROPERTIES.length };
    PROPERTIES.forEach(p => { counts[p.county] = (counts[p.county] || 0) + 1; });
    return counts;
  }, []);

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (selectedCounty !== 'All Counties' && p.county !== selectedCounty) return false;
      if (filters.minPrice && p.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
      if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.propertyType && p.type !== filters.propertyType) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedCounty, filters, searchQuery]);

  const savedProperties = PROPERTIES.filter(p => favorites.includes(p.id));
  const clearFilters = () => { setFilters({ minPrice: '', maxPrice: '', bedrooms: '', priceRange: '', propertyType: '' }); setSelectedCounty('All Counties'); };

  if (detailProperty) {
    return (
      <PropertyDetailPage
        property={detailProperty}
        onBack={() => setDetailProperty(null)}
        isFavorite={favorites.includes(detailProperty.id)}
        onToggleFavorite={toggleFavorite}
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
          <PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)}
            onToggleFavorite={toggleFavorite} onViewDetails={setDetailProperty} view={view} />
        ))}
      </div>
    )
  );

  return (
    <>
      {/* ══════════ DESKTOP (md+) ══════════ */}
      <div className="hidden md:flex flex-col min-h-screen bg-gray-100">
        <header className="bg-blue-600 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
            {/* Desktop Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/logo.png"
                alt="House Hunter"
                className="w-10 h-10 object-contain rounded-lg"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="text-xl font-black text-white tracking-tight">House Hunter</span>
            </div>
            <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
              <input type="text" placeholder="Search in Houses & Apartments For..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-gray-700 text-sm outline-none" />
              <button className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 border-l border-blue-500 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 text-sm">
              <button className="text-white/80 hover:text-white font-medium" onClick={onLogout}>Sign in</button>
              <span className="text-white/30">|</span>
              <button className="text-white/80 hover:text-white font-medium">Registration</button>
              <button className="bg-white text-blue-600 font-bold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5">
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
                <span>Sort by:</span>
                <button className="font-semibold text-gray-900 hover:text-blue-600">↑↓ Recommended</button>
                <span className="text-gray-300">|</span>
                <button className="hover:text-blue-600">⏱ Any time</button>
                <span className="text-gray-500 ml-2">{filteredProperties.length} properties</span>
              </div>
            </div>
            <PropertyGrid items={filteredProperties} />
          </main>
        </div>
      </div>

      {/* ══════════ MOBILE (below md) ══════════ */}
      <div className="flex flex-col min-h-screen md:hidden bg-gray-100">

        {/* Mobile Header with Logo + Search */}
        <div className="bg-blue-600 pt-10 pb-3 px-4 sticky top-0 z-40">
          {/* Logo Row */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/logo.png"
              alt="House Hunter"
              className="w-9 h-9 object-contain rounded-lg"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span className="text-white font-black text-lg tracking-tight">House Hunter</span>
          </div>
          {/* Search Row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl flex items-center px-3 py-2.5 gap-2 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search in Houses & Apartments For..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent" />
            </div>
            <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white py-3 sticky top-[72px] z-30 shadow-sm">
          <MobileFilterChips filters={filters} setFilters={setFilters} selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty} propertyCounts={propertyCounts} />
        </div>

        <div className="flex-1 pb-20">
          {activeTab === 'home' && (
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-gray-900 mb-3">Houses & Apartments For Rent in Kenya</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Sort by:</span>
                  <button className="font-semibold text-gray-900">↑↓ Recommended</button>
                  <span>|</span>
                  <button>Any time</button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No properties found</p>
                  <button onClick={clearFilters} className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">Clear Filters</button>
                </div>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
                  {filteredProperties.map(p => (
                    <PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)}
                      onToggleFavorite={toggleFavorite} onViewDetails={setDetailProperty} view={view} />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-gray-900 mb-4">Saved ({savedProperties.length})</h2>
              {savedProperties.length === 0 ? (
                <div className="text-center py-16"><Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No saved properties yet</p></div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedProperties.map(p => <PropertyCard key={p.id} property={p} isFavorite={true} onToggleFavorite={toggleFavorite} onViewDetails={setDetailProperty} view="list" />)}
                </div>
              )}
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="text-center py-16 px-4">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No messages yet</p>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="px-4 pt-4">
              <div className="bg-white rounded-2xl p-5 text-center mb-4 border border-gray-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-gray-900">user@example.com</p>
                <p className="text-sm text-gray-500">Tenant Account</p>
              </div>
              <button onClick={onLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm border border-red-100">Log Out</button>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-5 py-2">
            {[
              { id: 'home', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>, label: 'Home' },
              { id: 'saved', icon: <Bookmark className="w-5 h-5" />, label: 'Saved', badge: favorites.length },
              { id: 'sell', isCenter: true },
              { id: 'messages', icon: <MessageSquare className="w-5 h-5" />, label: 'Messages' },
              { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
            ].map(tab => (
              <button key={tab.id} onClick={() => !tab.isCenter && setActiveTab(tab.id)} className="flex flex-col items-center justify-center gap-0.5 py-1">
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