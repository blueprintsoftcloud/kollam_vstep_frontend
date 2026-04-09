// import React, { useState, useEffect } from 'react';

// export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// type NotificationProps = {
//   message: string;
//   type?: NotificationType;
//   duration?: number;
//   onClose?: () => void;
// };

// const Notification: React.FC<NotificationProps> = ({
//   message,
//   type = 'info',
//   duration = 3000,
//   onClose,
// }) => {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//       onClose?.();
//     }, duration);

//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   if (!isVisible) return null;

//   const bgColor = {
//     success: 'bg-green-50 border-green-200 text-green-700',
//     error: 'bg-red-50 border-red-200 text-red-700',
//     info: 'bg-blue-50 border-blue-200 text-blue-700',
//     warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
//   }[type];

//   const icon = {
//     success: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//       </svg>
//     ),
//     error: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//       </svg>
//     ),
//     info: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     warning: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-6V9m0 0L9.5 11.5M12 9l2.5 2.5" />
//       </svg>
//     ),
//   }[type];

//   return (
//     <div className="fixed top-4 right-4 z-50">
//       <div className={`flex items-center gap-3 border rounded-lg px-4 py-3 ${bgColor} shadow-lg`}>
//         {icon}
//         <p className="text-sm font-medium">{message}</p>
//       </div>
//     </div>
//   );
// };

// export default Notification;




import React, { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

type NotificationProps = {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  }[type];

  const icon = {
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      // Replaced the X with an exclamation circle so it doesn't conflict with the close button
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-6V9m0 0L9.5 11.5M12 9l2.5 2.5" />
      </svg>
    ),
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center justify-between gap-3 border rounded-lg px-4 py-3 min-w-[300px] ${bgColor} shadow-lg`}>
        
        {/* Left side: Icon and Message */}
        <div className="flex items-center gap-3">
          {icon}
          <p className="text-sm font-medium pr-4">{message}</p>
        </div>

        {/* Right side: Clickable Close Button */}
        <button 
          type="button"
          onClick={handleClose} 
          className="p-1 opacity-60 hover:opacity-100 focus:outline-none flex-shrink-0"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
      </div>
    </div>
  );
};

export default Notification;