import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const values = [
  { icon: Zap, title: 'AI-First', description: 'We leverage cutting-edge AI to make financial analysis instant and intelligent.' },
  { icon: Shield, title: 'Privacy', description: 'Your data is yours. We use bank-grade encryption and never share with third parties.' },
  { icon: Heart, title: 'User-Centric', description: 'Every feature is designed with you in mind — clear, actionable, and beautiful.' },
  { icon: Users, title: 'Accessible', description: 'Professional-grade financial tools should be available to everyone, not just the wealthy.' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl font-bold sm:text-5xl">
          About <span className="gradient-text">FinWise AI</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to democratize financial intelligence. Our AI-powered platform helps you make
          smarter loan decisions, understand your credit health, and plan your financial future — all in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
        {[
          { icon: Target, title: 'Our Mission', text: 'To make professional financial analysis accessible to everyone, powered by AI.' },
          { icon: Eye, title: 'Our Vision', text: 'A world where everyone has the tools to make informed financial decisions confidently.' },
          { icon: Heart, title: 'Our Promise', text: 'Transparent, accurate, and actionable insights — always with your privacy first.' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass h-full p-6 border-border/50 card-hover">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">Our <span className="gradient-text">Values</span></h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {values.map((value, i) => (
          <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass h-full p-6 border-border/50 card-hover text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{value.title}</h3>
              <p className="text-xs text-muted-foreground">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 p-12 text-center"
      >
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="mt-2 text-muted-foreground">Join thousands making smarter financial decisions</p>
        <Button size="lg" className="mt-6" asChild>
          <Link to="/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </motion.div>
    </div>
  );
}
