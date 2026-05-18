import Link from "next/link";

export const metadata = { title: "Cookie Policy — LookMe" };

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to LookMe
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Cookie Policy</h1>
      <p className="text-neutral-500 text-sm mb-10">Last updated: May 2026</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-700">

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website.
            They help the site remember information about your visit, such as your login session,
            preferences, and settings. Cookies cannot run programs or deliver viruses to your device.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">2. Cookies We Use</h2>
          <p className="mb-3">LookMe uses only the cookies that are strictly necessary to operate the platform:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 pr-4 font-semibold text-neutral-900 whitespace-nowrap">Name</th>
                  <th className="text-left py-2 pr-4 font-semibold text-neutral-900 whitespace-nowrap">Purpose</th>
                  <th className="text-left py-2 font-semibold text-neutral-900 whitespace-nowrap">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-neutral-600 whitespace-nowrap">lookme_token</td>
                  <td className="py-3 pr-4 text-neutral-700">Stores your encrypted authentication token to keep you logged in across page loads.</td>
                  <td className="py-3 text-neutral-700 whitespace-nowrap">Session / 7 days</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-neutral-600 whitespace-nowrap">lookme_role</td>
                  <td className="py-3 pr-4 text-neutral-700">Records your account role (client or worker) to render the correct dashboard.</td>
                  <td className="py-3 text-neutral-700 whitespace-nowrap">Session / 7 days</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-neutral-600 whitespace-nowrap">lookme_logged_in</td>
                  <td className="py-3 pr-4 text-neutral-700">A lightweight flag read by our Edge middleware to route unauthenticated users to the login page before the page is rendered.</td>
                  <td className="py-3 text-neutral-700 whitespace-nowrap">Session / 7 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">3. What We Do Not Use</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>No advertising or tracking cookies.</strong> We do not run ad networks, retargeting pixels, or cross-site tracking.</li>
            <li><strong>No third-party analytics cookies.</strong> Any analytics we run are server-side and do not place cookies on your device.</li>
            <li><strong>No social media cookies.</strong> We do not embed like buttons or share widgets that set third-party cookies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">4. How We Store Cookies</h2>
          <p>
            Authentication cookies are stored in <code className="bg-neutral-100 px-1 rounded text-xs">localStorage</code> and
            as <code className="bg-neutral-100 px-1 rounded text-xs">HttpOnly</code> cookies where applicable.
            The <code className="bg-neutral-100 px-1 rounded text-xs">lookme_logged_in</code> flag is a plain cookie readable
            by our Edge middleware but contains no sensitive data. Token values are signed JWTs and are
            validated server-side on every request.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">5. Managing Cookies</h2>
          <p className="mb-2">
            Because LookMe only sets essential session cookies, disabling cookies in your browser will
            prevent you from logging in and using the platform.
          </p>
          <p className="mb-2">You can manage cookies in your browser settings:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>
          <p className="mt-2">
            You can also delete all LookMe cookies at any time by clearing your browser data for this site,
            which will log you out of any active session.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">6. Consent</h2>
          <p>
            By using LookMe you consent to our use of the essential cookies described in this policy.
            Since these cookies are strictly necessary for the platform to function, they do not require
            an opt-in banner under most cookie regulations. We do not set any cookies that require
            your explicit prior consent.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page
            with an updated date. Continued use of the platform after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">8. Contact</h2>
          <p>
            For questions about our use of cookies, contact us at{" "}
            <a href="mailto:privacy@lookme.io" className="text-neutral-900 underline">privacy@lookme.io</a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-neutral-100 flex gap-6">
        <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
