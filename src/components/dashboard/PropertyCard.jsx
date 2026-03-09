import React from 'react';
import { MapPin, Bed, Maximize, Heart } from 'lucide-react';

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>
        
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </button>
        
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
            {property.type}
          </div>
          {property.verified && (
            <div className="bg-green-500/95 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
              ✓ Verified
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-3 h-3 mr-1 text-blue-600" />
          <span className="text-xs truncate">{property.location}</span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="w-3 h-3 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Maximize className="w-3 h-3 mr-1" />
            <span>{property.size}m²</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 2).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 text-blue-600 text-xs rounded-full font-medium">
              +{property.amenities.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {property.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-xs ml-1">/mo</span>
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-xs font-semibold shadow-lg shadow-blue-500/30">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;