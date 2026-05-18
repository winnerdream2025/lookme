import Link from 'next/link';

export default function GoogleReviewsHowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">How Google Reviews Work</h1>
          <p className="text-xl text-blue-100">
            Real customers leaving authentic reviews that stick
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* The Problem */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">❌ Why Fake Reviews Get Deleted</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Google is extremely sophisticated at detecting fake reviews. Here's what they track:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Device Hardware ID:</strong> If 5 reviews come from the same phone, all 5 get deleted</li>
              <li><strong>IP Address:</strong> Multiple reviews from same IP = instant red flag</li>
              <li><strong>Email Account Age:</strong> New Gmail accounts posting reviews = suspicious</li>
              <li><strong>Review Patterns:</strong> Similar wording, same time, same location = bot detection</li>
            </ul>
            <p className="mt-4 font-semibold text-red-600">
              Result: 95% of fake reviews deleted within 72 hours
            </p>
          </div>
        </section>

        {/* Our Solution */}
        <section className="mb-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">✅ Our 3-Layer Anti-Fraud System</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📧</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Layer 1: Unique Email Accounts</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong className="text-blue-600">Rule:</strong> 1 Email = 1 Review per Business
                  </p>
                  <p className="text-gray-600 text-sm">
                    Each worker must use a different Gmail account. Our system blocks the same email 
                    from reviewing your business twice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📱</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Layer 2: Unique Physical Devices</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong className="text-purple-600">Rule:</strong> 1 Device = 1 Review per Business
                  </p>
                  <p className="text-gray-600 text-sm">
                    We track device hardware fingerprints. A worker cannot use 5 different Google 
                    accounts on the same phone to post 5 reviews. Each review must come from a 
                    different physical device.
                  </p>
                  <div className="mt-3 bg-purple-50 p-3 rounded border border-purple-200">
                    <p className="text-xs text-purple-800">
                      <strong>Why this matters:</strong> Google tracks device IDs. If they see 5 reviews 
                      from the same iPhone, they delete all 5. We prevent this.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌐</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Layer 3: Unique IP Addresses</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong className="text-green-600">Rule:</strong> 1 IP = 1 Review per Business
                  </p>
                  <p className="text-gray-600 text-sm">
                    Every review comes from a different internet connection. Workers use their home WiFi, 
                    mobile data, or work connections - all unique IPs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">🎬 Step-by-Step Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">You Provide Business Details</h3>
                <p className="text-gray-700 text-sm">
                  Give us your Google Business Profile link, desired star rating (1-5), and any 
                  specific points you want mentioned (e.g., "great customer service", "clean facility").
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">We Match You with Real Reviewers</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Each review task is assigned to a different worker who:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Has an aged Gmail account (6+ months old)</li>
                  <li>✓ Has never reviewed your business before</li>
                  <li>✓ Uses a unique physical device</li>
                  <li>✓ Matches your gender requirement (if specified)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Worker Accepts Task</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Before accepting, the worker must provide:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2 text-sm">
                    <li>📧 <strong>Gmail account email</strong> they'll use for the review</li>
                    <li>📱 <strong>Device fingerprint</strong> (automatically captured)</li>
                  </ul>
                </div>
                <p className="text-gray-700 text-sm mt-3">
                  Our system instantly checks:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>❌ Has this email reviewed this business? → Blocked</li>
                  <li>❌ Has this device reviewed this business? → Blocked</li>
                  <li>✅ Both unique? → Task assigned</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Worker Posts Review</h3>
                <p className="text-gray-700 text-sm">
                  The worker logs into their Gmail account on their device, visits your Google Business 
                  Profile, and posts an authentic review based on your guidelines. They write in their 
                  own words to avoid pattern detection.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Worker Submits Proof</h3>
                <p className="text-gray-700 text-sm">
                  Worker provides a screenshot showing:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                  <li>Their review posted on your business page</li>
                  <li>Star rating visible</li>
                  <li>Their Google account name</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">We Verify & You See Results</h3>
                <p className="text-gray-700 text-sm">
                  Our team manually verifies the screenshot, then the review appears on your Google 
                  Business Profile within 24-48 hours.
                </p>
                <p className="mt-3 font-semibold text-green-700">
                  Result: Review stays permanent! ✅
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Standards */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">⭐ Our Quality Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold mb-2">Aged Accounts Only</h3>
              <p className="text-sm text-gray-700">
                Workers must use Gmail accounts that are at least 6 months old with review history. 
                New accounts get flagged by Google.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold mb-2">Real Devices Required</h3>
              <p className="text-sm text-gray-700">
                Each review must come from a different smartphone, tablet, or computer. We track 
                hardware fingerprints to enforce this.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold mb-2">Unique Content</h3>
              <p className="text-sm text-gray-700">
                Workers write reviews in their own words. We don't provide templates to avoid 
                Google's pattern detection algorithms.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-bold mb-2">Gradual Posting</h3>
              <p className="text-sm text-gray-700">
                Reviews are posted over 3-7 days to appear natural. Sudden spikes of reviews 
                trigger Google's fraud detection.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">💰 Transparent Pricing</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">$4.00</div>
              <div className="text-gray-600">per review</div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>5 reviews:</span>
                <span className="font-bold">$20.00</span>
              </p>
              <p className="flex justify-between">
                <span>10 reviews:</span>
                <span className="font-bold">$40.00</span>
              </p>
              <p className="flex justify-between">
                <span>25 reviews:</span>
                <span className="font-bold">$100.00</span>
              </p>
              <p className="flex justify-between">
                <span>50 reviews:</span>
                <span className="font-bold">$200.00</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Worker gets $2.40 per review. Platform keeps $1.60 for verification and anti-fraud protection.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">❓ Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">Will Google delete these reviews?</h3>
              <p className="text-gray-700 text-sm">
                Our 3-layer anti-fraud system (unique emails + unique devices + unique IPs) ensures 
                reviews pass Google's detection algorithms. Retention rate: 99%+
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">How long does delivery take?</h3>
              <p className="text-gray-700 text-sm">
                Reviews are posted gradually over 3-7 days to appear natural. Rush delivery (24-48 hours) 
                available for additional fee.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I choose the star rating?</h3>
              <p className="text-gray-700 text-sm">
                Yes! You can request 1-5 stars. We recommend 4-5 stars for best results. All 5-star 
                reviews can look suspicious.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if a review gets deleted?</h3>
              <p className="text-gray-700 text-sm">
                Extremely rare with our system (&lt;1%). If it happens, we replace it for free within 
                30 days.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I specify gender or location?</h3>
              <p className="text-gray-700 text-sm">
                Yes! You can require male/female reviewers. Location targeting available for premium pricing.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/services/google-reviews"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Order Google Reviews Now
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            <Link href="/terms" className="underline">View Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
