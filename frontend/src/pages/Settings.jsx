import { API } from "../config/api.js";
import Toast from "../components/Toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Hash,
  CalendarDays,
  Save,
  LogOut,
  Trash2,
  ShieldCheck,
  Settings as SettingsIcon,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Settings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    U_name: "",
    Email: "",
    Phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Load logged-in user information

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API}/user/getUserById`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch user information.");
        }

        if (data.User) {
          // Avoid storing the password hash in localStorage
          const { Password, ...safeUser } = data.User;

          setUser(safeUser);

          setFormData({
            U_name: safeUser.U_name || "",
            Email: safeUser.Email || "",
            Phone: safeUser.Phone || "",
          });

          // Keep local user information updated
          localStorage.setItem("user", JSON.stringify(safeUser));
        }
      } catch (error) {
        console.error("Unable to fetch user:", error);
        setToast({
          type: "error",
          message: error.message || "Unable to load profile information.",
        });
      }
    };

    fetchUser();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update user information
  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/user/updateUserById`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          U_name: formData.U_name.trim(),
          Email: formData.Email.trim(),
          Phone: formData.Phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      if (data.User) {
        // Update localStorage with the latest user information
        const updatedUser = {
          ...user,
          ...data.User,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setFormData({
          U_name: updatedUser.U_name || "",
          Email: updatedUser.Email || "",
          Phone: updatedUser.Phone || "",
        });
      }

      setToast({
        type: "success",
        message: data.message || "Profile updated successfully!",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const handleLogout = () => {
    setLoggingOut(true);

    // Clear the login cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Remove saved user information
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // Delete user account
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`${API}/user/deleteUserById`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete account.");
      }

      // Remove user information after successful deletion
      localStorage.removeItem("user");

      setShowDeletePopup(false);

      navigate("/register", { replace: true });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Something went wrong.",
      });
      setShowDeletePopup(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen mt-16 bg-[#F5F3F4]">
        <Sidebar />

        <div className="md:ml-64">
          <Navbar userName={user?.U_name || ""} />

          <main className="p-5 sm:p-8">
            {/* Page Heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                  <SettingsIcon size={25} />
                </div>

                <div>
                  <h1 className="mt-1 font-['XMind','Raleway',sans-serif] text-3xl font-extrabold text-[#161A1D]]">
                    Settings
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your account and personal information.
                  </p>
                </div>
              </div>
            </div>

            

            <div className="mx-auto max-w-4xl space-y-7">
              {/* Profile Information */}
              <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                      <UserRound size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#161A1D]">
                        Profile Information
                      </h2>

                      <p className="text-xs text-gray-500">
                        Update your personal account details.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5 p-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="U_name"
                        value={formData.U_name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-[#F5F3F4]/50 py-3 pl-11 pr-4 text-sm text-[#161A1D] outline-none transition focus:border-[#BA181B] focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-[#F5F3F4]/50 py-3 pl-11 pr-4 text-sm text-[#161A1D] outline-none transition focus:border-[#BA181B] focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#161A1D]">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        name="Phone"
                        value={formData.Phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-[#F5F3F4]/50 py-3 pl-11 pr-4 text-sm text-[#161A1D] outline-none transition focus:border-[#BA181B] focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end border-t border-gray-100 pt-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A4161A] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>

              {/* Account Information */}
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#161A1D]">
                      Account Information
                    </h2>

                    <p className="text-xs text-gray-500">
                      Your registered account details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#F5F3F4]/70 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Hash size={16} />
                      <span className="text-xs font-semibold">User ID</span>
                    </div>

                    <p className="mt-2 text-lg font-bold text-[#161A1D]">
                      {user?.U_id || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F5F3F4]/70 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays size={16} />
                      <span className="text-xs font-semibold">
                        Account Created
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-bold text-[#161A1D]">
                      {user?.CreatedAt || "Not available"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Logout Section */}
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                      <LogOut size={22} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#161A1D]">Logout</h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Sign out of your Progressa account.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#161A1D] transition hover:border-[#BA181B] hover:bg-red-50 hover:text-[#BA181B] disabled:opacity-60"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </section>

              {/* Delete Account Section */}
              <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                      <Trash2 size={22} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#BA181B]">
                        Delete Account
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Permanently delete your account and created tasks.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeletePopup(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#BA181B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#660708]"
                  >
                    <Trash2 size={17} />
                    Delete Account
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Delete Account Confirmation Popup */}
      {showDeletePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setShowDeletePopup(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-3 text-[#BA181B]">
                <AlertTriangle size={25} />
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeletePopup(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-extrabold text-[#161A1D]">
              Delete Your Account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to permanently delete your Progressa
              account? This action cannot be undone.
            </p>

            <div className="mt-4 rounded-xl bg-red-50 p-4">
              <p className="text-sm font-semibold text-[#BA181B]">Warning:</p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                Your account and all tasks created by you will be deleted. You
                will not be able to recover this information.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeletePopup(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#BA181B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#660708] disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Yes, Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
{toast && (
  <Toast
    type={toast.type}
    message={toast.message}
    onClose={() => setToast(null)}
  />
)}
    </>
  );
};

export default Settings;
