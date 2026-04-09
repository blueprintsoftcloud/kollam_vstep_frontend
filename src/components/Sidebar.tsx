// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { clearToken, getToken } from '../utils/auth';
// import Notification, { type NotificationType } from './Notification';

// // Import standard icons
// import {
//   HomeIcon,
//   UserPlusIcon,
//   UsersIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   PlusIcon,
//   ClipboardDocumentListIcon,
//   Cog6ToothIcon,
//   BriefcaseIcon,
//   ArrowLeftOnRectangleIcon,
//   ChevronDownIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from '@heroicons/react/24/outline';

// interface SidebarProps {
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Internal state for the new mobile menu
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
//   const [isCustomersOpen, setIsCustomersOpen] = useState(false);
//   const [isTasksOpen, setIsTasksOpen] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   // --- RESTORED: Your nav items with the updated Heroicons ---
//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/admin/dashboard',
//       icon: <HomeIcon className="w-5 h-5 shrink-0" />,
//     },
//   ];

//   const handleLogout = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsLoggingOut(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         clearToken();
//         navigate('/admin/login', { replace: true });
//         return;
//       }

//       const response = await fetch('/api/admin/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Logout failed: ${response.status}`);
//       }

//       clearToken();
//       setNotification({
//         message: 'Logged out successfully',
//         type: 'success',
//       });

//       setTimeout(() => {
//         navigate('/admin/login', { replace: true });
//       }, 1000);
//     } catch (error) {
//       console.error('Logout error:', error);
//       setNotification({
//         message: 'Logout failed. Please try again.',
//         type: 'error',
//       });

//       setTimeout(() => {
//         clearToken();
//         navigate('/admin/login', { replace: true });
//       }, 2000);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const closeMobileMenu = () => {
//     setSidebarOpen(false);
//     if (onMobileClose) onMobileClose();
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Desktop Sidebar - Always visible on md and above */}
//       <div
//         className={`hidden md:flex fixed left-0 top-0 h-screen ${
//           isOpen ? 'w-64' : 'w-20'
//         } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10`}
//       >
//         {/* Brand/Logo Section */}
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
//               AC
//             </div>
//             {isOpen && (
//               <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
//                 <h1 className="font-bold text-lg leading-none">Akshaya</h1>
//                 <p className="text-xs text-gray-400 mt-1">Center</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
//           <div className="space-y-2">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-white/10 text-white shadow-md'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                   }`
//                 }
//                 title={!isOpen ? item.label : ''}
//               >
//                 {item.icon}
//                 {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
//               </NavLink>
//             ))}

//             {/* Customers Section */}
//             <div>
//               <button
//                 onClick={() => setIsCustomersOpen(!isCustomersOpen)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isCustomersOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Customers' : ''}
//               >
//                 <UsersIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Customers</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         isCustomersOpen ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               {/* Customers Submenu with Smooth Grid Transition */}
//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   isCustomersOpen && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/add-customer"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <UserPlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Customer</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/customer-list"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Customer Status</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Tasks Section */}
//             <div>
//               <button
//                 onClick={() => setIsTasksOpen(!isTasksOpen)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isTasksOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Tasks' : ''}
//               >
//                 <BriefcaseIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Tasks</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         isTasksOpen ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               {/* Tasks Submenu with Smooth Grid Transition */}
//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   isTasksOpen && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/add-task"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Task</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/task-update"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Task Update</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Payments Section */}
//             <div>
//               <button
//                 onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isPaymentsOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Payments' : ''}
//               >
//                 <CreditCardIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Payments</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         isPaymentsOpen ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               {/* Payments Submenu with Smooth Grid Transition */}
//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   isPaymentsOpen && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/list-payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add New Payment</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Payment History</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Settings Section */}
//             <div>
//               <button
//                 onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isSettingsOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Settings' : ''}
//               >
//                 <Cog6ToothIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Settings</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         isSettingsOpen ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               {/* Settings Submenu with Smooth Grid Transition */}
//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   isSettingsOpen && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/list-staffs"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive
//                           ? 'bg-white/10 text-white'
//                           : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Staff Management</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="border-t border-white/10 p-4">
//           <button
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//               isLoggingOut
//                 ? 'text-gray-500 bg-white/5 cursor-not-allowed'
//                 : 'text-gray-400 hover:bg-white/10 hover:text-white'
//             }`}
//             title={!isOpen ? 'Logout' : ''}
//           >
//             {isLoggingOut ? (
//               <span className="shrink-0 h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
//             ) : (
//               <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
//             )}
//             {isOpen && (
//               <span className="text-sm font-medium whitespace-nowrap">
//                 {isLoggingOut ? 'Logging out...' : 'Logout'}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="border-t border-white/10 p-3">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-center py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
//             title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//           >
//             {isOpen ? (
//               <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
//             ) : (
//               <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE DIALOG */}
//       <Dialog open={sidebarOpen || isMobileOpen} onClose={closeMobileMenu} className="relative z-50 lg:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex">
//           <DialogPanel
//             transition
//             className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
//           >
//             <TransitionChild>
//               <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
//                 <button type="button" onClick={closeMobileMenu} className="-m-2.5 p-2.5">
//                   <span className="sr-only">Close sidebar</span>
//                   <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
//                 </button>
//               </div>
//             </TransitionChild>

//             {/* Mobile Sidebar Content */}
//             <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-4 ring-1 ring-white/10">
//               <div className="flex h-16 shrink-0 items-center gap-3 mt-2">
//                 <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
//                   AC
//                 </div>
//                 <div>
//                   <h1 className="font-bold text-lg text-white leading-none">Akshaya</h1>
//                   <p className="text-xs text-gray-400 mt-1">Center</p>
//                 </div>
//               </div>
//               <nav className="flex flex-1 flex-col">
//                 <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                   <li>
//                     <ul role="list" className="-mx-2 space-y-1">
//                       {navItems.map((item) => (
//                         <li key={item.path}>
//                           <NavLink
//                             to={item.path}
//                             onClick={closeMobileMenu}
//                             className={({ isActive }) =>
//                               `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                                 isActive
//                                   ? 'bg-white/10 text-white shadow-md'
//                                   : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                               }`
//                             }
//                           >
//                             {item.icon}
//                             <span className="text-sm font-medium">{item.label}</span>
//                           </NavLink>
//                         </li>
//                       ))}

//                       {/* Mobile Customers Section */}
//                       <li>
//                         <button
//                           onClick={() => setIsCustomersOpen(!isCustomersOpen)}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             isCustomersOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <UsersIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Customers</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 isCustomersOpen ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             isCustomersOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/add-customer"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <UserPlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Customer</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/customer-list"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Customer List</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Tasks Section */}
//                       <li>
//                         <button
//                           onClick={() => setIsTasksOpen(!isTasksOpen)}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             isTasksOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <BriefcaseIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Tasks</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 isTasksOpen ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             isTasksOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/add-task"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Task</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/task-update"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                               <span>Task Update</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Payments Section */}
//                       <li>
//                         <button
//                           onClick={() => setIsPaymentsOpen(!isPaymentsOpen)}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             isPaymentsOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <CreditCardIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Payments</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 isPaymentsOpen ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             isPaymentsOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add New Payment</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/list-payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Payment History</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Settings Section */}
//                       <li>
//                         <button
//                           onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             isSettingsOpen ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <Cog6ToothIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Settings</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 isSettingsOpen ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             isSettingsOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/list-staffs"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive
//                                     ? 'bg-white/10 text-white'
//                                     : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                               <span>Staff Management</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </li>

