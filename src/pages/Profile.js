// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePreferences } from '../store/slices/userSlice';
import Layout from '../components/Layout/Layout';
import UserInfo from '../components/Profile/UserInfo';
import PreferencesForm from '../components/Profile/PreferencesForm';
import ThemeSelector from '../components/Profile/ThemeSelector';
import Loader from '../components/common/Loader';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ConfirmDialog from '../components/common/ConfirmDialog';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.user);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });
  
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'light',
    notifications: user?.preferences?.notifications || {
      reminders: true,
      insights: true,
      tips: true,
    },
    dataSharing: user?.preferences?.dataSharing || {
      anonymousAnalytics: true,
      personalizedContent: true,
    },
    accessibility: user?.preferences?.accessibility || {
      fontSize: 'medium',
      highContrast: false,
    }
  });

  useEffect(() => {
    // Update local state when user data changes
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      });
      
      setPreferences({
        theme: user.preferences?.theme || 'light',
        notifications: user.preferences?.notifications || {
          reminders: true,
          insights: true,
          tips: true,
        },
        dataSharing: user.preferences?.dataSharing || {
          anonymousAnalytics: true,
          personalizedContent: true,
        },
        accessibility: user.preferences?.accessibility || {
          fontSize: 'medium',
          highContrast: false,
        }
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferencesChange = (category, setting, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleThemeChange = (theme) => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  };

  const handleSubmitPersonalInfo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(personalInfo)).unwrap();
      setSuccessMessage('Personal information updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleSubmitPreferences = async () => {
    try {
      await dispatch(updatePreferences(preferences)).unwrap();
      setSuccessMessage('Preferences updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  const renderPersonalInfoTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
      <UserInfo 
        personalInfo={personalInfo}
        onChange={handlePersonalInfoChange}
        onSubmit={handleSubmitPersonalInfo}
        
        isLoading={isLoading}
      />
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
      <PreferencesForm 
        preferences={preferences}
        onChange={handlePreferencesChange}
        onSubmit={handleSubmitPreferences}
        isLoading={isLoading}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Theme</h3>
        <ThemeSelector 
          currentTheme={preferences.theme}
          onChange={handleThemeChange}
        />
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
          <p className="text-gray-500 text-sm mt-1">Update your password to keep your account secure</p>
          <button 
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Password
          </button>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Data Management</h3>
          <p className="text-gray-500 text-sm mt-1">Manage your personal data and account activities</p>
          <div className="mt-3 space-y-3">
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download My Data
            </button>
            <button 
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Activity Log
            </button>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-red-800">Danger Zone</h3>
          <p className="text-gray-500 text-sm mt-1">Actions here cannot be undone</p>
          <div className="mt-3 space-y-3">
            <button 
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-100 rounded-lg p-1 flex mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'personal' 
                  ? 'bg-white text-indigo-700 shadow' 
                  : 'text-gray-700 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'preferences' 
                  ? 'bg-white text-indigo-700 shadow' 
                  : 'text-gray-700 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'account' 
                  ? 'bg-white text-indigo-700 shadow' 
                  : 'text-gray-700 hover:text-indigo-700'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
          </div>
          
          {isLoading && !user ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" color="indigo" />
            </div>
          ) : (
            <>
              {activeTab === 'personal' && renderPersonalInfoTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
              {activeTab === 'account' && renderAccountTab()}
            </>
          )}
        </div>
        
        {/* Confirm Account Deletion Dialog */}
        <ConfirmDialog
          isOpen={confirmLogout}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
          confirmLabel="Delete Account"
          cancelLabel="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={() => {
            // Handle account deletion
            console.log('Account deletion confirmed');
            setConfirmLogout(false);
          }}
          onCancel={() => setConfirmLogout(false)}
        />
      </Layout>
    </ErrorBoundary>
  );
};

export default Profile;
