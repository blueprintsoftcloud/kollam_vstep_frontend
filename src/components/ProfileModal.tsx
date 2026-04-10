import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../utils/auth";
import { apiFetch } from "../utils/api";
import Notification, { type NotificationType } from "./Notification";
import { Eye, EyeOff } from "lucide-react";

interface AdminProfileData {
  _id: string;
  username: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AdminProfileData | null;
}

interface NotificationState {
  message: string;
  type: NotificationType;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [profile, setProfile] = useState<AdminProfileData | null>(
    initialData || null,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [hasFetched, setHasFetched] = useState(false);
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
  const [formErrors, setFormErrors] = useState<{ phone?: string }>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Failed to load profile information.",
          type: "error",
        });
        return;
      }

      const response = await apiFetch("/api/admin/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile`);
      }

      const data = await response.json();
      setProfile(data.profile);

      setEditFormData({
        username: data.profile.username || "",
        name: data.profile.name || "",
        address: data.profile.address || "",
        phone: data.profile.phone || "",
        email: data.profile.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setNotification({
        message: "Failed to load profile information.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch profile when the modal opens (only once per open)
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setProfile(initialData);
      setEditFormData({
        username: initialData.username || "",
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
      });
      setHasFetched(true);
      setIsLoading(false);
      return;
    }

    // Avoid refetching in a render loop when profile is null.
    if (!hasFetched) {
      setHasFetched(true);
      fetchProfile();
    }
  }, [isOpen, initialData, hasFetched, fetchProfile]);

  // Reset state when modal closes so it can fetch again next open
  useEffect(() => {
    if (!isOpen) {
      setHasFetched(false);
      setNotification(null);
      setIsEditing(false);
      setProfile(initialData || null);
      setIsLoading(!initialData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowChangePassword(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialData]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setEditFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "phone") {
      setFormErrors((prev) => ({
        ...prev,
        phone:
          newValue && newValue.length !== 10
            ? "Phone number must be exactly 10 digits"
            : undefined,
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (editFormData.phone && editFormData.phone.length !== 10) {
      setFormErrors({ phone: "Phone number must be exactly 10 digits" });
      return;
    }
    try {
      setIsSaving(true);
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found.",
          type: "error",
        });
        return;
      }

      const response = await apiFetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
      setFormErrors({});
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
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
    setFormErrors({});
  };

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
      const token = getToken();

      if (!token) {
        setNotification({
          message: "Authentication token not found.",
          type: "error",
        });
        return;
      }

      const response = await apiFetch("/api/admin/change-password", {
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
        throw new Error(errorData.message || "Failed to change password");
      }

      setNotification({
        message: "Password changed successfully!",
        type: "success",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowChangePassword(false);
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
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-50">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-lg"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
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
          <p className="text-center text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
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

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Profile
          </h2>

          {/* Profile Information Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      maxLength={10}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Username
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {profile.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {profile.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {profile.email || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {profile.phone || "Not set"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Address
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {profile.address || "Not set"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              {!showChangePassword && (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Change
                </button>
              )}
            </div>

            {showChangePassword && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
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
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-sm ${
                        passwordErrors.currentPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isChangingPassword}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
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
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-sm ${
                        passwordErrors.newPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isChangingPassword}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
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
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-sm ${
                        passwordErrors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isChangingPassword}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isChangingPassword ? "Changing..." : "Update Password"}
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
                      setShowCurrentPassword(false);
                      setShowNewPassword(false);
                      setShowConfirmPassword(false);
                    }}
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="px-6 pb-6">
            <Notification
              message={notification.message}
              type={notification.type}
              duration={3000}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
