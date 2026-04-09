// import { useState, useEffect } from 'react';
// import { getToken } from '../utils/auth';

// type DashboardSummary = {
//   status: {
//     pending: number;
//     inProgress: number;
//     completed: number;
//   };
//   stats: {
//     totalCustomers: number;
//     totalStaff: number;
//     totalPayments: number;
//     totalRevenue: number;
//   };
// };

// export type StaffMember = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   position: string;
//   joinDate: string;
// };

// const DashboardHome = () => {
//   // 1. Initialize with default values instead of null so the UI always renders
//   const [summary, setSummary] = useState<DashboardSummary>({
//     status: { pending: 0, inProgress: 0, completed: 0 },
//     stats: { totalCustomers: 0, totalStaff: 0, totalPayments: 0, totalRevenue: 0 }
//   });
  
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalStaff: 0,
//     totalPayments: 0,
//     revenueCollected: 0,
//   });
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const token = getToken();
//         const response = await fetch('/api/dashboard/summary', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch dashboard summary');
//         }

//         const data = await response.json();
        
//         // 2. Add safe fallbacks just in case the backend payload is missing a field
//         const safeData: DashboardSummary = {
//           status: {
//             pending: data?.status?.pending || 0,
//             inProgress: data?.status?.inProgress || 0,
//             completed: data?.status?.completed || 0,
//           },
//           stats: {
//             totalCustomers: data?.stats?.totalCustomers || 0,
//             totalStaff: data?.stats?.totalStaff || 0,
//             totalPayments: data?.stats?.totalPayments || 0,
//             totalRevenue: data?.stats?.totalRevenue || 0,
//           }
//         };

//         setSummary(safeData);
//         setStats({
//           totalCustomers: safeData.stats.totalCustomers,
//           totalStaff: safeData.stats.totalStaff,
//           totalPayments: safeData.stats.totalPayments,
//           revenueCollected: safeData.stats.totalRevenue,
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard summary:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSummary();
//   }, []);

//   // Simple Stat Card
//   const StatCard = ({ title, value, color }: { title: string; value: string; color: string; }) => (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
//       <p className="text-3xl font-semibold text-gray-900">{value}</p>
//       <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: color }} />
//     </div>
//   );

//   // Simple Status Card
//   const StatusCard = ({ title, count, color }: { title: string; count: number; color: string; }) => {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow hover:border-gray-300">
//         <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
//         <p className="text-4xl font-semibold mb-2" style={{ color }}>{count}</p>
//       </div>
//     );
//   };

//   // Simple Loading Skeleton
//   const LoadingSkeleton = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
//             <div className="h-8 bg-gray-200 rounded w-32 mb-3"></div>
//             <div className="h-1 bg-gray-200 rounded w-12"></div>
//           </div>
//         ))}
//       </div>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
//             <div className="h-10 bg-gray-200 rounded w-24 mb-4"></div>
//             <div className="flex justify-between">
//               <div className="h-3 bg-gray-200 rounded w-16"></div>
//               <div className="h-3 bg-gray-200 rounded w-8"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // 3. Pre-calculate totals and safe percentages to avoid NaN errors when data is 0
//   const totalWork = summary.status.pending + summary.status.inProgress + summary.status.completed;
//   const compRate = totalWork > 0 ? Math.round((summary.status.completed / totalWork) * 100) : 0;
//   const inProgRate = totalWork > 0 ? Math.round((summary.status.inProgress / totalWork) * 100) : 0;
//   const pendRate = totalWork > 0 ? Math.round((summary.status.pending / totalWork) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500 mt-1">Akshaya Center Admin Panel</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-red-700 text-sm">
//               <span className="font-medium">Error:</span> {error}
//             </p>
//           </div>
//         )}

//         {isLoading ? (
//           <LoadingSkeleton />
//         ) : (
//           <>
//             {/* Stats Grid */}
//             <div className="mb-8">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                 <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} color="#3B82F6" />
//                 <StatCard title="Total Staff" value={stats.totalStaff.toLocaleString()} color="#10B981" />
//                 <StatCard title="Payments Collected" value={stats.totalPayments.toLocaleString()} color="#F59E0B" />
//                 <StatCard title="Revenue Collected" value={`₹${stats.revenueCollected.toLocaleString()}`} color="#EF4444" />
//               </div>
//             </div>