//                   {/* Logout Button Mobile */}
//                   <li className="-mx-6 mt-auto">
//                     <button
//                       onClick={handleLogout}
//                       disabled={isLoggingOut}
//                       className="flex w-full items-center gap-x-4 px-6 py-3 text-sm/6 font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
//                     >
//                       {isLoggingOut ? (
//                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
//                       ) : (
//                         <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
//                       )}
//                       <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* MOBILE TOP BAR (Only visible on small screens) */}
//       <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#001A39] px-4 py-4 shadow-sm sm:px-6 md:hidden">
//         <button
//           type="button"
//           onClick={() => setSidebarOpen(true)}
//           className="-m-2.5 p-2.5 text-gray-400 hover:text-white"
//         >
//           <span className="sr-only">Open sidebar</span>
//           <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//         </button>
//         <div className="flex-1 text-sm/6 font-semibold text-white">Akshaya Center</div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { clearToken, getToken } from '../utils/auth';
// import Notification, { type NotificationType } from './Notification';

// // Import standard icons
// import {
//   HomeIcon,
//   UserPlusIcon,
//   UsersIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   PlusIcon,
//   ClipboardDocumentListIcon,
//   Cog6ToothIcon,
//   BriefcaseIcon,
//   ArrowLeftOnRectangleIcon,
//   ChevronDownIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from '@heroicons/react/24/outline';

// interface SidebarProps {
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Replaced multiple booleans with a single state to ensure only one is open at a time
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/admin/dashboard',
//       icon: <HomeIcon className="w-5 h-5 shrink-0" />,
//     },
//   ];

//   const toggleSubmenu = (menuName: string) => {
//     setOpenSubmenu(openSubmenu === menuName ? null : menuName);
//   };

//   const executeLogout = async () => {
//     setIsLoggingOut(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//         return;
//       }

//       const response = await fetch('/api/admin/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Logout failed: ${response.status}`);
//       }

//       clearToken();
//       setNotification({
//         message: 'Logged out successfully',
//         type: 'success',
//       });

//       setTimeout(() => {
//         setIsLogoutModalOpen(false);
//         window.location.href = '/admin/login';
//       }, 1000);
//     } catch (error) {
//       console.error('Logout error:', error);
//       setNotification({
//         message: 'Logout failed. Please try again.',
//         type: 'error',
//       });

//       setTimeout(() => {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//       }, 2000);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const closeMobileMenu = () => {
//     setSidebarOpen(false);
//     if (onMobileClose) onMobileClose();
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Desktop Sidebar */}
//       <div
//         className={`hidden md:flex fixed left-0 top-0 h-screen ${
//           isOpen ? 'w-64' : 'w-20'
//         } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10`}
//       >
//         {/* Brand/Logo Section */}
//         <div className="p-6 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
//               AC
//             </div>
//             {isOpen && (
//               <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
//                 <h1 className="font-bold text-lg leading-none">Akshaya</h1>
//                 <p className="text-xs text-gray-400 mt-1">Center</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
//           <div className="space-y-2">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-white/10 text-white shadow-md'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                   }`
//                 }
//                 title={!isOpen ? item.label : ''}
//               >
//                 {item.icon}
//                 {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
//               </NavLink>
//             ))}

//             {/* Customers Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('customers')}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Customers' : ''}
//               >
//                 <UsersIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Customers</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'customers' ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'customers' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/add-customer"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <UserPlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Customer</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/customer-list"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Customer Status</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Tasks Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('tasks')}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Tasks' : ''}
//               >
//                 <BriefcaseIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Tasks</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'tasks' ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'tasks' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/add-task"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Task</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/task-update"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Task Update</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Payments Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('payments')}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Payments' : ''}
//               >
//                 <CreditCardIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Payments</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'payments' ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'payments' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/list-payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add New Payment</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Payment History</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Settings Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('settings')}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Settings' : ''}
//               >
//                 <Cog6ToothIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Settings</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'settings' ? 'rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'settings' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                   <NavLink
//                     to="/admin/list-staffs"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Staff Management</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="border-t border-white/10 p-4">
//           <button
//             onClick={() => setIsLogoutModalOpen(true)}
//             className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:bg-white/10 hover:text-white"
//             title={!isOpen ? 'Logout' : ''}
//           >
//             <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
//             {isOpen && (
//               <span className="text-sm font-medium whitespace-nowrap">Logout</span>
//             )}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="border-t border-white/10 p-3">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-center py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
//             title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//           >
//             {isOpen ? (
//               <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
//             ) : (
//               <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE DIALOG */}
//       <Dialog open={sidebarOpen || isMobileOpen} onClose={closeMobileMenu} className="relative z-50 md:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex">
//           <DialogPanel
//             transition
//             className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
//           >
//             <TransitionChild>
//               <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
//                 <button type="button" onClick={closeMobileMenu} className="-m-2.5 p-2.5">
//                   <span className="sr-only">Close sidebar</span>
//                   <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
//                 </button>
//               </div>
//             </TransitionChild>

//             {/* Mobile Sidebar Content */}
//             <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-4 ring-1 ring-white/10">
//               <div className="flex h-16 shrink-0 items-center gap-3 mt-2">
//                 <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
//                   AC
//                 </div>
//                 <div>
//                   <h1 className="font-bold text-lg text-white leading-none">Akshaya</h1>
//                   <p className="text-xs text-gray-400 mt-1">Center</p>
//                 </div>
//               </div>
//               <nav className="flex flex-1 flex-col">
//                 <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                   <li>
//                     <ul role="list" className="-mx-2 space-y-1">
//                       {navItems.map((item) => (
//                         <li key={item.path}>
//                           <NavLink
//                             to={item.path}
//                             onClick={closeMobileMenu}
//                             className={({ isActive }) =>
//                               `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
//                                 isActive
//                                   ? 'bg-white/10 text-white shadow-md'
//                                   : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                               }`
//                             }
//                           >
//                             {item.icon}
//                             <span className="text-sm font-medium">{item.label}</span>
//                           </NavLink>
//                         </li>
//                       ))}

//                       {/* Mobile Customers Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('customers')}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <UsersIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Customers</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'customers' ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'customers' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/add-customer"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <UserPlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Customer</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/customer-list"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Customer List</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Tasks Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('tasks')}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <BriefcaseIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Tasks</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'tasks' ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'tasks' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/add-task"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Task</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/task-update"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                               <span>Task Update</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Payments Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('payments')}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <CreditCardIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Payments</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'payments' ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'payments' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add New Payment</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/list-payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Payment History</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Settings Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('settings')}
//                           className={`w-full group flex items-center gap-x-4 rounded-lg px-4 py-3 text-sm/6 font-medium transition-all duration-200 ${
//                             openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <Cog6ToothIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Settings</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'settings' ? 'rotate-180' : ''
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'settings' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-4 border-l border-white/10 pl-2">
//                             <NavLink
//                               to="/admin/list-staffs"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm/6 font-medium ${
//                                   isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                               <span>Staff Management</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </li>

//                   {/* Logout Button Mobile */}
//                   <li className="-mx-6 mt-auto">
//                     <button
//                       onClick={() => setIsLogoutModalOpen(true)}
//                       className="flex w-full items-center gap-x-4 px-6 py-3 text-sm/6 font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
//                     >
//                       <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
//                       <span>Logout</span>
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* MOBILE TOP BAR */}
//       <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#001A39] px-4 py-4 shadow-sm sm:px-6 md:hidden">
//         <button
//           type="button"
//           onClick={() => setSidebarOpen(true)}
//           className="-m-2.5 p-2.5 text-gray-400 hover:text-white"
//         >
//           <span className="sr-only">Open sidebar</span>
//           <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//         </button>
//         <div className="flex-1 text-sm/6 font-semibold text-white">Akshaya Center</div>
//       </div>

//       {/* LOGOUT CONFIRMATION MODAL */}
//       <Dialog open={isLogoutModalOpen} onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} className="relative z-[60]">
//         <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <DialogPanel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md p-6">
//               <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 rounded-full mb-4">
//                 <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-600" />
//               </div>

