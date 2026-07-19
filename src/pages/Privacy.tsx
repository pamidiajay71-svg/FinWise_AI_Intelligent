import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, including your name, email, and financial data you enter for analysis. We also collect usage data such as which features you use and how often.' },
  { title: 'How We Use Your Information', content: 'Your data is used solely to provide and improve our services: running AI analyses, generating reports, saving your history, and personalizing your experience. We never sell your data to third parties.' },
  { title: 'Data Storage and Security', content: 'All data is stored securely using Supabase with row-level security policies. Data is encrypted in transit (TLS) and at rest. Only you can access your own data through your authenticated session.' },
  { title: 'AI Processing', content: 'When you run an AI analysis, your anonymized financial data is sent to our AI service (Claude API) via a secure edge function. The AI processes your data to generate insights and does not store it.' },
  { title: 'Data Retention', content: 'Your analysis history is stored until you choose to delete it. You can delete individual records or clear all history at any time from Settings. Account deletion removes all associated data.' },
  { title: 'Cookies and Tracking', content: 'We use essential cookies to maintain your session and preferences. We do not use advertising cookies or third-party tracking pixels.' },
  { title: 'Your Rights', content: 'You have the right to access, export, modify, or delete your data at any time. Use the History page to export or delete records, or Settings to manage your account.' },
  { title: 'Third-Party Services', content: 'We use Supabase for data storage and authentication, and Claude AI for analysis generation. These providers have their own privacy policies that govern their data practices.' },
  { title: 'Changes to This Policy', content: 'We may update this policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use after changes constitutes acceptance.' },
  { title: 'Contact Us', content: 'If you have questions about this privacy policy, contact us at privacy@finwise.ai.' },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Privacy <span className="gradient-text">Policy</span></h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en', { dateStyle: 'long' })}</p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
