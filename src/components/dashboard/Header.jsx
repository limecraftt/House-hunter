import React, { useState, useEffect } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

const Header = ({ favorites, onLogout, newListingsCount = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [hasNewListings, setHasNewListings] = useState(false);

  // Check for new listings
  useEffect(() => {
    if (newListingsCount > 0) {
      setHasNewListings(true);
    }
  }, [newListingsCount]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleNotificationClick = () => {
    if (hasNewListings) {
      // Handle notification click - you can show a modal or navigate to new listings
      alert(`You have ${newListingsCount} new listing${newListingsCount > 1 ? 's' : ''}!`);
      setHasNewListings(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">HH</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                House Hunter
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Find your perfect home</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell - Only shows dot when there are new listings */}
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            >
              <Bell className="w-5 h-5" />
              {hasNewListings && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-gray-900 font-semibold truncate">
                        {JSON.parse(localStorage.getItem('user') || '{}').email || 'user@example.com'}
                      </p>
                    </div>
                    <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center space-x-3">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center space-x-3">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center space-x-3 border-t border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;