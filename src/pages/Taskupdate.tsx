// // Full Working Code For Task Update .

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
// import { getToken } from "../utils/auth";
// import Notification, {
//   type NotificationType,
// } from "../components/Notification";

// import received_img from "../assets/received_img.png";
// import paid_img from "../assets/paid_img.png";

// type PaymentField = {
//   method?: string | null;
//   amount?: number | null;
//   updatedDate?: string | null;
//   isPaid?: boolean;
// };

// type Customer = {
//   _id: string;
//   entryDate: string;
//   customerName: string;
//   phoneNumber1: string;
//   workDetail: string;
//   assignedStaff?: {
//     _id: string;
//     fullname: string;
//     email: string;
//     phone: string;
//   };
//   submitDate?: string;
//   approvedDate?: string;
//   advanceIn?: PaymentField;
//   expenseOut?: PaymentField;
//   balance?: PaymentField;
//   outstanding?: PaymentField;
//   serviceCharge?: PaymentField;
//   status: "pending" | "inProgress" | "completed";
//   createdAt: string;
//   updatedAt: string;
// };

// interface NotificationState {
//   message: string;
//   type: NotificationType;
// }

// interface EditModalProps {
//   isOpen: boolean;
//   customer: Customer | null;
//   onConfirm: (status: string, approvedDate?: string, paymentData?: any) => void;
//   onCancel: () => void;
//   isUpdating: boolean;
// }

// // Expandable Text Component (UI State Only)
// const ExpandableText: React.FC<{ text?: string; maxLength?: number }> = ({
//   text,
//   maxLength = 60,
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   if (!text) return <span className="italic text-gray-400 p-3">-</span>;

//   if (text.length <= maxLength) {
//     return (
//       <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed break-words">
//         {text}
//       </p>
//     );
//   }

//   return (
//     <div className="text-sm leading-relaxed w-full">
//       <p className="text-gray-700 whitespace-pre-wrap inline break-words">
//         {isExpanded ? text : `${text.slice(0, maxLength)}...`}
//       </p>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           setIsExpanded(!isExpanded);
//         }}
//         className="ml-1.5 text-indigo-600 hover:text-indigo-800 text-[11px] uppercase font-bold tracking-wider hover:underline focus:outline-none transition-colors whitespace-nowrap"
//       >
//         {isExpanded ? "Show less" : "Show more"}
//       </button>
//     </div>
//   );
// };

// // Edit Status Modal Component
// const EditStatusModal: React.FC<EditModalProps> = ({
//   isOpen,
//   customer,
//   onConfirm,
//   onCancel,
//   isUpdating,
// }) => {
//   const [selectedStatus, setSelectedStatus] = useState<string>("pending");
//   const [selectedApprovedDate, setSelectedApprovedDate] = useState<string>("");
//   const [advanceInAmount, setAdvanceInAmount] = useState<string>("");
//   const [expenseOutAmount, setExpenseOutAmount] = useState<string>("");
//   const [balanceAmount, setBalanceAmount] = useState<string>("");
//   const [outstandingAmount, setOutstandingAmount] = useState<string>("");
//   const [serviceChargeAmount, setServiceChargeAmount] = useState<string>("");
//   const [markAsPaid, setMarkAsPaid] = useState<boolean>(false);
//   const [markAsReceived, setMarkAsReceived] = useState<boolean>(false);

//   console.log("balanceAmount", balanceAmount);
//   console.log("outstandingAmount", outstandingAmount);
//   useEffect(() => {
//     if (customer) {
//       setSelectedStatus(customer.status);
//       setSelectedApprovedDate(
//         customer.approvedDate
//           ? new Date(customer.approvedDate).toISOString().split("T")[0]
//           : "",
//       );
//       setAdvanceInAmount(
//         customer.advanceIn?.amount ? String(customer.advanceIn.amount) : "",
//       );
//       setExpenseOutAmount(
//         customer.expenseOut?.amount ? String(customer.expenseOut.amount) : "",
//       );
//       setServiceChargeAmount(
//         customer.serviceCharge?.amount
//           ? String(customer.serviceCharge.amount)
//           : "",
//       );
//       setBalanceAmount(
//         customer.balance?.amount ? String(customer.balance.amount) : "",
//       );
//       setOutstandingAmount(
//         customer.outstanding?.amount ? String(customer.outstanding.amount) : "",
//       );
//     }
//   }, [customer]);

//   if (!isOpen || !customer) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
//         onClick={onCancel}
//       />
//       <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md z-50 transform transition-all">
//         <div className="absolute right-4 top-4">
//           <button
//             onClick={onCancel}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <svg
//               className="h-5 w-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         <h2 className="text-xl font-semibold text-gray-900 mb-2">
//           Update Status
//         </h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Change the status and approval date for this task
//         </p>

//         <div className="mb-6 space-y-5">
//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//             <p className="text-sm font-medium text-gray-900 mb-1 break-words">
//               {customer.customerName}
//             </p>
//             <p className="text-sm text-gray-500 flex items-center gap-1">
//               <svg
//                 className="h-4 w-4 flex-shrink-0"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                 />
//               </svg>
//               <span className="break-words">{customer.phoneNumber1}</span>
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               disabled={isUpdating}
//               className="mt-1 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
//             >
//               <option value="pending">Pending</option>
//               <option value="inProgress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Approved Date
//             </label>
//             <input
//               type="date"
//               value={selectedApprovedDate}
//               onChange={(e) => setSelectedApprovedDate(e.target.value)}
//               disabled={isUpdating}
//               className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
//             />
//           </div>

//           {/* Payment Fields Section */}
//           <div className="pt-6 border-t border-gray-200">
//             <h3 className="text-sm font-semibold text-gray-900 mb-4">
//               Payment Details
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Advance In (₹)
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={advanceInAmount}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     // Allow empty or valid numbers (including decimal)
//                     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//                       setAdvanceInAmount(val);
//                     }
//                   }}
//                   disabled={isUpdating}
//                   readOnly
//                   placeholder="0"
//                   className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm bg-gray-50 cursor-not-allowed"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expense Out (₹)
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={expenseOutAmount}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//                       setExpenseOutAmount(val);
//                     }
//                   }}
//                   disabled={isUpdating}
//                   placeholder="0"
//                   className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Service Charge (₹)
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={serviceChargeAmount}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//                       setServiceChargeAmount(val);
//                     }
//                   }}
//                   disabled={isUpdating}
//                   placeholder="0"
//                   className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
//                 />
//               </div>