//               <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Logout</h3>

//               <p className="text-sm text-center text-gray-600 mb-6">
//                 Are you sure you want to logout? You will need to sign back in to access the dashboard.
//               </p>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsLogoutModalOpen(false)}
//                   disabled={isLoggingOut}
//                   className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={executeLogout}
//                   disabled={isLoggingOut}
//                   className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm"
//                 >
//                   {isLoggingOut ? (
//                     <>
//                       <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                       <span>Logging out...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Yes, Logout</span>
//                       <ArrowLeftOnRectangleIcon className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { clearToken, getToken } from '../utils/auth';
// import Notification, { type NotificationType } from './Notification';

// // Import standard icons
// import {
//   HomeIcon,
//   UserPlusIcon,
//   UsersIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   PlusIcon,
//   ClipboardDocumentListIcon,
//   Cog6ToothIcon,
//   BriefcaseIcon,
//   ArrowLeftOnRectangleIcon,
//   ChevronDownIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from '@heroicons/react/24/outline';

// interface SidebarProps {
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Replaced multiple booleans with a single state to ensure only one is open at a time
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/admin/dashboard',
//       icon: <HomeIcon className="w-5 h-5 shrink-0" />,
//     },
//   ];

//   const toggleSubmenu = (menuName: string) => {
//     setOpenSubmenu(openSubmenu === menuName ? null : menuName);
//   };

//   const executeLogout = async () => {
//     setIsLoggingOut(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//         return;
//       }

//       const response = await fetch('/api/admin/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Logout failed: ${response.status}`);
//       }

//       clearToken();
//       setNotification({
//         message: 'Logged out successfully',
//         type: 'success',
//       });

//       setTimeout(() => {
//         setIsLogoutModalOpen(false);
//         window.location.href = '/admin/login';
//       }, 1000);
//     } catch (error) {
//       console.error('Logout error:', error);
//       setNotification({
//         message: 'Logout failed. Please try again.',
//         type: 'error',
//       });

//       setTimeout(() => {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//       }, 2000);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const closeMobileMenu = () => {
//     setSidebarOpen(false);
//     if (onMobileClose) onMobileClose();
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* ========================================== */}
//       {/* DESKTOP SIDEBAR (Hidden on Mobile)         */}
//       {/* ========================================== */}
//       <div
//         className={`hidden md:flex fixed left-0 top-0 h-screen ${
//           isOpen ? 'w-64' : 'w-20'
//         } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10 shadow-xl`}
//       >
//         {/* Brand/Logo Section */}
//         <div className="p-5 border-b border-white/10 flex items-center h-[72px] shrink-0">
//           <div className="flex items-center gap-3 w-full">
//             <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-md">
//               AC
//             </div>
//             {isOpen && (
//               <div className="overflow-hidden whitespace-nowrap transition-all duration-300 flex-1">
//                 <h1 className="font-bold text-lg leading-tight tracking-wide">Akshaya</h1>
//                 <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
//           <div className="space-y-1.5">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${
//                     isActive
//                       ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                   }`
//                 }
//                 title={!isOpen ? item.label : ''}
//               >
//                 {item.icon}
//                 {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
//               </NavLink>
//             ))}

//             {/* Customers Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('customers')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Customers' : ''}
//               >
//                 <UsersIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Customers</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'customers' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-customer"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <UserPlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Customer</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/customer-list"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Customer Status</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Tasks Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('tasks')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Tasks' : ''}
//               >
//                 <BriefcaseIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Tasks</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'tasks' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-task"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Task</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/task-update"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Task Update</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Payments Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('payments')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Payments' : ''}
//               >
//                 <CreditCardIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Payments</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'payments' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add New Payment</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Payment History</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Settings Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('settings')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Settings' : ''}
//               >
//                 <Cog6ToothIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Settings</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'settings' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-staffs"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Staff Management</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={() => setIsLogoutModalOpen(true)}
//             className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
//             title={!isOpen ? 'Logout' : ''}
//           >
//             <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
//             {isOpen && (
//               <span className="text-sm font-medium whitespace-nowrap">Logout</span>
//             )}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="border-t border-white/10 p-3 bg-black/10">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-center py-2.5 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-200"
//             title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//           >
//             {isOpen ? (
//               <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
//             ) : (
//               <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE TOP NAVIGATION BAR                  */}
//       {/* ========================================== */}
//       <div className="sticky top-0 z-40 flex items-center justify-between bg-[#001A39] px-4 py-3 shadow-lg md:hidden">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => setSidebarOpen(true)}
//             className="-ml-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
//           >
//             <span className="sr-only">Open menu</span>
//             <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//           </button>

//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-white text-[#001A39] rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
//               AC
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-bold text-white leading-none tracking-wide">Akshaya</span>
//               <span className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">Center</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE SIDEBAR DRAWER                      */}
//       {/* ========================================== */}
//       <Dialog open={sidebarOpen || isMobileOpen} onClose={closeMobileMenu} className="relative z-50 md:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex">
//           <DialogPanel
//             transition
//             className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full shadow-2xl"
//           >
//             {/* Close Button positioned outside the drawer */}
//             <TransitionChild>
//               <div className="absolute top-0 left-full flex w-16 justify-center pt-4 duration-300 ease-in-out data-[closed]:opacity-0">
//                 <button
//                   type="button"
//                   onClick={closeMobileMenu}
//                   className="-m-2.5 p-2.5 rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon aria-hidden="true" className="h-7 w-7 text-white" />
//                 </button>
//               </div>
//             </TransitionChild>

//             {/* Mobile Drawer Content */}
//             <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-6 ring-1 ring-white/10 custom-scrollbar">

//               {/* Drawer Header */}
//               <div className="flex items-center h-[72px] shrink-0 border-b border-white/10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
//                     AC
//                   </div>
//                   <div>
//                     <h1 className="font-bold text-lg text-white leading-tight tracking-wide">Akshaya</h1>
//                     <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Drawer Navigation */}
//               <nav className="flex flex-1 flex-col">
//                 <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                   <li>
//                     <ul role="list" className="-mx-2 space-y-2">
//                       {navItems.map((item) => (
//                         <li key={item.path}>
//                           <NavLink
//                             to={item.path}
//                             onClick={closeMobileMenu}
//                             className={({ isActive }) =>
//                               `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
//                                 isActive
//                                   ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                                   : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                               }`
//                             }
//                           >
//                             {item.icon}
//                             <span className="text-sm">{item.label}</span>
//                           </NavLink>
//                         </li>
//                       ))}

//                       {/* Mobile Customers Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('customers')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <UsersIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Customers</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'customers' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-customer"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <UserPlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Customer</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/customer-list"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Customer Status</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Tasks Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('tasks')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <BriefcaseIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Tasks</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'tasks' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-task"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Task</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/task-update"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                               <span>Task Update</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Payments Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('payments')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <CreditCardIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Payments</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'payments' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add New Payment</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Payment History</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Settings Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('settings')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <Cog6ToothIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Settings</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'settings' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-staffs"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                               <span>Staff Management</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </li>

//                   {/* Mobile Drawer Logout Button */}
//                   <li className="-mx-2 mt-auto border-t border-white/10 pt-4">
//                     <button
//                       onClick={() => setIsLogoutModalOpen(true)}
//                       className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
//                     >
//                       <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
//                       <span>Logout</span>
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* ========================================== */}
//       {/* LOGOUT CONFIRMATION MODAL                  */}
//       {/* ========================================== */}
//       <Dialog open={isLogoutModalOpen} onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} className="relative z-[60]">
//         <DialogBackdrop className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
//               <div className="p-6">
//                 <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-full mb-5 border border-red-100">
//                   <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-600" />
//                 </div>

//                 <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Confirm Logout</h3>

