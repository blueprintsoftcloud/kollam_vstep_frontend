import React, { useState } from 'react';
import { getToken } from '../utils/auth';
import { apiFetch } from '../utils/api';
import Notification, { type NotificationType } from './Notification';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface NotificationState {
  message: string;
  type: NotificationType;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [errors, setErrors] = useState<{
    fullname?: string;
    email?: string;
    phone?: string;
  }>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must contain at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Strip non-digits
      const numericValue = value.replace(/\D/g, '');
      
      // Act as gatekeeper: only update state if 10 chars or fewer
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field as user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setNotification({
        message: 'Please fix the errors above',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setNotification({
          message: 'Authentication token not found. Please log in again.',
          type: 'error',
        });
        setIsLoading(false);
        return;
      }

      // Call the backend API
      const response = await apiFetch('/api/staff', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add staff (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('Staff member added successfully:', data);

      // Show success notification
      setNotification({
        message: 'Staff member added successfully!',
        type: 'success',
      });

      // Clear form
      setFormData({
        fullname: '',
        email: '',
        phone: '',
      });
      setErrors({});

      // Call onSuccess callback and close modal after a short delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding staff member:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add staff member';
      setNotification({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullname: '',
      email: '',
      phone: '',
    });
    setErrors({});
    setNotification(null);
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add Staff Member</h2>
          <p className="text-gray-500 mb-6">Register a new staff member to the system</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.fullname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullname}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
               <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10} // <-- Add this property
                  placeholder="9876543210" // <-- Updated to show clean format
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
                  isLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                    : 'bg-[#032852] text-white hover:bg-[#104581]'
                }`}
              >
                {isLoading ? 'Adding Staff...' : 'Add Staff Member'}
              </button>
            </div>
          </form>

          {/* Notification */}
          {notification && (
            <div className="mt-6">
              <Notification
                message={notification.message}
                type={notification.type}
                duration={notification.type === 'success' ? 3000 : 4000}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
