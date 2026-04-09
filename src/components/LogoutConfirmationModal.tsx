import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin_token");

      if (token) {
        const response = await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Logout API failed:", response.status);
        }
      }

      // Clear authentication state
      logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md z-50">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mx-auto mb-4">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0 4h.01m-6.938-4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Confirm Logout
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to logout? You will need to log in again to
          access the dashboard.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm min-w-24"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center text-sm min-w-24"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Logging out...</span>
              </>
            ) : (
              <span>Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
