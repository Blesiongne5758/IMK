import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import JobsPage from './pages/JobsPage';
import LegalitasPage from './pages/LegalitasPage';
import EOfficeLoginPage from './pages/EOfficeLoginPage';
import EOfficeDashboard from './pages/EOfficeDashboard';
import LegalitasAdmin from './pages/LegalitasAdmin';

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
            <Route path="/legalitas" element={<LegalitasPage />} />
            <Route path="/eoffice/login" element={<EOfficeLoginPage />} />
            <Route path="/eoffice" element={<EOfficeDashboard />} />
            <Route path="/eoffice/legalitas" element={<LegalitasAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
