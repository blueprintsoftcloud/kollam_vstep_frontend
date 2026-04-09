// import React, { useState } from 'react';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: Add your authentication logic here
//     console.log('Login attempt with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
//           Welcome Back
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label 
//               htmlFor="email" 
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               placeholder="you@example.com"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label 
//               htmlFor="password" 
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between text-sm">
//             <label className="flex items-center text-gray-600 cursor-pointer">
//               <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//               Remember me
//             </label>
//             <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
//               Forgot password?
//             </a>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 mt-4"
//           >
//             Sign In
//           </button>
//         </form>

//         {/* Sign Up Link */}
//         <p className="text-center text-sm text-gray-600 mt-6">
//           Don't have an account?{' '}
//           <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from 'react';

// const SplitLogin: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: Add your authentication logic here
//     console.log('Login attempt with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Left Side - Image (Hidden on smaller screens) */}
//       <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
//         <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
//         <img
//           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
//           alt="Login Background"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
//           <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
//           <p className="text-lg text-gray-200 max-w-md">
//             Discover seamless workflows and elevate your productivity today.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        
//         {/* Added a small border, padding, and subtle shadow here */}
//         <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 sm:p-10">
          
//           {/* Header Section */}
//           <div className="mb-8 text-center lg:text-left">
//             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
//               Welcome back
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Please enter your details to sign in.
//             </p>
//           </div>

//           {/* Form Inputs */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>

//             {/* Password Field with Eye Button */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                   className="w-full pl-4 pr-12 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   placeholder="••••••••"
//                   required
//                 />
                
//                 {/* Eye Toggle Button */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     // Eye Open Icon
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   ) : (
//                     // Eye Closed Icon
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 transition-all duration-200 mt-4"
//             >
//               Sign In
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SplitLogin;



// import React, { useState } from 'react';

// const SplitLogin: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: Add your authentication logic here
//     console.log('Login attempt with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Left Side - Image (Hidden on smaller screens) */}
//       <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
//         <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
//         <img
//           src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
//           alt="Login Background"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
//           <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
//           <p className="text-lg text-gray-200 max-w-md">
//             Discover seamless workflows and elevate your productivity today.
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
//               Welcome back
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Please enter your details to sign in.
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative group">
//                 {/* Mail Icon */}
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                   className="w-full pl-11 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   placeholder="you@example.com"
//                   required
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
//                   <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
                
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                   className="w-full pl-11 pr-12 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   placeholder="••••••••"
//                   required
//                 />
                
//                 {/* Eye Toggle Button */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     // Eye Open Icon
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   ) : (
//                     // Eye Closed Icon
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
//               className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 focus:ring-4 focus:ring-blue-200 transition-all duration-200 mt-2 active:scale-[0.98]"
//             >
//               Sign In
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SplitLogin;
