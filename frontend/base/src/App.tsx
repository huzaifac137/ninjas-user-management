import { useContext, useEffect, useState } from "react";
import "./App.css";
import { serverLink } from "./serverLink/server";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router";

interface IUser {
  _id: string;
  name: string;
  email: string;
}
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [error, setError] = useState("");
  const [roleName, setRoleName] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState<IUser[]>([]);
  const {
    user,
    isLoading: authLoading,
    logout,
    token,
  } = useContext(AuthContext);

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
        setIsLoading(false);
        setError("Role not found");
        return;
      }

      const nameMap: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Admin",
        user: "User",
      };

      setRoleName(nameMap[matchedRole.name] || matchedRole.name);
      setIsLoading(false);
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

  const fetchAllUsers = async () => {
    try {
      setIsLoading2(true);
      setError("");
      const response = await axios.get(`${serverLink}users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response?.data?.users || [];
      if (users.length === 0) {
        setIsLoading2(false);
        setError("No users found");
        return;
      }

      setUsers(response?.data?.users);
      setIsLoading2(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error?.response?.data?.message || error?.response?.data?.error
        );
        setIsLoading2(false);
      } else {
        setError(error?.toString() || "");
        setIsLoading2(false);
      }
    }
  };

  const deleteAUser = async (userId: string) => {
    try {
      await axios.delete(`${serverLink}users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAllUsers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error?.response?.data?.message || error?.response?.data?.error
        );
      } else {
        setError(error?.toString() || "");
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

          {isLoading && (
            <div className="text-center text-sm text-blue-600 animate-pulse mb-4">
              Loading role info...
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {isAdmin && (
            <button
              onClick={() => {
                fetchAllUsers();
                setActiveTab("users");
              }}
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  User Management
                </h4>
                <button
                  onClick={() => navigate("/users")}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                >
                  Create User
                </button>
              </div>

              {isLoading2 ? (
                <div className="text-sm text-blue-600 animate-pulse">
                  Loading users...
                </div>
              ) : (
                <>
                  {users.length === 0 ? (
                    <p className="text-sm text-gray-500">No users found.</p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user?._id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
                      >
                        <div>
                          <p className="text-base font-medium text-gray-800">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/users/${user?._id}`)}
                            className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                          >
                            Details & Actions
                          </button>
                          <button
                            onClick={() => deleteAUser(user?._id)}
                            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800">
                My Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-xl">
                  <strong>Name:</strong> {user?.name || "N/A"}
                </div>
                <div className="p-4 bg-gray-100 rounded-xl">
                  <strong>Email:</strong> {user?.email || "N/A"}
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
