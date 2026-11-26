import NavBar from './components/NavBar';
import CoursesGrid from './components/CoursesGrid';
import RevealOnScroll from './components/RevealOnScroll';
import ChatbotWidget from './components/ChatbotWidget';
import RoiCalculator from './components/RoiCalculator';
import CorporateB2BSection from './components/CorporateB2BSection';
import CorporateOfferingsSection from './components/CorporateOfferingsSection';
import SaaSInteractiveDemo from './components/SaaSInteractiveDemo';
import SovereigntyTiersSection from './components/SovereigntyTiersSection';
import {
  HeroSection,
  StatsBar,
  CareerRoadmapSection,
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C664FF]/30 bg-[#C664FF]/10 text-[#C664FF] text-xs font-semibold mb-4">
          <span>Official EC-Council Distribution Partner</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">CyberGOAT Enterprise Academy</h2>
        <p className="text-xl text-gray-400">
          Official EC-Council certification courseware, hands-on iLabs, and executive upskilling pathways for enterprise security &amp; compliance teams.
        </p>
      </RevealOnScroll>
      <CoursesGrid />
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] selection:bg-[#0DCAF0]/30 selection:text-white font-sans">
      <NavBar />
      <HeroSection />
      <StatsBar />
      <DescIsrCtaSection />
      <SaaSInteractiveDemo />
      <SovereigntyTiersSection />
      <GRCSection />
      <CareerRoadmapSection />
      <RoiCalculator />
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
