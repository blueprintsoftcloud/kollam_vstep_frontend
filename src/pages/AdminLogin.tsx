// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuthContext } from '../components/AuthContext';

// const AdminLogin: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, isLoading } = useAuthContext();

//   const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError(null);

//     const result = await login(username, password);

//     if (result.success) {
//       navigate(from, { replace: true });
//     } else {
//       setError(result.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
//         <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Login</h1>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Sign in with your admin credentials to access the dashboard.
//         </p>

//         {error ? (
//           <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
//             {error}
//           </div>
//         ) : null}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               id="username"
//               name="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="admin"
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//               required
//               autoComplete="username"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//               required
//               autoComplete="current-password"
//               disabled={isLoading}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
//           >
//             {isLoading ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;





// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuthContext } from '../components/AuthContext';
// import loginimg from "../assets/login_img.avif"

// const AdminLogin: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false); // Added for eye toggle UI

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, isLoading } = useAuthContext();

//   const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError(null);

//     const result = await login(username, password);

//     if (result.success) {
//       navigate(from, { replace: true });
//     } else {
//       setError(result.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Left Side - Image (Hidden on smaller screens) */}
//       <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
//         <div className="absolute inset-0 bg-[#001A39]/20 z-10"></div>
//         <img
//           src={loginimg}
//           alt="Admin Background"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
//           <h2 className="text-4xl font-bold mb-4">Admin Portal</h2>
//           <p className="text-lg text-gray-200 max-w-md">
//             Secure access to the administration dashboard and management tools.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        
//         {/* Card Container */}
//         <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
          
//           {/* Header Section */}
//           <div className="mb-8 text-center lg:text-left">
//             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
//               Admin Login
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Sign in with your admin credentials to access the dashboard.
//             </p>
//           </div>

//           {/* Error Message */}
//           {error ? (
//             <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
//               {error}
//             </div>
//           ) : null}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* Username Field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative group">
//                 {/* User Icon */}
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#001A39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full pl-11 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white  outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="admin"
//                   required
//                   autoComplete="username"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative group">
//                 {/* Lock Icon */}
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#001A39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
                
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-11 pr-12 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white   outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="••••••••"
//                   required
//                   autoComplete="current-password"
//                   disabled={isLoading}
//                 />
                
//                 {/* Eye Toggle Button */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#001A39] text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-[#001A39]/30 focus:ring-4 focus:ring-[#001A39]/20 transition-all duration-200 mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;





import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../components/AuthContext';
import loginimg from "../assets/login_img.avif";
import toast from 'react-hot-toast'; // Added toast import

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthContext();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation with Toasts
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      toast.success('Logged in successfully!'); // Success toast
      navigate(from, { replace: true });
    } else {
      const errorMsg = result.error || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg); // Error toast
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Image (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 bg-[#001A39]/20 z-10"></div>
        <img
          src={loginimg}
          alt="Admin Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <h2 className="text-4xl font-bold mb-4">Admin Portal</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Secure access to the administration dashboard and management tools.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        
        {/* Card Container */}
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
          
          {/* Header Section */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in with your admin credentials to access the dashboard.
            </p>
          </div>

          {/* Error Message */}
          {error ? (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative group">
                {/* User Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#001A39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="admin"
                  autoComplete="username"
                  disabled={isLoading}
                  /* Removed "required" attribute here so the custom JS toast can fire instead of the default browser popup */
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                {/* Lock Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#001A39] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  /* Removed "required" attribute here so the custom JS toast can fire instead of the default browser popup */
                />
                
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button with Loader */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#001A39] text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-90 hover:shadow-lg hover:shadow-[#001A39]/30 focus:ring-4 focus:ring-[#001A39]/20 transition-all duration-200 mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;