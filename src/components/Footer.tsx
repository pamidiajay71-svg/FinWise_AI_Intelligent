import { Link } from 'react-router-dom';
import { Wallet, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Loan Eligibility', href: '/loan-eligibility' },
    { label: 'Credit Analyzer', href: '/credit-analyzer' },
    { label: 'EMI Calculator', href: '/emi-calculator' },
    { label: 'AI Advisor', href: '/financial-advisor' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'History', href: '/history' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'FAQ', href: '/faq' },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/50">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">FinWise AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Intelligent loan eligibility, credit analysis, and AI-powered financial advisory for smarter decisions.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <Icon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FinWise AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with AI · Supabase · React
          </p>
        </div>
      </div>
    </footer>
  );
}
