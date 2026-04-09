// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import ProfileDropdown from './ProfileDropdown';

// type AdminLayoutProps = {
//   children: React.ReactNode;
// };

// const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Mobile Header with Hamburger */}
//       <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 md:hidden">
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-600 hover:text-gray-900 focus:outline-none"
//           aria-label="Toggle sidebar"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//         <div className="flex-1 flex justify-center">
//           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
//             AC
//           </div>
//         </div>
//         <div onClick={closeSidebar} className="cursor-pointer">
//           <ProfileDropdown />
//         </div>
//       </div>

//       {/* Sidebar */}
//       <Sidebar isMobileOpen={sidebarOpen} onMobileClose={closeSidebar} />

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 md:hidden"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 pt-16 md:pt-0 flex flex-col">
//         {/* Desktop Header with Profile Icon */}
//         <div className="hidden md:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8">
//           <div className="flex-1" />
//           <ProfileDropdown />
//         </div>

//         {/* Page Content */}
//         <div className="flex-1 p-4 md:p-8">{children}</div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDropdown from "./ProfileDropdown";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Listen for sidebar expanded/collapsed events
  React.useEffect(() => {
    const handleSidebarStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsSidebarExpanded(customEvent.detail?.isOpen ?? true);
    };

    window.addEventListener("sidebarStateChanged", handleSidebarStateChange);
    return () =>
      window.removeEventListener(
        "sidebarStateChanged",
        handleSidebarStateChange,
      );
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header with Hamburger - Changed md:hidden to lg:hidden */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex-1 flex justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            AC
          </div>
        </div>
        <div onClick={closeSidebar} className="cursor-pointer">
          <ProfileDropdown />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={closeSidebar} />

      {/* Mobile Overlay - Changed md:hidden to lg:hidden */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content - Dynamically adjust margin based on sidebar state */}
      <main
        className={`flex-1 pt-16 lg:pt-0 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {/* Desktop Header with Profile Icon - Dynamically adjust width and margin */}
        <div
          className={`hidden lg:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8 transition-all duration-300 ${
            isSidebarExpanded
              ? "lg:ml-0 lg:w-[calc(100%-16rem)]"
              : "lg:ml-0 lg:w-full"
          } fixed top-0 right-0 z-30`}
        >
          <div className="flex-1" />
          <ProfileDropdown />
        </div>

        {/* Page Content - Adjusted padding to accommodate navbar */}
        <div
          className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${
            isSidebarExpanded ? "lg:mt-16" : "lg:mt-16"
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