//                 <p className="text-sm text-center text-slate-500 mb-6">
//                   Are you sure you want to logout? You will need to sign back in to access the dashboard.
//                 </p>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsLogoutModalOpen(false)}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={executeLogout}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
//                   >
//                     {isLoggingOut ? (
//                       <>
//                         <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                         <span>Logging out...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Yes, Logout</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>

//       {/* Add custom CSS for scrollbar if not defined globally */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 10px;
//         }
//         .custom-scrollbar:hover::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { clearToken, getToken } from '../utils/auth';
// import Notification, { type NotificationType } from './Notification';

// // Import standard icons
// import {
//   HomeIcon,
//   UserPlusIcon,
//   UsersIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   PlusIcon,
//   ClipboardDocumentListIcon,
//   Cog6ToothIcon,
//   BriefcaseIcon,
//   ArrowLeftOnRectangleIcon,
//   ChevronDownIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from '@heroicons/react/24/outline';

// interface SidebarProps {
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Replaced multiple booleans with a single state to ensure only one is open at a time
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/admin/dashboard',
//       icon: <HomeIcon className="w-5 h-5 shrink-0" />,
//     },
//   ];

//   const toggleSubmenu = (menuName: string) => {
//     setOpenSubmenu(openSubmenu === menuName ? null : menuName);
//   };

//   const executeLogout = async () => {
//     setIsLoggingOut(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//         return;
//       }

//       const response = await fetch('/api/admin/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Logout failed: ${response.status}`);
//       }

//       clearToken();
//       setNotification({
//         message: 'Logged out successfully',
//         type: 'success',
//       });

//       setTimeout(() => {
//         setIsLogoutModalOpen(false);
//         window.location.href = '/admin/login';
//       }, 1000);
//     } catch (error) {
//       console.error('Logout error:', error);
//       setNotification({
//         message: 'Logout failed. Please try again.',
//         type: 'error',
//       });

//       setTimeout(() => {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//       }, 2000);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const closeMobileMenu = () => {
//     setSidebarOpen(false);
//     if (onMobileClose) onMobileClose();
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* ========================================== */}
//       {/* DESKTOP SIDEBAR (Hidden on Mobile & Tablet)*/}
//       {/* ========================================== */}
//       <div
//         className={`hidden lg:flex fixed left-0 top-0 h-screen ${
//           isOpen ? 'w-64' : 'w-20'
//         } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10 shadow-xl`}
//       >
//         {/* Brand/Logo Section */}
//         <div className="p-5 border-b border-white/10 flex items-center h-[72px] shrink-0">
//           <div className="flex items-center gap-3 w-full">
//             <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-md">
//               AC
//             </div>
//             {isOpen && (
//               <div className="overflow-hidden whitespace-nowrap transition-all duration-300 flex-1">
//                 <h1 className="font-bold text-lg leading-tight tracking-wide">Akshaya</h1>
//                 <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
//           <div className="space-y-1.5">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${
//                     isActive
//                       ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                   }`
//                 }
//                 title={!isOpen ? item.label : ''}
//               >
//                 {item.icon}
//                 {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
//               </NavLink>
//             ))}

//             {/* Customers Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('customers')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Customers' : ''}
//               >
//                 <UsersIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Customers</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'customers' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-customer"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <UserPlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Customer</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/customer-list"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Customer Status</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Tasks Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('tasks')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Tasks' : ''}
//               >
//                 <BriefcaseIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Tasks</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'tasks' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-task"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Task</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/task-update"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Task Update</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Payments Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('payments')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Payments' : ''}
//               >
//                 <CreditCardIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Payments</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'payments' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add New Payment</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Payment History</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Settings Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('settings')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Settings' : ''}
//               >
//                 <Cog6ToothIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Settings</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'settings' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-staffs"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Staff Management</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={() => setIsLogoutModalOpen(true)}
//             className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
//             title={!isOpen ? 'Logout' : ''}
//           >
//             <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
//             {isOpen && (
//               <span className="text-sm font-medium whitespace-nowrap">Logout</span>
//             )}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="border-t border-white/10 p-3 bg-black/10">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-center py-2.5 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-200"
//             title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//           >
//             {isOpen ? (
//               <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
//             ) : (
//               <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE & TABLET TOP NAVIGATION BAR         */}
//       {/* ========================================== */}
//       <div className="sticky top-0 z-40 flex items-center justify-between bg-[#001A39] px-4 py-3 shadow-lg lg:hidden">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => setSidebarOpen(true)}
//             className="-ml-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
//           >
//             <span className="sr-only">Open menu</span>
//             <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//           </button>

//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-white text-[#001A39] rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
//               AC
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-bold text-white leading-none tracking-wide">Akshaya</span>
//               <span className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">Center</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE & TABLET SIDEBAR DRAWER             */}
//       {/* ========================================== */}
//       <Dialog open={sidebarOpen || isMobileOpen} onClose={closeMobileMenu} className="relative z-50 lg:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex">
//           <DialogPanel
//             transition
//             className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full shadow-2xl"
//           >
//             {/* Close Button positioned outside the drawer */}
//             <TransitionChild>
//               <div className="absolute top-0 left-full flex w-16 justify-center pt-4 duration-300 ease-in-out data-[closed]:opacity-0">
//                 <button
//                   type="button"
//                   onClick={closeMobileMenu}
//                   className="-m-2.5 p-2.5 rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon aria-hidden="true" className="h-7 w-7 text-white" />
//                 </button>
//               </div>
//             </TransitionChild>

//             {/* Drawer Content */}
//             <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-6 ring-1 ring-white/10 custom-scrollbar">

//               {/* Drawer Header */}
//               <div className="flex items-center h-[72px] shrink-0 border-b border-white/10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
//                     AC
//                   </div>
//                   <div>
//                     <h1 className="font-bold text-lg text-white leading-tight tracking-wide">Akshaya</h1>
//                     <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Drawer Navigation */}
//               <nav className="flex flex-1 flex-col">
//                 <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                   <li>
//                     <ul role="list" className="-mx-2 space-y-2">
//                       {navItems.map((item) => (
//                         <li key={item.path}>
//                           <NavLink
//                             to={item.path}
//                             onClick={closeMobileMenu}
//                             className={({ isActive }) =>
//                               `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
//                                 isActive
//                                   ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                                   : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                               }`
//                             }
//                           >
//                             {item.icon}
//                             <span className="text-sm">{item.label}</span>
//                           </NavLink>
//                         </li>
//                       ))}

//                       {/* Mobile Customers Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('customers')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <UsersIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Customers</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'customers' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-customer"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <UserPlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Customer</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/customer-list"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Customer Status</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Tasks Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('tasks')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <BriefcaseIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Tasks</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'tasks' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-task"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Task</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/task-update"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                               <span>Task Update</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Payments Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('payments')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <CreditCardIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Payments</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'payments' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add New Payment</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Payment History</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Settings Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('settings')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <Cog6ToothIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Settings</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'settings' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-staffs"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                               <span>Staff Management</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </li>

//                   {/* Mobile Drawer Logout Button */}
//                   <li className="-mx-2 mt-auto border-t border-white/10 pt-4">
//                     <button
//                       onClick={() => setIsLogoutModalOpen(true)}
//                       className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
//                     >
//                       <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
//                       <span>Logout</span>
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* ========================================== */}
//       {/* LOGOUT CONFIRMATION MODAL                  */}
//       {/* ========================================== */}
//       <Dialog open={isLogoutModalOpen} onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} className="relative z-[60]">
//         <DialogBackdrop className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
//               <div className="p-6">
//                 <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-full mb-5 border border-red-100">
//                   <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-600" />
//                 </div>

//                 <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Confirm Logout</h3>

