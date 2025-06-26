import { useContext, useEffect, useState } from "react";
import "./App.css";
import { serverLink } from "./serverLink/server";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleName, setRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const { user, isLoading: authLoading, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const fetchAllRoles = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(`${serverLink}roles`);
      const roles = response?.data?.roles || [];
      if (roles.length === 0) {
        setIsLoading(false);
        setError("No roles found");
        return;
      }

      const matchedRole = roles.find((r) => r._id === user.role._id);
      if (!matchedRole) {
        setError("Role not found");
        return;
      }

      const nameMap: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Admin",
        user: "User",
      };

      setRoleName(nameMap[matchedRole.name] || matchedRole.name);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error?.response?.data?.message || error?.response?.data?.error
        );
        setIsLoading(false);
      } else {
        setError(error?.toString() || "");
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  const isAdmin = roleName === "Admin" || roleName === "Super Admin";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Welcome, {roleName}
          </h3>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-100 text-red-600 px-4 py-1.5 rounded-xl font-medium hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {isAdmin && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              User Management
            </button>
          )}

          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              activeTab === "details"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Details
          </button>
        </div>

        {error && (
          <div className="text-center text-red-500 font-medium mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-4">
          {activeTab === "users" && isAdmin && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">
                User Management
              </h4>

            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">
                My Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-xl">
                  <strong>Name:</strong> {user.name}
                </div>
                <div className="p-4 bg-gray-100 rounded-xl">
                  <strong>Email:</strong> {user.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
