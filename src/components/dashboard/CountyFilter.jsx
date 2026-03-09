import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const CountyFilter = ({ selectedCounty = 'All Counties', onCountyChange = () => {}, propertyCounts = {} }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // List of Kenyan counties
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
    'Kajiado',
    'Nyeri',
    'Meru',
    'Kilifi',
    'Uasin Gishu',
    'Kakamega',
    'Bungoma',
    'Kericho',
    'Bomet',
    'Trans Nzoia',
    'Nandi',
    'Baringo',
    'Laikipia',
    'Samburu',
    'Turkana',
    'West Pokot',
    'Elgeyo-Marakwet',
    'Nyandarua',
    'Kirinyaga',
    'Tharaka-Nithi',
    'Kitui',
    'Makueni',
    'Taita-Taveta',
    'Kwale',
    'Tana River',
    'Lamu',
    'Garissa',
    'Wajir',
    'Mandera',
    'Marsabit',
    'Isiolo',
    'Siaya',
    'Kisii',
    'Homa Bay',
    'Migori',
    'Nyamira',
    'Narok',
    'Vihiga',
    'Busia'
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl mb-8 border border-blue-500 overflow-hidden">
      {/* Header - Always Visible */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Select Your County</h2>
              <p className="text-blue-100 text-sm">
                {isExpanded 
                  ? 'Choose a county to see available properties' 
                  : `Currently viewing: ${selectedCounty}`
                }
              </p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
            aria-label={isExpanded ? 'Collapse county filter' : 'Expand county filter'}
          >
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDown className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {counties.map((county) => {
              const count = propertyCounts[county] || 0;
              const isSelected = selectedCounty === county;
              const isAllCounties = county === 'All Counties';
              
              return (
                <button
                  key={county}
                  onClick={() => onCountyChange(county)}
                  disabled={!isAllCounties && count === 0}
                  className={`
                    relative py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
                    ${isSelected 
                      ? 'bg-white text-blue-700 shadow-lg scale-105 ring-2 ring-white/50' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }
                    ${!isAllCounties && count === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="truncate w-full text-center">{county}</span>
                    {!isAllCounties && (
                      <span className={`text-xs mt-1 ${isSelected ? 'text-blue-600' : 'text-blue-200'}`}>
                        {count} {count === 1 ? 'property' : 'properties'}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountyFilter;