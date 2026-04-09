import { useState, useEffect, useCallback, useRef } from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";
import EditCustomerModal from "../components/EditCustomerModal";

type Customer = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Debounce and request cancellation
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const previousSearchRef = useRef<string>("");

  // Handle search debounce
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      const nextSearch = searchTerm.trim();
      if (nextSearch !== previousSearchRef.current.trim()) {
        previousSearchRef.current = nextSearch;
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
      }
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, currentPage]);

  // Fetch customers from backend
  const fetchCustomers = useCallback(
    async (searchQuery: string, pageNum: number) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

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
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        params.append("page", String(pageNum));
        params.append("limit", String(pageSize));

        const queryString = params.toString();
        const url = queryString
          ? `/api/customer-info?${queryString}`
          : "/api/customer-info";

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch customers (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        setCustomers(data.data || []);
        setTotalRecords(typeof data.total === "number" ? data.total : 0);
        setCurrentPage(typeof data.page === "number" ? data.page : 1);
      } catch (error) {
        // Don't show error for aborted requests
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error fetching customers:", error);
        setNotification({
          message:
            error instanceof Error ? error.message : "Failed to load customers",
          type: "error",
        });
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  // Combine search and pagination effects into single effect
  useEffect(() => {
    fetchCustomers(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage, fetchCustomers]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle edit button click
  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    // Refetch current page with current search term
    fetchCustomers(debouncedSearchTerm, currentPage);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Loader Component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-[#1e293b] border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-500 text-sm font-medium">
        Loading customers...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8 font-sans">
      <div
        className={`max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isEditModalOpen ? "blur-sm pointer-events-none" : ""}`}
      >
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b]">
              Customer List
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base ml-4">
            Manage and view all your customers
          </p>
        </div>

        {/* Search Bar */}
        {(customers.length > 0 || searchTerm) && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <Loader />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && customers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-16 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM1 20a6 6 0 0112 0v2H1v-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                No customers found
              </h3>
              <p className="text-slate-500 text-sm">
                {searchTerm
                  ? "Try adjusting your search query."
                  : "Get started by adding your first customer."}
              </p>
            </div>
          </div>
        )}

        {/* Data Container */}
        {!isLoading && customers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                      Full Name
                    </th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                      Email
                    </th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs whitespace-nowrap text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-slate-900">
                          {customer.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-600 font-mono">
                          {customer.phoneNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-slate-600 truncate"
                          title={customer.email}
                        >
                          {customer.email || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 text-sm">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {customer.phoneNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="shrink-0 px-3 py-1.5 bg-blue-50 cursor-pointer text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium border border-blue-200"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                      Email
                    </p>
                    <p className="text-sm text-slate-700 truncate">
                      {customer.email || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1 text-center sm:text-left w-full sm:w-auto">
                Showing{" "}
                <span className="font-semibold text-[#1e293b]">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-[#1e293b]">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {totalRecords}
                </span>{" "}
                customers
              </div>

              <div className="flex items-center justify-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar px-1 py-0.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                          currentPage === pageNum
                            ? "bg-[#1e293b] text-white shadow-sm"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={5000}
            onClose={() => setNotification(null)}
          />
        )}
      </div>

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleEditSuccess}
        customerId={selectedCustomer?._id || null}
        initialData={
          selectedCustomer
            ? {
                name: selectedCustomer.name,
                phoneNumber: selectedCustomer.phoneNumber,
                email: selectedCustomer.email,
              }
            : undefined
        }
      />

      <style>{`
        /* Hide scrollbar for pagination to look cleaner on mobile */
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CustomerList;
