import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Privacy Policy | CyberGOAT Services LLC',
  description: 'Official Privacy Policy and Data Protection guidelines for CyberGOAT Services LLC.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans selection:bg-[#0DCAF0]/30 selection:text-white">
      {/* Header */}
      <nav className="fixed w-full z-50 top-0 bg-[#0A0F1A]/90 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center">
            <Image 
              src="/CG White logo_.PNG" 
              alt="CyberGOAT" 
              width={300} 
              height={100} 
              priority 
              className="h-16 md:h-20 w-auto object-contain logo-bright-blue" 
            />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-24 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2F57EF]/30 bg-[#2F57EF]/10 text-[#0DCAF0] text-xs font-semibold mb-6">
          <ShieldCheckIcon className="w-4 h-4" /> Data Protection &amp; GDPR Compliance
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Privacy Policy - CyberGoat Services LLC
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Effective Date: September 18, 2024 | CyberGoat Services LLC
        </p>

        <div className="space-y-8 text-base leading-relaxed bg-[#05080F] border border-white/10 rounded-3xl p-8 md:p-12 glass-card">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white">Introduction</h2>
            <p>
              CyberGoat Services LLC (&ldquo;CyberGoat,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting the privacy of our customers, website visitors, and users of our services (&ldquo;you&rdquo; or &ldquo;your&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you interact with us or use our services, in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws. By accessing or using our services, you consent to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, phone number, mailing address, and other contact details.</li>
              <li><strong className="text-white">Account Information:</strong> Username, password, and other account credentials.</li>
              <li><strong className="text-white">Payment Information:</strong> Credit card details, billing address, and other payment-related information.</li>
              <li><strong className="text-white">Usage Data:</strong> Information about how you use our services, including IP address, device type, browser type, pages visited, and other usage statistics.</li>
              <li><strong className="text-white">Communications:</strong> Records of your communications with us, including emails, phone calls, and chat transcripts.</li>
              <li><strong className="text-white">Other Information:</strong> Any other information you provide to us, such as feedback, survey responses, or information collected through cookies and similar technologies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p>We may use your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Provide and Improve Our Services:</strong> To deliver, maintain, and improve our services, including responding to your inquiries, processing your transactions, and providing customer support.</li>
              <li><strong className="text-white">Personalize Your Experience:</strong> To tailor our services to your preferences and provide you with a more personalized experience.</li>
              <li><strong className="text-white">Communicate with You:</strong> To send you administrative information, updates, marketing communications, and other information related to our services.</li>
              <li><strong className="text-white">Protect Our Rights and Interests:</strong> To detect, prevent, and address fraud, security breaches, and other illegal activities.</li>
              <li><strong className="text-white">Comply with Legal Obligations:</strong> To comply with applicable laws, regulations, and legal processes, including the GDPR.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Lawful Basis for Processing</h2>
            <p>We process your personal information based on the following lawful bases under the GDPR:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Contractual Necessity:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong className="text-white">Legitimate Interests:</strong> Processing is necessary for our legitimate interests, such as providing and improving our services, marketing our products and services, and protecting our legal rights and interests.</li>
              <li><strong className="text-white">Consent:</strong> You have given us your consent to process your personal information for specific purposes.</li>
              <li><strong className="text-white">Legal Obligation:</strong> Processing is necessary for us to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. How We Share Your Information</h2>
            <p>We may share your personal information with the following parties:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Service Providers:</strong> Third-party service providers who assist us in providing our services, such as payment processors, IT service providers, and marketing agencies. We ensure these providers have appropriate data protection measures in place.</li>
              <li><strong className="text-white">Business Partners:</strong> Trusted business partners with whom we collaborate to offer you additional products or services.</li>
              <li><strong className="text-white">Affiliates:</strong> Our subsidiaries and affiliates within the CyberGoat corporate family.</li>
              <li><strong className="text-white">Legal Authorities:</strong> Government agencies, law enforcement officials, and other parties when required by law or to protect our legal rights.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. International Data Transfers</h2>
            <p>
              As a company operating in the UAE with customers from various continents, we may transfer your personal information to countries outside of your home country, including the UAE and other countries where we or our service providers operate. We will take appropriate measures to ensure that your personal information is protected in accordance with this Privacy Policy and applicable data protection laws, including the GDPR.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Data Retention</h2>
            <p>
              We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Your Rights</h2>
            <p>Under the GDPR, you have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Right of Access:</strong> You have the right to request access to your personal information.</li>
              <li><strong className="text-white">Right to Rectification:</strong> You have the right to request that we correct any inaccurate or incomplete personal information.</li>
              <li><strong className="text-white">Right to Erasure:</strong> You have the right to request that we erase your personal information in certain circumstances.</li>
              <li><strong className="text-white">Right to Data Portability:</strong> You have the right to receive your personal information in a structured, commonly used format.</li>
              <li><strong className="text-white">Right to Object:</strong> You have the right to object to the processing of your personal information.</li>
              <li><strong className="text-white">Right to Withdraw Consent:</strong> You have the right to withdraw your consent at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Children&rsquo;s Privacy</h2>
            <p>
              Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">9. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
            </p>
          </section>

          <section className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white">10. Contact Us &amp; Data Protection Officer</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white text-base mb-2">CyberGoat Services LLC</h3>
                <p className="text-gray-400">Makani A1, DSO-IFZA, IFZA Properties, Dubai Silicon Oasis, Dubai, UAE</p>
                <p className="mt-2 text-[#0DCAF0]">Email: admin@cybergoat.ae</p>
                <p className="text-gray-400">Mobile: +971 55 184 6786</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold text-white text-base mb-2">Data Protection Officer</h3>
                <p className="text-gray-400"><strong className="text-white">DPO:</strong> Shahzad Quadri</p>
                <p className="mt-2 text-[#0DCAF0]">Email: shahzad@cybergoat.ae</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
