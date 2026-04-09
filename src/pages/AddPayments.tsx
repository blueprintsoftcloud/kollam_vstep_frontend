// import React, { useState, useEffect } from 'react';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// type Staff = {
//   _id: string;
//   fullname: string;
// };

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// const AddPayment = () => {
//   const [formData, setFormData] = useState({
//     entryDate: new Date().toISOString().split('T')[0],
//     customerName: '', // <-- CHANGED from customerId
//     staffId: '',
//     workDescription: '',
//     cash: '',
//     bankIn: '',
//     bankOut: '',
//     serviceCharge: '',
//   });

//   const [staff, setStaff] = useState<Staff[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<NotificationState | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = getToken();
//         if (!token) {
//           setNotification({ message: 'Authentication required. Please log in again.', type: 'error' });
//           return;
//         }

//         const staffResponse = await fetch('/api/staff', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (staffResponse.ok) {
//           const staffData = await staffResponse.json();
//           setStaff(staffData.staff || []);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleReset = () => {
//     setFormData({
//       entryDate: new Date().toISOString().split('T')[0],
//       customerName: '', // <-- Resetting customerName
//       staffId: '',
//       workDescription: '',
//       cash: '',
//       bankIn: '',
//       bankOut: '',
//       serviceCharge: '',
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

    
//     if (!formData.staffId) {
//       setNotification({ message: 'Please select assisted staff.', type: 'error' });
//       return;
//     }
    

//     setIsLoading(true);
//     setNotification(null);

//     try {
//       const token = getToken();
      
//       // Look here! We are sending customerName in the payload now!
//       const requestBody = {
//         entryDate: formData.entryDate,
//         customerName: formData.customerName.trim(), 
//         staffId: formData.staffId,
//         workDescription: formData.workDescription.trim(),
//         cash: parseFloat(formData.cash) || 0,
//         bankIn: parseFloat(formData.bankIn) || 0,
//         bankOut: parseFloat(formData.bankOut) || 0,
//         serviceCharge: parseFloat(formData.serviceCharge) || 0,
//       };

//       const response = await fetch('/api/payments', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save payment (Status: ${response.status})`);
//       }

//       setNotification({ message: 'Payment record saved successfully!', type: 'success' });
//       handleReset();

//     } catch (error) {
//       console.error('Error saving payment:', error);
//       setNotification({ message: 'Failed to save payment', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Add Payments</h1>
//         <p className="text-gray-500 mt-2">Record daily transactions, bank transfers, and service charges</p>
//       </div>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={3000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="bg-white rounded-lg shadow p-8">
//         <form onSubmit={handleSubmit} onReset={handleReset} className="max-w-3xl">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Entry Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="entryDate"
//                   value={formData.entryDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
//                   required
//                 />
//               </div>

//               {/* THIS IS THE NEW TEXT INPUT FOR CUSTOMER NAME */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Customer Name <span className="text-red-500"></span>
//                 </label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={formData.customerName}
//                   onChange={handleChange}
//                   placeholder="Enter customer name manually"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  
//                 />
//               </div>

              
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Work Description <span className="text-red-500"></span>
//               </label>
//               <textarea
//                 name="workDescription"
//                 value={formData.workDescription}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Describe the service or work related to this payment..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
                
//               />
//             </div>

//             <div className="border-t border-gray-100 pt-6 mt-2">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Cash (₹)</label>
//                   <input type="number" name="cash" value={formData.cash} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank In (₹)</label>
//                   <input type="number" name="bankIn" value={formData.bankIn} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank Out (₹)</label>
//                   <input type="number" name="bankOut" value={formData.bankOut} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (₹)</label>
//                   <input type="number" name="serviceCharge" value={formData.serviceCharge} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
//             <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
//               {isLoading ? 'Saving...' : 'Save Payment'}
//             </button>
//             <button type="reset" disabled={isLoading} className="bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50">
//               Clear Form
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPayment;





