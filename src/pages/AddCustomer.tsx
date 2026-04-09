// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// interface FormData {
//   name: string;
//   phoneNumber: string;
//   email: string;
//   address: string;
// }

// interface FormErrors {
//   name?: string;
//   phoneNumber?: string;
//   email?: string;
// }

// const AddCustomer = () => {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     phoneNumber: '',
//     email: '',
//     address: ''
//   });

//   const [errors, setErrors] = useState<FormErrors>({});

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.phoneNumber.trim()) {
//       newErrors.phoneNumber = 'Phone number is required';
//     } else if (!/^[0-9]{10,}$/.test(formData.phoneNumber.trim())) {
//       newErrors.phoneNumber = 'Phone number must be at least 10 digits';
//     }

//     if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error for this field as user types
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setNotification({
//         message: 'Please fix the errors above',
//         type: 'error',
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         setNotification({
//           message: 'Authentication token not found. Please log in again.',
//           type: 'error',
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       const response = await fetch('/api/customer-info', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name.trim(),
//           phoneNumber: formData.phoneNumber.trim(),
//           email: formData.email.trim() || undefined,
//           address: formData.address.trim() || undefined,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Failed to add customer (Status: ${response.status})`);
//       }

//       const data = await response.json();
//       console.log('Customer added successfully:', data);

//       // Show success notification
//       setNotification({
//         message: 'Customer added successfully!',
//         type: 'success',
//       });

//       // Reset form
//       setFormData({
//         name: '',
//         phoneNumber: '',
//         email: '',
//         address: ''
//       });

//       // Redirect to customer list after a short delay
//       setTimeout(() => {
//         navigate('/admin/customer-list');
//       }, 1500);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       setNotification({
//         message: error instanceof Error ? error.message : 'Failed to add customer',
//         type: 'error',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Add Customer</h1>
//           <p className="text-gray-600 mt-2">Register a new customer to the system</p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter customer's full name"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.name ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//               )}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="Enter phone number (at least 10 digits)"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.phoneNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter email address (optional)"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Enter address (optional)"
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
//                 disabled={isSubmitting}
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
//                   isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Adding Customer...
//                   </div>
//                 ) : (
//                   'Add Customer'
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/customer-list')}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Notification */}
//         {notification && (
//           <Notification
//             message={notification.message}
//             type={notification.type}
//             duration={notification.type === 'success' ? 3000 : 5000}
//             onClose={() => setNotification(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

const AddCustomer = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (formData.phoneNumber.trim().length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (
      formData.email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    let newValue = value;

    // Specifically format the phone number field as the user types
    if (name === "phoneNumber") {
      // Remove all non-digit characters and limit to 10 digits
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error for this field as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setErrors({}); // Clear any validation errors too
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        message: "Please fill all the feilds",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/customer-info", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle duplicate email error - set it as field error without toast
        if (
          errorData.field === "email" ||
          errorData.message?.includes("Email")
        ) {
          setErrors((prev) => ({ ...prev, email: errorData.message }));
          setIsSubmitting(false);
          return;
        }

        throw new Error(
          errorData.message ||
            `Failed to add customer (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Customer added successfully:", data);

      // Show success notification
      setNotification({
        message: "Customer added successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
      });

      // Redirect to customer list after a short delay
      setTimeout(() => {
        navigate("/admin/customer-list");
      }, 1500);
    } catch (error) {
      console.error("Error adding customer:", error);
      setNotification({
        message:
          error instanceof Error ? error.message : "Failed to add customer",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans">
     <form
  onSubmit={handleSubmit}
  className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6"
>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">
              Add New Customer
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Register a new customer to the system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearForm}
              disabled={isSubmitting}
              className="px-4 py-2 cursor-pointer bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#001A39] cursor-pointer text-white text-sm font-medium rounded-lg hover:bg-[#072a54] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              )}
              Add Customer
            </button>
          </div>
        </div>

        {/* Info Cards Row */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm">
                    #
                  </span>
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Basic contact details for the customer
                </p>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Eg: Jane Doe"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errors.name
                        ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                    }`}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Letters and spaces only
                    </p>
                  )}
                </div>

                {/* Grid for Phone and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Phone Number */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Phone Number
                      </label>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      disabled={isSubmitting}
                      maxLength={10}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                        errors.phoneNumber
                          ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                          : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                      }`}
                    />
                    {errors.phoneNumber ? (
                      <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                        <svg
                          className="w-3.5 h-3.5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {errors.phoneNumber}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        10 digits required
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">
                        Email Address
                      </label>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Eg: jane@example.com"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 transition-colors ${
                        errors.email
                          ? "border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-orange-50/30"
                          : "border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white"
                      }`}
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs text-orange-600 flex items-center">
                        <svg
                          className="w-3.5 h-3.5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Valid email format
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </span>
                  Location Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Physical address for service visits
                </p>
              </div>

              <div className="space-y-6 h-[calc(100%-80px)]">
                {/* Address */}
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Address
                    </label>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address including street, city, and pin code..."
                    disabled={isSubmitting}
                    className="w-full flex-grow min-h-[150px] px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white resize-none"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Optional but recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "success" ? 3000 : 5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AddCustomer;
