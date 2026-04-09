import { useNavigate } from "react-router-dom";
import { clearToken, getToken, parseJwt } from "../utils/auth";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();
  const tokenData = token ? parseJwt(token) : null;

  const handleLogout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                This is a protected admin route. Only authenticated users can
                access this page.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition"
            >
              Log out
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Token Info
            </h2>
            <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
              {tokenData
                ? JSON.stringify(tokenData, null, 2)
                : "No token data available."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
