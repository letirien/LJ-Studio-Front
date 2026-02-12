import Layout from "../../components/layout";
import Head from "next/head";

export default function Legal() {
  return (
    <Layout>
      <Head>
        <title>Legal Notice & Privacy Policy — LJ Studio</title>
        <meta name="description" content="Legal notice and privacy policy for LJ Studio website." />
      </Head>

      <div className="bg-black text-white min-h-screen px-6 sm:px-16 lg:px-32 pt-40 pb-24 mx-auto max-w-7xl">
        {/* ── Legal Notice ── */}
        <section id="legal-notice" className="mb-24 robotoRegular">
          <h1 className="text-4xl sm:text-5xl uppercase helveticaNowDisplayBold mb-16">Legal Notice</h1>

          <div className="space-y-12 text-sm sm:text-base leading-relaxed max-w-3xl">
            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">1. Website Publisher</h2>
              <p>This website is published by:</p>
              <ul className="mt-2 space-y-1">
                <li><strong>LJ STUDIO</strong> (EURL)</li>
                <li>Registered office: 128 Rue La Boetie, 75008 Paris, France</li>
                <li>Trade register: RCS Paris 903 836 799</li>
                <li>SIRET: 903 836 799 00010</li>
                <li>VAT number: FR54 903 836 799</li>
                <li>Publication Director: Jean BRONNER</li>
                <li>Contact email: <a href="mailto:jean@ljstudio.xyz" className="underline">jean@ljstudio.xyz</a></li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">2. Hosting Provider</h2>
              <p>This website is hosted by:</p>
              <ul className="mt-2 space-y-1">
                <li><strong>Vercel Inc.</strong></li>
                <li>440 N Barranca Ave #4133, Covina, CA 91723, United States</li>
                <li>Website: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline">vercel.com</a></li>
              </ul>
              <p className="mt-3">Domain name registered with Squarespace Domains (formerly Google Domains).</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">3. Intellectual Property</h2>
              <p>Unless otherwise stated, all content available on this website (including, without limitation, text, visuals, graphics, videos, logos, and design elements) is protected by applicable intellectual property laws and remains the exclusive property of LJ STUDIO.</p>
              <p className="mt-3">Any reproduction, representation, adaptation, modification, distribution, or republication, in whole or in part, by any means whatsoever, is strictly prohibited without prior written permission from LJ STUDIO.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">4. Liability</h2>
              <p>LJ STUDIO makes reasonable efforts to ensure that the information published on this website is accurate and up to date. However, LJ STUDIO provides the content &quot;as is&quot; and makes no warranty (express or implied) regarding its completeness, accuracy, or availability.</p>
              <p className="mt-3">LJ STUDIO shall not be liable for any direct or indirect damages arising from access to, or use of, the website.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">5. External Links</h2>
              <p>This website may contain links to third-party websites. LJ STUDIO has no control over such websites and assumes no responsibility for their content, policies, or practices.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">6. Governing Law & Jurisdiction</h2>
              <p>This website and this Legal Notice are governed by French law.</p>
              <p className="mt-3">Any dispute shall fall under the exclusive jurisdiction of the competent courts of Paris, France, unless mandatory legal provisions provide otherwise.</p>
            </div>
          </div>
        </section>

        {/* ── Separator ── */}
        <hr className="border-white/20 mb-24" />

        {/* ── Privacy Policy ── */}
        <section id="privacy-policy">
          <h1 className="text-4xl sm:text-5xl uppercase helveticaNowDisplayBold mb-16">Privacy Policy</h1>

          <div className="space-y-12 text-sm sm:text-base leading-relaxed max-w-3xl">
            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">1. Data Controller</h2>
              <p>The data controller is:</p>
              <ul className="mt-2 space-y-1">
                <li><strong>LJ STUDIO</strong> (EURL)</li>
                <li>128 Rue La Boetie, 75008 Paris, France</li>
                <li>Email: <a href="mailto:jean@ljstudio.xyz" className="underline">jean@ljstudio.xyz</a></li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">2. Scope</h2>
              <p>This Privacy Policy explains how LJ STUDIO collects and processes personal data when you browse this website and when you contact us.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">3. Personal Data We Collect</h2>
              <h3 className="font-bold mt-4 mb-2">a) Data you provide</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Identity and contact details (e.g., name, company, email address)</li>
                <li>Content of your message (when you contact us via form or email)</li>
              </ul>
              <h3 className="font-bold mt-4 mb-2">b) Data collected automatically</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Technical data (e.g., IP address, device type, browser, operating system)</li>
                <li>Usage data (e.g., pages visited, time spent, referral source)</li>
                <li>Cookie identifiers (where applicable)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">4. Purposes of Processing</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Responding to inquiries and messages</li>
                <li>Managing pre-contractual discussions and business relationships</li>
                <li>Ensuring website operation, security, and troubleshooting</li>
                <li>Measuring audience and improving website performance (analytics)</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">5. Legal Bases (GDPR)</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Legitimate interests</strong> (security, website improvement, service management)</li>
                <li><strong>Pre-contractual steps / contract performance</strong> (handling requests, quotes, services)</li>
                <li><strong>Consent</strong> (for non-essential cookies, including analytics cookies, where required)</li>
                <li><strong>Legal obligations</strong> (compliance, record-keeping)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">6. Cookies and Analytics (Google Analytics)</h2>
              <p>We use Google Analytics to understand how visitors use the website and to improve content and performance.</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>In France, audience-measurement cookies may be exempt from consent under specific conditions; otherwise, consent is required.</li>
                <li>Where required, you can accept or refuse non-essential cookies via the cookie banner.</li>
                <li>You may also manage cookies via your browser settings.</li>
              </ul>
              <p className="mt-3">Google Analytics retention: For GA4 user-level data, retention can be set to 2 months or 14 months.</p>
              <p className="mt-1"><strong>Our chosen retention period: 14 months.</strong></p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">7. Data Recipients</h2>
              <p>Personal data is accessed only by LJ STUDIO and trusted service providers strictly necessary to operate the website (e.g., hosting provider, analytics provider).</p>
              <p className="mt-3">We do not sell personal data.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">8. International Data Transfers</h2>
              <p>Some service providers may process data outside the European Economic Area. Where applicable, transfers are handled using appropriate safeguards (such as Standard Contractual Clauses and supplementary measures where required).</p>
              <p className="mt-3">For analytics tools, specific compliance considerations may apply.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">9. Data Retention</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact requests: 24 months</li>
                <li>Analytics data (GA4 retention setting): 14 months</li>
                <li>Cookies: 13 months</li>
                <li>Legal/contractual records (if applicable): as required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">10. Security</h2>
              <p>We implement reasonable technical and organizational measures designed to protect personal data against unauthorized access, alteration, disclosure, or destruction. No system is completely secure, and we cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">11. Your Rights</h2>
              <p>Where the GDPR applies, you have the right to: access, rectification, erasure, restriction, objection, portability, and to withdraw consent at any time where processing is based on consent.</p>
              <p className="mt-3">To exercise your rights, contact: <a href="mailto:jean@ljstudio.xyz" className="underline">jean@ljstudio.xyz</a>.</p>
              <p className="mt-3">You also have the right to lodge a complaint with the <strong>CNIL</strong> (France).</p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl uppercase helveticaNowDisplayBold mb-4">12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the updated date.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
