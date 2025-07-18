import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Typography } from '@/components';
import { useAuthStore } from '@/store';
import { useLoadingWithTimeout } from '@/hooks';
import { Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const { showLoadingWithTimeout } = useLoadingWithTimeout({
    minDuration: 2000,
    defaultText: 'Creating your account...',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await showLoadingWithTimeout(
        async () => {
          // Remove confirmPassword before sending to API
          const { confirmPassword, ...registrationData } = formData;
          await register(registrationData);
        },
        'Setting up your account...'
      );
      
      // Registration successful, redirect to login
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in.' 
        } 
      });
    } catch (err) {
      // Error is handled by the store
      console.error('Registration failed:', err);
    }
  };

  // Helper function to render error message safely
  const renderError = (error: any) => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.detail) {
      if (typeof error.detail === 'string') {
        return error.detail;
      }
      if (Array.isArray(error.detail)) {
        return error.detail.map((err: any, index: number) => (
          <div key={index}>
            {typeof err === 'string' ? err : err.msg || JSON.stringify(err)}
          </div>
        ));
      }
    }
    return 'An unexpected error occurred';
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.confirmPassword && !passwordsMatch;

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <Typography variant="h2" className="text-primary">
              Create Account
            </Typography>
            <Typography variant="body2" className="text-base-content/70 mt-2">
              Sign up for a new account
            </Typography>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>{renderError(error)}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Username *</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className="input input-bordered w-full focus:input-primary"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="input input-bordered w-full focus:input-primary"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="input input-bordered w-full pr-12 focus:input-primary"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye />
                  ) : (
                    <EyeOff />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Confirm Password *</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`input input-bordered w-full pr-12 focus:input-primary ${showPasswordError ? 'input-error' : ''}`}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <Eye />
                  ) : (
                    <EyeOff />
                  )}
                </button>
              </div>
              {showPasswordError && (
                <label className="label">
                  <span className="label-text-alt text-error">Passwords do not match</span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={Boolean(isLoading || showPasswordError)}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <Typography variant="body2" className="text-base-content/70">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-medium">
                Sign in here
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};