import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./lib/auth.jsx";
import { ThemeProvider } from "./lib/theme.jsx";
import { ToastProvider } from "./lib/toast.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { initOfflineStore } from "./lib/offline/offlineStore.js";
import "./index.css";

// Safely initialize offline storage with fallback demo data
try {
  initOfflineStore();
} catch (e) {
  console.warn("[CareerPath] Offline store initialization caught:", e);
}

// Register PWA service worker silently if supported
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
