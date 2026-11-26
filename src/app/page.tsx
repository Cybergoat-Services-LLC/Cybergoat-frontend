import NavBar from './components/NavBar';
import CoursesGrid from './components/CoursesGrid';
import RevealOnScroll from './components/RevealOnScroll';
import ChatbotWidget from './components/ChatbotWidget';
import CorporateB2BSection from './components/CorporateB2BSection';
import CorporateOfferingsSection from './components/CorporateOfferingsSection';
import SaaSInteractiveDemo from './components/SaaSInteractiveDemo';
import SovereigntyTiersSection from './components/SovereigntyTiersSection';
import {
  HeroSection,
  StatsBar,
  ClosedLoopFlywheelSection,
  EnterpriseCompetencySection,
  ApproachSection,
  GRCSection,
  DescIsrCtaSection,
  TestimonialsSection,
  Footer,
} from './components/sections';

const CoursesSection = () => (
  <section id="courses" className="py-24 bg-[#0A0F1A] relative">
    <div className="container mx-auto px-6 relative z-10">
      <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold mb-4 font-mono">
          <span>Official EC-Council Authorized Partner (ID: ECRS21832) &bull; Verified Evidence Ingestion</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Accredited Workforce Competency Catalog</h2>
        <p className="text-lg text-gray-300">
          Official EC-Council curriculum, hands-on cloud iLabs, and examination vouchers designed to satisfy mandatory role competence under DESC ISR v3.1 Domain 9 and UAE IA v1.1 M3.
        </p>
      </RevealOnScroll>
      <CoursesGrid />
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] selection:bg-[#00F0FF]/30 selection:text-white font-sans">
      <NavBar />
      <HeroSection />
      <StatsBar />
      <DescIsrCtaSection />
      <ClosedLoopFlywheelSection />
      <SaaSInteractiveDemo />
      <SovereigntyTiersSection />
      <GRCSection />
      <EnterpriseCompetencySection />
      <ApproachSection />
      <CorporateOfferingsSection />
      <CorporateB2BSection />
      <CoursesSection />
      <TestimonialsSection />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
