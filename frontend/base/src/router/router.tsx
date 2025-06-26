import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/protectedRoute/protectedRoute";
import App from "../App";

export const router = (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute>
                <App/>
                 </ProtectedRoute>}/>
        </Routes>
    </BrowserRouter>
);
