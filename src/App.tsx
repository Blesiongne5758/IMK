import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Infrastructure from './components/Infrastructure';
import Capability from './components/Capability';
import Process from './components/Process';
import CTASection from './components/CTASection';
import ConsultationScheduler from './components/ConsultationScheduler';
import Footer from './components/Footer';

export default function App() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  function handleOpenScheduler() {
    setSchedulerOpen(true);
    // Scroll ke section scheduler
    setTimeout(() => {
      const el = document.getElementById('scheduler');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  return (
    <div className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Infrastructure />
        <Capability />
        <Process />
        <CTASection onScheduleClick={handleOpenScheduler} />
        <ConsultationScheduler
          isModalOpen={schedulerOpen}
          onModalClose={() => setSchedulerOpen(false)}
        />
      </main>
      <Footer />
    </div>
  );
}
