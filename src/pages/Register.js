// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/userSlice';
import Loader from '../components/common/Loader';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [initialAssessment, setInitialAssessment] = useState({
    currentMood: 5,
    sleepQuality: 5,
    stressLevel: 5,
    primaryGoal: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setInitialAssessment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAccountForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAssessmentForm = () => {
    const newErrors = {};
    
    if (!initialAssessment.primaryGoal) {
      newErrors.primaryGoal = 'Please select a primary goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateAccountForm()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNextStep();
      return;
    }
    
    if (validateAssessmentForm()) {
      try {
        await dispatch(register({
          ...formData,
          initialAssessment
        })).unwrap();
        navigate('/dashboard');
      } catch (err) {
        console.error('Registration failed:', err);
      }
    }
  };

  const renderAccountForm = () => (
    <>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="Your full name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="Email address"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="Password (min 8 characters)"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>
      
      <div className="mb-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
            </label>
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
            <p className="text-gray-500 mt-1">Your data is private and secure. We will never share your information without your permission.</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderAssessmentForm = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">How are you feeling today?</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Not great</span>
          <input
            type="range"
            name="currentMood"
            min="1"
            max="10"
            value={initialAssessment.currentMood}
            onChange={handleAssessmentChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm text-gray-500">Excellent</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">How has your sleep quality been recently?</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Poor</span>
          <input
            type="range"
            name="sleepQuality"
            min="1"
            max="10"
            value={initialAssessment.sleepQuality}
            onChange={handleAssessmentChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm text-gray-500">Excellent</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">What's your current stress level?</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Low stress</span>
          <input
            type="range"
            name="stressLevel"
            min="1"
            max="10"
            value={initialAssessment.stressLevel}
            onChange={handleAssessmentChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm text-gray-500">High stress</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">What's your primary goal with our app?</h3>
        <select
          name="primaryGoal"
          value={initialAssessment.primaryGoal}
          onChange={handleAssessmentChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
            errors.primaryGoal ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select your primary goal</option>
          <option value="reduce_anxiety">Reduce anxiety</option>
          <option value="improve_mood">Improve mood</option>
          <option value="better_sleep">Better sleep</option>
          <option value="stress_management">Stress management</option>
          <option value="build_resilience">Build resilience</option>
          <option value="self_awareness">Increase self-awareness</option>
          <option value="other">Other</option>
        </select>
        {errors.primaryGoal && <p className="mt-1 text-sm text-red-600">{errors.primaryGoal}</p>}
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        This information helps us personalize your experience. You can always update your preferences later.
      </p>
    </>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600">Mental Health Companion</h1>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {step === 1 ? 'Create your account' : 'Tell us about yourself'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 
                ? 'Your journey to better mental well-being starts here' 
                : 'We use this information to personalize your experience'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
          
          {/* Progress steps */}
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${
                step > 1 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md -space-y-px">
              {step === 1 ? renderAccountForm() : renderAssessmentForm()}
            </div>

            <div className="flex items-center justify-between">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative ${step === 1 ? 'w-full' : 'ml-auto'} flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? (
                  <Loader size="sm" color="white" />
                ) : (
                  step === 1 ? 'Continue' : 'Create Account'
                )}
              </button>
            </div>
            
            {step === 1 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Register;