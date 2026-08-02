import NavBar from './components/NavBar';
import CoursesGrid from './components/CoursesGrid';
import RevealOnScroll from './components/RevealOnScroll';
import ChatbotWidget from './components/ChatbotWidget';
import RoiCalculator from './components/RoiCalculator';
import CorporateB2BSection from './components/CorporateB2BSection';
import {
  HeroSection,
  StatsBar,
  CareerRoadmapSection,
  ApproachSection,
  GRCSection,
  TestimonialsSection,
  Footer,
} from './components/sections';

const CoursesSection = () => (
  <section id="courses" className="py-24 bg-[#0A0F1A] relative">
    <div className="container mx-auto px-6 relative z-10">
      <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Tracks</h2>
        <p className="text-xl text-gray-400">
          World-class cybersecurity certifications and training programs tailored to your
          goals.
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
      <CareerRoadmapSection />
      <RoiCalculator />
      <ApproachSection />
      <GRCSection />
      <CorporateB2BSection />
      <CoursesSection />
      <TestimonialsSection />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