// import React, { useState } from 'react';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// const AddPayment = () => {
//   const [formData, setFormData] = useState({
//     entryDate: new Date().toISOString().split('T')[0],
//     customerName: '', 
//     workDescription: '',
//     cash: '',
//     bankIn: '',
//     bankOut: '',
//     serviceCharge: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<NotificationState | null>(null);

//   // Removed the useEffect that fetched /api/staff since we don't need it anymore

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleReset = () => {
//     setFormData({
//       entryDate: new Date().toISOString().split('T')[0],
//       customerName: '',
//       workDescription: '',
//       cash: '',
//       bankIn: '',
//       bankOut: '',
//       serviceCharge: '',
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // REMOVED: The staffId validation block that was causing your error

//     setIsLoading(true);
//     setNotification(null);

//     try {
//       const token = getToken();
//       if (!token) {
//         setNotification({ message: 'Authentication required. Please log in again.', type: 'error' });
//         setIsLoading(false);
//         return;
//       }
      
//       const requestBody = {
//         entryDate: formData.entryDate,
//         customerName: formData.customerName.trim(), 
//         // REMOVED: staffId
//         workDescription: formData.workDescription.trim(),
//         cash: parseFloat(formData.cash) || 0,
//         bankIn: parseFloat(formData.bankIn) || 0,
//         bankOut: parseFloat(formData.bankOut) || 0,
//         serviceCharge: parseFloat(formData.serviceCharge) || 0,
//       };

//       const response = await fetch('/api/payments', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save payment (Status: ${response.status})`);
//       }

//       setNotification({ message: 'Payment record saved successfully!', type: 'success' });
//       handleReset();

//     } catch (error) {
//       console.error('Error saving payment:', error);
//       setNotification({ message: 'Failed to save payment', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Add Payments</h1>
//         <p className="text-gray-500 mt-2">Record daily transactions, bank transfers, and service charges</p>
//       </div>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={3000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="bg-white rounded-lg shadow p-8">
//         <form onSubmit={handleSubmit} onReset={handleReset} className="max-w-3xl">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Entry Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="entryDate"
//                   value={formData.entryDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Customer Name
//                 </label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={formData.customerName}
//                   onChange={handleChange}
//                   placeholder="Enter customer name manually"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Work Description
//               </label>
//               <textarea
//                 name="workDescription"
//                 value={formData.workDescription}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Describe the service or work related to this payment..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
//               />
//             </div>

//             <div className="border-t border-gray-100 pt-6 mt-2">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Cash (₹)</label>
//                   <input type="number" name="cash" value={formData.cash} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank In (₹)</label>
//                   <input type="number" name="bankIn" value={formData.bankIn} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank Out (₹)</label>
//                   <input type="number" name="bankOut" value={formData.bankOut} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (₹)</label>
//                   <input type="number" name="serviceCharge" value={formData.serviceCharge} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
//             <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
//               {isLoading ? 'Saving...' : 'Save Payment'}
//             </button>
//             <button type="reset" disabled={isLoading} className="bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50">
//               Clear Form
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPayment;



// import React, { useState } from 'react';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// const AddPayment = () => {
//   const [formData, setFormData] = useState({
//     entryDate: new Date().toISOString().split('T')[0],
//     customerName: '', 
//     workDescription: '',
//     cash: '',
//     bankIn: '',
//     bankOut: '',
//     serviceCharge: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<NotificationState | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleReset = () => {
//     setFormData({
//       entryDate: new Date().toISOString().split('T')[0],
//       customerName: '',
//       workDescription: '',
//       cash: '',
//       bankIn: '',
//       bankOut: '',
//       serviceCharge: '',
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // --- NEW VALIDATION ---
//     // Parse the values to numbers, defaulting to 0 if empty
//     const cashAmount = parseFloat(formData.cash) || 0;
//     const bankInAmount = parseFloat(formData.bankIn) || 0;
//     const bankOutAmount = parseFloat(formData.bankOut) || 0;

//     // Check if ALL of them are zero
//     if (cashAmount === 0 && bankInAmount === 0 && bankOutAmount === 0) {
//       setNotification({ 
//         message: 'Please enter an amount for Cash, Bank In, or Bank Out.', 
//         type: 'error' 
//       });
//       return; // Stop the submission
//     }
//     // ----------------------

//     setIsLoading(true);
//     setNotification(null);

//     try {
//       const token = getToken();
//       if (!token) {
//         setNotification({ message: 'Authentication required. Please log in again.', type: 'error' });
//         setIsLoading(false);
//         return;
//       }
      
//       const requestBody = {
//         entryDate: formData.entryDate,
//         customerName: formData.customerName.trim(), 
//         workDescription: formData.workDescription.trim(),
//         cash: cashAmount,
//         bankIn: bankInAmount,
//         bankOut: bankOutAmount,
//         serviceCharge: parseFloat(formData.serviceCharge) || 0,
//       };

//       const response = await fetch('/api/payments', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save payment (Status: ${response.status})`);
//       }

//       setNotification({ message: 'Payment record saved successfully!', type: 'success' });
//       handleReset();

//     } catch (error) {
//       console.error('Error saving payment:', error);
//       setNotification({ message: 'Failed to save payment', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Add Payments</h1>
//         <p className="text-gray-500 mt-2">Record daily transactions, bank transfers, and service charges</p>
//       </div>

//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={3000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="bg-white rounded-lg shadow p-8">
//         <form onSubmit={handleSubmit} onReset={handleReset} className="max-w-3xl">
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Entry Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="entryDate"
//                   value={formData.entryDate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Customer Name
//                 </label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={formData.customerName}
//                   onChange={handleChange}
//                   placeholder="Enter customer name manually"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Work Description
//               </label>
//               <textarea
//                 name="workDescription"
//                 value={formData.workDescription}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Describe the service or work related to this payment..."
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
//               />
//             </div>

//             <div className="border-t border-gray-100 pt-6 mt-2">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Cash (₹)</label>
//                   <input type="number" name="cash" value={formData.cash} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank In (₹)</label>
//                   <input type="number" name="bankIn" value={formData.bankIn} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Bank Out (₹)</label>
//                   <input type="number" name="bankOut" value={formData.bankOut} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (₹)</label>
//                   <input type="number" name="serviceCharge" value={formData.serviceCharge} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
//             <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
//               {isLoading ? 'Saving...' : 'Save Payment'}
//             </button>
//             <button type="reset" disabled={isLoading} className="bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50">
//               Clear Form
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPayment;




// import React, { useState } from 'react';
// import { getToken } from '../utils/auth';
// import Notification, { type NotificationType } from '../components/Notification';

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// const AddPayment = () => {
//   const [formData, setFormData] = useState({
//     entryDate: new Date().toISOString().split('T')[0],
//     customerName: '', 
//     workDescription: '',
//     cash: '',
//     bankIn: '',
//     bankOut: '',
//     serviceCharge: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState<NotificationState | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleReset = () => {
//     setFormData({
//       entryDate: new Date().toISOString().split('T')[0],
//       customerName: '',
//       workDescription: '',
//       cash: '',
//       bankIn: '',
//       bankOut: '',
//       serviceCharge: '',
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // --- NEW VALIDATION ---
//     // Parse the values to numbers, defaulting to 0 if empty
//     const cashAmount = parseFloat(formData.cash) || 0;
//     const bankInAmount = parseFloat(formData.bankIn) || 0;
//     const bankOutAmount = parseFloat(formData.bankOut) || 0;

//     // Check if ALL of them are zero
//     if (cashAmount === 0 && bankInAmount === 0 && bankOutAmount === 0) {
//       setNotification({ 
//         message: 'Please enter an amount for Cash, Bank In, or Bank Out.', 
//         type: 'error' 
//       });
//       return; // Stop the submission
//     }
//     // ----------------------

//     setIsLoading(true);
//     setNotification(null);

//     try {
//       const token = getToken();
//       if (!token) {
//         setNotification({ message: 'Authentication required. Please log in again.', type: 'error' });
//         setIsLoading(false);
//         return;
//       }
      
//       const requestBody = {
//         entryDate: formData.entryDate,
//         customerName: formData.customerName.trim(), 
//         workDescription: formData.workDescription.trim(),
//         cash: cashAmount,
//         bankIn: bankInAmount,
//         bankOut: bankOutAmount,
//         serviceCharge: parseFloat(formData.serviceCharge) || 0,
//       };

//       const response = await fetch('/api/payments', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save payment (Status: ${response.status})`);
//       }

//       setNotification({ message: 'Payment record saved successfully!', type: 'success' });
//       handleReset();

//     } catch (error) {
//       console.error('Error saving payment:', error);
//       setNotification({ message: 'Failed to save payment', type: 'error' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Loader component
//   const Loader = () => (
//     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
//   );

//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         {/* Header Section */}
//         <div className="mb-4 pt-2">
//           <div className="flex items-center gap-3 mb-1">
//             <div className="h-6 w-1 rounded-full "></div>
//             <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Add Payment</h1>
//           </div>
//           <p className="text-gray-500 text-xs sm:text-sm ml-4">Record daily transactions, bank transfers, and service charges</p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//           {/* Card Header */}
//           <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
//             <h2 className="text-sm font-medium text-gray-700">Payment Information</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Fill in the details below to record a new payment</p>
//           </div>

//           {/* Form Body */}
//           <div className="p-4 sm:p-6">
//             <form onSubmit={handleSubmit} onReset={handleReset}>
//               <div className="space-y-4">
//                 {/* Date and Customer Row */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="block text-xs font-medium text-gray-600">
//                       Entry Date <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         name="entryDate"
//                         value={formData.entryDate}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                         required
//                       />
                      
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">Select the transaction date</p>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="block text-xs font-medium text-gray-600">
//                       Customer Name
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="customerName"
//                         value={formData.customerName}
//                         onChange={handleChange}
//                         placeholder="Enter customer name"
//                         className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                       />
                      
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">Enter customer name (optional)</p>
//                   </div>
//                 </div>

//                 {/* Work Description */}
//                 <div className="space-y-1">
//                   <label className="block text-xs font-medium text-gray-600">
//                     Work Description
//                   </label>
//                   <div className="relative">
//                     <textarea
//                       name="workDescription"
//                       value={formData.workDescription}
//                       onChange={handleChange}
//                       rows={2}
//                       placeholder="Describe the service or work related to this payment..."
//                       className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all resize-y"
//                     />
                    
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">Describe the service or work performed</p>
//                 </div>

//                 {/* Payment Details Section */}
//                 <div className="border-t border-gray-100 pt-4 mt-1">
//                   <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <label className="block text-xs font-medium text-gray-600">Cash (₹)</label>
//                       <div className="relative">
//                         <input 
//                           type="number" 
//                           name="cash" 
//                           value={formData.cash} 
//                           onChange={handleChange} 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                         />
                        
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="block text-xs font-medium text-gray-600">Bank In (₹)</label>
//                       <div className="relative">
//                         <input 
//                           type="number" 
//                           name="bankIn" 
//                           value={formData.bankIn} 
//                           onChange={handleChange} 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                         />
                        
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="block text-xs font-medium text-gray-600">Bank Out (₹)</label>
//                       <div className="relative">
//                         <input 
//                           type="number" 
//                           name="bankOut" 
//                           value={formData.bankOut} 
//                           onChange={handleChange} 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                         />
                        
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="block text-xs font-medium text-gray-600">Service Charge (₹)</label>
//                       <div className="relative">
//                         <input 
//                           type="number" 
//                           name="serviceCharge" 
//                           value={formData.serviceCharge} 
//                           onChange={handleChange} 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
//                         />
                        
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Required Fields Note */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-400">*</span>
//                   <span className="text-xs text-gray-500">Required fields</span>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`
//                       inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
//                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
//                       ${isLoading
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow'
//                       }
//                     `}
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader />
//                         <span>Saving Payment...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Save Payment</span>
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
//                         </svg>
//                       </>
//                     )}
//                   </button>
                  
//                   <button
//                     type="reset"
//                     disabled={isLoading}
//                     className={`
//                       inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
//                       transition-all duration-200 border
//                       ${isLoading
//                         ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
//                         : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
//                       }
//                     `}
//                   >
//                     <span>Clear Form</span>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Notification */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={3000}
//           onClose={() => setNotification(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default AddPayment;





import React, { useState } from 'react';
import { getToken } from '../utils/auth';
import Notification, { type NotificationType } from '../components/Notification';

interface NotificationState {
  message: string;
  type: NotificationType;
}

const AddPayment = () => {
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    customerName: '', 
    workDescription: '',
    cash: '',
    bankIn: '',
    bankOut: '',
    serviceCharge: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      entryDate: new Date().toISOString().split('T')[0],
      customerName: '',
      workDescription: '',
      cash: '',
      bankIn: '',
      bankOut: '',
      serviceCharge: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- NEW VALIDATION ---
    // Parse the values to numbers, defaulting to 0 if empty
    const cashAmount = parseFloat(formData.cash) || 0;
    const bankInAmount = parseFloat(formData.bankIn) || 0;
    const bankOutAmount = parseFloat(formData.bankOut) || 0;

    // Check if ALL of them are zero
    if (cashAmount === 0 && bankInAmount === 0 && bankOutAmount === 0) {
      setNotification({ 
        message: 'Please enter an amount for Cash, Bank In, or Bank Out.', 
        type: 'error' 
      });
      return; // Stop the submission
    }
    // ----------------------

    setIsLoading(true);
    setNotification(null);

    try {
      const token = getToken();
      if (!token) {
        setNotification({ message: 'Authentication required. Please log in again.', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      const requestBody = {
        entryDate: formData.entryDate,
        customerName: formData.customerName.trim(), 
        workDescription: formData.workDescription.trim(),
        cash: cashAmount,
        bankIn: bankInAmount,
        bankOut: bankOutAmount,
        serviceCharge: parseFloat(formData.serviceCharge) || 0,
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to save payment (Status: ${response.status})`);
      }

      setNotification({ message: 'Payment record saved successfully!', type: 'success' });
      handleReset();

    } catch (error) {
      console.error('Error saving payment:', error);
      setNotification({ message: 'Failed to save payment', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans">
      <form onSubmit={handleSubmit} onReset={handleReset} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">Add Payment</h1>
            <p className="text-sm text-slate-500 mt-1">Record daily transactions, bank transfers, and service charges</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="reset"
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-[#1e293b] text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              )}
              Save Payment
            </button>
          </div>
        </div>

        {/* Info Cards Row */}
        

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Transaction Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm">#</span> 
                  Transaction Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">General information about this payment entry</p>
              </div>

              <div className="space-y-6">
                
                {/* Row for Date and Customer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Entry Date */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Entry Date <span className="text-orange-500">*</span></label>
                    </div>
                    <input
                      type="date"
                      name="entryDate"
                      value={formData.entryDate}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                    />
                  </div>

                  {/* Customer Name */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Customer Name</label>
                    </div>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Work Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">Work Description</label>
                  </div>
                  <textarea
                    name="workDescription"
                    value={formData.workDescription}
                    onChange={handleChange}
                    placeholder="Describe the service or work related to this payment..."
                    rows={5}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white resize-none transition-colors"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Optional description of the service performed</p>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column - Payment Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span> 
                  Payment Breakdown
                </h2>
                <p className="text-sm text-slate-500 mt-1">Provide at least one amount</p>
              </div>

              <div className="space-y-5">
                
                {/* Cash */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Cash (₹)</label>
                  <input 
                    type="number" 
                    name="cash" 
                    value={formData.cash} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                  />
                </div>

                {/* Bank In */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Bank In (₹)</label>
                  <input 
                    type="number" 
                    name="bankIn" 
                    value={formData.bankIn} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                  />
                </div>

                {/* Bank Out */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Bank Out (₹)</label>
                  <input 
                    type="number" 
                    name="bankOut" 
                    value={formData.bankOut} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {/* Service Charge */}
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5 mt-2">Service Charge (₹)</label>
                  <input 
                    type="number" 
                    name="serviceCharge" 
                    value={formData.serviceCharge} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-colors"
                  />
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
          duration={3000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AddPayment;