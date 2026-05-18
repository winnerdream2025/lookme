import Link from 'next/link';

export default function YouTubeViewsHowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">How YouTube Views Work</h1>
          <p className="text-xl text-red-100">
            Real people watching your videos for real results
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* The Problem */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">❌ Why Cheap Bot Views Don't Work</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Most SMM panels use bots or fake accounts to generate views. Here's what happens:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bot clicks video and closes it after 2 seconds</li>
              <li>YouTube detects: "1,000 views, all &lt; 5 seconds = BOT TRAFFIC"</li>
              <li><strong className="text-red-600">All views deleted within 48 hours</strong></li>
              <li>Your money is wasted</li>
            </ul>
          </div>
        </section>

        {/* Our Solution */}
        <section className="mb-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">✅ Our Solution: Real People, Real Views</h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg font-semibold text-green-700">
              We use real people on real devices watching your videos for a minimum of 30 seconds.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-bold mb-2">Real Workers</h3>
                <p className="text-sm">Verified humans, not bots or fake accounts</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-bold mb-2">Real Devices</h3>
                <p className="text-sm">Mobile phones, tablets, computers - all unique</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">🌐</div>
                <h3 className="font-bold mb-2">Real IPs</h3>
                <p className="text-sm">1,000 views = 1,000 different IP addresses</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl mb-2">⏱️</div>
                <h3 className="font-bold mb-2">Real Watch Time</h3>
                <p className="text-sm">Minimum 30 seconds per view (YouTube's threshold)</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">🎬 How The Process Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">You Place an Order</h3>
                <p className="text-gray-700">
                  Choose the number of views you want (minimum 100, maximum 10,000 per order).
                  Provide your YouTube video URL.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">We Create Individual Tasks</h3>
                <p className="text-gray-700">
                  Your order is split into individual viewing tasks. Each task is assigned to a 
                  different worker on our platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Workers Watch Your Video</h3>
                <p className="text-gray-700 mb-3">
                  Each worker opens your video in a special viewer with a countdown timer:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Video plays in iframe for 30 seconds minimum</li>
                    <li>✓ Timer pauses if worker switches tabs (anti-cheat)</li>
                    <li>✓ Worker must keep video visible and playing</li>
                    <li>✓ Timer reaches 0 = task complete</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Automatic Verification</h3>
                <p className="text-gray-700">
                  Our system automatically verifies:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Worker watched for minimum 30 seconds</li>
                  <li>Unique IP address (not used for this video before)</li>
                  <li>Unique device (hardware fingerprint)</li>
                  <li>Worker hasn't viewed this video before</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Views Appear on YouTube</h3>
                <p className="text-gray-700">
                  YouTube counts the view because it meets all their requirements:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Real person watching (not a bot)</li>
                  <li>Watched for 30+ seconds</li>
                  <li>Unique IP address</li>
                  <li>Real device with real browser</li>
                </ul>
                <p className="mt-3 font-semibold text-green-700">
                  Result: Views stay permanent! ✅
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Fraud Measures */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">🛡️ Our Anti-Fraud Protection</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <h3 className="font-bold mb-1">1 Worker = 1 View per Video</h3>
              <p className="text-gray-700 text-sm">
                Once a worker views your video, they can never view it again. The video disappears 
                from their task feed forever.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4 py-2">
              <h3 className="font-bold mb-1">1 IP Address = 1 View per Video</h3>
              <p className="text-gray-700 text-sm">
                Every view comes from a unique IP address. To get 1,000 views, we need 1,000 different 
                workers on 1,000 different internet connections.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-bold mb-1">Minimum 30-Second Watch Time</h3>
              <p className="text-gray-700 text-sm">
                YouTube counts a view after 30 seconds. Our timer system forces workers to watch for 
                at least 30 seconds. They cannot skip or fast-forward.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h3 className="font-bold mb-1">Tab Visibility Detection</h3>
              <p className="text-gray-700 text-sm">
                If a worker switches to another tab or minimizes the window, the timer automatically 
                pauses. They must return to the video to continue.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Guarantee */}
        <section className="mb-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-8 border-2 border-yellow-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">⭐ Quality Guarantee</h2>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>99%+ Retention Rate:</strong> Views stay permanent on your video</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Real Watch Time:</strong> Average 35+ seconds per view</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Unique IPs:</strong> Every view from a different IP address</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>No Bots:</strong> 100% real human viewers</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Gradual Delivery:</strong> Views delivered naturally over time</span>
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">💰 Transparent Pricing</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-blue-600">$0.05</div>
              <div className="text-gray-600">per view</div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>100 views:</span>
                <span className="font-bold">$5.00</span>
              </p>
              <p className="flex justify-between">
                <span>500 views:</span>
                <span className="font-bold">$25.00</span>
              </p>
              <p className="flex justify-between">
                <span>1,000 views:</span>
                <span className="font-bold">$50.00</span>
              </p>
              <p className="flex justify-between">
                <span>5,000 views:</span>
                <span className="font-bold">$250.00</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Higher quality than bot services. Lower price than influencer marketing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">❓ Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-2">How long does delivery take?</h3>
              <p className="text-gray-700 text-sm">
                Views are delivered gradually over 24-72 hours to appear natural to YouTube. 
                Rush delivery available for an additional fee.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Will YouTube delete these views?</h3>
              <p className="text-gray-700 text-sm">
                No. Because we use real people watching for real durations from real devices, 
                YouTube sees this as organic traffic. Our retention rate is 99%+.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Can I order views for multiple videos?</h3>
              <p className="text-gray-700 text-sm">
                Yes! Place a separate order for each video. Each video gets its own pool of unique viewers.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">What if I don't get all the views?</h3>
              <p className="text-gray-700 text-sm">
                We guarantee delivery of the full amount. If any views drop (extremely rare), 
                we automatically refill them at no extra cost.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Is this against YouTube's terms of service?</h3>
              <p className="text-gray-700 text-sm">
                We use real people watching real videos. This is no different than running an ad 
                campaign or asking friends to watch. YouTube's issue is with bots and fake accounts, 
                which we never use.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/services/youtube-views"
            className="inline-block bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Order YouTube Views Now
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            <Link href="/terms" className="underline">View Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