//                 <p className="text-sm text-center text-slate-500 mb-6">
//                   Are you sure you want to logout? You will need to sign back in to access the dashboard.
//                 </p>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsLogoutModalOpen(false)}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={executeLogout}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
//                   >
//                     {isLoggingOut ? (
//                       <>
//                         <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                         <span>Logging out...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Yes, Logout</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>

//       {/* Add custom CSS for scrollbar if not defined globally */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 10px;
//         }
//         .custom-scrollbar:hover::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
// import { clearToken, getToken } from '../utils/auth';
// import Notification, { type NotificationType } from './Notification';

// // Import standard icons
// import {
//   HomeIcon,
//   UserPlusIcon,
//   UsersIcon,
//   CreditCardIcon,
//   DocumentTextIcon,
//   PlusIcon,
//   ClipboardDocumentListIcon,
//   Cog6ToothIcon,
//   BriefcaseIcon,
//   ArrowLeftOnRectangleIcon,
//   ChevronDownIcon,
//   ChevronDoubleLeftIcon,
//   ChevronDoubleRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from '@heroicons/react/24/outline';

// interface SidebarProps {
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Replaced multiple booleans with a single state to ensure only one is open at a time
//   const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: NotificationType;
//   } | null>(null);

//   const navItems = [
//     {
//       label: 'Dashboard',
//       path: '/admin/dashboard',
//       icon: <HomeIcon className="w-5 h-5 shrink-0" />,
//     },
//   ];

//   const toggleSubmenu = (menuName: string) => {
//     setOpenSubmenu(openSubmenu === menuName ? null : menuName);
//   };

//   const executeLogout = async () => {
//     setIsLoggingOut(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//         return;
//       }

//       const response = await fetch('/api/admin/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Logout failed: ${response.status}`);
//       }

//       clearToken();
//       setNotification({
//         message: 'Logged out successfully',
//         type: 'success',
//       });

//       setTimeout(() => {
//         setIsLogoutModalOpen(false);
//         window.location.href = '/admin/login';
//       }, 1000);
//     } catch (error) {
//       console.error('Logout error:', error);
//       setNotification({
//         message: 'Logout failed. Please try again.',
//         type: 'error',
//       });

//       setTimeout(() => {
//         clearToken();
//         setIsLogoutModalOpen(false);
//         navigate('/admin/login', { replace: true });
//       }, 2000);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const closeMobileMenu = () => {
//     setSidebarOpen(false);
//     if (onMobileClose) onMobileClose();
//   };

//   return (
//     <>
//       {/* Notification Toast */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           duration={notification.type === 'success' ? 3000 : 4000}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* ========================================== */}
//       {/* DESKTOP SIDEBAR (Hidden on Mobile & Tablet)*/}
//       {/* ========================================== */}
//       <div
//         className={`hidden md:flex fixed left-0 top-0 h-screen ${
//           isOpen ? 'w-64' : 'w-20'
//         } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10 shadow-xl`}
//       >
//         {/* Brand/Logo Section */}
//         <div className="p-5 border-b border-white/10 flex items-center h-[72px] shrink-0">
//           <div className="flex items-center gap-3 w-full">
//             <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-md">
//               AC
//             </div>
//             {isOpen && (
//               <div className="overflow-hidden whitespace-nowrap transition-all duration-300 flex-1">
//                 <h1 className="font-bold text-lg leading-tight tracking-wide">Akshaya</h1>
//                 <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
//           <div className="space-y-1.5">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${
//                     isActive
//                       ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                   }`
//                 }
//                 title={!isOpen ? item.label : ''}
//               >
//                 {item.icon}
//                 {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
//               </NavLink>
//             ))}

//             {/* Customers Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('customers')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Customers' : ''}
//               >
//                 <UsersIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Customers</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'customers' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-customer"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <UserPlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Customer</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/customer-list"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Customer Status</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Tasks Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('tasks')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Tasks' : ''}
//               >
//                 <BriefcaseIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Tasks</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'tasks' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/add-task"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add Task</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/task-update"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Task Update</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Payments Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('payments')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Payments' : ''}
//               >
//                 <CreditCardIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Payments</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'payments' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <PlusIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Add New Payment</span>
//                   </NavLink>
//                   <NavLink
//                     to="/admin/payments"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Payment History</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>

//             {/* Settings Section */}
//             <div>
//               <button
//                 onClick={() => toggleSubmenu('settings')}
//                 className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
//                   openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                 }`}
//                 title={!isOpen ? 'Settings' : ''}
//               >
//                 <Cog6ToothIcon className="w-5 h-5 shrink-0" />
//                 {isOpen && (
//                   <div className="flex items-center justify-between flex-1 whitespace-nowrap">
//                     <span className="text-sm font-medium">Settings</span>
//                     <ChevronDownIcon
//                       className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                         openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                       }`}
//                     />
//                   </div>
//                 )}
//               </button>

//               <div
//                 className={`grid transition-all duration-300 ease-in-out ${
//                   openSubmenu === 'settings' && isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                 }`}
//               >
//                 <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
//                   <NavLink
//                     to="/admin/list-staffs"
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
//                         isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                       }`
//                     }
//                   >
//                     <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                     <span className="whitespace-nowrap">Staff Management</span>
//                   </NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={() => setIsLogoutModalOpen(true)}
//             className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
//             title={!isOpen ? 'Logout' : ''}
//           >
//             <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
//             {isOpen && (
//               <span className="text-sm font-medium whitespace-nowrap">Logout</span>
//             )}
//           </button>
//         </div>

//         {/* Toggle Button */}
//         <div className="border-t border-white/10 p-3 bg-black/10">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-center py-2.5 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-200"
//             title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//           >
//             {isOpen ? (
//               <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
//             ) : (
//               <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE TOP NAVIGATION BAR                  */}
//       {/* ========================================== */}
//       {/* Fix applied: absolute positioning w-full to break out of flex row layout */}
//       <div className="fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-gray-200 md:hidden">
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors"
//           >
//             <span className="sr-only">Open menu</span>
//             <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//           </button>

