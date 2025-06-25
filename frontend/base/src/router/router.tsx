import { BrowserRouter, Routes, Route } from "react-router";
import App from "../App";

export const router = (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
        </Routes>
    </BrowserRouter>
);
