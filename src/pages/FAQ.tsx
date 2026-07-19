import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const faqs = [
  { q: 'How does FinWise AI calculate loan eligibility?', a: 'Our AI analyzes your income, existing EMIs, credit score, debt-to-income ratio, and loan details to provide a comprehensive eligibility assessment with approval probability and maximum loan amount.' },
  { q: 'Is my financial data secure?', a: 'Yes. All data is encrypted and stored securely using Supabase with row-level security. We never share your data with third parties. Your analyses are private to your account.' },
  { q: 'How accurate is the AI financial advisor?', a: 'Our AI uses Claude to analyze your financial profile and generate personalized recommendations. While highly accurate, it should be used as guidance alongside professional financial advice for major decisions.' },
  { q: 'Can I download my analysis reports?', a: 'Yes! Every analysis can be downloaded as a professional PDF report with charts, risk summaries, and recommendations. You can also export your history to CSV.' },
  { q: 'Do I need to create an account?', a: 'You can use the EMI calculator without an account. For AI-powered analyses, credit checks, and saving your history, you will need to create a free account.' },
  { q: 'What is the Debt-to-Income (DTI) ratio?', a: 'DTI ratio is the percentage of your monthly income that goes toward paying debts. A lower DTI (below 40%) generally improves your loan eligibility.' },
  { q: 'How is my credit score analyzed?', a: 'We look at your credit score, credit card utilization, payment history, and existing loans to categorize your credit health and provide a personalized improvement plan with weekly and monthly goals.' },
  { q: 'Can I delete my analysis history?', a: 'Yes. You can delete individual records from the History page or clear all records from Settings > Danger Zone.' },
  { q: 'What does the 12-month financial roadmap include?', a: 'The AI advisor creates a month-by-month plan with specific goals for savings, debt reduction, investments, and financial health improvement based on your profile.' },
  { q: 'Is there a free plan?', a: 'Yes! Our free plan includes 3 analyses per month, the EMI calculator, basic credit analysis, and PDF export. Upgrade to Pro for unlimited access.' },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Frequently Asked <span className="gradient-text">Questions</span></h1>
        <p className="mt-4 text-muted-foreground">Everything you need to know about FinWise AI</p>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="glass rounded-xl border-border/50 px-4">
            <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className="glass-strong p-8 mt-12 text-center border-border/50">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Our support team is here to help</p>
        <a href="mailto:support@finwise.ai" className="mt-4 inline-block text-primary hover:underline">
          support@finwise.ai
        </a>
      </Card>
    </div>
  );
}
