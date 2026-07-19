import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bot,
  FileDown,
  Sparkles,
  PiggyBank,
  TrendingUp,
  Shield,
  Receipt,
  Target,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { callAIAnalysis } from '@/services/ai';
import { saveAnalysis } from '@/services/analytics';
import { generateAdvisorReport, savePDF } from '@/services/pdf';
import type { AdvisorInput, AdvisorResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { advisorSchema, type AdvisorFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CardSkeleton } from '@/components/Loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const goals = [
  'Buy a House',
  'Retirement Planning',
  'Children\'s Education',
  'Debt Freedom',
  'Wealth Creation',
  'Emergency Fund',
  'Start a Business',
  'Tax Saving',
];

const budgetColors = ['hsl(217 91% 60%)', 'hsl(160 60% 45%)', 'hsl(43 74% 60%)', 'hsl(280 65% 65%)', 'hsl(340 75% 60%)', 'hsl(190 95% 45%)'];

export default function FinancialAdvisor() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [inputData, setInputData] = useState<AdvisorInput | null>(null);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AdvisorFormData>({
    resolver: zodResolver(advisorSchema),
    defaultValues: { expenses: 0, savings: 0, investments: 0, insurance: 0, debt: 0 },
  });

  const financialGoal = watch('financialGoal');

  const onSubmit = async (data: AdvisorFormData) => {
    setLoading(true);
    setResult(null);
    const input: AdvisorInput = {
      income: data.income,
      expenses: data.expenses,
      savings: data.savings,
      investments: data.investments,
      insurance: data.insurance,
      debt: data.debt,
      financialGoal: data.financialGoal,
    };
    setInputData(input);

    const { data: aiData, error } = await callAIAnalysis('advisor', input as unknown as Record<string, unknown>);
    setLoading(false);

    if (error || !aiData) {
      toast.error(error || 'Failed to generate advice');
      return;
    }

    const advisorResult = aiData as unknown as AdvisorResult;
    setResult(advisorResult);

    await saveAnalysis('advisor', `Advisor: ${input.financialGoal}`, input as unknown as Record<string, unknown>, aiData, {
      financial_score: advisorResult.financialHealthScore,
    });

    toast.success('Financial advice generated!');
  };

  const handleDownloadPDF = () => {
    if (!result || !inputData) return;
    const doc = generateAdvisorReport(inputData as unknown as Record<string, unknown>, result, profile?.full_name || user?.email || '');
    savePDF(doc, `advisor-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Financial Advisor</h1>
            <p className="text-sm text-muted-foreground">Get personalized financial advice powered by AI</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="glass-strong p-6 border-border/50">
          <h2 className="mb-6 text-lg font-semibold">Your Financial Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (₹)</Label>
              <Input id="income" type="number" placeholder="50000" {...register('income')} />
              {errors.income && <p className="text-xs text-rose-400">{errors.income.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                <Input id="expenses" type="number" placeholder="20000" {...register('expenses')} />
                {errors.expenses && <p className="text-xs text-rose-400">{errors.expenses.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings">Current Savings (₹)</Label>
                <Input id="savings" type="number" placeholder="10000" {...register('savings')} />
                {errors.savings && <p className="text-xs text-rose-400">{errors.savings.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investments">Investments (₹)</Label>
                <Input id="investments" type="number" placeholder="5000" {...register('investments')} />
                {errors.investments && <p className="text-xs text-rose-400">{errors.investments.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Premium (₹)</Label>
                <Input id="insurance" type="number" placeholder="2000" {...register('insurance')} />
                {errors.insurance && <p className="text-xs text-rose-400">{errors.insurance.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="debt">Total Debt (₹)</Label>
              <Input id="debt" type="number" placeholder="100000" {...register('debt')} />
              {errors.debt && <p className="text-xs text-rose-400">{errors.debt.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Financial Goal</Label>
              <Select
                value={financialGoal}
                onValueChange={(v) => setValue('financialGoal', v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.financialGoal && <p className="text-xs text-rose-400">{errors.financialGoal.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  AI Generating Advice...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Get Financial Advice
                </span>
              )}
            </Button>
          </form>
        </Card>

        <div>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <CardSkeleton />
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Health Score */}
                <Card className="glass-strong p-6 border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Financial Health Score</h3>
                    </div>
                    <p className="text-3xl font-bold gradient-text">{result.financialHealthScore}/100</p>
                  </div>
                  <Progress value={result.financialHealthScore} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {result.financialHealthScore >= 75 ? 'Excellent financial health!' :
                     result.financialHealthScore >= 50 ? 'Good, but room for improvement.' :
                     'Needs attention. Follow the plan below.'}
                  </p>
                </Card>

                {/* Budget Plan Pie */}
                {result.budgetPlan.length > 0 && (
                  <Card className="glass p-6 border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <PiggyBank className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Recommended Budget Plan</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={result.budgetPlan} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                          {result.budgetPlan.map((_, i) => (
                            <Cell key={i} fill={budgetColors[i % budgetColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* Savings Strategy */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <PiggyBank className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-semibold">Savings Strategy</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.savingsStrategy.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Investment Advice */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold">Investment Advice</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.investmentAdvice.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-blue-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Emergency Fund */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-amber-400" />
                    <h3 className="font-semibold">Emergency Fund</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.emergencyFund}</p>
                </Card>

                {/* Insurance Advice */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-violet-400" />
                    <h3 className="font-semibold">Insurance Advice</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.insuranceAdvice.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-violet-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Tax Saving */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-semibold">Tax Saving Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.taxSaving.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Debt Reduction */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-rose-400" />
                    <h3 className="font-semibold">Debt Reduction</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.debtReduction.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-rose-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Roadmap */}
                {result.roadmap.length > 0 && (
                  <Card className="glass p-6 border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">12-Month Financial Roadmap</h3>
                    </div>
                    <div className="space-y-3">
                      {result.roadmap.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.month}</p>
                            <p className="text-xs text-muted-foreground">{item.goal}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                )}

                <Button onClick={handleDownloadPDF} variant="outline" className="w-full">
                  <FileDown className="mr-2 h-4 w-4" /> Download Advisory Report (PDF)
                </Button>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[400px] flex-col items-center justify-center">
                <div className="glass rounded-2xl p-12 text-center">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Enter your financial details to get personalized AI advice</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
