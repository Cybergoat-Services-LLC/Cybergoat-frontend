import NavBar from '../components/NavBar';
import { Footer } from '../components/sections';
import ChatbotWidget from '../components/ChatbotWidget';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Returns Policy | CyberGOAT Services LLC',
  description: 'Official Refund, Cancellation & Returns Policy for CyberGOAT digital courseware kits, EC-Council exam vouchers, and training services.',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] text-white font-sans selection:bg-[#00F0FF]/30">
      <NavBar />

      <section className="pt-36 pb-20 lg:pt-48 lg:pb-24 container mx-auto px-6 max-w-4xl space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8 text-center sm:text-left">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            Consumer Protection &amp; Legal Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-gray-400 font-mono">
            Effective Date: August 2, 2026 | CyberGOAT Services LLC (Dubai Silicon Oasis, UAE)
          </p>
        </div>

        <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
          <div className="p-6 rounded-2xl bg-[#05080F] border border-[#00F0FF]/30 space-y-2">
            <h3 className="text-lg font-bold text-white text-[#00F0FF]">Notice to Customers</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              CyberGOAT Services LLC provides high-value cybersecurity training, proprietary digital courseware kits, and official certification vouchers. All purchases are subject to the legal terms below, structured in accordance with UAE Federal Law No. 15 of 2020 on Consumer Protection and international reseller frameworks.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white border-l-4 border-[#00F0FF] pl-3">
              1. Digital Products &amp; Downloadable Courseware Kits
            </h2>
            <p>
              Due to the immediate access provided for downloadable digital assets, proprietary student kits, lab manuals, and electronic courseware:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <strong className="text-white">Strict Non-Refundable Policy:</strong> Under UAE Consumer Protection regulations regarding digital content and electronic downloads, all digital courseware kit purchases are <strong className="text-white">final and non-refundable</strong> once a download link, V4 signed URL, or access token has been generated or issued.
              </li>
              <li>
                <strong className="text-white">Un-Accessed Orders:</strong> If an order was placed in error and no download link or kit token has been generated or accessed, a written refund request may be submitted within 48 hours of purchase, subject to a 15% administrative handling fee.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white border-l-4 border-amber-400 pl-3">
              2. Official EC-Council Exam Vouchers &amp; iLabs Credentials
            </h2>
            <p>
              CyberGOAT Services LLC acts as an official <strong className="text-white">EC-Council Authorized Reseller</strong>. All official exam vouchers (CEH v12, CHFI v11, C|CISO) and iLabs credentials issued to students are subject to direct vendor governance:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <strong className="text-white">Direct Vendor Redirection:</strong> Once an official EC-Council voucher code or iLabs code has been generated or assigned to a student&rsquo;s email, <strong className="text-white">CyberGOAT does not process any refunds for vouchers under any circumstances</strong>.
              </li>
              <li>
                <strong className="text-white">Voucher Assistance:</strong> Any inquiries regarding voucher validity extensions, voucher transfers, or exam retakes must be submitted directly to EC-Council Official Support at <a href="mailto:support@eccouncil.org" className="text-amber-300 underline">support@eccouncil.org</a>.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white border-l-4 border-[#38BDF8] pl-3">
              3. Live Training Bootcamps &amp; Dubai Campus Sessions
            </h2>
            <p>
              For live instructor-led virtual bootcamps or in-person sessions at Dubai Silicon Oasis:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <strong className="text-white">14+ Days Written Notice:</strong> Option to transfer 100% of the tuition fee to a future batch within 6 months. If a cash refund is requested, a mandatory <strong className="text-white">20% Administrative Processing Fee</strong> will be retained by CyberGOAT Services LLC.
              </li>
              <li>
                <strong className="text-white">Under 14 Days Notice:</strong> Registration fees are strictly non-refundable. Students may nominate a substitute colleague from the same organization to attend in their place upon written notice.
              </li>
              <li>
                <strong className="text-white">No-Show Policy:</strong> Failure to attend scheduled live classes without prior written notice results in complete forfeiture of all course fees.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white border-l-4 border-[#C664FF] pl-3">
              4. Limitation of Liability &amp; Exam Outcome Disclaimer
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <strong className="text-white">Liability Cap:</strong> The maximum aggregate financial liability of CyberGOAT Services LLC for any service dispute or claim shall not exceed the net amount paid by the customer for that specific course.
              </li>
              <li>
                <strong className="text-white">Third-Party Exam Passing:</strong> CyberGOAT provides world-class exam preparation training, but individual passing scores on vendor certification exams (ISACA, ISC2, EC-Council, IAPP) depend on individual student preparation and are not guaranteed cash-back events.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white border-l-4 border-emerald-400 pl-3">
              5. Contact &amp; Legal Inquiries
            </h2>
            <p>
              For formal legal inquiries or order verification:
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm space-y-1 font-mono">
              <p>Legal &amp; Support Email: <a href="mailto:admin@cybergoat.ae" className="text-[#00F0FF] underline">admin@cybergoat.ae</a></p>
              <p>Official WhatsApp: <a href="https://wa.me/971551846786" target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] underline">+971 55 184 6786</a></p>
              <p>Headquarters: CyberGOAT Services LLC, Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
          <Link href="/" className="text-[#00F0FF] hover:underline font-bold">
            &larr; Return to Home Page
          </Link>
          <p>© 2026 CyberGOAT Services LLC. All rights reserved.</p>
        </div>
      </section>

      <Footer />
      <ChatbotWidget />
    </main>
  );
}
