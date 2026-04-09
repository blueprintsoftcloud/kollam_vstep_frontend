import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../utils/auth";
import Notification, { type NotificationType } from "./Notification";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customerId: string | null;
  initialData?: {
    name: string;
    phoneNumber: string;
    email: string;
  };
}

interface NotificationState {
  message: string;
  type: NotificationType;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customerId,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    email?: string;
  }>({});

  // Initialize form with customer data
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email,
      });
      setErrors({});
      setNotification(null);
    }
  }, [isOpen, initialData]);

  // Validation functions - memoized to prevent recreation
  const validateEmail = useCallback((email: string): boolean => {
    if (!email.trim()) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain at least 10 digits";
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateEmail, validatePhone]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Strip non-digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phoneNumber: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field as user starts typing
    setErrors((prev) => {
      if (prev[name as keyof typeof errors]) {
        return { ...prev, [name]: undefined };
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      if (!validateForm()) {
        setNotification({
          message: "Please fix the errors above",
          type: "error",
        });
        return;
      }

      setIsLoading(true);

      try {
        const token = getToken();

        if (!token) {
          setNotification({
            message: "Authentication token not found. Please log in again.",
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        // Call the backend API
        const response = await fetch(`/api/customer-info/${customerId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            email: formData.email.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.field) {
            setErrors((prev) => ({
              ...prev,
              [errorData.field]: errorData.message,
            }));
          }
          throw new Error(
            errorData.message ||
              `Failed to update customer (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        console.log("Customer updated successfully:", data);

        // Show success notification
        setNotification({
          message: "Customer updated successfully!",
          type: "success",
        });

        // Call onSuccess callback and close modal after a short delay
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Error updating customer:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update customer";
        setNotification({
          message: errorMessage,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [validateForm, formData, customerId, onSuccess, onClose],
  );

  const handleReset = useCallback(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email,
      });
    }
    setErrors({});
    setNotification(null);
  }, [initialData]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  }, [isLoading, handleReset, onClose]);

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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Edit Customer
          </h2>
          <p className="text-gray-500 mb-6">Update customer information</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name Field */}
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="9876543210"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.phoneNumber
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address{" "}
                  <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
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
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                    : "bg-[#032852] text-white hover:bg-[#104581]"
                }`}
              >
                {isLoading ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </form>

          {/* Notification */}
          {notification && (
            <div className="mt-6">
              <Notification
                message={notification.message}
                type={notification.type}
                duration={notification.type === "success" ? 3000 : 4000}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
