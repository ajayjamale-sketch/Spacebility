import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import LoadingPage from "@/components/ui/LoadingPage";

// Lazy load pages for performance
const Landing = lazy(() => import("@/pages/Landing"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Features = lazy(() => import("@/pages/Features"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const WorkspaceDetail = lazy(() => import("@/pages/WorkspaceDetail"));
const MeetingRooms = lazy(() => import("@/pages/MeetingRooms"));
const Enterprise = lazy(() => import("@/pages/Enterprise"));
const Events = lazy(() => import("@/pages/Events"));
const Community = lazy(() => import("@/pages/Community"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Careers = lazy(() => import("@/pages/Careers"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Security = lazy(() => import("@/pages/Security"));
const Integrations = lazy(() => import("@/pages/Integrations"));
const Support = lazy(() => import("@/pages/Support"));

// Auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Dashboard pages
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardBookings = lazy(() => import("@/pages/dashboard/DashboardBookings"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/DashboardAnalytics"));
const DashboardWorkspaces = lazy(() => import("@/pages/dashboard/DashboardWorkspaces"));
const DashboardCommunity = lazy(() => import("@/pages/dashboard/DashboardCommunity"));
const DashboardBilling = lazy(() => import("@/pages/dashboard/DashboardBilling"));
const DashboardProfile = lazy(() => import("@/pages/dashboard/DashboardProfile"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));
const DashboardAdmin = lazy(() => import("@/pages/dashboard/DashboardAdmin"));
const DashboardUsers = lazy(() => import("@/pages/dashboard/DashboardUsers"));
const DashboardReports = lazy(() => import("@/pages/dashboard/DashboardReports"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/DashboardEvents"));
const DashboardNotifications = lazy(() => import("@/pages/dashboard/DashboardNotifications"));
const DashboardAccess = lazy(() => import("@/pages/dashboard/DashboardAccess"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));
const BookingDetail = lazy(() => import("@/pages/BookingDetail"));
const SubscriptionDetail = lazy(() => import("@/pages/SubscriptionDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<WorkspaceDetail />} />
        <Route path="/meeting-rooms" element={<MeetingRooms />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/events" element={<Events />} />
        <Route path="/community" element={<Community />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/support" element={<Support />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardBookings /></ProtectedRoute>} />
        <Route path="/dashboard/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardAnalytics /></ProtectedRoute>} />
        <Route path="/dashboard/workspaces" element={<ProtectedRoute><DashboardWorkspaces /></ProtectedRoute>} />
        <Route path="/dashboard/community" element={<ProtectedRoute><DashboardCommunity /></ProtectedRoute>} />
        <Route path="/dashboard/events" element={<ProtectedRoute><DashboardEvents /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute><DashboardBilling /></ProtectedRoute>} />
        <Route path="/dashboard/billing/:id" element={<ProtectedRoute><SubscriptionDetail /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfile /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute><DashboardUsers /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardReports /></ProtectedRoute>} />
        <Route path="/dashboard/notifications" element={<ProtectedRoute><DashboardNotifications /></ProtectedRoute>} />
        <Route path="/dashboard/access" element={<ProtectedRoute><DashboardAccess /></ProtectedRoute>} />
        <Route path="/dashboard/messages" element={<ProtectedRoute><DashboardMessages /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
