import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import ManageEventsPage from "./pages/ManageEventsPage.jsx";
import AddUndercardFightPage from "./pages/AddUndercardFightPage.jsx";
import ScoringPage from "./pages/ScoringPage.jsx";
import ScorecardsPage from "./pages/ScorecardsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import NotFoundPage from  "./pages/NotFoundPage.jsx"
import FighterProfilePage from "./pages/FighterProfilePage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import TermsOfServicePage from "./pages/TermsOfServicePage.jsx"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/events/:eventId/fights/:fightId/score" element={<ScoringPage />} />
        <Route path="/scorecards" element={<ScorecardsPage />} />
        <Route path="/fighter/:id" element={<FighterProfilePage />} />
        <Route path="/termsofservice" element={<TermsOfServicePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* organizer-only routes */}
        <Route
          path="/events/create"
          element={
            <ProtectedRoute requireOrganizer>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage"
          element={
            <ProtectedRoute requireOrganizer>
              <ManageEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/:eventId/add-fight"
          element={
            <ProtectedRoute requireOrganizer>
              <AddUndercardFightPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
