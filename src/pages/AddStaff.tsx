// import { useState } from 'react';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// const AddStaff = () => {
//   const [formData, setFormData] = useState({
//     fullname: '',
//     email: '',
//     phone: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<NotificationState | null>(null);
//   const [errors, setErrors] = useState<{
//     fullname?: string;
//     email?: string;
//     phone?: string;
//   }>({});

//   // Validation functions
//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePhone = (phone: string): boolean => {
//     const phoneRegex = /^[0-9]{10,}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: typeof errors = {};

//     if (!formData.fullname.trim()) {
//       newErrors.fullname = 'Full name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!validatePhone(formData.phone)) {
//       newErrors.phone = 'Phone number must contain at least 10 digits';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error for this field as user starts typing
//     if (errors[name as keyof typeof errors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form
//     if (!validateForm()) {
//       setNotification({
//         message: 'Please fix the errors above',
//         type: 'error',
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         setNotification({
//           message: 'Authentication token not found. Please log in again.',
//           type: 'error',
//         });
//         setIsLoading(false);
//         return;
//       }

//       // Call the backend API
//       const response = await fetch('/api/staff', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fullname: formData.fullname,
//           email: formData.email,
//           phone: formData.phone,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Failed to add staff (Status: ${response.status})`);
//       }

//       const data = await response.json();
//       console.log('Staff member added successfully:', data);

//       // Show success notification
//       setNotification({
//         message: 'Staff member added successfully!',
//         type: 'success',
//       });

//       // Clear form
//       setFormData({
//         fullname: '',
//         email: '',
//         phone: '',
//       });
//       setErrors({});

//       // Auto-hide notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error adding staff member:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Failed to add staff member';
//       setNotification({
//         message: errorMessage,
//         type: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       fullname: '',
//       email: '',
//       phone: '',
//     });
//     setErrors({});
//     setNotification(null);
//   };

//   return (
//     <div>
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Staff Member</h1>
//         <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Register a new staff member to the system</p>
//       </div>

//       <div className="bg-white rounded-lg shadow p-4 sm:p-8">
//         <form onSubmit={handleSubmit} className="max-w-2xl">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//             {/* Name Field */}
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullname"
//                 value={formData.fullname}
//                 onChange={handleChange}
//                 placeholder="John Doe"
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
//                   errors.fullname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//                 disabled={isLoading}
//               />
//               {errors.fullname && (
//                 <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullname}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 Email Address <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="john@example.com"
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
//                   errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//                 disabled={isLoading}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
//               )}
//             </div>

//             {/* Phone Field */}
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="+91 98765 43210"
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition text-sm ${
//                   errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                 }`}
//                 disabled={isLoading}
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
//               )}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
//                 isLoading
//                   ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
//                   : 'bg-blue-600 text-white hover:bg-blue-700'
//               }`}
//             >
//               {isLoading ? 'Adding Staff...' : 'Add Staff Member'}
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isLoading}
//               className={`font-medium px-6 py-2 rounded-lg transition text-sm ${
//                 isLoading
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
//                   : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
//               }`}
//             >
//               Clear Form
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Notification */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default AddStaff;

import { useState } from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";

interface NotificationState {
  message: string;
  type: NotificationType;
}

const AddStaff = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
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
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must contain at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to add staff (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      console.log("Staff member added successfully:", data);

      // Show success notification
      setNotification({
        message: "Staff member added successfully!",
        type: "success",
      });

      // Clear form
      setFormData({
        fullname: "",
        email: "",
        phone: "",
      });
      setErrors({});

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding staff member:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add staff member";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullname: "",
      email: "",
      phone: "",
    });
    setErrors({});
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 pt-15">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1  rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Add Staff Member
            </h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base ml-4">
            Register a new staff member to the system
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-medium text-gray-700">
              Staff Information
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the details below to add a new staff member
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm
                        ${
                          errors.fullname
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        }`}
                      disabled={isLoading}
                    />
                    {/* Field indicator */}
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full
                      ${formData.fullname ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                  </div>
                  {errors.fullname && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.fullname}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Enter staff member's full name
                  </p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm
                        ${
                          errors.email
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        }`}
                      disabled={isLoading}
                    />
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full
                      ${formData.email ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.email}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Use a valid email address for communication
                  </p>
                </div>

                {/* Phone Field */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none transition-all text-sm
                        ${
                          errors.phone
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        }`}
                      disabled={isLoading}
                    />
                    <div
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full
                      ${formData.phone ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Include country code if applicable (minimum 10 digits)
                  </p>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="mt-6 flex items-center gap-2">
                <span className="text-xs text-gray-400">*</span>
                <span className="text-xs text-gray-500">Required fields</span>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${
                      isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow"
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-gray-400"
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
                      <span>Adding Staff...</span>
                    </>
                  ) : (
                    <>
                      <span>Add Staff Member</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className={`
                    inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 border
                    ${
                      isLoading
                        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    }
                  `}
                >
                  <span>Clear Form</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Helper Card */}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "success" ? 3000 : 4000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AddStaff;
