import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { serverLink } from "../../../serverLink/server";

interface Role {
  _id: string;
  name: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const navigate = useNavigate("");

  const { token } = useContext(AuthContext);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${serverLink}users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res?.data?.user);
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || error?.response?.data?.error);
      } else {
        setError(error?.toString() || "");
      }
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${serverLink}roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res?.data?.roles || []);
    } catch (error:unknown) {
        if (axios.isAxiosError(error)) {
            setError(error?.response?.data?.message || error?.response?.data?.error);
          } else {
            setError(error?.toString() || "");
          }
          setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!selectedRole) return;

    try {
      setIsAssigning(true);
      await axios.patch(
        `${serverLink}users/${id}/role/${selectedRole}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAssigning(false);
      setModalOpen(false);
      fetchUser(); // Refresh user details
    } catch (error: unknown) {
      setIsAssigning(false);
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || error?.response?.data?.error);
      } else {
        setError(error?.toString() || "");
      }
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        User Details
      </h2>

      {error && (
        <div className="text-center text-red-600 mb-4">{error}</div>
      )}

      <div className="space-y-3 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span> {user?.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span>{" "}
          {user?.role?.name?.charAt(0)?.toUpperCase() +
            user?.role?.name?.slice(1)?.replace("_", " ")}
        </div>
      </div>

      <div className="mt-6 flex gap-4 justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={() => navigate(`/users/edit/${user?._id}`)}
        >
          Edit User
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          onClick={() => setModalOpen(true)}
        >
          Assign Role
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Assign Role
            </h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700 font-medium">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border px-3 py-2 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name.charAt(0).toUpperCase() +
                      role.name.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={assignRole}
                disabled={isAssigning || !selectedRole}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;