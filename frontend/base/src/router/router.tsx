import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/protectedRoute/protectedRoute";
import App from "../App";
import UserDetails from "../pages/user/details/UserDetails";
import CreateUser from "../pages/user/create/CreateUser";

export const router = (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
