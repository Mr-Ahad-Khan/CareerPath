import { Navigate, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/lib/currency.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import { Footer } from "@/components/Footer.jsx";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute.jsx";

import LandingPage from "@/pages/LandingPage.jsx";
import AboutPage from "@/pages/AboutPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import WizardPage from "@/pages/WizardPage.jsx";
import DashboardPage from "@/pages/DashboardPage.jsx";
import SimulationPage from "@/pages/SimulationPage.jsx";
import ComparatorPage from "@/pages/ComparatorPage.jsx";
import MilestonesPage from "@/pages/MilestonesPage.jsx";
import MentorsPage from "@/pages/MentorsPage.jsx";
import ResumeCheckPage from "@/pages/ResumeCheckPage.jsx";
import AdminPage from "@/pages/AdminPage.jsx";
import NotFoundPage from "@/pages/NotFoundPage.jsx";

import { useAuth } from "@/lib/auth.jsx";
import { MobileBottomNav } from "@/components/MobileBottomNav.jsx";

function Layout({ children }) {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className={`flex-1 w-full overflow-x-hidden ${user ? 'pb-20 lg:pb-0' : ''}`}>{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />

        <Route
          path="/simulate"
          element={
            <ProtectedRoute>
              <Layout>
                <WizardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulations"
          element={<Navigate to="/simulate" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulation/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SimulationPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <Layout>
                <ComparatorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/milestones"
          element={
            <ProtectedRoute>
              <Layout>
                <MilestonesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentors"
          element={
            <ProtectedRoute>
              <Layout>
                <MentorsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-check"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeCheckPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>
    </CurrencyProvider>
  );
}
