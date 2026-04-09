import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import ProfileModal from "./ProfileModal";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();

  // Fetch admin name on mount
  useEffect(() => {
    fetchAdminName();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const fetchAdminName = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        return;
      }

      const response = await fetch("/api/admin/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setProfileData(data.profile);
    } catch (error) {
      console.error("Error fetching admin name:", error);
    }
  };

  const handleMyProfileClick = () => {
    setShowProfileModal(true);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setIsDropdownOpen(false);
  };

  const handleProfileUpdate = () => {
    // Refresh profile data after update
    fetchAdminName();
  };

  const adminName = profileData?.name || user?.username || "Admin";

  return (
    <>
      {/* Profile Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        {/* <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
          title={adminName}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">
            {adminName}
          </span>
        </button> */}

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg  transition-all text-gray-700 hover:text-[#164275] group"
          title={adminName}
        >
          {/* New Heroicon */}
          <UserCircleIcon className="w-5 h-5 text-[#001A39] group-hover:text-[#061e3b] transition-colors" />

          <span className="text-sm font-semibold hidden sm:inline">
            {adminName}
          </span>

          {/* Optional: Add a small chevron to show it's a dropdown */}
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* Profile Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-600">Logged in as</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {adminName}
              </p>
            </div>

            {/* Menu Items */}
            <button
              onClick={handleMyProfileClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
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
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-4-6h2a2 2 0 012 2v2a2 2 0 01-2 2h-2.5A1.5 1.5 0 0013 12v-.5a1.5 1.5 0 00-1.5-1.5H9a1.5 1.5 0 00-1.5 1.5V12A1.5 1.5 0 0010.5 13.5h2a1.5 1.5 0 001.5-1.5v-1a2 2 0 01-2-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
              <span className="text-sm font-medium">My Profile</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
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
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSuccess={handleProfileUpdate}
        initialData={profileData}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
};

export default ProfileDropdown;
