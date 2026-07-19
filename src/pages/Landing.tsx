import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Landmark,
  Gauge,
  Calculator,
  Bot,
  Shield,
  TrendingUp,
  FileText,
  Sparkles,
  Check,
  Star,
  Zap,
  Lock,
  BarChart3,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SafeImage } from '@/components/SafeImage';

const stats = [
  { value: '50K+', label: 'Analyses Run' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '₹2.4B+', label: 'Loans Evaluated' },
  { value: '24/7', label: 'AI Available' },
];

const features = [
  {
    icon: Landmark,
    title: 'Loan Eligibility Checker',
    description: 'AI-powered loan eligibility analysis with approval probability, max loan amount, and risk assessment.',
    color: 'from-blue-500 to-cyan-500',
    href: '/loan-eligibility',
  },
  {
    icon: Gauge,
    title: 'Credit Score Analyzer',
    description: 'Deep credit health analysis with improvement plans, weekly goals, and estimated recovery time.',
    color: 'from-indigo-500 to-violet-500',
    href: '/credit-analyzer',
  },
  {
    icon: Calculator,
    title: 'EMI Calculator',
    description: 'Calculate monthly EMIs with full amortization schedules, pie charts, and PDF export.',
    color: 'from-cyan-500 to-teal-500',
    href: '/emi-calculator',
  },
  {
    icon: Bot,
    title: 'AI Financial Advisor',
    description: 'Personalized budget plans, savings strategies, investment advice, and a 12-month financial roadmap.',
    color: 'from-violet-500 to-fuchsia-500',
    href: '/financial-advisor',
  },
  {
    icon: FileText,
    title: 'Professional Reports',
    description: 'Download branded PDF reports for every analysis with charts, risk summaries, and recommendations.',
    color: 'from-amber-500 to-orange-500',
    href: '/history',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your financial journey with interactive charts, loan distribution, and risk analytics.',
    color: 'from-emerald-500 to-green-500',
    href: '/dashboard',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    rating: 5,
    text: 'FinWise AI helped me understand my loan eligibility before applying. The AI advisor gave me a clear roadmap to improve my credit score. Got my home loan approved in 2 weeks!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner, Mumbai',
    rating: 5,
    text: 'The EMI calculator and amortization schedule were exactly what I needed. The PDF reports are professional and helped me compare loan offers from 3 different banks.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=c0aede',
  },
  {
    name: 'Anita Desai',
    role: 'Doctor, Delhi',
    rating: 5,
    text: 'The AI financial advisor created a personalized budget plan and 12-month roadmap. I have already saved 30% more since I started following the recommendations.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita&backgroundColor=d1d4f9',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for trying out FinWise AI',
    features: ['3 analyses per month', 'EMI Calculator', 'Basic credit analyzer', 'PDF export'],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'per month',
    description: 'For serious financial planning',
    features: [
      'Unlimited analyses',
      'Full AI financial advisor',
      'Advanced credit improvement plans',
      '12-month financial roadmap',
      'Priority support',
      'Export to CSV & PDF',
    ],
    cta: 'Start Pro Trial',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '₹1,999',
    period: 'per month',
    description: 'For teams and financial advisors',
    features: [
      'Everything in Pro',
      'Multi-user access (5 seats)',
      'White-label reports',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'How does FinWise AI calculate loan eligibility?',
    a: 'Our AI analyzes your income, existing EMIs, credit score, debt-to-income ratio, and loan details to provide a comprehensive eligibility assessment with approval probability and maximum loan amount.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Yes. All data is encrypted and stored securely using Supabase with row-level security. We never share your data with third parties. Your analyses are private to your account.',
  },
  {
    q: 'How accurate is the AI financial advisor?',
    a: 'Our AI uses Claude to analyze your financial profile and generate personalized recommendations. While highly accurate, it should be used as guidance alongside professional financial advice for major decisions.',
  },
  {
    q: 'Can I download my analysis reports?',
    a: 'Yes! Every analysis can be downloaded as a professional PDF report with charts, risk summaries, and recommendations. Pro users can also export to CSV.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'You can use the EMI calculator without an account. For AI-powered analyses, credit checks, and saving your history, you will need to create a free account.',
  },
];

export default function Landing() {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Claude AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Smart Financial Decisions
            <br />
            <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Check loan eligibility, analyze your credit score, calculate EMIs, and get personalized
            financial advice — all in one intelligent platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="group">
              <Link to="/signup">
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/emi-calculator">Try EMI Calculator</Link>
            </Button>
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 mx-auto max-w-5xl"
        >
          <div className="glass-strong rounded-2xl border border-border/50 p-2 shadow-2xl shadow-blue-500/10">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
              {[
                { icon: Landmark, label: 'Loan Approval', value: '87%', color: 'text-emerald-400' },
                { icon: Gauge, label: 'Credit Score', value: '742', color: 'text-blue-400' },
                { icon: TrendingUp, label: 'Financial Health', value: '82/100', color: 'text-violet-400' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass rounded-xl p-4 text-center card-hover"
                >
                  <item.icon className={`mx-auto h-8 w-8 ${item.color}`} />
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center card-hover"
            >
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need for
            <br />
            <span className="gradient-text">Financial Clarity</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Six powerful AI-driven modules in one platform</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={feature.href}>
                <Card className="glass h-full p-6 card-hover border-border/50 group">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-3xl border border-border/50 p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Why Choose <span className="gradient-text">FinWise AI?</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                We combine cutting-edge AI with financial expertise to give you insights that matter.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Shield, text: 'Bank-grade security with encrypted data storage' },
                  { icon: Zap, text: 'Instant AI analysis powered by Claude' },
                  { icon: Lock, text: 'Your data is private — never shared with lenders' },
                  { icon: FileText, text: 'Professional PDF reports for every analysis' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'AI', label: 'Powered Analysis' },
                { value: 'PDF', label: 'Report Export' },
                { value: 'CSV', label: 'Data Export' },
                { value: '24/7', label: 'Availability' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 text-center card-hover"
                >
                  <p className="text-3xl font-bold gradient-text">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Loved by <span className="gradient-text">Thousands</span></h2>
          <p className="mt-4 text-muted-foreground">Real stories from real users</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass h-full p-6 card-hover border-border/50">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <SafeImage
                    src={t.avatar}
                    alt={t.name}
                    fallbackType="avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={plan.highlighted ? 'lg:-mt-4' : ''}
            >
              <Card
                className={`relative h-full p-6 card-hover border-border/50 ${
                  plan.highlighted ? 'glass-strong border-primary/50 glow-blue' : 'glass'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass rounded-xl border-border/50 px-4">
              <AccordionTrigger className="text-left text-sm font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 p-12 text-center"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Take Control of Your <span className="gradient-text">Financial Future?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join thousands of users making smarter financial decisions with AI-powered insights.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
