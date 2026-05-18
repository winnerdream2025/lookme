/**
 * Task Instructions Generator
 * 
 * Generates clear, bulletproof instructions for workers based on service type.
 * Workers see exactly what they need to do, with no confusion.
 */

import type {
  ReviewServiceInput,
  SocialGrowthInput,
  ViewsInput,
  WebTrafficInput,
} from '@lookme/validation';

export class TaskInstructionsService {
  /**
   * Generate instructions for REVIEW tasks
   */
  static generateReviewInstructions(
    platformName: string,
    inputs: ReviewServiceInput
  ): string {
    const reviewText = inputs.reviewTextOption === 'client_provided'
      ? `**Review Text to Post:**\n"${inputs.customReviewText}"\n\n`
      : `**Review Text:** Write a unique, authentic ${inputs.starRating}-star review (minimum 2 sentences) based on the business type${inputs.businessType ? ` (${inputs.businessType})` : ''}.\n\n`;

    const keyPointsSection = inputs.keyPoints && inputs.keyPoints.length > 0
      ? `**Key Points to Mention:**\n${inputs.keyPoints.map(point => `- ${point}`).join('\n')}\n\n`
      : '';

    return `
## Task Instructions: ${platformName} Review

**Business:** ${inputs.businessName}
**Target URL:** ${inputs.targetUrl}
**Star Rating:** ${inputs.starRating} stars

${reviewText}${keyPointsSection}

### Step-by-Step Instructions:

1. **Open the Business Profile**
   - Copy the target URL above and open it in your browser or map app
   - Make sure you're logged into your ${platformName} account

2. **Read the Business Profile**
   - Familiarize yourself with the business type and services
   - Look at existing reviews to understand the context

3. **Write Your Review**
   - Write a unique, positive review (minimum 2 sentences)
   ${inputs.reviewTextOption === 'client_provided' 
     ? '- Use the exact text provided above, but feel free to add personal touches'
     : '- Make it sound natural and authentic, like a real customer experience'}
   - Rate the business ${inputs.starRating} stars

4. **Important Rules**
   - **DO NOT** use a VPN or proxy
   - Use your real, localized internet connection
   - Write in your own words (don't copy from other reviews)
   - Make sure your review is visible and posted successfully

5. **Submit Proof**
   - Take a screenshot showing:
     * Your posted review
     * Your profile name visible
     * The timestamp/date
     * The ${inputs.starRating}-star rating visible
   - Upload the screenshot below

### ⚠️ Warning
Posting fake, copied, or AI-generated reviews will result in:
- Immediate task rejection
- Trust score penalty (-30 points)
- Possible account suspension

Your review must remain posted for at least 30 days. Deleting it early will result in account penalties.
`.trim();
  }

  /**
   * Generate instructions for SOCIAL GROWTH tasks (Followers, Likes, Subscribers)
   */
  static generateSocialGrowthInstructions(
    actionType: 'follow' | 'like' | 'subscribe',
    platformName: string,
    inputs: SocialGrowthInput
  ): string {
    const actionVerb = actionType === 'follow' ? 'Follow' : actionType === 'like' ? 'Like' : 'Subscribe to';
    const actionButton = actionType === 'follow' ? 'Follow' : actionType === 'like' ? 'Like/Heart' : 'Subscribe';
    const actionPast = actionType === 'follow' ? 'Followed' : actionType === 'like' ? 'Liked' : 'Subscribed';

    return `
## Task Instructions: ${platformName} ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}

**Target Account:** ${inputs.accountHandle}
**Target URL:** ${inputs.targetUrl}

### Step-by-Step Instructions:

1. **Open the Target**
   - Click the link above to open the target profile/post
   - Make sure you're logged into your ${platformName} account

2. **${actionVerb}**
   - Click the **${actionButton}** button
   - Verify that the button changes to show you've ${actionPast.toLowerCase()}

3. **Wait 5 Seconds**
   - Do NOT immediately close the app/browser
   - Wait at least 5 seconds to ensure the action registers on ${platformName}'s servers

4. **Submit Proof**
   - Take a screenshot clearly showing:
     * The "${actionPast}" button is active/highlighted
     * The account handle (${inputs.accountHandle}) is visible
     * Your account name/profile picture is visible
   - Upload the screenshot below

### ⚠️ Critical Warning
**Unfollowing, unliking, or unsubscribing within 30 days will result in:**
- Immediate account ban
- Forfeiture of ALL pending wallet balance
- Permanent platform suspension

We track all ${actionType} actions. If the client reports that you unfollowed, you will be required to provide proof or face penalties.

### Why This Matters
Clients pay for permanent ${actionType}s. If you ${actionType} and then immediately un${actionType}, you're committing fraud. Our system detects this and will ban your account permanently.
`.trim();
  }

