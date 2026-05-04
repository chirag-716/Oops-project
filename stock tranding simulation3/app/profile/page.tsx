'use client';

import { useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Trading St, New York, NY 10001',
    joinDate: 'January 15, 2023',
    accountType: 'Premium',
    verificationStatus: 'Verified'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">JD</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                    {user.verificationStatus}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                    {user.accountType}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">{user.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account ID</span>
                  <span className="text-white">#USR-2023-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="trading-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="trading-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="trading-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="trading-input w-full"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <p className="text-white">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <p className="text-white">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number
                    </label>
                    <p className="text-white">{user.phone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Address
                    </label>
                    <p className="text-white">{user.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="glass-card p-6 mt-8">
              <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                  <span className="text-white">Change Password</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                  <span className="text-white">Two-Factor Authentication</span>
                  <span className="text-green-400">Enabled</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                  <span className="text-white">API Keys</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
