import { useState, useEffect, useRef } from "react";
import { getToken } from "../utils/auth";
import Pagination from "../components/Pagination";

type PaymentRecord = {
  _id: string;
  entryDate: string;
  customerName: string;
  workDescription: string;
  cash: number;
  cashMethod: "cash" | "bank" | null;
  expenseOut: number;
  expenseOutMethod: "cash" | "bank" | null;
  serviceCharge: number;
  serviceChargeMethod: "cash" | "bank" | null;
  balance: number;
  balanceMethod: "cash" | "bank" | null;
  balanceIsPaid?: boolean; // Flag indicating if balance is marked as paid
  balanceUpdatedDate?: string; // When balance was marked as paid
  outstanding: number;
  outstandingMethod: "cash" | "bank" | null;
  outstandingIsPaid?: boolean; // Flag indicating if outstanding is marked as paid
  outstandingUpdatedDate?: string; // When outstanding was marked as paid
  isPettyCash?: boolean; // Flag indicating if this is a petty cash entry
  createdAt: string;
  updatedAt: string;
};

type PaymentSummary = {
  totalCash: number;
  totalExpenseOut: number;
  totalServiceCharge: number;
  totalBalance: number;
  totalOutstanding: number;
  count: number;
};

// ExpandableText Component
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

const ListPayments = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Summary State - store summaries for each date
  const [summaries, setSummaries] = useState<{ [key: string]: PaymentSummary }>(
    {},
  );
  const summariesFetchedRef = useRef<Set<string>>(new Set());

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchPayments = async (page: number) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `/api/customers/payment-history?page=${page}&limit=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      // Handle new API response format
      const responseData = data.data || {};
      const paymentList = responseData.records || [];
      const summaries = responseData.summaries || {};
      const pagination = responseData.pagination || {};
      const total = pagination.totalRecords || 0;

      setPayments(paymentList);
      setTotalCount(total);
      setCurrentPage(page);

      // Set summaries from API response
      setSummaries(summaries);
      // Mark all summaries as fetched
      Object.keys(summaries).forEach((dateKey) => {
        summariesFetchedRef.current.add(dateKey);
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPayments(newPage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderPaymentWithMethod = (
    amount: number,
    method: "cash" | "bank" | null,
    isPaid?: boolean,
    updatedDate?: string,
    advanceIn?: number,
    expenseOut?: number,
    serviceCharge?: number,
    isBal?: boolean,
  ) => {
    // If isPaid is true, recalculate the original amount instead of showing 0
    let displayAmount = amount;
    if (isPaid && isBal) {
      // For balance: calculate as (expenseOut + serviceCharge) - advanceIn
      displayAmount =
        (expenseOut || 0) + (serviceCharge || 0) - (advanceIn || 0);
      if (displayAmount < 0) displayAmount = 0;
    } else if (isPaid && !isBal) {
      // For outstanding: calculate as Math.abs((expenseOut + serviceCharge) - advanceIn) if negative
      const calculated =
        (expenseOut || 0) + (serviceCharge || 0) - (advanceIn || 0);
      displayAmount = calculated < 0 ? Math.abs(calculated) : 0;
    }

    if (displayAmount <= 0 && !isPaid) return "-";

    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center justify-end gap-2">
          <span>{formatCurrency(displayAmount)}</span>
          {method && (
            <span
              className={`px-2 py-0.5  text-[10px] md:text-xs font-semibold  whitespace-nowrap ${
                method === "cash" ? " text-emerald-700 " : " text-blue-700 "
              }`}
            >
              {method === "cash" ? "Cash" : " Bank/UPI"}
            </span>
          )}
        </div>
        {isPaid && updatedDate && (
          <span className="text-[9px] md:text-[10px] text-emerald-600 font-semibold whitespace-nowrap">
            Paid on {formatEditedDate(updatedDate)}
          </span>
        )}
      </div>
    );
  };

  const formatEditedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupPaymentsByDate = () => {
    const grouped: { [key: string]: PaymentRecord[] } = {};
    payments.forEach((payment) => {
      const dateObj = new Date(payment.entryDate);
      const dateKey = !isNaN(dateObj.getTime())
        ? dateObj.toISOString().split("T")[0]
        : "Unknown Date";

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(payment);
    });
    return grouped;
  };

  const groupedPayments = groupPaymentsByDate();

  const sortedDates = Object.keys(groupedPayments).sort((a, b) => {
    if (a === "Unknown Date") return 1;
    if (b === "Unknown Date") return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const formatDisplayDate = (dateString: string) => {
    if (dateString === "Unknown Date") return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  let currentSlNo = (currentPage - 1) * pageSize + 1;

  return (
    <div className="min-h-screen bg-slate-50 py-4 md:py-8">
      <div className="w-full max-w-[90%] mx-auto px-4 sm:px-4 lg:px-6">
        {/* Toast Notification Container */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 animate-bounce-in">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1">
              <div className="h-6 w-1 md:h-8 md:w-1.5  rounded-full"></div>
              <h1 className="text-xl md:text-3xl font-bold text-slate-900 ">
                Payment History
              </h1>
            </div>
            <p className="text-slate-500 text-sm md:text-base ml-3 md:ml-4">
              Review and manage all customer transactions.
            </p>
          </div>
          <div className="bg-blue-50 px-3 md:px-4 py-2 rounded-lg border border-blue-100 self-start md:self-auto w-full md:w-auto text-center md:text-left">
            <p className="text-sm font-semibold text-blue-800">
              Total Records: <span className="font-bold">{totalCount}</span>
            </p>
          </div>
        </div>

        {!isLoading && payments.length === 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 px-4 py-16 md:py-20 text-center flex flex-col items-center">
            <h3 className="text-base md:text-sm font-semibold text-slate-900 mb-1">
              No payments found
            </h3>
          </div>
        )}

        {!isLoading && payments.length > 0 && (
          <div className="space-y-6 md:space-y-8">
            {sortedDates.map((dateKey) => {
              const dateSummary = summaries[dateKey];

              return (
                <div
                  key={dateKey}
                  className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative"
                >
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
                    <h3 className="text-sm md:text-lg font-bold text-slate-900">
                      {formatDisplayDate(dateKey)}
                    </h3>
                    <span className="text-[10px] md:text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 md:px-3 py-1 rounded-full border border-slate-200">
                      {groupedPayments[dateKey].length} Entry
                      {groupedPayments[dateKey].length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Payment Table with Integrated Totals and Vertical Lines */}
                  <div className="hidden lg:block overflow-x-auto w-full">
                    <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
                      <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold w-16 border-x border-slate-200 text-center">
                            #
                          </th>
                          <th className="px-6 py-4 font-semibold border-x border-slate-200">
                            Customer
                          </th>
                          <th className="px-6 py-4 font-semibold border-x border-slate-200">
                            Work Description
                          </th>
                          <th className="px-6 py-4 font-semibold text-right border-x border-slate-200">
                            Advance in
                          </th>
                          <th className="px-6 py-4 font-semibold text-right border-x border-slate-200">
                            Expense Out
                          </th>
                          <th className="px-6 py-4 font-semibold text-right border-x border-slate-200">
                            Service Charge
                          </th>
                          <th className="px-6 py-4 font-semibold text-right border-x border-slate-200">
                            Balance
                          </th>
                          <th className="px-6 py-4 font-semibold text-right border-x border-slate-200">
                            Outstanding
                          </th>

                          {/* <th className="px-6 py-4 font-semibold text-center border-x border-slate-200">Mode</th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {groupedPayments[dateKey].map((payment) => {
                          return (
                            <tr
                              key={payment._id}
                              className="hover:bg-blue-50/40 transition-colors group"
                            >
                              <td className="px-6 py-4 text-slate-400 font-mono text-sm border-x border-slate-100 text-center">
                                {String(currentSlNo++).padStart(2, "0")}
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-900 border-x border-slate-100">
                                <div className="flex items-center gap-2">
                                  <span>
                                    {payment.customerName ||
                                      (payment as any).customerId
                                        ?.customerName ||
                                      "-"}
                                  </span>
                                  {payment.isPettyCash && (
                                    <span className="inline-flex items-center px-2 py-0.5  text-xs font-medium  text-orange-800 ">
                                      (Petty Cash)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 border-x border-slate-100">
                                <ExpandableText
                                  text={payment.workDescription}
                                  maxLength={60}
                                />
                              </td>
                              <td className="px-6 py-4 text-right border-x border-slate-100">
                                {renderPaymentWithMethod(
                                  payment.cash,
                                  payment.cashMethod,
                                )}
                              </td>
                              <td className="px-6 py-4 text-right border-x border-slate-100">
                                {renderPaymentWithMethod(
                                  payment.expenseOut,
                                  payment.expenseOutMethod,
                                )}
                              </td>
                              <td className="px-6 py-4 text-right border-x border-slate-100">
                                {renderPaymentWithMethod(
                                  payment.serviceCharge,
                                  payment.serviceChargeMethod,
                                )}
                              </td>
                              <td className="px-6 py-4 text-right text-red-600 border-x border-slate-100">
                                {renderPaymentWithMethod(
                                  payment.balance,
                                  payment.balanceMethod,
                                  payment.balanceIsPaid,
                                  payment.balanceUpdatedDate,
                                  payment.cash,
                                  payment.expenseOut,
                                  payment.serviceCharge,
                                  true,
                                )}
                              </td>
                              <td className="px-6 py-4 text-right text-green-600 border-x border-slate-100">
                                {renderPaymentWithMethod(
                                  payment.outstanding,
                                  payment.outstandingMethod,
                                  payment.outstandingIsPaid,
                                  payment.outstandingUpdatedDate,
                                  payment.cash,
                                  payment.expenseOut,
                                  payment.serviceCharge,
                                  false,
                                )}
                              </td>

                              {/* <td className="px-6 py-4 text-center border-x border-slate-100">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-700 border-slate-200">
                Task
              </span>
            </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Table Footer showing Totals with Vertical Lines */}
                      {dateSummary && (
                        <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                          <tr>
                            <td
                              colSpan={3}
                              className="px-6 py-4 text-right uppercase text-xs tracking-wider border-x border-slate-200"
                            >
                              Daily Total:
                            </td>
                            <td className="px-6 py-4 text-right border-x border-slate-200">
                              {formatCurrency(dateSummary.totalCash)}
                            </td>
                            <td className="px-6 py-4 text-right text-blue-600 border-x border-slate-200">
                              {formatCurrency(dateSummary.totalExpenseOut)}
                            </td>
                            <td className="px-6 py-4 text-right text-yellow-600 border-x border-slate-200">
                              {formatCurrency(dateSummary.totalServiceCharge)}
                            </td>
                            <td className="px-6 py-4 text-right text-red-600 border-x border-slate-200">
                              {formatCurrency(dateSummary.totalBalance)}
                            </td>
                            <td className="px-6 py-4 text-right text-green-600 border-x border-slate-200">
                              {formatCurrency(dateSummary.totalOutstanding)}
                            </td>
                            <td
                              colSpan={1}
                              className="bg-slate-50 border-x border-slate-200"
                            ></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  {/* Mobile/Tablet Card Layout */}
                  <div className="lg:hidden">
                    {groupedPayments[dateKey].map((payment, index) => {
                      const mobileSlNo =
                        (currentPage - 1) * pageSize + index + 1;
                      return (
                        <div
                          key={payment._id}
                          className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Header Section */}
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-mono text-sm bg-slate-100 px-3 py-1 rounded-full">
                                #{String(mobileSlNo).padStart(2, "0")}
                              </span>
                              {payment.isPettyCash && (
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-orange-800 bg-orange-50 rounded-full border border-orange-200">
                                  Petty Cash
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Customer Name */}
                          <div className="mb-3">
                            <h4 className="text-lg font-semibold text-slate-900 leading-tight">
                              {payment.customerName ||
                                (payment as any).customerId?.customerName ||
                                "-"}
                            </h4>
                          </div>

                          {/* Work Description */}
                          <div className="mb-4">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                              Work Description
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                              <ExpandableText
                                text={payment.workDescription}
                                maxLength={100}
                              />
                            </div>
                          </div>

                          {/* Payment Details - Single Column Layout */}
                          <div className="space-y-3">
                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                              Payment Details
                            </div>

                            {/* Advance In */}
                            <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                              <span className="text-sm font-medium text-blue-900">
                                Advance In
                              </span>
                              <div className="text-right">
                                {renderPaymentWithMethod(
                                  payment.cash,
                                  payment.cashMethod,
                                )}
                              </div>
                            </div>

                            {/* Expense Out */}
                            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-sm font-medium text-slate-900">
                                Expense Out
                              </span>
                              <div className="text-right">
                                {renderPaymentWithMethod(
                                  payment.expenseOut,
                                  payment.expenseOutMethod,
                                )}
                              </div>
                            </div>

                            {/* Service Charge */}
                            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="text-sm font-medium text-slate-900">
                                Service Charge
                              </span>
                              <div className="text-right">
                                {renderPaymentWithMethod(
                                  payment.serviceCharge,
                                  payment.serviceChargeMethod,
                                )}
                              </div>
                            </div>

                            {/* Balance */}
                            <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                              <span className="text-sm font-medium text-red-900">
                                Balance
                              </span>
                              <div className="text-right">
                                {renderPaymentWithMethod(
                                  payment.balance,
                                  payment.balanceMethod,
                                  payment.balanceIsPaid,
                                  payment.balanceUpdatedDate,
                                  payment.cash,
                                  payment.expenseOut,
                                  payment.serviceCharge,
                                  true,
                                )}
                              </div>
                            </div>

                            {/* Outstanding */}
                            <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border border-green-100">
                              <span className="text-sm font-medium text-green-900">
                                Outstanding
                              </span>
                              <div className="text-right">
                                {renderPaymentWithMethod(
                                  payment.outstanding,
                                  payment.outstandingMethod,
                                  payment.outstandingIsPaid,
                                  payment.outstandingUpdatedDate,
                                  payment.cash,
                                  payment.expenseOut,
                                  payment.serviceCharge,
                                  false,
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Mobile Daily Totals */}
                    {dateSummary && (
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Daily Total
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-sm font-medium text-blue-900">
                              Advance In
                            </span>
                            <span className="text-sm font-bold text-blue-900">
                              {formatCurrency(dateSummary.totalCash)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-900">
                              Expense Out
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(dateSummary.totalExpenseOut)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <span className="text-sm font-medium text-yellow-900">
                              Service Charge
                            </span>
                            <span className="text-sm font-bold text-yellow-900">
                              {formatCurrency(dateSummary.totalServiceCharge)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                            <span className="text-sm font-medium text-red-900">
                              Balance
                            </span>
                            <span className="text-sm font-bold text-red-900">
                              {formatCurrency(dateSummary.totalBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-sm font-medium text-green-900">
                              Outstanding
                            </span>
                            <span className="text-sm font-bold text-green-900">
                              {formatCurrency(dateSummary.totalOutstanding)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && payments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}

        {/* {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Edit Payment
              </h3>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Cash In (₹)", key: "cash" },
                  { label: "Expense Out (₹)", key: "expenseOut" },
                  { label: "Service Charge (₹)", key: "serviceCharge" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      // Crucial fix: Show empty string if value is 0 so users can type naturally
                      value={
                        editFormData[field.key as keyof typeof editFormData] ===
                        0
                          ? ""
                          : editFormData[field.key as keyof typeof editFormData]
                      }
                      placeholder="0"
                      onChange={(e) =>
                        handleEditFormChange(field.key, e.target.value)
                      }
                      disabled={isUpdating}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={executeEdit}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ListPayments;
