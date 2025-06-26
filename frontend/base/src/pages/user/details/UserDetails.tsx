import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${serverLink}users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res?.data?.user);
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error?.response?.data?.message || error?.response?.data?.error
        );
        setLoading(false);
      } else {
        setError(error?.toString() || "");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        User Details
      </h2>

      <div className="space-y-3 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span> {user?.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user?.role?.name}
        </div>
      </div>

      <div className="mt-6 flex gap-4 justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={() => alert("Edit User Clicked")}
        >
          Edit User
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          onClick={() => alert("Assign Role Clicked")}
        >
          Assign Role
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