//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 bg-[#001A39] text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
//               AC
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-bold text-[#001A39] leading-none tracking-wide">Akshaya</span>
//               <span className="text-[10px] text-blue-600 uppercase tracking-widest font-medium">Center</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================== */}
//       {/* MOBILE SIDEBAR DRAWER                      */}
//       {/* ========================================== */}
//       <Dialog open={sidebarOpen || isMobileOpen} onClose={closeMobileMenu} className="relative z-50 md:hidden">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex">
//           <DialogPanel
//             transition
//             className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full shadow-2xl"
//           >
//             {/* Close Button positioned outside the drawer */}
//             <TransitionChild>
//               <div className="absolute top-0 left-full flex w-16 justify-center pt-4 duration-300 ease-in-out data-[closed]:opacity-0">
//                 <button
//                   type="button"
//                   onClick={closeMobileMenu}
//                   className="-m-2.5 p-2.5 rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <span className="sr-only">Close menu</span>
//                   <XMarkIcon aria-hidden="true" className="h-7 w-7 text-white" />
//                 </button>
//               </div>
//             </TransitionChild>

//             {/* Drawer Content */}
//             <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-6 ring-1 ring-white/10 custom-scrollbar">

//               {/* Drawer Header */}
//               <div className="flex items-center h-[72px] shrink-0 border-b border-white/10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
//                     AC
//                   </div>
//                   <div>
//                     <h1 className="font-bold text-lg text-white leading-tight tracking-wide">Akshaya</h1>
//                     <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">Center</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Drawer Navigation */}
//               <nav className="flex flex-1 flex-col">
//                 <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                   <li>
//                     <ul role="list" className="-mx-2 space-y-2">
//                       {navItems.map((item) => (
//                         <li key={item.path}>
//                           <NavLink
//                             to={item.path}
//                             onClick={closeMobileMenu}
//                             className={({ isActive }) =>
//                               `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
//                                 isActive
//                                   ? 'bg-blue-600/20 text-white shadow-sm border border-blue-500/20'
//                                   : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
//                               }`
//                             }
//                           >
//                             {item.icon}
//                             <span className="text-sm">{item.label}</span>
//                           </NavLink>
//                         </li>
//                       ))}

//                       {/* Mobile Customers Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('customers')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'customers' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <UsersIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Customers</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'customers' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'customers' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-customer"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <UserPlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Customer</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/customer-list"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Customer Status</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Tasks Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('tasks')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'tasks' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <BriefcaseIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Tasks</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'tasks' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'tasks' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/add-task"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add Task</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/task-update"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <DocumentTextIcon className="w-4 h-4 shrink-0" />
//                               <span>Task Update</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Payments Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('payments')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'payments' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <CreditCardIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Payments</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'payments' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'payments' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <PlusIcon className="w-4 h-4 shrink-0" />
//                               <span>Add New Payment</span>
//                             </NavLink>
//                             <NavLink
//                               to="/admin/payments"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
//                               <span>Payment History</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Mobile Settings Section */}
//                       <li>
//                         <button
//                           onClick={() => toggleSubmenu('settings')}
//                           className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
//                             openSubmenu === 'settings' ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                           }`}
//                         >
//                           <Cog6ToothIcon className="h-5 w-5 shrink-0" />
//                           <div className="flex items-center justify-between flex-1">
//                             <span>Settings</span>
//                             <ChevronDownIcon
//                               className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
//                                 openSubmenu === 'settings' ? 'rotate-180 text-white' : 'text-gray-500'
//                               }`}
//                             />
//                           </div>
//                         </button>

//                         <div
//                           className={`grid transition-all duration-300 ease-in-out ${
//                             openSubmenu === 'settings' ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
//                           }`}
//                         >
//                           <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
//                             <NavLink
//                               to="/admin/list-staffs"
//                               onClick={closeMobileMenu}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
//                                   isActive ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                                 }`
//                               }
//                             >
//                               <BriefcaseIcon className="w-4 h-4 shrink-0" />
//                               <span>Staff Management</span>
//                             </NavLink>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </li>

//                   {/* Mobile Drawer Logout Button */}
//                   <li className="-mx-2 mt-auto border-t border-white/10 pt-4">
//                     <button
//                       onClick={() => setIsLogoutModalOpen(true)}
//                       className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
//                     >
//                       <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
//                       <span>Logout</span>
//                     </button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       {/* ========================================== */}
//       {/* LOGOUT CONFIRMATION MODAL                  */}
//       {/* ========================================== */}
//       <Dialog open={isLogoutModalOpen} onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)} className="relative z-[60]">
//         <DialogBackdrop className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" />

//         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
//             <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
//               <div className="p-6">
//                 <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-full mb-5 border border-red-100">
//                   <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-600" />
//                 </div>

//                 <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Confirm Logout</h3>

//                 <p className="text-sm text-center text-slate-500 mb-6">
//                   Are you sure you want to logout? You will need to sign back in to access the dashboard.
//                 </p>

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsLogoutModalOpen(false)}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={executeLogout}
//                     disabled={isLoggingOut}
//                     className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
//                   >
//                     {isLoggingOut ? (
//                       <>
//                         <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                         <span>Logging out...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Yes, Logout</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 10px;
//         }
//         .custom-scrollbar:hover::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

//workingggggggggggggggg

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { clearToken, getToken } from "../utils/auth";
import Notification, { type NotificationType } from "./Notification";
import logo from "../assets/logo2.png";

