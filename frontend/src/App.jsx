import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StepIndicator from './components/StepIndicator';

import WelcomePage from './pages/WelcomePage';
import VideoDemoPage from './pages/VideoDemoPage';
import EventInputPage from './pages/EventInputPage';
import AgePreferencesPage from './pages/AgePreferencesPage';
import RequirementSummaryPage from './pages/RequirementSummaryPage';
import AgentProcessingPage from './pages/AgentProcessingPage';
import VenueResultsPage from './pages/VenueResultsPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import VenueComparePage from './pages/VenueComparePage';
import AIRecommendationPage from './pages/AIRecommendationPage';
import EventPreviewPage from './pages/EventPreviewPage';
import FinalEventPlanPage from './pages/FinalEventPlanPage';
import SavedVenuesPage from './pages/SavedVenuesPage';

export default function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-600 selection:text-white">
          <Navbar />
          <StepIndicator />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/demo" element={<VideoDemoPage />} />
              <Route path="/event-input" element={<EventInputPage />} />
              <Route path="/age-preferences" element={<AgePreferencesPage />} />
              <Route path="/summary" element={<RequirementSummaryPage />} />
              <Route path="/agent-processing" element={<AgentProcessingPage />} />
              <Route path="/venues" element={<VenueResultsPage />} />
              <Route path="/venue/:id" element={<VenueDetailsPage />} />
              <Route path="/compare" element={<VenueComparePage />} />
              <Route path="/recommendation" element={<AIRecommendationPage />} />
              <Route path="/preview" element={<EventPreviewPage />} />
              <Route path="/final-plan" element={<FinalEventPlanPage />} />
              <Route path="/saved" element={<SavedVenuesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </EventProvider>
  );
}
