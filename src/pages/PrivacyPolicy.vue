<template>
  <section class="min-h-screen bg-white text-gray-800 flex items-start justify-center px-4 pt-16">
    <div class="max-w-3xl w-full">
      <h1 class="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p class="text-sm text-gray-500 mb-8">Last updated: June 10, 2025</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p class="mb-4">
        This Privacy Policy explains how Saynest Lab (operated by Andrii Mysliuk as an individual entrepreneur, registered in Ukraine) collects, uses, and protects your personal data when you use our
        English speaking practice platform (“Service”).
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">2. Data We Collect</h2>
      <ul class="list-disc list-inside mb-4">
        <li>Text chat history with the AI interviewer</li>
        <li>Audio recordings of your spoken responses</li>
        <li>Session metadata (scenario, confidence level, errors, time, progress)</li>
        <li>Account identifiers (email address, login via Google, etc.)</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">3. Purpose of Data Collection</h2>
      <p class="mb-4">We process this data to:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Track your progress and adapt scenarios to your needs</li>
        <li>Provide you with feedback and insights</li>
        <li>Display your interaction history</li>
        <li>Improve the quality and security of the platform</li>
      </ul>
      <p class="mb-4">We do not use your data for AI training unless you explicitly opt in to that feature (not currently enabled).</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">4. Data Storage and Processing</h2>
      <p class="mb-4">
        Text data is stored in MongoDB databases hosted on Google Cloud (Europe-west1 region, Belgium).<br />
        Audio recordings are stored in Google Cloud Storage and accessible via temporary links (up to 5 minutes).<br />
        All transmissions are secured and encrypted.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">5. Data Sharing</h2>
      <p class="mb-4">We may share your data with:</p>
      <ul class="list-disc list-inside mb-4">
        <li>OpenAI (for generating responses and analyzing text)</li>
        <li>Google Cloud (for storage and data processing)</li>
        <li>Paddle (for payment processing, once connected)</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">6. Data Retention</h2>
      <p class="mb-4">
        Session history (text and audio) is stored until you delete it manually.<br />
        If you don’t complete a session (no progress saved), data is deleted automatically within a few hours.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">7. Your Rights</h2>
      <p class="mb-4">At any time, you can:</p>
      <ul class="list-disc list-inside mb-4">
        <li>Delete individual sessions</li>
        <li>Delete your entire interaction history</li>
      </ul>
      <p class="mb-4">You can manage these settings in your user profile.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">8. Analytics and Marketing</h2>
      <p class="mb-4">
        We use Google Analytics and Hotjar to understand how our Service is used and to improve it. We do not currently use your data for marketing communications, but we may offer updates or
        announcements in the future.
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">9. Data Location</h2>
      <p class="mb-4">All data is processed and stored in Google Cloud infrastructure in the EU (Belgium).</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">10. Contact</h2>
      <p class="mb-4">
        For questions about this Privacy Policy or data handling, please contact:
        <a href="mailto:saynest.labs@gmail.com" class="text-blue-600 hover:underline">saynest.labs@gmail.com</a>
      </p>

      <h2 class="text-xl font-semibold mt-6 mb-2">11. Changes</h2>
      <p class="mb-12">
        We may update this Policy from time to time. If significant changes occur, we’ll do our best to notify you. Continued use of the Service after changes means you agree to the updated terms.
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  setup() {
    return {}
  },
})
</script>