//               {/* Payment Status Indicator */}
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 {(() => {
//                   const advance =
//                     advanceInAmount === ""
//                       ? 0
//                       : parseFloat(advanceInAmount) || 0;
//                   const expense =
//                     expenseOutAmount === ""
//                       ? 0
//                       : parseFloat(expenseOutAmount) || 0;
//                   const service =
//                     serviceChargeAmount === ""
//                       ? 0
//                       : parseFloat(serviceChargeAmount) || 0;

//                   const outstanding =
//                     outstandingAmount === ""
//                       ? 0
//                       : parseFloat(outstandingAmount) || 0;
//                   const balance =
//                     balanceAmount === "" ? 0 : parseFloat(balanceAmount) || 0;
//                   const calculatedValue = expense + service - advance;

//                   return (
//                     <div>
//                       {balance === 0 && outstanding === 0 && (
//                         <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-200 w-full justify-center">
//                           <span className="text-sm font-semibold text-green-700">
//                             ✓ Payment Completed
//                           </span>
//                         </div>
//                       )}
//                       {balance > 0 && (
//                         <>
//                           <div>
//                             <div className="relative px-3 py-2 rounded-full bg-red-50 border border-red-200 w-full justify-center">
//                               <span className="text-sm font-semibold text-red-700">
//                                 Amount Due ₹
//                                 {Math.abs(calculatedValue).toFixed(0)}
//                               </span>
//                               {markAsReceived && (
//                                 <img
//                                   src={received_img}
//                                   alt="Paid"
//                                   className="h-20 w-20 absolute top-[-20px] right-35"
//                                 />
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-end mt-2">
//                             <input
//                               type="checkbox"
//                               id="refundable-due"
//                               value={String(markAsReceived)}
//                               onChange={() =>
//                                 setMarkAsReceived(!markAsReceived)
//                               }
//                               className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                             />
//                             <label
//                               htmlFor="refundable-due"
//                               className="mx-2 text-sm text-gray-700 font-medium"
//                             >
//                               Amount Received
//                             </label>
//                           </div>
//                         </>
//                       )}
//                       {outstanding > 0 && (
//                         <>
//                           <div>
//                             <div className="relative px-3 py-2 rounded-full bg-green-50 border border-green-200 w-full justify-center">
//                               <span className="text-sm font-semibold text-green-700">
//                                 Outstanding ₹
//                                 {Math.abs(calculatedValue).toFixed(0)}
//                               </span>
//                               {markAsPaid && (
//                                 <img
//                                   src={paid_img}
//                                   alt="Paid"
//                                   className="h-20 w-20 absolute top-[-20px] right-28"
//                                 />
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-end mt-2">
//                             <input
//                               type="checkbox"
//                               id="refundable-outstanding"
//                               value={String(markAsPaid)}
//                               onChange={() => setMarkAsPaid(!markAsPaid)}
//                               className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                             />
//                             <label
//                               htmlFor="refundable-outstanding"
//                               className="mx-2 text-sm text-gray-700 font-medium"
//                             >
//                               Amount Paid
//                             </label>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-8">
//           <button
//             onClick={() => {
//               setMarkAsPaid(false);
//               setMarkAsReceived(false);
//               onCancel();
//             }}
//             disabled={isUpdating}
//             className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               const paymentData = {
//                 cash:
//                   advanceInAmount === "" ? 0 : parseFloat(advanceInAmount) || 0,
//                 expenseOut:
//                   expenseOutAmount === ""
//                     ? 0
//                     : parseFloat(expenseOutAmount) || 0,
//                 serviceCharge:
//                   serviceChargeAmount === ""
//                     ? 0
//                     : parseFloat(serviceChargeAmount) || 0,
//                 markAsPaid,
//                 markAsReceived,
//               };
//               onConfirm(
//                 selectedStatus,
//                 selectedApprovedDate || undefined,
//                 paymentData,
//               );
//               setMarkAsPaid(false);
//               setMarkAsReceived(false);
//             }}
//             disabled={isUpdating}
//             className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2"
//           >
//             {isUpdating ? (
//               <>
//                 <svg
//                   className="animate-spin h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Saving...
//               </>
//             ) : (
//               "Save Changes"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Skeleton Loader
// const SkeletonLoader = () => (
//   <div className="space-y-6 py-4 w-full">
//     {[...Array(5)].map((_, i) => (
//       <div
//         key={i}
//         className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
//       >
//         <div className="flex-1 space-y-3 w-full">
//           <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
//           <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
//         </div>
//         <div className="flex-1 space-y-3 w-full">
//           <div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
//           <div className="h-4 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
//         </div>
//         <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
//       </div>
//     ))}
//   </div>
// );

// // Payment Status Badge Component
// const PaymentStatusBadge: React.FC<{ customer: Customer }> = ({ customer }) => {
//   const getPaymentStatus = () => {
//     const advanceAmount = customer.advanceIn?.amount
//       ? parseFloat(String(customer.advanceIn.amount))
//       : 0;
//     const expenseAmount = customer.expenseOut?.amount
//       ? parseFloat(String(customer.expenseOut.amount))
//       : 0;
//     const serviceAmount = customer.serviceCharge?.amount
//       ? parseFloat(String(customer.serviceCharge.amount))
//       : 0;

//     const outstandingAmount = customer.outstanding?.amount
//       ? parseFloat(String(customer.outstanding.amount))
//       : 0;
//     const balanceAmount = customer.balance?.amount
//       ? parseFloat(String(customer.balance.amount))
//       : 0;

//     // Check if balance or outstanding is marked as paid using isPaid flag
//     const isBalancePaid = customer.balance?.isPaid === true;
//     const isOutstandingPaid = customer.outstanding?.isPaid === true;

//     const calculatedValue = expenseAmount + serviceAmount - advanceAmount;

//     const paymentDates = [
//       customer.advanceIn?.updatedDate,
//       customer.expenseOut?.updatedDate,
//       customer.serviceCharge?.updatedDate,
//       customer.balance?.updatedDate,
//       customer.outstanding?.updatedDate,
//     ].filter((date): date is string => !!date);

//     const lastUpdatedDate =
//       paymentDates.length > 0
//         ? new Date(Math.max(...paymentDates.map((d) => new Date(d).getTime())))
//         : null;

//     return {
//       calculatedValue,
//       hasBalance: calculatedValue > 0,
//       hasOutstanding: calculatedValue < 0,
//       isCompleted: calculatedValue === 0,
//       advanceAmount,
//       expenseAmount,
//       serviceAmount,
//       outstandingAmount,
//       balanceAmount,
//       lastUpdatedDate,
//       isBalancePaid,
//       isOutstandingPaid,
//     };
//   };

//   const {
//     advanceAmount,
//     expenseAmount,
//     serviceAmount,
//     outstandingAmount,
//     balanceAmount,
//     lastUpdatedDate,
//     isBalancePaid,
//     isOutstandingPaid,
//   } = getPaymentStatus();
//   const hasPayments =
//     advanceAmount > 0 || expenseAmount > 0 || serviceAmount > 0;

//   return (
//     <div className="space-y-2 text-xs">
//       {hasPayments && (
//         <div className="space-y-1.5 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
//           {advanceAmount > 0 && (
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 font-medium">Advance In:</span>
//               <span className="font-semibold text-gray-800">
//                 ₹{advanceAmount.toFixed(0)}
//               </span>
//             </div>
//           )}
//           {expenseAmount > 0 && (
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 font-medium">Expense Out:</span>
//               <span className="font-semibold text-gray-800">
//                 ₹{expenseAmount.toFixed(0)}
//               </span>
//             </div>
//           )}
//           {serviceAmount > 0 && (
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 font-medium">Service Charge:</span>
//               <span className="font-semibold text-gray-800">
//                 ₹{serviceAmount.toFixed(0)}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {(balanceAmount === 0 && outstandingAmount === 0) ||
//       isBalancePaid ||
//       isOutstandingPaid ? (
//         <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 w-full justify-center">
//           <svg
//             className="h-3.5 w-3.5 text-emerald-600"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <span className="font-semibold text-emerald-700">
//             Payment Completed
//           </span>
//         </div>
//       ) : null}

//       {balanceAmount > 0 && (
//         <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 border border-red-200 w-full justify-center">
//           <span className="font-semibold text-red-700">
//             Amount Due ₹{Math.abs(balanceAmount).toFixed(0)}
//           </span>
//         </div>
//       )}
//       {outstandingAmount > 0 && (
//         <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 w-full justify-center">
//           <span className="font-semibold text-emerald-700">
//             Outstanding ₹{Math.abs(outstandingAmount).toFixed(0)}
//           </span>
//         </div>
//       )}

//       {lastUpdatedDate &&
//         ((balanceAmount === 0 && outstandingAmount === 0) ||
//           isBalancePaid ||
//           isOutstandingPaid) && (
//           <div className="text-[11px] text-gray-400 text-center mt-2">
//             Paid on:{" "}
//             <span className="font-medium text-gray-600">
//               {lastUpdatedDate.toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//             {" at "}
//             <span className="font-medium text-gray-600">
//               {lastUpdatedDate.toLocaleTimeString("en-IN", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
//             </span>
//           </div>
//         )}
//     </div>
//   );
// };

// // Status Badge Component
// const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
//   const statusConfig: Record<
//     string,
//     {
//       bg: string;
//       text: string;
//       ring: string;
//       icon: React.ReactNode;
//     }
//   > = {
//     pending: {
//       bg: "bg-amber-50",
//       text: "text-amber-700",
//       ring: "border-amber-200",
//       icon: (
//         <svg
//           className="h-3.5 w-3.5 flex-shrink-0"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       ),
//     },
//     inProgress: {
//       bg: "bg-indigo-50",
//       text: "text-indigo-700",
//       ring: "border-indigo-200",
//       icon: (
//         <svg
//           className="h-3.5 w-3.5 flex-shrink-0"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//           />
//         </svg>
//       ),
//     },
//     completed: {
//       bg: "bg-emerald-50",
//       text: "text-emerald-700",
//       ring: "border-emerald-200",
//       icon: (
//         <svg
//           className="h-3.5 w-3.5 flex-shrink-0"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       ),
//     },
//   };

//   const config = statusConfig[status] || {
//     bg: "bg-gray-50",
//     text: "text-gray-600",
//     ring: "border-gray-200",
//     icon: null,
//   };

//   const statusLabels: Record<string, string> = {
//     pending: "Pending",
//     inProgress: "In Progress",
//     completed: "Completed",
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide font-bold border ${config.bg} ${config.text} ${config.ring}`}
//     >
//       {config.icon}
//       <span className="truncate max-w-[80px] sm:max-w-none">
//         {statusLabels[status] || status}
//       </span>
//     </span>
//   );
// };

// // Mobile Customer Card Component
// const MobileCustomerCard: React.FC<{
//   customer: Customer;
//   onEdit: (customer: Customer) => void;
//   isUpdating: boolean;
//   formatDate: (dateStr?: string) => string;
// }> = ({ customer, onEdit, isUpdating, formatDate }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 hover:shadow-md transition-all">
//       <div className="flex justify-between items-start gap-2 mb-3">
//         <div className="min-w-0 flex-1">
//           <h3 className="font-semibold text-gray-900 break-words">
//             {customer.customerName}
//           </h3>
//           <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
//             <svg
//               className="h-4 w-4 text-gray-400 flex-shrink-0"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//               />
//             </svg>
//             <span className="break-words">{customer.phoneNumber1}</span>
//           </p>
//         </div>
//         <StatusBadge status={customer.status} />
//       </div>

//       <div className="bg-gray-50 rounded-lg p-3.5 mb-3 border border-gray-100">
//         <p className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
//           Description
//         </p>
//         <ExpandableText text={customer.workDetail} maxLength={80} />
//       </div>

//       <div className="grid grid-cols-2 gap-3 mb-4 text-sm bg-gray-50/50 rounded-lg p-3 border border-gray-100">
//         <div className="min-w-0">
//           <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
//             Assigned Staff
//           </p>
//           <p className="text-sm font-medium text-gray-800 flex items-center gap-1 mt-1">
//             <svg
//               className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//             <span
//               className="truncate"
//               title={customer.assignedStaff?.fullname || "Unassigned"}
//             >
//               {customer.assignedStaff?.fullname || "Unassigned"}
//             </span>
//           </p>
//         </div>
//         <div>
//           <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
//             Submit Date
//           </p>
//           <p className="text-sm font-medium text-gray-800 mt-1">
//             {formatDate(customer.submitDate)}
//           </p>
//         </div>
//         <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
//           <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
//             Approved Date
//           </p>
//           <p className="text-sm font-medium text-gray-800 mt-1">
//             {formatDate(customer.approvedDate)}
//           </p>
//         </div>
//       </div>

//       <div className="border-t border-gray-100 pt-3 mb-4">
//         <p className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">
//           Payment Status
//         </p>
//         <PaymentStatusBadge customer={customer} />
//       </div>

//       <button
//         onClick={() => onEdit(customer)}
//         disabled={isUpdating}
//         className="w-full rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
//       >
//         {isUpdating ? (
//           <>
//             <svg
//               className="animate-spin h-4 w-4 text-indigo-600 flex-shrink-0"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             <span>Updating...</span>
//           </>
//         ) : (
//           <>
//             <svg
//               className="h-4 w-4 flex-shrink-0"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//               />
//             </svg>
//             <span>Update Status</span>
//           </>
//         )}
//       </button>
//     </div>
//   );
// };

// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return "-";
//   const d = new Date(dateStr);
//   if (isNaN(d.getTime())) return "-";
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const ListCustomers = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "All" | "pending" | "inProgress" | "completed"
//   >("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [notification, setNotification] = useState<NotificationState | null>(
//     null,
//   );

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const [editModal, setEditModal] = useState<{
//     isOpen: boolean;
//     customer: Customer | null;
//   }>({
//     isOpen: false,
//     customer: null,
//   });
//   const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

//   const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   useEffect(() => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     searchTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => {
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     };
//   }, [searchTerm]);

//   const fetchCustomers = useCallback(async () => {
//     setIsLoading(true);

//     try {
//       const token = getToken();

//       if (!token) {
//         setNotification({
//           message: "Authentication required. Please log in again.",
//           type: "error",
//         });
//         setIsLoading(false);
//         return;
//       }

//       const params = new URLSearchParams();
//       if (debouncedSearchTerm.trim()) {
//         params.append("search", debouncedSearchTerm.trim());
//       }
//       if (statusFilter !== "All") {
//         params.append("status", statusFilter);
//       }
//       params.append("page", String(currentPage));
//       params.append("limit", String(itemsPerPage));

//       const queryString = params.toString();
//       const url = queryString
//         ? `/api/customers?${queryString}`
//         : "/api/customers";

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch customers (Status: ${response.status})`,
//         );
//       }

//       const data = await response.json();
//       const total = Number(data.count) || 0;
//       setTotalCount(total);

//       const totalPages = Math.ceil(total / itemsPerPage);
//       if (total > 0 && currentPage > totalPages) {
//         setCurrentPage(totalPages);
//         return;
//       }

//       setCustomers(data.customers || []);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to load customers";
//       setNotification({
//         message: errorMessage,
//         type: "error",
//       });
//       setCustomers([]);
//       setTotalCount(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [debouncedSearchTerm, statusFilter, currentPage]);

//   useEffect(() => {
//     if (currentPage !== 1) {
//       setCurrentPage(1);
//     }
//   }, [searchTerm, statusFilter]);

//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   const groupedCustomers = useMemo(() => {
//     const grouped: Record<string, Customer[]> = {};
//     customers.forEach((customer) => {
//       // ALWAYS use entryDate for grouping - NEVER use submitDate
//       // Ensure entryDate exists and is valid before grouping
//       if (!customer.entryDate) {
//         console.warn("Customer missing entryDate:", customer);
//         return; // Skip customers without entryDate
//       }

//       const entryDateObj = new Date(customer.entryDate);
//       const groupingKey = entryDateObj.toLocaleDateString("en-IN");

//       // Debug log to confirm grouping by entryDate (not submitDate)
//       console.debug(
//         `Grouping customer "${customer.customerName}" by entryDate: ${groupingKey}`,
//         {
//           entryDate: customer.entryDate,
//           submitDate: customer.submitDate,
//           groupingKey: groupingKey,
//         },
//       );

//       if (!grouped[groupingKey]) {
//         grouped[groupingKey] = [];
//       }
//       grouped[groupingKey].push(customer);
//     });

//     // Sort date groups in descending order (latest entry dates first)
//     const sortedDates = Object.keys(grouped).sort((a, b) => {
//       const dateA = new Date(a.split("-").reverse().join("-"));
//       const dateB = new Date(b.split("-").reverse().join("-"));
//       return dateB.getTime() - dateA.getTime();
//     });

//     console.log("Final grouped dates (in order):", sortedDates);

//     return { grouped, sortedDates };
//   }, [customers]);

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   const handleEdit = (customer: Customer) => {
//     setEditModal({ isOpen: true, customer });
//   };

//   const handleSaveStatus = async (
//     status: string,
//     approvedDate?: string,
//     paymentData?: any,
//   ) => {
//     if (!editModal.customer) return;

//     console.log("Saving status for customer:", editModal.customer);

//     setIsUpdatingId(editModal.customer._id);

//     try {
//       const token = getToken();

//       if (!token) {
//         setNotification({
//           message: "Authentication required. Please log in again.",
//           type: "error",
//         });
//         setIsUpdatingId(null);
//         return;
//       }

//       const body: any = { status };
//       if (approvedDate) body.approvedDate = approvedDate;

//       if (paymentData) {
//         body.cash = paymentData.cash;
//         body.expenseOut = paymentData.expenseOut;
//         body.serviceCharge = paymentData.serviceCharge;
//         // body.outstanding = editModal.customer.outstanding?.amount || 0;
//         // body.balance = editModal.customer.balance?.amount || 0;
//       }

//       if (paymentData?.markAsPaid) {
//         body.outstanding = 0;
//       }
//       if (paymentData?.markAsReceived) {
//         body.balance = 0;
//       }

//       console.log("body", body);

//       const response = await fetch(`/api/customers/${editModal.customer._id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to update customer (Status: ${response.status})`,
//         );
//       }

//       if (paymentData) {
//         setCustomers((prevCustomers) =>
//           prevCustomers.map((customer) =>
//             customer._id === editModal.customer?._id
//               ? {
//                   ...customer,
//                   status: status as "pending" | "inProgress" | "completed",
//                   approvedDate: approvedDate || customer.approvedDate,
//                   advanceIn: paymentData.cash
//                     ? { amount: paymentData.cash, method: "cash" }
//                     : customer.advanceIn,
//                   expenseOut: paymentData.expenseOut
//                     ? { amount: paymentData.expenseOut, method: "cash" }
//                     : customer.expenseOut,
//                   serviceCharge: paymentData.serviceCharge
//                     ? { amount: paymentData.serviceCharge, method: "cash" }
//                     : customer.serviceCharge,
//                 }
//               : customer,
//           ),
//         );
//       } else {
//         setCustomers((prevCustomers) =>
//           prevCustomers.map((customer) =>
//             customer._id === editModal.customer?._id
//               ? {
//                   ...customer,
//                   status: status as "pending" | "inProgress" | "completed",
//                   approvedDate: approvedDate || customer.approvedDate,
//                 }
//               : customer,
//           ),
//         );
//       }

//       await fetchCustomers();
//       window.dispatchEvent(new CustomEvent("taskStatusUpdated"));

//       setNotification({
//         message: "Customer status updated successfully!",
//         type: "success",
//       });

//       setEditModal({ isOpen: false, customer: null });
//       setTimeout(() => setNotification(null), 3000);
//     } catch (error) {
//       console.error("Error updating customer:", error);
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Failed to update customer status";
//       setNotification({
//         message: errorMessage,
//         type: "error",
//       });
//     } finally {
//       setIsUpdatingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 font-sans">
//       <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
//         {/* Header Section */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex items-center gap-3 mb-2 flex-wrap">
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b]">
//               Task Update
//             </h1>
//             {!isLoading && totalCount > 0 && (
//               <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
//                 {totalCount} total
//               </span>
//             )}
//           </div>
//           <p className="text-sm text-slate-500 ml-1">
//             Manage and track customer work orders, payments, and statuses.
//           </p>
//         </div>

//         {/* Search and Filter Section */}
//         {(totalCount > 0 || searchTerm !== "" || statusFilter !== "All") && (
//           <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   className="h-5 w-5 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search customers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full h-[44px] rounded-lg border border-slate-300 pl-10 pr-4 text-sm "
//               />
//             </div>

//             {/* Status Dropdown */}
//             <div className="relative w-full sm:w-[200px]">
//               <select
//                 value={statusFilter}
//                 onChange={(e) =>
//                   setStatusFilter(e.target.value as typeof statusFilter)
//                 }
//                 className="w-full h-[44px] appearance-none rounded-lg border border-slate-300 px-4 pr-10 text-sm bg-white focus:ring-2 transition-colors font-medium text-slate-700"
//               >
//                 <option value="All">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="inProgress">In Progress</option>
//                 <option value="completed">Completed</option>
//               </select>

//               <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                 <svg
//                   className="h-4 w-4 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Desktop Table View (hidden on mobile) */}
//         <div className="hidden md:block w-full">
//           {isLoading ? (
//             <SkeletonLoader />
//           ) : groupedCustomers.sortedDates.length > 0 ? (
//             groupedCustomers.sortedDates.map((date) => (
//               <div key={date} className="mb-10 last:mb-0 w-full">
//                 <div className="mb-4 flex items-center gap-3">
//                   <span className="inline-flex items-center rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-1.5 text-sm font-bold text-slate-700">
//                     {date}
//                   </span>
//                   <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></span>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full overflow-hidden">
//                   <table className="w-full divide-y divide-slate-200 min-w-[800px] lg:min-w-0 lg:table-fixed border-collapse">
//                     <thead className="bg-slate-50 border-b border-slate-200">
//                       <tr>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[18%]"
//                         >
//                           Customer Info
//                         </th>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[32%]"
//                         >
//                           Task Details
//                         </th>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[18%]"
//                         >
//                           Payment Status
//                         </th>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[12%]"
//                         >
//                           Timeline
//                         </th>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[10%]"
//                         >
//                           Status
//                         </th>
//                         <th
//                           scope="col"
//                           className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[10%]"
//                         >
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-200 bg-white">
//                       {groupedCustomers.grouped[date].map((customer, index) => (
//                         <tr
//                           key={customer._id}
//                           className={`${
//                             index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
//                           } hover:bg-indigo-50/40 transition-colors align-top`}
//                         >
//                           {/* 1. Customer + Phone */}
//                           <td className="py-4 px-4 align-top border-x border-slate-200">
//                             <div className="font-bold text-slate-900 text-base break-words">
//                               {customer.customerName}
//                             </div>
//                             <div className="text-slate-500 mt-1 flex items-center gap-1.5 text-sm font-medium">
//                               <svg
//                                 className="h-4 w-4 text-slate-400 flex-shrink-0"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                                 />
//                               </svg>
//                               <span className="break-words font-mono">
//                                 {customer.phoneNumber1}
//                               </span>
//                             </div>
//                           </td>

//                           {/* 2. Work Detail (Expandable) + Staff */}
//                           <td className="py-4 px-4 align-top border-x border-slate-200">
//                             <ExpandableText
//                               text={customer.workDetail}
//                               maxLength={60}
//                             />
//                             <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 max-w-full">
//                               <svg
//                                 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                                 />
//                               </svg>
//                               <span
//                                 className="truncate max-w-[150px]"
//                                 title={
//                                   customer.assignedStaff?.fullname ||
//                                   "Unassigned"
//                                 }
//                               >
//                                 {customer.assignedStaff?.fullname ||
//                                   "Unassigned"}
//                               </span>
//                             </div>
//                           </td>

//                           {/* 3. Payments */}
//                           <td className="py-4 px-4 align-top border-x border-slate-200">
//                             <PaymentStatusBadge customer={customer} />
//                           </td>

//                           {/* 4. Timeline (Submit + Approved) */}
//                           <td className="py-4 px-4 align-top border-x border-slate-200">
//                             <div className="flex flex-col gap-2 text-sm">
//                               <div>
//                                 <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-0.5">
//                                   Submit Date
//                                 </span>
//                                 <span className="font-medium text-slate-800 text-xs whitespace-nowrap">
//                                   {formatDate(customer.submitDate)}
//                                 </span>
//                               </div>
//                               <div>
//                                 <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-0.5">
//                                   Approved
//                                 </span>
//                                 <span className="font-medium text-slate-800 text-xs whitespace-nowrap">
//                                   {formatDate(customer.approvedDate)}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>

//                           {/* 5. Status */}
//                           <td className="py-4 px-4 align-top border-x border-slate-200">
//                             <StatusBadge status={customer.status} />
//                           </td>

//                           {/* 6. Actions */}
//                           <td className="py-4 px-4 text-center align-top border-x border-slate-200">
//                             <button
//                               onClick={() => handleEdit(customer)}
//                               disabled={isUpdatingId === customer._id}
//                               className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-all whitespace-nowrap w-full"
//                             >
//                               {isUpdatingId === customer._id ? (
//                                 <>
//                                   <svg
//                                     className="animate-spin h-4 w-4 flex-shrink-0"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <circle
//                                       className="opacity-25"
//                                       cx="12"
//                                       cy="12"
//                                       r="10"
//                                       stroke="currentColor"
//                                       strokeWidth="4"
//                                     ></circle>
//                                     <path
//                                       className="opacity-75"
//                                       fill="currentColor"
//                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     ></path>
//                                   </svg>
//                                   <span>...</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <svg
//                                     className="h-4 w-4 flex-shrink-0"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                                     />
//                                   </svg>
//                                   <span>Update</span>
//                                 </>
//                               )}
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//               <h3 className="mt-4 text-sm font-semibold text-slate-900">
//                 No tasks found
//               </h3>
//             </div>
//           )}
//         </div>

//         {/* Mobile Card View (visible only on mobile) */}
//         <div className="md:hidden">
//           {isLoading ? (
//             <SkeletonLoader />
//           ) : groupedCustomers.sortedDates.length > 0 ? (
//             groupedCustomers.sortedDates.map((date) => (
//               <div key={date} className="mb-8">
//                 <div className="mb-4 flex items-center gap-3">
//                   <span className="inline-flex items-center rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm">
//                     {date}
//                   </span>
//                   <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></span>
//                 </div>

//                 {groupedCustomers.grouped[date].map((customer) => (
//                   <MobileCustomerCard
//                     key={customer._id}
//                     customer={customer}
//                     onEdit={handleEdit}
//                     isUpdating={isUpdatingId === customer._id}
//                     formatDate={formatDate}
//                   />
//                 ))}
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
//               <svg
//                 className="mx-auto h-12 w-12 text-slate-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                 />
//               </svg>
//               <h3 className="mt-4 text-sm font-semibold text-slate-900">
//                 No tasks found
//               </h3>
//               <p className="mt-2 text-sm text-slate-500">
//                 Try adjusting your search or filter criteria
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {!isLoading && totalCount > 0 && (
//           <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
//             <p className="text-sm text-slate-600">
//               Showing{" "}
//               <span className="font-bold text-slate-900">
//                 {totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-bold text-slate-900">
//                 {Math.min(currentPage * itemsPerPage, totalCount)}
//               </span>{" "}
//               of <span className="font-bold text-slate-900">{totalCount}</span>{" "}
//               results
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 <svg
//                   className="h-4 w-4 flex-shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 <span className="hidden sm:inline">Previous</span>
//               </button>

//               <div className="hidden sm:flex gap-1">
//                 {[...Array(Math.min(totalPages, 5))].map((_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`relative inline-flex items-center justify-center min-w-[36px] px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
//                       currentPage === i + 1
//                         ? "bg-[#1e293b] text-white shadow-sm"
//                         : "text-slate-600 hover:bg-slate-50 bg-white border border-slate-300"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <svg
//                   className="h-4 w-4 flex-shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Modals & Notifications */}
//         <EditStatusModal
//           isOpen={editModal.isOpen}
//           customer={editModal.customer}
//           onConfirm={handleSaveStatus}
//           onCancel={() => {
//             setEditModal({ isOpen: false, customer: null });
//           }}
//           isUpdating={isUpdatingId !== null}
//         />

//         {notification && (
//           <div className="fixed bottom-4 right-4 z-50 animate-slide-up ">
//             <Notification
//               message={notification.message}
//               type={notification.type}
//               duration={notification.type === "success" ? 3000 : 4000}
//               onClose={() => setNotification(null)}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ListCustomers;

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";

import received_img from "../assets/received_img.png";
import paid_img from "../assets/paid_img.png";

type PaymentField = {
  method?: string | null;
  amount?: number | null;
  updatedDate?: string | null;
  isPaid?: boolean;
};

type Customer = {
  _id: string;
  entryDate: string;
  customerName: string;
  phoneNumber1: string;
  workDetail: string;
  assignedStaff?: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
  };
  submitDate?: string;
  approvedDate?: string;
  advanceIn?: PaymentField;
  expenseOut?: PaymentField;
  balance?: PaymentField;
  outstanding?: PaymentField;
  serviceCharge?: PaymentField;
  status: "pending" | "inProgress" | "completed";
  createdAt: string;
  updatedAt: string;
};

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface EditModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onConfirm: (status: string, approvedDate?: string, paymentData?: any) => void;
  onCancel: () => void;
  isUpdating: boolean;
}

// Expandable Text Component (UI State Only)
const ExpandableText: React.FC<{ text?: string; maxLength?: number }> = ({
  text,
  maxLength = 60,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return <span className="italic text-gray-400 p-3">-</span>;

  if (text.length <= maxLength) {
    return (
      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed break-words">
        {text}
      </p>
    );
  }

  return (
    <div className="text-sm leading-relaxed w-full">
      <p className="text-gray-700 whitespace-pre-wrap inline break-words">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="ml-1.5 text-indigo-600 hover:text-indigo-800 text-[11px] uppercase font-bold tracking-wider hover:underline focus:outline-none transition-colors whitespace-nowrap"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

// Edit Status Modal Component
const EditStatusModal: React.FC<EditModalProps> = ({
  isOpen,
  customer,
  onConfirm,
  onCancel,
  isUpdating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [selectedApprovedDate, setSelectedApprovedDate] = useState<string>("");
  const [advanceInAmount, setAdvanceInAmount] = useState<string>("");
  const [expenseOutAmount, setExpenseOutAmount] = useState<string>("");
  const [expenseOutMethod, setExpenseOutMethod] = useState<string>("");
  const [_balanceAmount, setBalanceAmount] = useState<string>("");
  const [_outstandingAmount, setOutstandingAmount] = useState<string>("");
  const [serviceChargeAmount, setServiceChargeAmount] = useState<string>("");
  const [serviceChargeMethod, setServiceChargeMethod] = useState<
    "cash" | "bank"
  >("cash");
  const [markAsPaid, setMarkAsPaid] = useState<boolean>(false);
  const [markAsReceived, setMarkAsReceived] = useState<boolean>(false);
  const [balanceMethod, setBalanceMethod] = useState<"cash" | "bank">("cash");
  const [outstandingMethod, setOutstandingMethod] = useState<"cash" | "bank">(
    "cash",
  );

  
  useEffect(() => {
    if (customer) {
      setSelectedStatus(customer.status);
      setSelectedApprovedDate(
        customer.approvedDate
          ? new Date(customer.approvedDate).toISOString().split("T")[0]
          : "",
      );
      setAdvanceInAmount(
        customer.advanceIn?.amount ? String(customer.advanceIn.amount) : "",
      );
      setExpenseOutAmount(
        customer.expenseOut?.amount ? String(customer.expenseOut.amount) : "",
      );
      setExpenseOutMethod(customer.expenseOut?.method || "");
      setServiceChargeAmount(
        customer.serviceCharge?.amount
          ? String(customer.serviceCharge.amount)
          : "",
      );
      setServiceChargeMethod(
        (customer.serviceCharge?.method as "cash" | "bank") || "cash",
      );
      setBalanceAmount(
        customer.balance?.amount ? String(customer.balance.amount) : "",
      );
      setBalanceMethod((customer.balance?.method as "cash" | "bank") || "cash");
      setOutstandingAmount(
        customer.outstanding?.amount ? String(customer.outstanding.amount) : "",
      );
      setOutstandingMethod(
        (customer.outstanding?.method as "cash" | "bank") || "cash",
      );
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md z-50 transform transition-all my-8">
        <div className="absolute right-4 top-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Update Status
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Change the status and approval date for this task
        </p>

        <div className="mb-6 space-y-5 max-h-[65vh] overflow-y-auto pr-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-1 break-words">
              {customer.customerName}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="break-words">{customer.phoneNumber1}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isUpdating}
              className="mt-1 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approved Date
            </label>
            <input
              type="date"
              value={selectedApprovedDate}
              onChange={(e) => setSelectedApprovedDate(e.target.value)}
              disabled={isUpdating}
              className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
            />
          </div>

          {/* Payment Fields Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Payment Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advance In (₹)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={advanceInAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty or valid numbers (including decimal)
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      setAdvanceInAmount(val);
                    }
                  }}
                  disabled={isUpdating}
                  readOnly
                  placeholder="0"
                  className="mt-1 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm bg-gray-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Out (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={expenseOutAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        setExpenseOutAmount(val);
                      }
                    }}
                    disabled={isUpdating}
                    placeholder="0"
                    className="mt-1 flex-1 block rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
                  />
                  <select
                    value={expenseOutMethod}
                    onChange={(e) => setExpenseOutMethod(e.target.value)}
                    disabled={
                      isUpdating ||
                      expenseOutAmount === "" ||
                      parseFloat(expenseOutAmount) === 0
                    }
                    className="mt-1 block px-3 py-2.5 rounded-xl border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm bg-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">GPay/Bank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Charge (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={serviceChargeAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        setServiceChargeAmount(val);
                      }
                    }}
                    disabled={isUpdating}
                    placeholder="0"
                    className="mt-1 flex-1 block rounded-xl border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm"
                  />
                  <select
                    value={serviceChargeMethod}
                    onChange={(e) =>
                      setServiceChargeMethod(e.target.value as "cash" | "bank")
                    }
                    disabled={isUpdating}
                    className="mt-1 block px-3 py-2.5 rounded-xl border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 shadow-sm bg-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">GPay/Bank</option>
                  </select>
                </div>
              </div>

              {/* Payment Status Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                {(() => {
                  const advance =
                    advanceInAmount === ""
                      ? 0
                      : parseFloat(advanceInAmount) || 0;
                  const expense =
                    expenseOutAmount === ""
                      ? 0
                      : parseFloat(expenseOutAmount) || 0;
                  const service =
                    serviceChargeAmount === ""
                      ? 0
                      : parseFloat(serviceChargeAmount) || 0;

                  // Recalculate balance and outstanding based on current input values
                  const calculatedValue = expense + service - advance;
                  const calculatedBalance =
                    calculatedValue >= 0 ? calculatedValue : 0;
                  const calculatedOutstanding =
                    calculatedValue < 0 ? Math.abs(calculatedValue) : 0;

                  const originalAdvance = customer.advanceIn?.amount ?? 0;
                  const originalExpense = customer.expenseOut?.amount ?? 0;
                  const originalService = customer.serviceCharge?.amount ?? 0;
                  const originalPaymentCompleted =
                    customer.balance?.isPaid === true ||
                    customer.outstanding?.isPaid === true;
                  const originalValuesUnchanged =
                    advance === originalAdvance &&
                    expense === originalExpense &&
                    service === originalService;

                  const showCompletedFromOriginalPayment =
                    originalPaymentCompleted && originalValuesUnchanged;

                  const hasPayments =
                    advance > 0 ||
                    expense > 0 ||
                    service > 0 ||
                    calculatedBalance > 0 ||
                    calculatedOutstanding > 0;

                  return (
                    <div>
                      {!hasPayments && !showCompletedFromOriginalPayment && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 w-full justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            No Payment Initiated
                          </span>
                        </div>
                      )}
                      {(showCompletedFromOriginalPayment ||
                        (hasPayments &&
                          calculatedBalance === 0 &&
                          calculatedOutstanding === 0)) && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-200 w-full justify-center">
                          <span className="text-sm font-semibold text-green-700">
                            ✓ Payment Completed
                          </span>
                        </div>
                      )}
                      {hasPayments &&
                        calculatedBalance > 0 &&
                        !showCompletedFromOriginalPayment && (
                          <>
                            <div>
                              <div className="relative px-3 py-2 rounded-full bg-red-50 border border-red-200 w-full justify-center">
                                <span className="text-sm font-semibold text-red-700">
                                  Amount Due ₹
                                  {Math.abs(calculatedValue).toFixed(0)}
                                </span>
                                {markAsReceived && (
                                  <img
                                    src={received_img}
                                    alt="Paid"
                                    className="h-20 w-20 absolute top-[-20px] right-4 sm:right-12"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="space-y-3 mt-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="refundable-due"
                                  value={String(markAsReceived)}
                                  onChange={() =>
                                    setMarkAsReceived(!markAsReceived)
                                  }
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                  htmlFor="refundable-due"
                                  className="ml-2 text-sm text-gray-700 font-medium"
                                >
                                  Amount Received
                                </label>
                              </div>
                              {markAsReceived && (
                                <select
                                  value={balanceMethod}
                                  onChange={(e) =>
                                    setBalanceMethod(
                                      e.target.value as "cash" | "bank",
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="block w-full px-3 py-2 rounded-lg border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm disabled:opacity-50 shadow-sm bg-white"
                                >
                                  <option value="cash">Cash</option>
                                  <option value="bank">GPay/Bank</option>
                                </select>
                              )}
                            </div>
                          </>
                        )}
                      {hasPayments &&
                        calculatedOutstanding > 0 &&
                        !showCompletedFromOriginalPayment && (
                          <>
                            <div>
                              <div className="relative px-3 py-2 rounded-full bg-green-50 border border-green-200 w-full justify-center">
                                <span className="text-sm font-semibold text-green-700">
                                  Outstanding ₹
                                  {Math.abs(calculatedValue).toFixed(0)}
                                </span>
                                {markAsPaid && (
                                  <img
                                    src={paid_img}
                                    alt="Paid"
                                    className="h-20 w-20 absolute top-[-20px] right-4 sm:right-12"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="space-y-3 mt-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="refundable-outstanding"
                                  value={String(markAsPaid)}
                                  onChange={() => setMarkAsPaid(!markAsPaid)}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label
                                  htmlFor="refundable-outstanding"
                                  className="ml-2 text-sm text-gray-700 font-medium"
                                >
                                  Amount Paid
                                </label>
                              </div>
                              {markAsPaid && (
                                <select
                                  value={outstandingMethod}
                                  onChange={(e) =>
                                    setOutstandingMethod(
                                      e.target.value as "cash" | "bank",
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="block w-full px-3 py-2 rounded-lg border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm disabled:opacity-50 shadow-sm bg-white"
                                >
                                  <option value="cash">Cash</option>
                                  <option value="bank">GPay/Bank</option>
                                </select>
                              )}
                            </div>
                          </>
                        )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => {
              setMarkAsPaid(false);
              setMarkAsReceived(false);
              onCancel();
            }}
            disabled={isUpdating}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const paymentData = {
                cash:
                  advanceInAmount === "" ? 0 : parseFloat(advanceInAmount) || 0,
                expenseOut:
                  expenseOutAmount === ""
                    ? 0
                    : parseFloat(expenseOutAmount) || 0,
                expenseOutMethod: expenseOutMethod || null,
                serviceCharge:
                  serviceChargeAmount === ""
                    ? 0
                    : parseFloat(serviceChargeAmount) || 0,
                serviceChargeMethod,
                balanceMethod,
                outstandingMethod,
                markAsPaid,
                markAsReceived,
              };
              onConfirm(
                selectedStatus,
                selectedApprovedDate || undefined,
                paymentData,
              );
              setMarkAsPaid(false);
              setMarkAsReceived(false);
            }}
            disabled={isUpdating}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isUpdating ? (
              <>
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="space-y-6 py-4 w-full">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
      >
        <div className="flex-1 space-y-3 w-full">
          <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 space-y-3 w-full">
          <div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    ))}
  </div>
);

// Payment Status Badge Component
const PaymentStatusBadge: React.FC<{ customer: Customer }> = ({ customer }) => {
  const getPaymentStatus = () => {
    const advanceAmount = customer.advanceIn?.amount
      ? parseFloat(String(customer.advanceIn.amount))
      : 0;
    const expenseAmount = customer.expenseOut?.amount
      ? parseFloat(String(customer.expenseOut.amount))
      : 0;
    const serviceAmount = customer.serviceCharge?.amount
      ? parseFloat(String(customer.serviceCharge.amount))
      : 0;

    const outstandingAmount = customer.outstanding?.amount
      ? parseFloat(String(customer.outstanding.amount))
      : 0;
    const balanceAmount = customer.balance?.amount
      ? parseFloat(String(customer.balance.amount))
      : 0;

    // Check if balance or outstanding is marked as paid using isPaid flag
    const isBalancePaid = customer.balance?.isPaid === true;
    const isOutstandingPaid = customer.outstanding?.isPaid === true;

    const calculatedValue = expenseAmount + serviceAmount - advanceAmount;

    const paymentDates = [
      customer.advanceIn?.updatedDate,
      customer.expenseOut?.updatedDate,
      customer.serviceCharge?.updatedDate,
      customer.balance?.updatedDate,
      customer.outstanding?.updatedDate,
    ].filter((date): date is string => !!date);

    const lastUpdatedDate =
      paymentDates.length > 0
        ? new Date(Math.max(...paymentDates.map((d) => new Date(d).getTime())))
        : null;

    return {
      calculatedValue,
      hasBalance: calculatedValue > 0,
      hasOutstanding: calculatedValue < 0,
      isCompleted: calculatedValue === 0,
      advanceAmount,
      expenseAmount,
      serviceAmount,
      outstandingAmount,
      balanceAmount,
      lastUpdatedDate,
      isBalancePaid,
      isOutstandingPaid,
    };
  };

  const {
    advanceAmount,
    expenseAmount,
    serviceAmount,
    outstandingAmount,
    balanceAmount,
    lastUpdatedDate,
    isBalancePaid,
    isOutstandingPaid,
  } = getPaymentStatus();
  const hasPayments =
    advanceAmount > 0 ||
    expenseAmount > 0 ||
    serviceAmount > 0 ||
    balanceAmount > 0 ||
    outstandingAmount > 0;

  return (
    <div className="space-y-2 text-xs">
      {!hasPayments && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200 w-full justify-center">
          <span className="font-semibold text-gray-700">
            No Payment Initiated
          </span>
        </div>
      )}
      {hasPayments && (
        <div className="space-y-1.5 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
          {advanceAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Advance In:</span>
              <span className="font-semibold text-gray-800">
                ₹{advanceAmount.toFixed(0)}
              </span>
            </div>
          )}
          {expenseAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Expense Out:</span>
              <span className="font-semibold text-gray-800">
                ₹{expenseAmount.toFixed(0)}
              </span>
            </div>
          )}
          {serviceAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Service Charge:</span>
              <span className="font-semibold text-gray-800">
                ₹{serviceAmount.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      )}

      {hasPayments &&
        ((balanceAmount === 0 && outstandingAmount === 0) ||
          isBalancePaid ||
          isOutstandingPaid) && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 w-full justify-center">
            <svg
              className="h-3.5 w-3.5 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-emerald-700">
              Payment Completed
            </span>
          </div>
        )}

      {hasPayments && balanceAmount > 0 && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 border border-red-200 w-full justify-center">
          <span className="font-semibold text-red-700">
            Amount Due ₹{Math.abs(balanceAmount).toFixed(0)}
          </span>
        </div>
      )}
      {hasPayments && outstandingAmount > 0 && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 w-full justify-center">
          <span className="font-semibold text-emerald-700">
            Outstanding ₹{Math.abs(outstandingAmount).toFixed(0)}
          </span>
        </div>
      )}

      {lastUpdatedDate &&
        hasPayments &&
        ((balanceAmount === 0 && outstandingAmount === 0) ||
          isBalancePaid ||
          isOutstandingPaid) && (
          <div className="text-[11px] text-gray-400 text-center mt-2">
            Paid on:{" "}
            <span className="font-medium text-gray-600">
              {lastUpdatedDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            {" at "}
            <span className="font-medium text-gray-600">
              {lastUpdatedDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        )}
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<
    string,
    {
      bg: string;
      text: string;
      ring: string;
      icon: React.ReactNode;
    }
  > = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "border-amber-200",
      icon: (
        <svg
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    inProgress: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      ring: "border-indigo-200",
      icon: (
        <svg
          className="h-3.5 w-3.5 flex-shrink-0"
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
      ),
    },
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "border-emerald-200",
      icon: (
        <svg
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    ring: "border-gray-200",
    icon: null,
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide font-bold border ${config.bg} ${config.text} ${config.ring}`}
    >
      {config.icon}
      <span className="truncate max-w-[80px] sm:max-w-none">
        {statusLabels[status] || status}
      </span>
    </span>
  );
};

// Mobile Customer Card Component
const MobileCustomerCard: React.FC<{
  customer: Customer;
  onEdit: (customer: Customer) => void;
  isUpdating: boolean;
  formatDate: (dateStr?: string) => string;
}> = ({ customer, onEdit, isUpdating, formatDate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 break-words">
            {customer.customerName}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <svg
              className="h-4 w-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="break-words">{customer.phoneNumber1}</span>
          </p>
        </div>
        <StatusBadge status={customer.status} />
      </div>

      <div className="bg-gray-50 rounded-lg p-3.5 mb-3 border border-gray-100">
        <p className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
          Description
        </p>
        <ExpandableText text={customer.workDetail} maxLength={80} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm bg-gray-50/50 rounded-lg p-3 border border-gray-100">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
            Assigned Staff
          </p>
          <p className="text-sm font-medium text-gray-800 flex items-center gap-1 mt-1">
            <svg
              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span
              className="truncate"
              title={customer.assignedStaff?.fullname || "Unassigned"}
            >
              {customer.assignedStaff?.fullname || "Unassigned"}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
            Submit Date
          </p>
          <p className="text-sm font-medium text-gray-800 mt-1">
            {formatDate(customer.submitDate)}
          </p>
        </div>
        <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
          <p className="text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
            Approved Date
          </p>
          <p className="text-sm font-medium text-gray-800 mt-1">
            {formatDate(customer.approvedDate)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-4">
        <p className="text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-wider">
          Payment Status
        </p>
        <PaymentStatusBadge customer={customer} />
      </div>

      <button
        onClick={() => onEdit(customer)}
        disabled={isUpdating}
        className="w-full rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {isUpdating ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-indigo-600 flex-shrink-0"
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
            <span>Updating...</span>
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span>Update Status</span>
          </>
        )}
      </button>
    </div>
  );
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ListCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "pending" | "inProgress" | "completed"
  >("All");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    customer: Customer | null;
  }>({
    isOpen: false,
    customer: null,
  });
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm]);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim());
      }
      if (statusFilter !== "All") {
        params.append("status", statusFilter);
      }
      params.append("page", String(currentPage));
      params.append("limit", String(itemsPerPage));

      const queryString = params.toString();
      const url = queryString
        ? `/api/customers?${queryString}`
        : "/api/customers";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch customers (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      const total = Number(data.count) || 0;
      setTotalCount(total);

      const totalPages = Math.ceil(total / itemsPerPage);
      if (total > 0 && currentPage > totalPages) {
        setCurrentPage(totalPages);
        return;
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load customers";
      setNotification({
        message: errorMessage,
        type: "error",
      });
      setCustomers([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const groupedCustomers = useMemo(() => {
    const grouped: Record<string, Customer[]> = {};
    customers.forEach((customer) => {
      if (!customer.entryDate) {
        console.warn("Customer missing entryDate:", customer);
        return;
      }

      const entryDateObj = new Date(customer.entryDate);
      const groupingKey = entryDateObj.toLocaleDateString("en-IN");

      if (!grouped[groupingKey]) {
        grouped[groupingKey] = [];
      }
      grouped[groupingKey].push(customer);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a.split("-").reverse().join("-"));
      const dateB = new Date(b.split("-").reverse().join("-"));
      return dateB.getTime() - dateA.getTime();
    });

    return { grouped, sortedDates };
  }, [customers]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleEdit = (customer: Customer) => {
    setEditModal({ isOpen: true, customer });
  };

  const handleSaveStatus = async (
    status: string,
    approvedDate?: string,
    paymentData?: any,
  ) => {
    if (!editModal.customer) return;

    setIsUpdatingId(editModal.customer._id);

    try {
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication required. Please log in again.",
          type: "error",
        });
        setIsUpdatingId(null);
        return;
      }

      const body: any = { status };
      if (approvedDate) body.approvedDate = approvedDate;

      if (paymentData) {
        body.cash = paymentData.cash;
        body.expenseOut = paymentData.expenseOut;
        body.expenseOutMethod = paymentData.expenseOutMethod;
        body.serviceCharge = paymentData.serviceCharge;
        body.serviceChargeMethod = paymentData.serviceChargeMethod;
      }

      if (paymentData?.markAsPaid) {
        body.outstanding = 0;
        body.outstandingMethod = paymentData.outstandingMethod;
      }
      if (paymentData?.markAsReceived) {
        body.balance = 0;
        body.balanceMethod = paymentData.balanceMethod;
      }

      const response = await fetch(`/api/customers/${editModal.customer._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update customer (Status: ${response.status})`,
        );
      }

      if (paymentData) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === editModal.customer?._id
              ? {
                  ...customer,
                  status: status as "pending" | "inProgress" | "completed",
                  approvedDate: approvedDate || customer.approvedDate,
                  advanceIn: paymentData.cash
                    ? { amount: paymentData.cash, method: "cash" }
                    : customer.advanceIn,
                  expenseOut: paymentData.expenseOut
                    ? { amount: paymentData.expenseOut, method: "cash" }
                    : customer.expenseOut,
                  serviceCharge: paymentData.serviceCharge
                    ? {
                        amount: paymentData.serviceCharge,
                        method: paymentData.serviceChargeMethod,
                      }
                    : customer.serviceCharge,
                }
              : customer,
          ),
        );
      } else {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === editModal.customer?._id
              ? {
                  ...customer,
                  status: status as "pending" | "inProgress" | "completed",
                  approvedDate: approvedDate || customer.approvedDate,
                }
              : customer,
          ),
        );
      }

      await fetchCustomers();
      window.dispatchEvent(new CustomEvent("taskStatusUpdated"));

      setNotification({
        message: "Customer status updated successfully!",
        type: "success",
      });

      setEditModal({ isOpen: false, customer: null });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating customer:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update customer status";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 font-sans">
      {/* Changed max-w-[90%] to w-full lg:max-w-[90%] so mobile utilizes screen width */}
      <div className="w-full lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b]">
              Task Update
            </h1>
            {!isLoading && totalCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
                {totalCount} total
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 ml-1">
            Manage and track customer work orders, payments, and statuses.
          </p>
        </div>

        {/* Search and Filter Section */}
        {(totalCount > 0 || searchTerm !== "" || statusFilter !== "All") && (
          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[44px] rounded-lg border border-slate-300 pl-10 pr-4 text-sm "
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative w-full sm:w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="w-full h-[44px] appearance-none cursor-pointer rounded-lg border border-slate-300 px-4 pr-10 text-sm bg-white focus:ring-2 transition-colors font-medium text-slate-700"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block w-full">
          {isLoading ? (
            <SkeletonLoader />
          ) : groupedCustomers.sortedDates.length > 0 ? (
            groupedCustomers.sortedDates.map((date) => (
              <div key={date} className="mb-10 last:mb-0 w-full">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-1.5 text-sm font-bold text-slate-700">
                    {date}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></span>
                </div>

                {/* Changed overflow-hidden to overflow-x-auto to prevent clipping on tablets */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full overflow-x-auto">
                  <table className="w-full divide-y divide-slate-200 min-w-[800px] lg:min-w-0 lg:table-fixed border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[15%]"
                        >
                          Customer Info
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[30%]"
                        >
                          Task Details
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[15%]"
                        >
                          Payment Status
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[12%]"
                        >
                          Timeline
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[13%]"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-x border-slate-200 lg:w-[15%]"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {groupedCustomers.grouped[date].map((customer, index) => (
                        <tr
                          key={customer._id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          } hover:bg-indigo-50/40 transition-colors align-top`}
                        >
                          <td className="py-4 px-4 align-top border-x border-slate-200">
                            <div className="font-bold text-slate-900 text-base break-words">
                              {customer.customerName}
                            </div>
                            <div className="text-slate-500 mt-1 flex items-center gap-1.5 text-sm font-medium">
                              <svg
                                className="h-4 w-4 text-slate-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span className="break-words font-mono">
                                {customer.phoneNumber1}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-top border-x border-slate-200">
                            <ExpandableText
                              text={customer.workDetail}
                              maxLength={60}
                            />
                            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 max-w-full">
                              <svg
                                className="h-3.5 w-3.5 text-slate-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span
                                className="truncate max-w-[150px]"
                                title={
                                  customer.assignedStaff?.fullname ||
                                  "Unassigned"
                                }
                              >
                                {customer.assignedStaff?.fullname ||
                                  "Unassigned"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-top border-x border-slate-200">
                            <PaymentStatusBadge customer={customer} />
                          </td>
                          <td className="py-4 px-4 align-top border-x border-slate-200">
                            <div className="flex flex-col gap-2 text-sm">
                              <div>
                                <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-0.5">
                                  Submit Date
                                </span>
                                <span className="font-medium text-slate-800 text-xs whitespace-nowrap">
                                  {formatDate(customer.submitDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-0.5">
                                  Approved
                                </span>
                                <span className="font-medium text-slate-800 text-xs whitespace-nowrap">
                                  {formatDate(customer.approvedDate)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-top border-x border-slate-200">
                            {/* Ensured the status badge wraps or has enough space */}
                            <div className="flex flex-col gap-2 items-start">
                              <StatusBadge status={customer.status} />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center align-top border-x border-slate-200">
                            {/* Allowed the button to take up available space nicely */}
                            <button
                              onClick={() => handleEdit(customer)}
                              disabled={isUpdatingId === customer._id}
                              className="inline-flex items-center cursor-pointer justify-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-all whitespace-nowrap w-full lg:w-auto"
                            >
                              {isUpdatingId === customer._id ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 flex-shrink-0"
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
                                  <span>...</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="h-4 w-4 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                  <span>Update</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No tasks found
              </h3>
            </div>
          )}
        </div>

        {/* Mobile Card View (visible only on mobile) */}
        <div className="md:hidden">
          {isLoading ? (
            <SkeletonLoader />
          ) : groupedCustomers.sortedDates.length > 0 ? (
            groupedCustomers.sortedDates.map((date) => (
              <div key={date} className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm">
                    {date}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></span>
                </div>

                {groupedCustomers.grouped[date].map((customer) => (
                  <MobileCustomerCard
                    key={customer._id}
                    customer={customer}
                    onEdit={handleEdit}
                    isUpdating={isUpdatingId === customer._id}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No tasks found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalCount > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
            {/* Added text-center sm:text-left for cleaner mobile alignment */}
            <p className="text-sm text-slate-600 text-center sm:text-left">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900">
                {Math.min(currentPage * itemsPerPage, totalCount)}
              </span>{" "}
              of <span className="font-bold text-slate-900">{totalCount}</span>{" "}
              results
            </p>
            {/* Added w-full sm:w-auto justify-center sm:justify-end */}
            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="hidden sm:flex gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center justify-center min-w-[36px] px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-[#1e293b] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 bg-white border border-slate-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modals & Notifications */}
        <EditStatusModal
          isOpen={editModal.isOpen}
          customer={editModal.customer}
          onConfirm={handleSaveStatus}
          onCancel={() => {
            setEditModal({ isOpen: false, customer: null });
          }}
          isUpdating={isUpdatingId !== null}
        />

        {notification && (
          <div className="fixed bottom-4 right-4 z-50 animate-slide-up ">
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.type === "success" ? 3000 : 4000}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCustomers;
