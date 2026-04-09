import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import DashboardHome from "./pages/DashboardHome";
import AddStaff from "./pages/AddStaff";
import AdminProfile from "./pages/AdminProfile";
import CustomerForm from "./pages/Addtask";
import ListCustomers from "./pages/Taskupdate";
import PaymentCollected from "./pages/Paymenthistory";
import AddCustomer from "./pages/AddCustomer";
import CustomerList from "./pages/ListCustomer";
import ListStaffs from "./pages/ListStaffs";
import NotFound from "./pages/NotFound";
import Offline from "./components/Offline";
import { AuthProvider, useAuthContext } from "./components/AuthContext";
import { LoadingProvider } from "./components/LoadingProvider";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading state while verifying authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Offline />
      <Routes>
        {/* Redirect root and /admin to login/dashboard */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              replace
            />
          }
        />
        <Route
          path="/admin"
          element={
            <Navigate
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              replace
            />
          }
        />

        {/* Redirect authenticated users from login page to dashboard */}
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardHome />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-staff"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddStaff />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/list-staffs"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ListStaffs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddCustomer />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customer-list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CustomerList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-task"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CustomerForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/task-update"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ListCustomers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PaymentCollected />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