// Import standard icons
import {
  HomeIcon,
  UserPlusIcon,
  UsersIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Profile Interfaces
interface AdminProfileData {
  _id: string;
  username: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const Sidebar = ({ isMobileOpen = false, onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();

  // Sidebar States
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Dispatch sidebar state change event
  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sidebarStateChanged", {
        detail: { isOpen },
      }),
    );
  }, [isOpen]);

  // Logout States
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Notification State
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  // ==========================================
  // PROFILE MODAL STATES & LOGIC
  // ==========================================
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [editProfileData, setEditProfileData] = useState({
    username: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Prevent background scrolling when Profile modal is open
  useEffect(() => {
    if (isProfileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isProfileModalOpen]);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    fetchProfile();
    setSidebarOpen(false); // Close mobile sidebar if open
  };

  const closeProfileModal = () => {
    if (!isSavingProfile && !isChangingPassword) {
      setIsProfileModalOpen(false);
      setIsEditingProfile(false);
      setShowChangePassword(false);
    }
  };

  // const fetchProfile = async () => {
  //   try {
  //     setIsProfileLoading(true);
  //     const token = getToken();

  //     if (!token) {
  //       setNotification({ message: 'Authentication token not found. Please log in again.', type: 'error' });
  //       return;
  //     }

  //     const response = await fetch('/api/admin/profile', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) throw new Error(`Failed to fetch profile (Status: ${response.status})`);

  //     const data = await response.json();
  //     setProfile(data.profile);
  //     setEditProfileData({
  //       name: data.profile.name || '',
  //       address: data.profile.address || '',
  //       phone: data.profile.phone || '',
  //       email: data.profile.email || '',
  //     });
  //   } catch (error) {
  //     console.error('Error fetching profile:', error);
  //     setNotification({
  //       message: error instanceof Error ? error.message : 'Failed to load profile',
  //       type: 'error',
  //     });
  //   } finally {
  //     setIsProfileLoading(false);
  //   }
  // };

  const fetchProfile = async () => {
    try {
      setIsProfileLoading(true);
      const token = getToken();

      // If there's no token at all, instantly boot them to login
      if (!token) {
        clearToken();
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await fetch("/api/admin/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // --- NEW AUTO-LOGOUT LOGIC ---
      // If the token is rejected (401) or the user isn't found (404)
      if (response.status === 401 || response.status === 404) {
        clearToken(); // Destroy the bad token
        setNotification({
          message: "Session expired or invalid. Please log in again.",
          type: "error",
        });

        // Use a slight timeout so they can read the notification before the redirect
        setTimeout(() => {
          navigate("/admin/login", { replace: true });
        }, 1500);
        return;
      }
      // -----------------------------

      if (!response.ok)
        throw new Error(`Failed to fetch profile (Status: ${response.status})`);

      const data = await response.json();
      setProfile(data.profile);
      setEditProfileData({
        username: data.profile.username || "",
        name: data.profile.name || "",
        address: data.profile.address || "",
        phone: data.profile.phone || "",
        email: data.profile.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setNotification({
        message:
          error instanceof Error ? error.message : "Failed to load profile",
        type: "error",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProfileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update profile (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditingProfile(false);
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditProfileData({
        username: profile.username || "",
        name: profile.name || "",
        address: profile.address || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
    setIsEditingProfile(false);
  };

  const validatePassword = (): boolean => {
    const errors: typeof passwordErrors = {};
    if (!passwordData.currentPassword.trim())
      errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword.trim())
      errors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 6)
      errors.newPassword = "New password must be at least 6 characters";
    if (!passwordData.confirmPassword.trim())
      errors.confirmPassword = "Please confirm your new password";
    else if (passwordData.newPassword !== passwordData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      setIsChangingPassword(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to change password (Status: ${response.status})`,
        );
      }

      setNotification({
        message: "Password changed successfully!",
        type: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowChangePassword(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setNotification({
        message:
          error instanceof Error ? error.message : "Failed to change password",
        type: "error",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ==========================================
  // SIDEBAR LOGIC
  // ==========================================
  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <HomeIcon className="w-5 h-5 shrink-0" />,
    },
  ];

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const executeLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = getToken();
      if (!token) {
        clearToken();
        setIsLogoutModalOpen(false);
        navigate("/admin/login", { replace: true });
        return;
      }
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Logout failed: ${response.status}`);

      clearToken();
      setNotification({ message: "Logged out successfully", type: "success" });
      setTimeout(() => {
        setIsLogoutModalOpen(false);
        window.location.href = "/admin/login";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      setNotification({
        message: "Logout failed. Please try again.",
        type: "error",
      });
      setTimeout(() => {
        clearToken();
        setIsLogoutModalOpen(false);
        navigate("/admin/login", { replace: true });
      }, 2000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setSidebarOpen(false);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "success" ? 3000 : 4000}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Hidden on Mobile & Tablet)*/}
      {/* ========================================== */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-screen ${
          isOpen ? "w-64" : "w-20"
        } bg-[#001A39] text-white flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10 shadow-xl`}
      >
        {/* Brand/Logo Section */}
        <div className="p-5 border-b border-white/10 flex items-center h-[72px] shrink-0">
          <div className="flex items-center gap-3 w-full">
            {/* Logo Image Box */}
            <div className="w-15 h-15  rounded-xl flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              <img
                src={logo} // Replace with your actual image path
                alt="Logo"
                className="w-full h-full object-contain p-1" // Use object-cover if the logo should fill the entire box without padding
              />
            </div>

            {/* Center Text */}
            {isOpen && (
              <div className="overflow-hidden whitespace-nowrap transition-all duration-300 flex-1">
                <h1 className="font-bold text-lg leading-tight tracking-wide">
                  Karunya
                </h1>
                <p className="text-[11px] text-blue-200 tracking-widest font-medium">
                  Janasevana Kendram
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-white shadow-sm border border-blue-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`
                }
                title={!isOpen ? item.label : ""}
              >
                {item.icon}
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Customers Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("customers")}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                  openSubmenu === "customers"
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={!isOpen ? "Customers" : ""}
              >
                <UsersIcon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 whitespace-nowrap">
                    <span className="text-sm font-medium">Customers</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        openSubmenu === "customers"
                          ? "rotate-180 text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSubmenu === "customers" && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
                  <NavLink
                    to="/admin/add-customer"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <UserPlusIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Add Customer</span>
                  </NavLink>
                  <NavLink
                    to="/admin/customer-list"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">List Customer</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("tasks")}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                  openSubmenu === "tasks"
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={!isOpen ? "Tasks" : ""}
              >
                <BriefcaseIcon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 whitespace-nowrap">
                    <span className="text-sm font-medium">Tasks</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        openSubmenu === "tasks"
                          ? "rotate-180 text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSubmenu === "tasks" && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
                  <NavLink
                    to="/admin/add-task"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <PlusIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Add Task</span>
                  </NavLink>
                  <NavLink
                    to="/admin/task-update"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <DocumentTextIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Update</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Payments Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("payments")}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                  openSubmenu === "payments"
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={!isOpen ? "Payments" : ""}
              >
                <CreditCardIcon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 whitespace-nowrap">
                    <span className="text-sm font-medium">Payments</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        openSubmenu === "payments"
                          ? "rotate-180 text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSubmenu === "payments" && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
                  {/* Add Payment link disabled - Using Add Task instead */}
                  {/* <NavLink
                    to="/admin/list-payments"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <PlusIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Add New Payment</span>
                  </NavLink> */}
                  {/* <NavLink
                    to="/admin/payments"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive ? 'bg-blue-600/20 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Payment History</span>
                  </NavLink> */}
                  <NavLink
                    to="/admin/payments"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Payment History</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("settings")}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 border border-transparent ${
                  openSubmenu === "settings"
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={!isOpen ? "Settings" : ""}
              >
                <Cog6ToothIcon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 whitespace-nowrap">
                    <span className="text-sm font-medium">Settings</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        openSubmenu === "settings"
                          ? "rotate-180 text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSubmenu === "settings" && isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-1 ml-5 border-l border-white/10 pl-3 py-1">
                  <NavLink
                    to="/admin/list-staffs"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive
                          ? "bg-blue-600/20 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <BriefcaseIcon className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Staff Management</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile & Logout Buttons */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Open Profile Modal Button */}
          {/* <button
            onClick={openProfileModal}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-white/10 hover:text-white group"
            title={!isOpen ? 'Profile' : ''}
          >
            <UserCircleIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            {isOpen && (
              <span className="text-sm font-medium whitespace-nowrap">Profile</span>
            )}
          </button> */}

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group"
            title={!isOpen ? "Logout" : ""}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
            {isOpen && (
              <span className="text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="border-t border-white/10 p-3 bg-black/10">
          <button
            onClick={() => {
              const newState = !isOpen;
              setIsOpen(newState);
              // Dispatch event for layout adjustment
              window.dispatchEvent(
                new CustomEvent("sidebarStateChanged", {
                  detail: { isOpen: newState },
                }),
              );
            }}
            className="w-full flex justify-center py-2.5 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-200"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronDoubleLeftIcon className="w-5 h-5 shrink-0" />
            ) : (
              <ChevronDoubleRightIcon className="w-5 h-5 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE & TABLET TOP NAVIGATION BAR         */}
      {/* ========================================== */}
      <div className="fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-gray-200 lg:hidden">
        {/* Left Side: Hamburger */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-ml-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        {/* Right Side: Profile Modal Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            title="Admin Profile"
          >
            <div className="h-8 w-8 rounded-full bg-[#001A39] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              A
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 mr-1">
              Admin
            </span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE & TABLET SIDEBAR DRAWER             */}
      {/* ========================================== */}
      <Dialog
        open={sidebarOpen || isMobileOpen}
        onClose={closeMobileMenu}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-[280px] flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full shadow-2xl"
          >
            {/* Close Button positioned outside the drawer */}
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-4 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="-m-2.5 p-2.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-7 w-7 text-white"
                  />
                </button>
              </div>
            </TransitionChild>

            {/* Drawer Content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#001A39] px-6 pb-6 ring-1 ring-white/10 custom-scrollbar">
              {/* Drawer Header */}
              <div className="flex items-center h-[72px] shrink-0 border-b border-white/10">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-white text-[#001A39] rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    AC
                  </div>
                  <div className="flex-1">
                    <h1 className="font-bold text-lg text-white leading-tight tracking-wide">
                      Akshaya
                    </h1>
                    <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">
                      Center
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-2">
                      {navItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                isActive
                                  ? "bg-white/10 text-white shadow-sm"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                              }`
                            }
                          >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}

                      {/* Mobile Customers Section */}
                      <li>
                        <button
                          onClick={() => toggleSubmenu("customers")}
                          className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
                            openSubmenu === "customers"
                              ? "text-white bg-white/5"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <UsersIcon className="h-5 w-5 shrink-0" />
                          <div className="flex items-center justify-between flex-1">
                            <span>Customers</span>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                openSubmenu === "customers"
                                  ? "rotate-180 text-white"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            openSubmenu === "customers"
                              ? "grid-rows-[1fr] opacity-100 mt-1"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
                            <NavLink
                              to="/admin/add-customer"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <UserPlusIcon className="w-4 h-4 shrink-0" />
                              <span>Add Customer</span>
                            </NavLink>
                            <NavLink
                              to="/admin/customer-list"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                              <span>Customer Status</span>
                            </NavLink>
                          </div>
                        </div>
                      </li>

                      {/* Mobile Tasks Section */}
                      <li>
                        <button
                          onClick={() => toggleSubmenu("tasks")}
                          className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
                            openSubmenu === "tasks"
                              ? "text-white bg-white/5"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <BriefcaseIcon className="h-5 w-5 shrink-0" />
                          <div className="flex items-center justify-between flex-1">
                            <span>Tasks</span>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                openSubmenu === "tasks"
                                  ? "rotate-180 text-white"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            openSubmenu === "tasks"
                              ? "grid-rows-[1fr] opacity-100 mt-1"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
                            <NavLink
                              to="/admin/add-task"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <PlusIcon className="w-4 h-4 shrink-0" />
                              <span>Add Task</span>
                            </NavLink>
                            <NavLink
                              to="/admin/task-update"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <DocumentTextIcon className="w-4 h-4 shrink-0" />
                              <span>Task Update</span>
                            </NavLink>
                          </div>
                        </div>
                      </li>

                      {/* Mobile Payments Section */}
                      <li>
                        <button
                          onClick={() => toggleSubmenu("payments")}
                          className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
                            openSubmenu === "payments"
                              ? "text-white bg-white/5"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <CreditCardIcon className="h-5 w-5 shrink-0" />
                          <div className="flex items-center justify-between flex-1">
                            <span>Payments</span>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                openSubmenu === "payments"
                                  ? "rotate-180 text-white"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            openSubmenu === "payments"
                              ? "grid-rows-[1fr] opacity-100 mt-1"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
                            {/* Add Payment link disabled - Using Add Task instead */}
                            {/* <NavLink
                              to="/admin/list-payments"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                              }
                            >
                              <PlusIcon className="w-4 h-4 shrink-0" />
                              <span>Add New Payment</span>
                            </NavLink> */}
                            <NavLink
                              to="/admin/payments"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <ClipboardDocumentListIcon className="w-4 h-4 shrink-0" />
                              <span>Payment History</span>
                            </NavLink>
                          </div>
                        </div>
                      </li>

                      {/* Mobile Settings Section */}
                      <li>
                        <button
                          onClick={() => toggleSubmenu("settings")}
                          className={`w-full group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent ${
                            openSubmenu === "settings"
                              ? "text-white bg-white/5"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 shrink-0" />
                          <div className="flex items-center justify-between flex-1">
                            <span>Settings</span>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                openSubmenu === "settings"
                                  ? "rotate-180 text-white"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            openSubmenu === "settings"
                              ? "grid-rows-[1fr] opacity-100 mt-1"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1 ml-6 border-l border-white/10 pl-3 py-1">
                            <NavLink
                              to="/admin/list-staffs"
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                                  isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                              }
                            >
                              <BriefcaseIcon className="w-4 h-4 shrink-0" />
                              <span>Staff Management</span>
                            </NavLink>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>

                  {/* Mobile Drawer Logout Button */}
                  <li className="-mx-2 mt-auto border-t border-white/10 pt-4">
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* LOGOUT CONFIRMATION MODAL                  */}
      {/* ========================================== */}
      <Dialog
        open={isLogoutModalOpen}
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        className="relative z-[60]"
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
              <div className="p-6">
                <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-full mb-5 border border-red-100">
                  <ArrowLeftOnRectangleIcon className="w-7 h-7 text-red-600" />
                </div>

                <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                  Confirm Logout
                </h3>

                <p className="text-sm text-center text-slate-500 mb-6">
                  Are you sure you want to logout? You will need to sign back in
                  to access the dashboard.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(false)}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeLogout}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <span>Yes, Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* ========================================== */}
      {/* INTEGRATED PROFILE MODAL                   */}
      {/* ========================================== */}
      <Dialog
        open={isProfileModalOpen}
        onClose={closeProfileModal}
        className="relative z-[60]"
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-[#F8FAFC] text-left shadow-2xl transition-all sm:my-8 w-full max-w-4xl border border-slate-200">
              {/* Modal Header */}
              <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-[#1e293b] rounded-full"></div>
                  <h2 className="text-xl font-bold text-[#1e293b]">
                    Admin Profile
                  </h2>
                </div>
                <button
                  onClick={closeProfileModal}
                  disabled={isSavingProfile || isChangingPassword}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {isProfileLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e293b]"></div>
                    <p className="mt-4 text-slate-500 font-medium">
                      Loading profile...
                    </p>
                  </div>
                ) : !profile ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-600 font-medium">
                      Failed to load profile data.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                      <div className="h-28 bg-gradient-to-r from-[#001A39] to-[#0a2f63]"></div>
                      <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 mb-6 gap-4">
                          <div className="flex items-end gap-4">
                            <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md mt-6">
                              <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-700 border border-slate-200">
                                {profile.name
                                  ? profile.name.charAt(0).toUpperCase()
                                  : profile.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="pb-1">
                              <h2 className="text-xl font-bold text-slate-900">
                                {profile.name || profile.username}
                              </h2>
                              <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                System Administrator
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 pb-1">
                            {!isEditingProfile && !showChangePassword && (
                              <>
                                <button
                                  onClick={() => setIsEditingProfile(true)}
                                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  Edit Details
                                </button>
                                <button
                                  onClick={() => setShowChangePassword(true)}
                                  className="px-3 py-1.5 bg-[#1e293b] text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                  Security
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* View / Edit Mode */}
                        <div className="border-t border-slate-100 pt-5">
                          {isEditingProfile ? (
                            <div className="space-y-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    name="username"
                                    value={editProfileData.username}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={editProfileData.name}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={editProfileData.email}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Phone Number
                                  </label>
                                  <input
                                    type="tel"
                                    name="phone"
                                    value={editProfileData.phone}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 text-sm"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Address
                                  </label>
                                  <input
                                    type="text"
                                    name="address"
                                    value={editProfileData.address}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={isSavingProfile}
                                  className="px-4 py-2 bg-white border border-slate-300 text-sm rounded-lg hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSaveProfile}
                                  disabled={isSavingProfile}
                                  className="px-4 py-2 bg-[#1e293b] text-white text-sm rounded-lg hover:bg-slate-800"
                                >
                                  {isSavingProfile
                                    ? "Saving..."
                                    : "Save Changes"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                              <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Account Login
                                </h3>
                                <p className="text-sm font-medium text-slate-900">
                                  {profile.username}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Contact Email
                                </h3>
                                <p className="text-sm font-medium text-slate-900">
                                  {profile.email || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Phone Number
                                </h3>
                                <p className="text-sm font-medium text-slate-900">
                                  {profile.phone || "Not provided"}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  {" "}
                                  Address
                                </h3>
                                <p className="text-sm font-medium text-slate-900">
                                  {profile.address || "Not provided"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    {showChangePassword && (
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                          Security Settings
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Current Password *
                            </label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 ${passwordErrors.currentPassword ? "border-red-300 focus:ring-red-500 bg-red-50/30" : "border-slate-300 focus:ring-slate-500"}`}
                            />
                            {passwordErrors.currentPassword && (
                              <p className="text-red-500 text-xs mt-1">
                                {passwordErrors.currentPassword}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              New Password *
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 ${passwordErrors.newPassword ? "border-red-300 focus:ring-red-500 bg-red-50/30" : "border-slate-300 focus:ring-slate-500"}`}
                            />
                            {passwordErrors.newPassword && (
                              <p className="text-red-500 text-xs mt-1">
                                {passwordErrors.newPassword}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Confirm New Password *
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 ${passwordErrors.confirmPassword ? "border-red-300 focus:ring-red-500 bg-red-50/30" : "border-slate-300 focus:ring-slate-500"}`}
                            />
                            {passwordErrors.confirmPassword && (
                              <p className="text-red-500 text-xs mt-1">
                                {passwordErrors.confirmPassword}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-5 mt-5 border-t border-slate-100">
                          <button
                            onClick={() => setShowChangePassword(false)}
                            disabled={isChangingPassword}
                            className="px-4 py-2 bg-white border border-slate-300 text-sm rounded-lg hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="px-4 py-2 bg-[#1e293b] text-white text-sm rounded-lg hover:bg-slate-800"
                          >
                            {isChangingPassword
                              ? "Updating..."
                              : "Update Password"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
