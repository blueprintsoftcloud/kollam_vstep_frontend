import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";
import AddStaffModal from "../components/AddStaffModal";

type StaffMember = {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  createdAt?: string;
};

interface NotificationState {
  message: string;
  type: NotificationType;
}

const ListStaffs = () => {
  const [staffs, setStaffs] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch staff data from API
  useEffect(() => {
    fetchStaffData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchStaffData = async (page: number, search: string) => {
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

      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search,
      });

      const response = await fetch(`/api/staff?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch staff data (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      setStaffs(data.staff || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load staff data";
      setNotification({
        message: errorMessage,
        type: "error",
      });
      setStaffs([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaffSuccess = () => {
    // Refresh staff list after successful addition
    fetchStaffData(currentPage, searchTerm);
    setNotification({
      message: "Staff member added successfully!",
      type: "success",
    });
  };

  // Loader Component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">Loading staff members...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with decorative elements */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1  rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Staff Directory
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base ml-4">
              Manage all registered staff members
            </p>
          </div>
          <button
            onClick={() => setIsAddStaffModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#001A39] text-white rounded-lg hover:bg-[#1a4379] transition-colors font-medium text-sm shadow-sm cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Add Staff</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Search Bar - Enhanced */}
        {(totalItems > 0 || searchTerm !== "") && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                placeholder="Search staff by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm"
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <Loader />
          </div>
        )}

        {/* Staff Table */}
        {!isLoading && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {staffs.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Phone
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {staffs.map((staff) => (
                          <tr
                            key={staff._id}
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-[#001A39] flex items-center justify-center text-white font-medium text-sm">
                                  {staff.fullname.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {staff.fullname}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600">
                                {staff.email}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600">
                                {staff.phone}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden divide-y divide-gray-200">
                    {staffs.map((staff) => (
                      <div
                        key={staff._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#001A39] flex items-center justify-center text-white font-semibold">
                              {staff.fullname.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {staff.fullname}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {staff.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-gray-600">{staff.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-sm mb-2">
                      {totalItems === 0
                        ? "No staff members found."
                        : "No staff members found matching your search."}
                    </p>
                    {totalItems === 0 && (
                      <p className="text-xs text-gray-400">
                        Start by adding new staff members.
                      </p>
                    )}
                    {totalItems > 0 && searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-blue-600 text-sm hover:text-blue-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summary Footer with Stats */}
            {totalItems > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-100 inline-flex items-center gap-2">
                  <span className="font-semibold text-blue-600">
                    {staffs.length}
                  </span>
                  <span>of</span>
                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>
                  <span>staff members</span>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Staff Modal */}
        <AddStaffModal
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          onSuccess={handleAddStaffSuccess}
        />

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.type === "success" ? 3000 : 4000}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ListStaffs;
