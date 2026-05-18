import Link from "next/link";

export const metadata = { title: "Terms of Service — LookMe" };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to LookMe
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Terms of Service</h1>
      <p className="text-neutral-500 text-sm mb-10">Last updated: May 2026</p>

      <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-700">

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">1. About LookMe</h2>
          <p>
            LookMe is a social engagement marketplace that connects clients who want to grow their online
            presence with workers who complete micro-tasks. By using this platform you agree to be bound
            by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">2. Client Terms</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Clients purchase engagement services (followers, likes, views, reviews) for their own accounts or managed accounts they have permission to promote.</li>
            <li>You must own or have explicit permission to manage the target account or business listing.</li>
            <li>LookMe does not guarantee specific results. Delivery estimates are approximations.</li>
            <li>Orders are non-refundable once tasks have been distributed to workers and work has commenced.</li>
            <li>Partial refunds may be issued at LookMe's discretion for unfulfilled portions of an order.</li>
            <li>Do not use LookMe to artificially inflate metrics in violation of any third-party platform's terms of service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">3. Worker Terms</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Workers must be at least 18 years old.</li>
            <li>Workers must complete tasks using real, personally owned accounts. Bots, automation tools, or shared accounts are strictly prohibited.</li>
            <li>Workers must submit genuine proof of task completion (screenshots, usernames, review text). Fabricated or AI-generated proof is grounds for immediate termination.</li>
            <li>For review tasks, workers must use their own genuine Google/Yelp/App Store account and write an original, honest-sounding review as specified in the task instructions.</li>
            <li>A worker may only complete one review task per business target, per account. Attempting to review the same business multiple times from the same account will result in task rejection and trust score penalty.</li>
            <li>Workers must read the full task instructions before accepting. Accepting a task constitutes agreement to complete it within the specified time limit (30 minutes).</li>
            <li>Failure to submit within the deadline will expire the task and return it to the pool. Repeat expirations reduce your trust score.</li>
            <li>Workers with a trust score below 20 will be suspended from the task feed.</li>
            <li>LookMe reserves the right to withhold payment for tasks that fail verification review.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">4. Review Task Rules</h2>
          <p className="mb-2">
            Review tasks carry specific obligations due to the sensitive nature of posting public reviews:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>To protect our clients&apos; accounts from spam filters, reviews are distributed at a maximum rate of 10 per day per business.</li>
            <li>You must declare the email address of the account you will use before accepting a review task. This information is stored and used to prevent duplicate reviews from the same account.</li>
            <li>The same email address may not be used to review the same business twice, across any orders or any time period.</li>
            <li>Reviews must meet the minimum length and content requirements specified in the task. Short or low-effort reviews will be rejected.</li>
            <li>LookMe does not instruct workers to write false or misleading reviews. Workers agree to write reviews that represent a genuine experience or opinion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">5. Payments & Wallet</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Worker rewards are credited to your LookMe wallet upon task verification.</li>
            <li>Minimum withdrawal amount is $5.00.</li>
            <li>Withdrawals are processed via Stripe Connect and may take 2–5 business days.</li>
            <li>LookMe charges a 15% platform fee on all worker rewards.</li>
            <li>Client funds are held in escrow and released to workers as tasks are verified.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">6. Prohibited Activities</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Using bots, scripts, or automation to complete tasks</li>
            <li>Creating multiple worker accounts to bypass per-worker limits</li>
            <li>Submitting fake or AI-generated screenshots or review text</li>
            <li>Attempting to reverse-engineer or scrape the LookMe platform</li>
            <li>Selling or transferring your worker account to another person</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">7. Termination</h2>
          <p>
            LookMe reserves the right to suspend or permanently ban any account found to be in violation
            of these terms, with or without notice. Banned accounts forfeit any pending wallet balance
            associated with tasks under dispute.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">8. Limitation of Liability</h2>
          <p>
            LookMe is not responsible for actions taken by third-party platforms (Google, Instagram, etc.)
            as a result of engagement activities. Clients use this service at their own risk and are
            responsible for compliance with the terms of service of any third-party platform they use
            LookMe to promote.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">9. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-neutral-900 mb-3">10. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href="mailto:legal@lookme.io" className="text-neutral-900 underline">legal@lookme.io</a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-neutral-100 flex gap-6">
        <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
          Privacy Policy
        </Link>
        <Link href="/register" className="text-sm text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
          Back to Register
        </Link>
      </div>
    </div>
  );
}
