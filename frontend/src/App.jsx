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

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
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
            <AdminRoute>
              <Layout>
                <AdminPage />
              </Layout>
            </AdminRoute>
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
