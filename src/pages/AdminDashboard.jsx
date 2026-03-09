import React, { useState, useMemo } from 'react';
import { 
  Users, Home, BarChart3, Settings, LogOut, Bell, User, 
  Search, Filter, Edit, Trash2, CheckCircle, XCircle, 
  TrendingUp, DollarSign, MapPin, Eye, MoreVertical,
  UserCheck, UserX, Shield, Activity, Calendar, Mail
} from 'lucide-react';

// Header Component
const AdminHeader = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-600">House Hunter Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <User className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-gray-900 font-semibold">admin@househunter.com</p>
                      <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                        Administrator
                      </span>
                    </div>
                    <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center space-x-3">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center space-x-3">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button 
                      onClick={onLogout}
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

// Stats Card Component
const StatCard = ({ icon: Icon, title, value, change, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active 
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

// User Management Component
const UserManagement = ({ users, onEditUser, onDeleteUser, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All Roles</option>
            <option value="tenant">Tenants</option>
            <option value="landlord">Landlords</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'landlord' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'landlord' ? <Home className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className="flex items-center space-x-2"
                    >
                      {user.active ? (
                        <span className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm font-medium">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditUser(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No users found</p>
        </div>
      )}
    </div>
  );
};

// Property Management Component
const PropertyManagement = ({ properties, onEditProperty, onDeleteProperty }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countyFilter, setCountyFilter] = useState('all');

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = countyFilter === 'all' || property.county === countyFilter;
    return matchesSearch && matchesCounty;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All Counties</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Embu">Embu</option>
            <option value="Murang'a">Murang'a</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              {property.verified && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
              <p className="text-sm text-gray-600 mb-2 flex items-start">
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                {property.location}
              </p>
              
              <div className="text-xl font-bold text-purple-600 mb-3">
                KSh {property.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal">/month</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditProperty(property.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProperty(property.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No properties found</p>
        </div>
      )}
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500 mt-1">Integrate with your charting library</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New user registered', user: 'John Doe', time: '5 minutes ago', type: 'user' },
            { action: 'Property listed', user: 'Jane Smith', time: '1 hour ago', type: 'property' },
            { action: 'Payment received', user: 'Mike Johnson', time: '2 hours ago', type: 'payment' },
            { action: 'User updated profile', user: 'Sarah Wilson', time: '3 hours ago', type: 'user' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'user' ? 'bg-blue-100' :
                activity.type === 'property' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'user' && <UserCheck className="w-5 h-5 text-blue-600" />}
                {activity.type === 'property' && <Home className="w-5 h-5 text-green-600" />}
                {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'tenant', active: true, joinedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'landlord', active: true, joinedDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'tenant', active: false, joinedDate: '2024-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'landlord', active: true, joinedDate: '2024-03-25' },
  ];

  const properties = [
    { id: 1, title: "Modern 2BR Apartment", location: "Westlands, Nairobi", county: "Nairobi", price: 45000, bedrooms: 2, bathrooms: 2, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", verified: true },
    { id: 2, title: "Cozy Studio", location: "Kilimani, Nairobi", county: "Nairobi", price: 28000, bedrooms: 1, bathrooms: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", verified: true },
    { id: 3, title: "Family House", location: "Embu Town, Embu", county: "Embu", price: 85000, bedrooms: 3, bathrooms: 3, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36594?w=800&h=600&fit=crop", verified: false },
  ];

  const handleEditUser = (id) => {
    alert(`Edit user ${id}`);
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      alert(`Delete user ${id}`);
    }
  };

  const handleToggleStatus = (id) => {
    alert(`Toggle status for user ${id}`);
  };

  const handleEditProperty = (id) => {
    alert(`Edit property ${id}`);
  };

  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      alert(`Delete property ${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Users} 
            title="Total Users" 
            value="1,234" 
            change={12.5} 
            color="blue"
          />
          <StatCard 
            icon={Home} 
            title="Total Properties" 
            value="456" 
            change={8.2} 
            color="green"
          />
          <StatCard 
            icon={DollarSign} 
            title="Revenue (KSh)" 
            value="2.4M" 
            change={15.3} 
            color="purple"
          />
          <StatCard 
            icon={Activity} 
            title="Active Listings" 
            value="342" 
            change={-2.4} 
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              icon={BarChart3}
              label="Overview"
            />
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
              icon={Users}
              label="Users"
            />
            <TabButton 
              active={activeTab === 'properties'} 
              onClick={() => setActiveTab('properties')}
              icon={Home}
              label="Properties"
            />
            <TabButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
              icon={Settings}
              label="Settings"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <Analytics />}
        {activeTab === 'users' && (
          <UserManagement 
            users={users}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        )}
        {activeTab === 'properties' && (
          <PropertyManagement 
            properties={properties}
            onEditProperty={handleEditProperty}
            onDeleteProperty={handleDeleteProperty}
          />
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Platform Settings</h4>
                <p className="text-sm text-gray-600">Configure platform-wide settings and preferences</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Email Notifications</h4>
                <p className="text-sm text-gray-600">Manage email notification settings</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                <p className="text-sm text-gray-600">Configure security and authentication settings</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;