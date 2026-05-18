"use client";

import Link from "next/link";
import { cn } from "@/styles/worker-design-system";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/worker"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Worker Help & Guide</h1>
          <p className="text-lg text-neutral-600">Everything you need to know about completing tasks successfully</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="#how-it-works" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              How the Dashboard Works
            </a>
            <a href="#task-completion" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Task Completion Process
            </a>
            <a href="#requirements" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Task Requirements
            </a>
            <a href="#best-practices" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Best Practices
            </a>
            <a href="#faq" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Common Questions
            </a>
            <a href="#contact" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>

        {/* How Dashboard Works */}
        <section id="how-it-works" className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">How the Worker Dashboard Works</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">📊 Overview Section</h3>
              <p className="text-neutral-700 mb-3">Shows your key metrics at a glance:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-neutral-700">• <strong>Available Tasks:</strong> Tasks you can accept right now</li>
                <li className="text-neutral-700">• <strong>Active Tasks:</strong> Tasks you're currently working on</li>
                <li className="text-neutral-700">• <strong>Completed:</strong> Successfully finished tasks with success rate</li>
                <li className="text-neutral-700">• <strong>Balance:</strong> Money available to withdraw</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">📋 My Tasks Page</h3>
              <p className="text-neutral-700 mb-3">Manage all your tasks in one place:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-neutral-700">• <strong>Active Tab:</strong> Tasks you need to complete (with countdown timer)</li>
                <li className="text-neutral-700">• <strong>Submitted Tab:</strong> Tasks waiting for admin review</li>
                <li className="text-neutral-700">• <strong>Completed Tab:</strong> Approved tasks (paid or rejected)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">💰 Earnings Page</h3>
              <p className="text-neutral-700 mb-3">Track your money:</p>
              <ul className="space-y-2 ml-6">
                <li className="text-neutral-700">• <strong>Available Balance:</strong> Ready to withdraw</li>
                <li className="text-neutral-700">• <strong>Pending:</strong> Earnings in 24-48 hour hold period (fraud protection)</li>
                <li className="text-neutral-700">• <strong>Transaction History:</strong> All your earnings and withdrawals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Task Completion Process */}
        <section id="task-completion" className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Task Completion Process</h2>
          
          <div className="space-y-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Accept a Task</h3>
                  <p className="text-sm text-neutral-700">Browse available tasks and click "Accept Task" on one that matches your skills and availability.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Read Task Instructions Carefully</h3>
                  <p className="text-sm text-neutral-700 mb-2">Every task has specific requirements. Read everything before starting!</p>
                  <ul className="space-y-1 ml-4 text-sm text-neutral-700">
                    <li>• Platform name (Instagram, Facebook, Google, etc.)</li>
                    <li>• Exact action required (follow, like, review, etc.)</li>
                    <li>• Target URL or profile</li>
                    <li>• Special instructions (language, rating, content)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Complete the Required Action</h3>
                  <p className="text-sm text-neutral-700">Go to the platform and perform the task naturally and authentically.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Submit Proof</h3>
                  <p className="text-sm text-neutral-700">Provide evidence that you completed the task (screenshot, link, confirmation).</p>
                </div>
              </div>
            </div>

            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Get Paid</h3>
                  <p className="text-sm text-neutral-700">After admin approval, earnings go to "Pending" for 24-48 hours, then become available to withdraw.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task Requirements */}
        <section id="requirements" className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">⚠️ Important: Task Requirements</h2>
          
          <div className="bg-warning-50 border-l-4 border-warning-500 p-4 mb-6">
            <p className="text-sm font-semibold text-warning-900 mb-2">Some tasks require preparation before you can complete them!</p>
            <p className="text-sm text-warning-800">Read the task details carefully to avoid wasting time.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">📱 App Installation Required</h3>
              <p className="text-neutral-700 mb-2">Many tasks require you to have the platform's app installed:</p>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• <strong>Instagram:</strong> Download Instagram app from App Store/Play Store</li>
                <li>• <strong>TikTok:</strong> Download TikTok app</li>
                <li>• <strong>Facebook:</strong> Download Facebook app</li>
                <li>• <strong>Google Reviews:</strong> Google Maps app required</li>
                <li>• <strong>Yelp:</strong> Yelp app recommended</li>
              </ul>
              <p className="text-sm text-neutral-600 mt-3 italic">💡 Tip: Install common social media apps in advance to accept more tasks quickly.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">👤 Account Creation</h3>
              <p className="text-neutral-700 mb-2">You must have an active account on the platform:</p>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Create a <strong>real, authentic account</strong> with your actual information</li>
                <li>• Add a profile picture and bio</li>
                <li>• Follow some accounts to look natural</li>
                <li>• <strong>Never use fake or bot accounts</strong> - this will get you banned</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">📅 Appointments & Bookings</h3>
              <p className="text-neutral-700 mb-2">Some review tasks may require:</p>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Booking an appointment (salons, restaurants, services)</li>
                <li>• Visiting a physical location</li>
                <li>• Making a purchase or using a service</li>
              </ul>
              <p className="text-sm text-warning-700 mt-3">⚠️ Check task details - these tasks usually pay more but require more effort.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">🔍 Research Required</h3>
              <p className="text-neutral-700 mb-2">Before completing tasks, do your research:</p>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Visit the target profile/page to understand the content</li>
                <li>• Read existing reviews to match the tone</li>
                <li>• Check what kind of engagement is natural for that account</li>
                <li>• Understand the platform's guidelines</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">✅ Best Practices to Avoid Suspicion & Bans</h2>
          
          <div className="bg-error-50 border-l-4 border-error-500 p-4 mb-6">
            <p className="text-sm font-semibold text-error-900 mb-2">🚨 Critical: Platforms detect fake engagement!</p>
            <p className="text-sm text-error-800">Follow these rules to protect your account and get paid.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">🎭 Act Natural</h3>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• <strong>Don't rush:</strong> Spend time on the profile like a real user would</li>
                <li>• <strong>Browse content:</strong> Look at a few posts before liking/following</li>
                <li>• <strong>Vary your timing:</strong> Don't complete 10 tasks in 2 minutes</li>
                <li>• <strong>Use natural language:</strong> Write reviews like you're a real customer</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">📝 For Review Tasks</h3>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Write <strong>unique, detailed reviews</strong> (not copy-paste)</li>
                <li>• Include specific details about the business/product</li>
                <li>• Use proper grammar and spelling</li>
                <li>• Match the required star rating exactly</li>
                <li>• Add photos if the task requires it</li>
                <li>• <strong>Never mention you're being paid</strong> for the review</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">⏰ Respect Time Limits</h3>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Each task has a countdown timer - complete before it expires</li>
                <li>• If you can't finish, don't accept the task</li>
                <li>• Late submissions may be rejected</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">📸 Provide Clear Proof</h3>
              <ul className="space-y-2 ml-6 text-neutral-700">
                <li>• Take clear screenshots showing the completed action</li>
                <li>• Include timestamps if possible</li>
                <li>• Show your username/profile in the screenshot</li>
                <li>• Don't edit or fake screenshots - you will be banned</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">🚫 What NOT to Do</h3>
              <ul className="space-y-2 ml-6 text-error-700">
                <li>• ❌ Use bots or automation tools</li>
                <li>• ❌ Create fake accounts</li>
                <li>• ❌ Copy-paste the same review multiple times</li>
                <li>• ❌ Complete tasks you're not qualified for</li>
                <li>• ❌ Share your account with others</li>
                <li>• ❌ Accept tasks you can't complete</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">❓ Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">Why is my earning in "Pending"?</h3>
              <p className="text-neutral-700">All earnings are held for 24-48 hours as fraud protection. This ensures task quality and protects both workers and clients.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">What if I can't complete a task I accepted?</h3>
              <p className="text-neutral-700">Contact admin immediately through "Contact Admin" in the sidebar. Don't let the timer expire without communication.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">Why was my task rejected?</h3>
              <p className="text-neutral-700">Common reasons: incomplete action, poor quality proof, fake screenshot, didn't follow instructions, or suspicious activity detected.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">How do I withdraw my earnings?</h3>
              <p className="text-neutral-700">Go to Earnings page → Click "Withdraw" button → Follow the withdrawal process. Minimum withdrawal amount applies.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">Can I use VPN?</h3>
              <p className="text-neutral-700">Check task requirements. Some tasks require your real location. Using VPN for location-based tasks may result in rejection.</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">What happens if my account gets banned from a platform?</h3>
              <p className="text-neutral-700">This is why following best practices is critical. If banned, you can't complete tasks for that platform. Always act naturally and follow platform guidelines.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-primary-50 border border-primary-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">💬 Need More Help?</h2>
          <p className="text-neutral-700 mb-6">Our support team is here to help you succeed!</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Admin
            </Link>
            <Link
              href="/dashboard/worker"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
