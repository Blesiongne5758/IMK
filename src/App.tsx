import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Infrastructure from './components/Infrastructure';
import Capability from './components/Capability';
import Process from './components/Process';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-void text-text-primary">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Infrastructure />
        <Capability />
        <Process />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