//             {/* Customer Work Status */}
//             <div className="mb-8">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Work Status</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 <StatusCard title="Pending" count={summary.status.pending} color="#F59E0B" />
//                 <StatusCard title="In Progress" count={summary.status.inProgress} color="#3B82F6" />
//                 <StatusCard title="Completed" count={summary.status.completed} color="#10B981" />
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Average Transaction</span>
//                     <span className="font-medium text-gray-900">₹325</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Active Customers</span>
//                     <span className="font-medium text-gray-900">{stats.totalCustomers}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Pending Follow-ups</span>
//                     <span className="font-medium text-gray-900">{summary.status.pending}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3">
//                     <span className="text-gray-600">Monthly Revenue</span>
//                     <span className="font-medium text-gray-900">₹{(stats.revenueCollected / 1000).toFixed(1)}K</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Summary */}
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Completion Rate</span>
//                       <span className="font-medium text-gray-900">{compRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${compRate}%` }} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">In Progress</span>
//                       <span className="font-medium text-gray-900">{inProgRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${inProgRate}%` }} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Pending</span>
//                       <span className="font-medium text-gray-900">{pendRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pendRate}%` }} />
//                     </div>
//                   </div>

//                   <div className="pt-4 mt-4 border-t border-gray-100">
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div>
//                         <p className="text-2xl font-semibold text-gray-900">{totalWork}</p>
//                         <p className="text-xs text-gray-500">Total</p>
//                       </div>
//                       <div>
//                         <p className="text-2xl font-semibold text-emerald-600">{summary.status.completed}</p>
//                         <p className="text-xs text-gray-500">Done</p>
//                       </div>
//                       <div>
//                         <p className="text-2xl font-semibold text-amber-600">{summary.status.pending + summary.status.inProgress}</p>
//                         <p className="text-xs text-gray-500">Active</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Info */}
//             <div className="mt-8 text-sm text-gray-400 flex items-center justify-between">
//               <span>Last updated: {new Date().toLocaleDateString()}</span>
//               <span className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                 Live
//               </span>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;




// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // 1. IMPORT useNavigate
// import { getToken } from '../utils/auth';

// type DashboardSummary = {
//   status: {
//     pending: number;
//     inProgress: number;
//     completed: number;
//   };
//   stats: {
//     totalCustomers: number;
//     totalStaff: number;
//     totalPayments: number;
//     totalRevenue: number;
//   };
// };

// export type StaffMember = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   position: string;
//   joinDate: string;
// };

// const DashboardHome = () => {
//   const navigate = useNavigate(); // 2. INITIALIZE navigate

//   // 1. Initialize with default values instead of null so the UI always renders
//   const [summary, setSummary] = useState<DashboardSummary>({
//     status: { pending: 0, inProgress: 0, completed: 0 },
//     stats: { totalCustomers: 0, totalStaff: 0, totalPayments: 0, totalRevenue: 0 }
//   });
  
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalStaff: 0,
//     totalPayments: 0,
//     revenueCollected: 0,
//   });
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const token = getToken();
//         const response = await fetch('/api/dashboard/summary', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch dashboard summary');
//         }

//         const data = await response.json();
        
//         // 2. Add safe fallbacks just in case the backend payload is missing a field
//         const safeData: DashboardSummary = {
//           status: {
//             pending: data?.status?.pending || 0,
//             inProgress: data?.status?.inProgress || 0,
//             completed: data?.status?.completed || 0,
//           },
//           stats: {
//             totalCustomers: data?.stats?.totalCustomers || 0,
//             totalStaff: data?.stats?.totalStaff || 0,
//             totalPayments: data?.stats?.totalPayments || 0,
//             totalRevenue: data?.stats?.totalRevenue || 0,
//           }
//         };

//         setSummary(safeData);
//         setStats({
//           totalCustomers: safeData.stats.totalCustomers,
//           totalStaff: safeData.stats.totalStaff,
//           totalPayments: safeData.stats.totalPayments,
//           revenueCollected: safeData.stats.totalRevenue,
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard summary:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSummary();
//   }, []);

//   // Simple Stat Card
//   const StatCard = ({ title, value, color }: { title: string; value: string; color: string; }) => (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
//       <p className="text-3xl font-semibold text-gray-900">{value}</p>
//       <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: color }} />
//     </div>
//   );

