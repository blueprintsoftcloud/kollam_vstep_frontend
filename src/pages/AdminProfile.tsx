import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import Notification, {
  type NotificationType,
} from "../components/Notification";
import { useLoading } from "../components/LoadingProvider";
import { useAuthContext } from "../components/AuthContext";

interface AdminProfileData {
  _id: string;
  username: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface NotificationState {
  message: string;
  type: NotificationType;
}

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    username: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    phone?: string;
  }>({});

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const { setLoading } = useLoading();
  const { logout } = useAuthContext();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
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
        throw new Error(`Failed to fetch profile (Status: ${response.status})`);
      }

      const data = await response.json();
      setProfile(data.profile);

      // Initialize edit form with fetched data
      setEditFormData({
        username: data.profile.username || "",
        name: data.profile.name || "",
        address: data.profile.address || "",
        phone: data.profile.phone || "",
        email: data.profile.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For phone field, only allow numeric input and limit to 10 digits
    let processedValue = value;
    if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 10); // Remove non-digits and limit to 10
    }

    setEditFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Validate phone number
    if (name === "phone") {
      if (processedValue && processedValue.length !== 10) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Phone number must be exactly 10 digits",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          phone: undefined,
        }));
      }
    }
  };

  const handleSaveProfile = async () => {
    // Validate form before saving
    if (editFormData.phone && editFormData.phone.length !== 10) {
      setFormErrors({
        phone: "Phone number must be exactly 10 digits",
      });
      return;
    }

    try {
      setIsSaving(true);
      setLoading(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update profile (Status: ${response.status})`,
        );
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
      setFormErrors({}); // Clear form errors on success
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditFormData({
        username: profile.username || "",
        name: profile.name || "",
        address: profile.address || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
    setIsEditing(false);
    setFormErrors({}); // Clear form errors on cancel
  };

  // Password validation
  const validatePassword = (): boolean => {
    const errors: typeof passwordErrors = {};

    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      setIsChangingPassword(true);
      setLoading(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found. Please log in again.",
          type: "error",
        });
        return;
      }

      const response = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to change password (Status: ${response.status})`,
        );
      }

      // Password changed successfully - show success and logout after 2 seconds
      setNotification({
        message: "Password changed successfully! Redirecting to login...",
        type: "success",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowChangePassword(false);

      // Wait 2 seconds before logging out to let user see the success message
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsChangingPassword(false);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your profile and account settings
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={3000}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          // Edit Mode - Wrapped in a form for better mobile keyboard support
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  readOnly={false}
                  disabled={false}
                  spellCheck={false}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none select-text bg-white text-gray-900 cursor-text touch-manipulation"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  disabled={isSaving}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none select-text disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  disabled={isSaving}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none select-text disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  onInput={(e) => {
                    // Enforce 10-digit limit on input
                    const target = e.target as HTMLInputElement;
                    if (target.value.length > 10) {
                      target.value = target.value.slice(0, 10);
                    }
                    // Also ensure only digits
                    target.value = target.value.replace(/\D/g, "");
                  }}
                  disabled={isSaving}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none select-text disabled:bg-gray-100 disabled:text-gray-500 ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  disabled={isSaving}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none select-text disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.username}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.name || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.email || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.phone || "Not set"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.address || "Not set"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Change Password
          </h2>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {showChangePassword && (
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  });
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors({
                      ...passwordErrors,
                      currentPassword: undefined,
                    });
                  }
                }}
                placeholder="Enter current password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                  passwordErrors.currentPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isChangingPassword}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  });
                  if (passwordErrors.newPassword) {
                    setPasswordErrors({
                      ...passwordErrors,
                      newPassword: undefined,
                    });
                  }
                }}
                placeholder="Enter new password (min 6 characters)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                  passwordErrors.newPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isChangingPassword}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  });
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors({
                      ...passwordErrors,
                      confirmPassword: undefined,
                    });
                  }
                }}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition ${
                  passwordErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isChangingPassword}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setPasswordErrors({});
                }}
                disabled={isChangingPassword}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
