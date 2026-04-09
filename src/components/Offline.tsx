// import React, { useState, useEffect } from 'react';

// const Offline: React.FC = () => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       // Reload the page when connection is restored
//       window.location.reload();
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   if (isOnline) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
//       <div className="text-center">
//         <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
//           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364M5.636 5.636l12.728 12.728" />
//           </svg>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">No Internet Connection</h1>
//         <p className="text-gray-600">
//           No internet connection. Please check your network.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Offline;





import React, { useState, useEffect } from 'react';

const Offline: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Reload the page when connection is restored
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    // CHANGED: Added 'fixed inset-0 z-[9999]' to make it cover the entire screen and block the sidebar
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364M5.636 5.636l12.728 12.728" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text- mb-2">No Internet Connection</h1>
        <p className="text-[#001A39]">
           Please check your Internet and try again..
        </p>
      </div>
    </div>
  );
};

export default Offline;