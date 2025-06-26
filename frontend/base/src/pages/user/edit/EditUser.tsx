import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { serverLink } from "../../../serverLink/server";
import { useNavigate, useParams } from "react-router";

interface User {
  name: string;
  email: string;
}

const EditUser = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<User>({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${serverLink}users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res?.data?.user;
      setInitialData({ name: user.name, email: user.email });
      setFormData({ name: user.name, email: user.email });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || error?.response?.data?.error);
      } else {
        setError(error?.toString() || "");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const updates: Partial<User> = {};
    if (formData.name && formData.name !== initialData.name) {
      updates.name = formData.name;
    }
    if (formData.email && formData.email !== initialData.email) {
      updates.email = formData.email;
    }

    if (Object.keys(updates).length === 0) {
      setError("No changes made.");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${serverLink}users/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || error?.response?.data?.error);
      } else {
        setError(error?.toString() || "");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edit User
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