  /**
   * Generate instructions for VIEWS tasks (Video/Audio with Timer)
   */
  static generateViewsInstructions(
    platformName: string,
    inputs: ViewsInput
  ): string {
    return `
## Task Instructions: ${platformName} View

**Content:** ${inputs.contentTitle}
**Target URL:** ${inputs.targetUrl}
**Required Watch Time:** ${inputs.minWatchTime} seconds

### Step-by-Step Instructions:

1. **Press Play**
   - Click the "Play" button on the embedded media player below
   - The video/audio will start playing automatically

2. **Watch/Listen**
   - A countdown timer will begin automatically
   - You must watch/listen for at least **${inputs.minWatchTime} seconds**

3. **Keep Tab Active**
   - **DO NOT** switch to another tab or minimize the window
   - **DO NOT** mute the video (on some platforms)
   - If you leave the tab, the timer will PAUSE automatically

4. **Wait for Completion**
   - Watch the countdown timer at the top of the player
   - When the timer reaches 0, the task will complete automatically

5. **Automatic Payment**
   - **No screenshot needed!**
   - Once the timer hits 0, your wallet will be credited automatically
   - You'll see a success message confirming your payment

### ⚠️ Important Notes
- The timer pauses if you switch tabs or minimize the window
- You must keep the video/audio playing for the full duration
- Attempting to manipulate the timer will result in task rejection and trust score penalties
- This ensures ${platformName} counts your view as legitimate

### Why This System?
${platformName} only counts views that meet minimum watch time requirements. If someone clicks a video and closes it after 2 seconds, ${platformName} flags it as a bot view and deletes it. Our timer system ensures your view is counted and stays permanent.
`.trim();
  }

  /**
   * Generate instructions for WEB TRAFFIC tasks
   */
  static generateWebTrafficInstructions(
    inputs: WebTrafficInput
  ): string {
    return `
## Task Instructions: Website Traffic

**Website:** ${inputs.websiteName}
**Target URL:** ${inputs.targetUrl}
**Required Dwell Time:** ${inputs.minDwellTime} seconds

${inputs.pageDescription ? `**What to Expect:** ${inputs.pageDescription}\n` : ''}

### Step-by-Step Instructions:

1. **Click "Visit Website"**
   - Click the button below to open the website in a secure platform frame
   - The website will load in an embedded viewer

2. **Browse the Website**
   - Look at the homepage and explore the content
   - Scroll through the page naturally
   - Read some text, look at images, etc.

3. **Watch the Timer**
   - A countdown timer will appear at the top of the frame
   - You must stay on the website for at least **${inputs.minDwellTime} seconds**

4. **Keep Tab Active**
   - **DO NOT** switch to another tab or minimize the window
   - If you leave the tab, the timer will PAUSE automatically
   - Stay engaged with the website content

5. **Complete Task**
   - When the timer reaches 0, click the "Complete Task" button
   - Your wallet will be credited automatically
   - **No screenshot needed!**

### ⚠️ Important Rules
- You must actually browse the website (don't just leave it idle)
- The timer tracks your active engagement
- Attempting to manipulate the timer will result in task rejection
- Malicious websites are blocked - if you see anything suspicious, report it immediately

### Why This Matters
Website owners pay for real visitors who actually engage with their content. A 30-second visit from a real person is valuable for their analytics and SEO. Quick bot visits that last 2 seconds are worthless and get filtered out by analytics platforms.
`.trim();
  }

  /**
   * Generate instructions based on service category
   */
  static generateInstructions(
    categorySlug: string,
    platformName: string,
    serviceInputs: any
  ): string {
    switch (categorySlug) {
      case 'reviews':
        return this.generateReviewInstructions(platformName, serviceInputs);

      case 'followers':
        return this.generateSocialGrowthInstructions('follow', platformName, serviceInputs);

      case 'likes':
        return this.generateSocialGrowthInstructions('like', platformName, serviceInputs);

      case 'subscribers':
        return this.generateSocialGrowthInstructions('subscribe', platformName, serviceInputs);

      case 'views':
        return this.generateViewsInstructions(platformName, serviceInputs);

      case 'traffic':
        return this.generateWebTrafficInstructions(serviceInputs);

      default:
        return `
## Task Instructions

**Target URL:** ${serviceInputs.targetUrl || 'Not provided'}

Please complete the task as described in the order details.
`.trim();
    }
  }
}
