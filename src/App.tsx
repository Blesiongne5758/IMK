import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import JobsPage from './pages/JobsPage';
import ShowcasePage from './pages/ShowcasePage';
import EventPage from './pages/EventPage';
import LegalitasPage from './pages/LegalitasPage';
import EOfficeLoginPage from './pages/EOfficeLoginPage';
import EOfficeDashboard from './pages/EOfficeDashboard';
import LegalitasAdmin from './pages/LegalitasAdmin';
import EventManagement from './pages/EventManagement';
import QRScannerPage from './pages/QRScannerPage';
import LowonganListPage from './pages/eoffice/LowonganListPage';
import LowonganReportPage from './pages/eoffice/LowonganReportPage';
import LowonganInterviewPage from './pages/eoffice/LowonganInterviewPage';
import EventListPage from './pages/eoffice/EventListPage';
import EventParticipantsPage from './pages/eoffice/EventParticipantsPage';
import EventCommitteePage from './pages/eoffice/EventCommitteePage';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-void text-text-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jadwal" element={<SchedulePage />} />
            <Route path="/lowongan" element={<JobsPage />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/legalitas" element={<LegalitasPage />} />
            <Route path="/eoffice/login" element={<EOfficeLoginPage />} />
            <Route path="/eoffice" element={<EOfficeDashboard />} />
            <Route path="/eoffice/legalitas" element={<LegalitasAdmin />} />
            <Route path="/eoffice/event" element={<EventManagement />} />
            <Route path="/eoffice/qr-scanner" element={<QRScannerPage />} />
            <Route path="/eoffice/lowongan" element={<LowonganListPage />} />
            <Route path="/eoffice/lowongan/report" element={<LowonganReportPage />} />
            <Route path="/eoffice/lowongan/interview" element={<LowonganInterviewPage />} />
            <Route path="/eoffice/event/list" element={<EventListPage />} />
            <Route path="/eoffice/event/participants" element={<EventParticipantsPage />} />
            <Route path="/eoffice/event/committee" element={<EventCommitteePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