//   // 3. ADD onClick PROP TO StatusCard
//   const StatusCard = ({ title, count, color, onClick }: { title: string; count: number; color: string; onClick?: () => void; }) => {
//     return (
//       <div 
//         onClick={onClick} 
//         className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow hover:border-gray-300"
//       >
//         <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
//         <p className="text-4xl font-semibold mb-2" style={{ color }}>{count}</p>
//       </div>
//     );
//   };

//   // Simple Loading Skeleton
//   const LoadingSkeleton = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
//             <div className="h-8 bg-gray-200 rounded w-32 mb-3"></div>
//             <div className="h-1 bg-gray-200 rounded w-12"></div>
//           </div>
//         ))}
//       </div>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
//             <div className="h-10 bg-gray-200 rounded w-24 mb-4"></div>
//             <div className="flex justify-between">
//               <div className="h-3 bg-gray-200 rounded w-16"></div>
//               <div className="h-3 bg-gray-200 rounded w-8"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // 3. Pre-calculate totals and safe percentages to avoid NaN errors when data is 0
//   const totalWork = summary.status.pending + summary.status.inProgress + summary.status.completed;
//   const compRate = totalWork > 0 ? Math.round((summary.status.completed / totalWork) * 100) : 0;
//   const inProgRate = totalWork > 0 ? Math.round((summary.status.inProgress / totalWork) * 100) : 0;
//   const pendRate = totalWork > 0 ? Math.round((summary.status.pending / totalWork) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500 mt-1">Akshaya Center Admin Panel</p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-red-700 text-sm">
//               <span className="font-medium">Error:</span> {error}
//             </p>
//           </div>
//         )}

//         {isLoading ? (
//           <LoadingSkeleton />
//         ) : (
//           <>
//             {/* Stats Grid */}
//             <div className="mb-8">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                 <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} color="#3B82F6" />
//                 <StatCard title="Total Staff" value={stats.totalStaff.toLocaleString()} color="#10B981" />
//                 <StatCard title="Payments Collected" value={stats.totalPayments.toLocaleString()} color="#F59E0B" />
//                 <StatCard title="Revenue Collected" value={`₹${stats.revenueCollected.toLocaleString()}`} color="#EF4444" />
//               </div>
//             </div>

//             {/* Customer Work Status */}
//             <div className="mb-8">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Work Status</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 {/* 4. PASS onClick FUNCTION WITH ROUTE PATH */}
//                 <StatusCard 
//                   title="Pending" 
//                   count={summary.status.pending} 
//                   color="#F59E0B" 
//                   onClick={() => navigate('/admin/task-update')}
//                 />
//                 <StatusCard 
//                   title="In Progress" 
//                   count={summary.status.inProgress} 
//                   color="#3B82F6" 
//                   onClick={() => navigate('/admin/task-update')}
//                 />
//                 <StatusCard 
//                   title="Completed" 
//                   count={summary.status.completed} 
//                   color="#10B981" 
//                   onClick={() => navigate('/admin/task-update')}
//                 />
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Average Transaction</span>
//                     <span className="font-medium text-gray-900">₹325</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Active Customers</span>
//                     <span className="font-medium text-gray-900">{stats.totalCustomers}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3 border-b border-gray-100">
//                     <span className="text-gray-600">Pending Follow-ups</span>
//                     <span className="font-medium text-gray-900">{summary.status.pending}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-3">
//                     <span className="text-gray-600">Monthly Revenue</span>
//                     <span className="font-medium text-gray-900">₹{(stats.revenueCollected / 1000).toFixed(1)}K</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Summary */}
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Completion Rate</span>
//                       <span className="font-medium text-gray-900">{compRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${compRate}%` }} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">In Progress</span>
//                       <span className="font-medium text-gray-900">{inProgRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${inProgRate}%` }} />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-gray-600">Pending</span>
//                       <span className="font-medium text-gray-900">{pendRate}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pendRate}%` }} />
//                     </div>
//                   </div>

//                   <div className="pt-4 mt-4 border-t border-gray-100">
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div>
//                         <p className="text-2xl font-semibold text-gray-900">{totalWork}</p>
//                         <p className="text-xs text-gray-500">Total</p>
//                       </div>
//                       <div>
//                         <p className="text-2xl font-semibold text-emerald-600">{summary.status.completed}</p>
//                         <p className="text-xs text-gray-500">Done</p>
//                       </div>
//                       <div>
//                         <p className="text-2xl font-semibold text-amber-600">{summary.status.pending + summary.status.inProgress}</p>
//                         <p className="text-xs text-gray-500">Active</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Info */}
//             {/* <div className="mt-8 text-sm text-gray-400 flex items-center justify-between">
//               <span>Last updated: {new Date().toLocaleDateString()}</span>
//               <span className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                 Live
//               </span>
//             </div> */}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

