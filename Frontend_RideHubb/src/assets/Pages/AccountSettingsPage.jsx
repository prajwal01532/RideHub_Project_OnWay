import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaSave, FaTrash, FaTimes, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/profile');
      
      if (response.data.success) {
        setUser(response.data.user);
        setEditedUser(response.data.user);
      } else {
        toast.error('Failed to load user data');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user data');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/users/profile', editedUser);
      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteAccount = async () => {
    try {
      if (!password) {
        toast.error('Please enter your password');
        return;
      }

      const response = await api.post('/users/delete-account', { password });
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Account deleted successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      if (error.response?.status === 401) {
        toast.error('Please enter correct password to delete your account');
        setPassword('');
        navigate('/account/settings');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete account');
        setPassword('');
        navigate('/account/settings');
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error('All fields are required');
        setIsChangingPassword(false);
        return;
      }

      // Check if new password is same as current password
      if (passwordData.currentPassword === passwordData.newPassword) {
        toast.error('New password must be different from current password');
        setIsChangingPassword(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        setIsChangingPassword(false);
        return;
      }

      // Validate password requirements
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character');
        setIsChangingPassword(false);
        return;
      }

      const response = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      // Handle specific error messages from the backend
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
        setPasswordData({
          ...passwordData,
          currentPassword: ''
        });
      } else if (error.response?.data?.message === 'New password must be different from current password') {
        toast.error('New password must be different from current password');
      } else {
        toast.error(error.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <FaUser className="mr-3 text-blue-200" /> Account Settings
            </h2>
          </div>

          <div className="p-8">
            {/* Account Information Section */}
            <div className="mb-10 bg-white rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Account Information</h3>
                <div className="space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <FaEdit className="mr-2" /> Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-3">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <FaSave className="mr-2" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={isEditing ? editedUser.fullName : user.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={isEditing ? editedUser.email : user.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={isEditing ? editedUser.phoneNumber : user.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Password Settings</h3>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                >
                  <FaKey className="mr-2" /> Change Password
                </button>
              </div>

              {showChangePassword && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Changing Password...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Account Section */}
            <div className="border-t pt-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-500 mt-1">Once you delete your account, there is no going back.</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <FaTrash className="mr-2" /> Delete Account
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Confirm Account Deletion</h4>
                    <p className="text-gray-600 mb-4">Please enter your password to confirm account deletion:</p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 mb-4"
                      placeholder="Enter your password"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setPassword('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;