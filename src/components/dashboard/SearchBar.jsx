import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const SearchBar = ({ filters = {}, setFilters = () => {}, onClearFilters = () => {}, selectedCounty = 'All Counties', onCountyChange = () => {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = filters.priceRange || filters.roomType || filters.propertyType || filters.bedrooms || selectedCounty !== 'All Counties';

  // Simplified list of main counties
  const counties = [
    'All Counties',
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Embu',
    'Murang\'a',
    'Kiambu',
    'Machakos',
    'Nyeri',
    'Meru',
    'Kilifi',
    'Uasin Gishu',
    'Kakamega'
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      {/* Compact Filter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900">All filters</h3>
            <p className="text-sm text-gray-600">
              {hasActiveFilters ? 'Filters applied' : 'Region, Price, Property Type, Bedrooms'}
            </p>
          </div>
        </div>
        
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible Filter Options */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Region/County */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={selectedCounty}
                onChange={(e) => onCountyChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                {counties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price, KSh</label>
              <select
                value={filters.priceRange || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setFilters({...filters, minPrice: '', maxPrice: '', priceRange: ''});
                  } else {
                    const [min, max] = value.split('-');
                    setFilters({...filters, minPrice: min, maxPrice: max, priceRange: value});
                  }
                }}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">Any Price</option>
                <option value="0-10000">Under 10,000</option>
                <option value="10000-20000">10,000 - 20,000</option>
                <option value="20000-30000">20,000 - 30,000</option>
                <option value="30000-50000">30,000 - 50,000</option>
                <option value="50000-80000">50,000 - 80,000</option>
                <option value="80000-120000">80,000 - 120,000</option>
                <option value="120000-999999999">Above 120,000</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.propertyType || ''}
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Bedsitter">Bedsitter</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  onClearFilters();
                  setIsExpanded(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;