type DashboardSummary = {
  status: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  stats: {
    totalCustomers: number;
    totalStaff: number;
    totalPayments: number;
    totalRevenue: number;
  };
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  joinDate: string;
};

const DashboardHome = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary>({
    status: { pending: 0, inProgress: 0, completed: 0 },
    stats: { totalCustomers: 0, totalStaff: 0, totalPayments: 0, totalRevenue: 0 }
  });
  
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    totalPayments: 0,
    revenueCollected: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getToken();
        const response = await fetch('/api/dashboard/summary', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard summary');
        }

        const data = await response.json();
        
        const safeData: DashboardSummary = {
          status: {
            pending: data?.status?.pending || 0,
            inProgress: data?.status?.inProgress || 0,
            completed: data?.status?.completed || 0,
          },
          stats: {
            totalCustomers: data?.stats?.totalCustomers || 0,
            totalStaff: data?.stats?.totalStaff || 0,
            totalPayments: data?.stats?.totalPayments || 0,
            totalRevenue: data?.stats?.totalRevenue || 0,
          }
        };

        setSummary(safeData);
        setStats({
          totalCustomers: safeData.stats.totalCustomers,
          totalStaff: safeData.stats.totalStaff,
          totalPayments: safeData.stats.totalPayments,
          revenueCollected: safeData.stats.totalRevenue,
        });
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const totalWork = summary.status.pending + summary.status.inProgress + summary.status.completed;
  const compRate = totalWork > 0 ? Math.round((summary.status.completed / totalWork) * 100) : 0;
  const inProgRate = totalWork > 0 ? Math.round((summary.status.inProgress / totalWork) * 100) : 0;
  const pendRate = totalWork > 0 ? Math.round((summary.status.pending / totalWork) * 100) : 0;

  // UI Components
  const StatCard = ({ title, value, color, change }: { title: string; value: string; color: string; change?: string }) => (
    <div className="bg-white rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[15px] font-semibold text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {change && <p className="text-sm mt-2 text-emerald-500 font-medium">{change}</p>}
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: color }} />
    </div>
  );

  const StatusCard = ({ title, count, color, percentage, onClick }: { title: string; count: number; color: string; percentage: number; onClick?: () => void; }) => {
    return (
      <div 
        onClick={onClick} 
        className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col items-center justify-center group"
      >
        <div className="relative flex items-center justify-center w-24 h-24 mb-4">
          <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
            <path
              className="stroke-current text-gray-100"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-current transition-all duration-1000 ease-out"
              style={{ color: color, strokeDasharray: `${percentage || 0}, 100` }}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="text-2xl font-bold text-gray-800 absolute">{count}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
          <p className="text-[15px] font-semibold text-gray-600">{title}</p>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[24px] p-7 animate-pulse shadow-sm">
            <div className="h-4 bg-gray-100 rounded-full w-24 mb-4"></div>
            <div className="h-8 bg-gray-100 rounded-full w-32"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[24px] p-8 animate-pulse shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded-full w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-[32px] tracking-tight font-extrabold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-sm font-medium text-gray-400">Karunya Janasevana Kendram Admin Panel Overview</p>
          </div>
          {/* Optional: Add a stylized date or button here to match reference */}
        </div>

        {error && (
          <div className="mb-8 bg-red-50/80 border-none rounded-2xl p-5 shadow-sm">
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Error: {error}
            </p>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-10">
            {/* Overview Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Using vibrant colors from reference image */}
              <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} color="#8b5cf6" />
              <StatCard title="Total Staff" value={stats.totalStaff.toLocaleString()} color="#ec4899" />
              <StatCard title="Payments Collected" value={stats.totalPayments.toLocaleString()} color="#06b6d4" />
              <StatCard title="Revenue Collected" value={`₹${stats.revenueCollected.toLocaleString()}`} color="#3b82f6" />
            </div>

            {/* Middle Section Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Customer Work Status (Takes up 8 columns) */}
              <div className="lg:col-span-8 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[18px] font-bold text-gray-900">Project Statistics</h2>
                  <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Daily</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatusCard 
                    title="Completed" 
                    count={summary.status.completed} 
                    percentage={compRate}
                    color="#8b5cf6" // Purple
                    onClick={() => navigate('/admin/task-update')}
                  />
                  <StatusCard 
                    title="In Progress" 
                    count={summary.status.inProgress} 
                    percentage={inProgRate}
                    color="#ec4899" // Pink
                    onClick={() => navigate('/admin/task-update')}
                  />
                  <StatusCard 
                    title="Pending" 
                    count={summary.status.pending} 
                    percentage={pendRate}
                    color="#06b6d4" // Cyan
                    onClick={() => navigate('/admin/task-update')}
                  />
                </div>
              </div>

              {/* Performance Summary (Takes up 4 columns) */}
              <div className="lg:col-span-4 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <h2 className="text-[18px] font-bold text-gray-900 mb-8">Completion Rate</h2>
                
                <div className="space-y-6">
                  <div className="relative pt-2">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-500 font-medium">Completed</span>
                      <span className="font-bold text-gray-800">{compRate}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6] rounded-full transition-all duration-1000" style={{ width: `${compRate}%` }} />
                    </div>
                  </div>
                  
                  <div className="relative pt-2">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-500 font-medium">In Progress</span>
                      <span className="font-bold text-gray-800">{inProgRate}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ec4899] rounded-full transition-all duration-1000" style={{ width: `${inProgRate}%` }} />
                    </div>
                  </div>
                  
                  <div className="relative pt-2">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-500 font-medium">Pending</span>
                      <span className="font-bold text-gray-800">{pendRate}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#06b6d4] rounded-full transition-all duration-1000" style={{ width: `${pendRate}%` }} />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-800">{totalWork}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8b5cf6]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Stats Block Below */}
            
           

          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;




// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getToken } from '../utils/auth';

// const DashboardHome = () => {
//   const navigate = useNavigate();

//   const [summary, setSummary] = useState({
//     status: { pending: 0, inProgress: 0, completed: 0 },
//     stats: { totalCustomers: 0, totalStaff: 0, totalPayments: 0, totalRevenue: 0 }
//   });
  
//   const [stats, setStats] = useState({
//     totalCustomers: 0,
//     totalStaff: 0,
//     totalPayments: 0,
//     revenueCollected: 0,
//   });
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const token = getToken();
//         const response = await fetch('/api/dashboard/summary', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) throw new Error('Failed to fetch dashboard summary');

//         const data = await response.json();
//         const safeData = {
//           status: {
//             pending: data?.status?.pending || 0,
//             inProgress: data?.status?.inProgress || 0,
//             completed: data?.status?.completed || 0,
//           },
//           stats: {
//             totalCustomers: data?.stats?.totalCustomers || 0,
//             totalStaff: data?.stats?.totalStaff || 0,
//             totalPayments: data?.stats?.totalPayments || 0,
//             totalRevenue: data?.stats?.totalRevenue || 0,
//           }
//         };

//         setSummary(safeData);
//         setStats({
//           totalCustomers: safeData.stats.totalCustomers,
//           totalStaff: safeData.stats.totalStaff,
//           totalPayments: safeData.stats.totalPayments,
//           revenueCollected: safeData.stats.totalRevenue,
//         });
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSummary();
//   }, []);

//   const totalWork = summary.status.pending + summary.status.inProgress + summary.status.completed;
//   const compRate = totalWork > 0 ? Math.round((summary.status.completed / totalWork) * 100) : 0;
//   const inProgRate = totalWork > 0 ? Math.round((summary.status.inProgress / totalWork) * 100) : 0;
//   const pendRate = totalWork > 0 ? Math.round((summary.status.pending / totalWork) * 100) : 0;

//   // Clean UI Components
//   const StatCard = ({ title, value, label }: { title: string; value: string; label?: string }) => (
//     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
//       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
//       <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
//       {label && <p className="text-xs text-indigo-500 font-medium mt-2">{label}</p>}
//     </div>
//   );

//   const ProgressRing = ({ count, percentage, color, title, onClick }: any) => (
//     <div onClick={onClick} className="flex flex-col items-center p-4 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
//       <div className="relative w-20 h-20 mb-3">
//         <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
//           <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
//           <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" className="transition-all duration-700" />
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">{count}</span>
//       </div>
//       <p className="text-sm font-semibold text-slate-600">{title}</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 px-6">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header */}
//         <header className="mb-10 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
//             <p className="text-slate-500 text-sm">Akshaya Center Management</p>
//           </div>
//           <div className="text-right hidden sm:block">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
//             <p className="text-sm font-medium text-emerald-500 flex items-center justify-end gap-1.5">
//               <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
//             </p>
//           </div>
//         </header>

//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
//             {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100" />)}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {/* Top Row: Primary Stats */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatCard title="Customers" value={stats.totalCustomers.toLocaleString()} label="Total registered" />
//               <StatCard title="Staff" value={stats.totalStaff.toLocaleString()} label="Active members" />
//               <StatCard title="Payments" value={stats.totalPayments.toLocaleString()} label="Successful txns" />
//               <StatCard title="Revenue" value={`₹${stats.revenueCollected.toLocaleString()}`} label="Total collected" />
//             </div>

//             {/* Middle Row: Analytics Hub */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
//                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8">Workload Distribution</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <ProgressRing title="Completed" count={summary.status.completed} percentage={compRate} color="#6366f1" onClick={() => navigate('/admin/task-update')} />
//                   <ProgressRing title="In Progress" count={summary.status.inProgress} percentage={inProgRate} color="#f43f5e" onClick={() => navigate('/admin/task-update')} />
//                   <ProgressRing title="Pending" count={summary.status.pending} percentage={pendRate} color="#0ea5e9" onClick={() => navigate('/admin/task-update')} />
//                 </div>
//               </div>

//               <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
//                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Efficiency</h2>
//                 <div className="space-y-5">
//                   {[
//                     { label: 'Completion Rate', val: compRate, color: 'bg-indigo-500' },
//                     { label: 'Response Time', val: 85, color: 'bg-emerald-500' },
//                   ].map((item, i) => (
//                     <div key={i}>
//                       <div className="flex justify-between text-xs font-bold mb-2">
//                         <span className="text-slate-500">{item.label}</span>
//                         <span>{item.val}%</span>
//                       </div>
//                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
//                         <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                   <div className="pt-4 mt-4 border-t border-slate-50">
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Current Load</p>
//                     <p className="text-2xl font-bold text-slate-800">{totalWork} <span className="text-xs font-medium text-slate-400">Total Tasks</span></p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row: Quick Summary */}
//             <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-wrap gap-y-6 justify-between items-center">
//               <div>
//                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Portfolio Value</p>
//                 <h4 className="text-3xl font-bold">₹{stats.revenueCollected.toLocaleString()}</h4>
//               </div>
//               <div className="flex gap-8">
//                 <div className="text-center">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase">Avg Ticket</p>
//                   <p className="text-lg font-bold">₹325</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase">Active Users</p>
//                   <p className="text-lg font-bold">{stats.totalCustomers}</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-slate-400 text-[10px] font-bold uppercase">Growth</p>
//                   <p className="text-lg font-bold text-emerald-400">+12%</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;



// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getToken } from '../utils/auth';

// const DashboardHome = () => {
//   const navigate = useNavigate();
//   const [summary, setSummary] = useState({
//     status: { pending: 0, inProgress: 0, completed: 0 },
//     stats: { totalCustomers: 0, totalStaff: 0, totalPayments: 0, totalRevenue: 0 }
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const token = getToken();
//         const response = await fetch('/api/dashboard/summary', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         const data = await response.json();
//         setSummary(data);
//       } catch (err) { console.error(err); } 
//       finally { setIsLoading(false); }
//     };
//     fetchSummary();
//   }, []);

//   if (isLoading) return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-gray-400">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-12 text-[#1A1A1A] font-sans selection:bg-orange-100">
//       <div className="max-w-[1400px] mx-auto">
        
//         {/* Top Bar */}
//         <header className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h1>
//             <p className="text-gray-400 text-sm mt-1 font-medium">Control your customers, staff, and payments.</p>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
//               <span className="opacity-50">⚡</span> Filters
//             </button>
//             <button className="px-5 py-2.5 bg-[#FF5F2E] text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-200 hover:bg-[#e85528] transition-all">
//               + Add Task
//             </button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* Left Column (5/12) */}
//           <div className="lg:col-span-5 space-y-8">
            
//             {/* Revenue Summary Card */}
//             <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-lg font-bold">Summary</h3>
//                   <p className="text-xs text-gray-400 font-medium">Track your performance.</p>
//                 </div>
//                 <select className="text-xs font-bold bg-gray-50 border-none rounded-lg p-2">
//                   <option>Monthly</option>
//                 </select>
//               </div>
              
//               <div className="flex gap-12 mb-8">
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
//                   <p className="text-2xl font-bold">₹{summary.stats.totalRevenue.toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
//                   <p className="text-2xl font-bold text-gray-400">₹{summary.stats.totalPayments.toLocaleString()}</p>
//                 </div>
//               </div>

//               {/* Decorative Bar Chart (Matching Reference) */}
//               <div className="flex items-end gap-3 h-24">
//                 {[40, 70, 45, 90, 60, 30, 50, 80].map((h, i) => (
//                   <div key={i} className="flex-1 flex flex-col gap-1">
//                     <div className="w-full bg-[#FF5F2E] rounded-full opacity-80" style={{ height: `${h}%` }} />
//                     <div className="w-full bg-gray-100 rounded-full" style={{ height: `${20}%` }} />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Statistics Mini Cards */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-3xl border border-gray-100">
//                 <p className="text-[11px] text-gray-400 font-bold uppercase mb-2">Total Staff</p>
//                 <p className="text-xl font-bold">{summary.stats.totalStaff}</p>
//                 <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +11.5%</p>
//               </div>
//               <div className="bg-white p-6 rounded-3xl border border-gray-100">
//                 <p className="text-[11px] text-gray-400 font-bold uppercase mb-2">Total Customers</p>
//                 <p className="text-xl font-bold">{summary.stats.totalCustomers}</p>
//                 <p className="text-[10px] text-rose-500 font-bold mt-1">↓ -4.2%</p>
//               </div>
//             </div>

//             {/* Business Management Prompt */}
//             <div className="bg-white p-8 rounded-3xl border border-gray-100 flex justify-between items-center relative overflow-hidden">
//                <p className="text-sm font-bold max-w-[150px]">How is your business management going?</p>
//                <button className="text-gray-300 hover:text-gray-900 transition-colors">✕</button>
//             </div>
//           </div>

//           {/* Right Column (7/12) */}
//           <div className="lg:col-span-7 space-y-8">
            
//             {/* Activity Overview */}
//             <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
//               <div className="flex justify-between items-center mb-8">
//                 <h3 className="text-lg font-bold text-gray-800">Activity</h3>
//                 <div className="flex gap-2">
//                   <div className="p-2 bg-gray-50 rounded-lg">⚙️</div>
//                   <div className="p-2 bg-gray-50 rounded-lg">↗️</div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <StatusSmallCard title="Completed" val={summary.status.completed} color="text-emerald-500" />
//                 <StatusSmallCard title="In Progress" val={summary.status.inProgress} color="text-orange-500" />
//                 <div className="bg-[#2D1B14] p-6 rounded-3xl text-white">
//                   <p className="text-[10px] font-bold opacity-60 uppercase mb-2">Pending</p>
//                   <p className="text-2xl font-bold">{summary.status.pending}</p>
//                   <div className="mt-4 h-6 w-full opacity-30 border-b-2 border-orange-500 rounded-full italic" />
//                 </div>
//               </div>
//             </div>

//             {/* Transaction History Table */}
//             <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
//               <div className="flex justify-between items-center mb-8">
//                 <h3 className="text-lg font-bold">Recent Updates</h3>
//                 <button className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100">⚙️</button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="text-[11px] font-bold text-gray-300 uppercase tracking-widest border-b border-gray-50">
//                       <th className="pb-4">Category</th>
//                       <th className="pb-4">Status</th>
//                       <th className="pb-4 text-right">Count</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm font-semibold">
//                     <tr className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
//                       <td className="py-5 flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-indigo-50" /> Customer List
//                       </td>
//                       <td className="py-5">
//                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">● Active</span>
//                       </td>
//                       <td className="py-5 text-right font-bold">{summary.stats.totalCustomers}</td>
//                     </tr>
//                     <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//                       <td className="py-5 flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-rose-50" /> Pending Tasks
//                       </td>
//                       <td className="py-5">
//                         <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold">● Warning</span>
//                       </td>
//                       <td className="py-5 text-right font-bold">{summary.status.pending}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper Component for the Activity Grid
// const StatusSmallCard = ({ title, val, color }: any) => (
//   <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
//     <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">{title}</p>
//     <p className={`text-2xl font-bold ${color}`}>{val}</p>
//     <div className="mt-4 h-6 w-full border-b border-gray-100" />
//   </div>
// );

// export default DashboardHome;



