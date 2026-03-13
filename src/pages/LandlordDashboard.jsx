import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Edit, Trash2, Phone, Mail, MessageSquare, User, LogOut, Bell, Upload, X, Image } from 'lucide-react';
import { fetchLandlordProperties, insertProperty, updateProperty, deleteProperty, fetchLandlordMessages, uploadPropertyImage } from '../lib/supabase';

const LandlordDashboard = ({ onLogout, user }) => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load properties and messages
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [propsResult, msgsResult] = await Promise.all([
      fetchLandlordProperties(user.id),
      fetchLandlordMessages(user.id)
    ]);
    if (propsResult.data) setProperties(propsResult.data);
    if (msgsResult.data) setInquiries(msgsResult.data);
    setLoading(false);
  };

  const handleAddProperty = async (propertyData) => {
    const { data, error } = await insertProperty({
      ...propertyData,
      landlord_id: user.id,
      price: parseInt(propertyData.price),
      bedrooms: parseInt(propertyData.bedrooms),
      bathrooms: parseInt(propertyData.bathrooms),
    });
    if (!error && data) {
      setProperties(prev => [data, ...prev]);
    } else {
      alert('Failed to add property: ' + (error?.message || 'Unknown error'));
    }
    setShowPropertyForm(false);
  };

  const handleUpdateProperty = async (propertyData) => {
    const { data, error } = await updateProperty(editingProperty.id, {
      ...propertyData,
      price: parseInt(propertyData.price),
      bedrooms: parseInt(propertyData.bedrooms),
      bathrooms: parseInt(propertyData.bathrooms),
    });
    if (!error && data) {
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? data : p));
    } else {
      alert('Failed to update property: ' + (error?.message || 'Unknown error'));
    }
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await deleteProperty(id);
      if (!error) {
        setProperties(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete: ' + error.message);
      }
    }
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Landlord Portal</h1>
                <p className="text-xs text-gray-600">{user?.user_metadata?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                {inquiries.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Property Listings</h2>
          <button onClick={() => { setEditingProperty(null); setShowPropertyForm(true); }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Property</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Listed</h3>
                  <p className="text-gray-600 mb-4">Start advertising your properties to potential tenants</p>
                  <button onClick={() => setShowPropertyForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">
                    Add Your First Property
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {properties.map(property => (
                    <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {property.images && property.images.length > 0 ? (
                            <div className="relative">
                              <img src={property.images[0]} alt={property.title} className="w-32 h-32 rounded-lg object-cover" />
                              {property.images.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">+{property.images.length - 1}</div>
                              )}
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                              <div className="flex items-center text-gray-600 text-sm mt-1">
                                <MapPin className="w-4 h-4 mr-1" />{property.location}
                              </div>
                              <p className="text-2xl font-bold text-blue-600 mt-2">
                                KES {property.price?.toLocaleString()}<span className="text-sm text-gray-600">/month</span>
                              </p>
                              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span>{property.bedrooms} Bed</span>
                                <span>{property.bathrooms} Bath</span>
                                <span>{property.type}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditProperty(property)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDeleteProperty(property.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          {(property.contact_phone || property.contact_email) && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                <strong>Contact:</strong> {property.contact_phone} {property.contact_email && `| ${property.contact_email}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Inquiries */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Inquiries</h3>
                <p className="text-sm text-gray-600 mt-1">Messages from interested tenants</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {inquiries.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No inquiries yet</p>
                  </div>
                ) : (
                  inquiries.map(inquiry => (
                    <div key={inquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{inquiry.profiles?.full_name || 'Tenant'}</p>
                          <p className="text-xs text-gray-500 mb-2">{inquiry.properties?.title}</p>
                          <p className="text-sm text-gray-700 mb-2">{inquiry.message}</p>
                          <p className="text-xs text-gray-400">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPropertyForm && (
        <PropertyFormModal
          onClose={() => { setShowPropertyForm(false); setEditingProperty(null); }}
          onSubmit={editingProperty ? handleUpdateProperty : handleAddProperty}
          initialData={editingProperty}
          userId={user?.id}
        />
      )}
    </div>
  );
};

// ── Property Form Modal ───────────────────────────────────────────────────────
const PropertyFormModal = ({ onClose, onSubmit, initialData, userId }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '', location: '', county: '', price: '', bedrooms: '', bathrooms: '',
    type: '', contact_phone: '', contact_email: '', description: '', images: []
  });
  const [imagePreview, setImagePreview] = useState(initialData?.images || []);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Embu', "Murang'a", 'Kiambu', 'Machakos', 'Kajiado', 'Nyeri', 'Meru', 'Kilifi', 'Uasin Gishu', 'Kakamega'];
  const propertyTypes = ['Apartment', 'House', 'Studio', 'Bedsitter', 'Villa', 'Penthouse'];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); continue; }
      const { url, error } = await uploadPropertyImage(file, userId);
      if (url) {
        setImagePreview(prev => [...prev, url]);
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      } else {
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(prev => [...prev, reader.result]);
          setFormData(prev => ({ ...prev, images: [...(prev.images || []), reader.result] }));
        };
        reader.readAsDataURL(file);
      }
    }
    setUploading(false);
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setImagePreview(prev => [...prev, imageUrl]);
      setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageUrl] }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.images || formData.images.length === 0) { alert('Please add at least one image'); return; }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{initialData ? 'Edit Property' : 'Add New Property'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <label className="block text-lg font-semibold text-gray-900 mb-4">Property Images *</label>
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setUploadMethod('file')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${uploadMethod === 'file' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                Upload Files
              </button>
              <button type="button" onClick={() => setUploadMethod('url')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${uploadMethod === 'url' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                Add URL
              </button>
            </div>

            {uploadMethod === 'file' && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition-colors mb-4">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                  ) : (
                    <Upload className="w-10 h-10 text-blue-500 mb-2" />
                  )}
                  <p className="text-sm text-gray-600"><span className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</span></p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}

            {uploadMethod === 'url' && (
              <div className="mb-4 flex gap-2">
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="button" onClick={handleAddImageUrl} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            )}

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                    <button type="button" onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Modern 2BR Apartment" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Westlands, Nairobi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">County *</label>
              <select required value={formData.county} onChange={e => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select County</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (KES) *</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="45000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
              <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Type</option>
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
              <input type="number" required value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
              <input type="number" required value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
              <input type="tel" required value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+254 712 345 678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input type="email" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="landlord@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe your property in detail..." />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg font-medium">
              {initialData ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;