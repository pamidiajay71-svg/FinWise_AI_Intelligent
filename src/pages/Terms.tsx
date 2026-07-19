import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing and using FinWise AI, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
  { title: 'Description of Service', content: 'FinWise AI provides AI-powered financial analysis tools including loan eligibility checking, credit score analysis, EMI calculation, and financial advisory. Our services are for informational purposes only and do not constitute professional financial advice.' },
  { title: 'User Accounts', content: 'You must create an account to use most features. You are responsible for maintaining the security of your account and password. You must be 18 or older to create an account.' },
  { title: 'Acceptable Use', content: 'You agree not to: misuse the service, attempt unauthorized access, use the service for illegal activities, submit false or misleading information, or interfere with the service\'s operation.' },
  { title: 'Intellectual Property', content: 'All content, features, and functionality of FinWise AI — including text, graphics, logos, and software — are owned by us and protected by intellectual property laws.' },
  { title: 'Limitation of Liability', content: 'FinWise AI is provided "as is" without warranties of any kind. Our AI analyses are for informational purposes only and should not be the sole basis for financial decisions. We are not liable for any financial losses resulting from use of our service.' },
  { title: 'Not Financial Advice', content: 'The analyses and recommendations provided by FinWise AI are AI-generated insights, not professional financial advice. Always consult with a qualified financial advisor before making significant financial decisions.' },
  { title: 'Subscription and Billing', content: 'Paid plans are billed monthly. You can cancel anytime. Refunds are handled on a case-by-case basis. Price changes will be communicated in advance.' },
  { title: 'Termination', content: 'We may terminate or suspend your account if you violate these terms. You may delete your account at any time from Settings.' },
  { title: 'Changes to Terms', content: 'We may update these terms from time to time. Continued use after changes constitutes acceptance. We will notify you of significant changes.' },
  { title: 'Governing Law', content: 'These terms are governed by the laws of India. Any disputes will be resolved in the courts of Bangalore, Karnataka.' },
  { title: 'Contact', content: 'For questions about these terms, contact us at legal@finwise.ai.' },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Terms of <span className="gradient-text">Service</span></h1>
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
