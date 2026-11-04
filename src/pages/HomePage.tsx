import Hero from '../components/Hero';
import Services from '../components/Services';
import Infrastructure from '../components/Infrastructure';
import Capability from '../components/Capability';
import Process from '../components/Process';
import CTASection from '../components/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Infrastructure />
      <Capability />
      <Process />
      <CTASection />
    </>
  );
}
