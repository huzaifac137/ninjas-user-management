import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/router";
import { ToastContainerComponent } from "./components/toast/Container";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    {router}
    <ToastContainerComponent />
  </AuthProvider>
);
