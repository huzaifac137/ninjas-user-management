import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { serverLink } from "../../serverLink/server";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  
  if(ctx.isLoading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

    if(ctx.token){
        navigate("/");
        return;
      }


  const handleSubmit = async(e: React.FormEvent) => {
    try {
        
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    const response = await axios.post(`${serverLink}auth/login`, {
      email,
      password,
    });

    toast(response?.data?.message);
    ctx.setToken(response?.data?.accessToken);
    ctx.setUser({
      name: response?.data?.user?.name,
      email: response?.data?.user?.email,
      role: response?.data?.user?.role
    });

    navigate("/");

    setIsLoading(false);
    setError("");


} catch (error: unknown) {
         if(axios.isAxiosError(error)){
            setError(error?.response?.data?.message || error?.response?.data?.message);
            setIsLoading(false);
         } else {
            setError(error?.toString() || "");
            setIsLoading(false);
         }
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all duration-300 bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl font-medium transition duration-300 ${
              isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading && (
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
