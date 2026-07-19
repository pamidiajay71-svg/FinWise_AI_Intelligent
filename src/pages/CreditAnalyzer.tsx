import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Gauge,
  FileDown,
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { callAIAnalysis } from '@/services/ai';
import { saveAnalysis } from '@/services/analytics';
import { generateCreditReport, savePDF } from '@/services/pdf';
import type { CreditInput, CreditResult } from '@/types';
import { getRiskColor, getRiskBg } from '@/lib/utils';
import { creditSchema, type CreditFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CardSkeleton } from '@/components/Loading';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

const schema = creditSchema;

type FormData = CreditFormData;

export default function CreditAnalyzer() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreditResult | null>(null);
  const [inputData, setInputData] = useState<CreditInput | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { creditCardUsage: 30, paymentHistory: 95, existingLoans: 0 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    const input: CreditInput = {
      creditScore: data.creditScore,
      income: data.income,
      creditCardUsage: data.creditCardUsage,
      paymentHistory: data.paymentHistory,
      existingLoans: data.existingLoans,
    };
    setInputData(input);

    const { data: aiData, error } = await callAIAnalysis('credit', input as unknown as Record<string, unknown>);
    setLoading(false);

    if (error || !aiData) {
      toast.error(error || 'Failed to analyze credit score');
      return;
    }

    const creditResult = aiData as unknown as CreditResult;
    setResult(creditResult);

    await saveAnalysis('credit', `Credit Score: ${input.creditScore}`, input as unknown as Record<string, unknown>, aiData, {
      risk_category: creditResult.risk,
      financial_score: input.creditScore,
    });

    toast.success('Credit analysis complete!');
  };

  const handleDownloadPDF = () => {
    if (!result || !inputData) return;
    const doc = generateCreditReport(inputData as unknown as Record<string, unknown>, result, profile?.full_name || user?.email || '');
    savePDF(doc, `credit-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  };

  const gaugeData = inputData ? [{ name: 'score', value: inputData.creditScore, fill: inputData.creditScore >= 750 ? '#10b981' : inputData.creditScore >= 650 ? '#f59e0b' : '#f43f5e' }] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Credit Score Analyzer</h1>
            <p className="text-sm text-muted-foreground">AI-powered credit health analysis and improvement plan</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="glass-strong p-6 border-border/50">
          <h2 className="mb-6 text-lg font-semibold">Credit Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score (300-900)</Label>
              <Input id="creditScore" type="number" placeholder="750" {...register('creditScore')} />
              {errors.creditScore && <p className="text-xs text-rose-400">{errors.creditScore.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (₹)</Label>
              <Input id="income" type="number" placeholder="50000" {...register('income')} />
              {errors.income && <p className="text-xs text-rose-400">{errors.income.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditCardUsage">Credit Card Usage (%)</Label>
                <Input id="creditCardUsage" type="number" placeholder="30" {...register('creditCardUsage')} />
                {errors.creditCardUsage && <p className="text-xs text-rose-400">{errors.creditCardUsage.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentHistory">Payment History (%)</Label>
                <Input id="paymentHistory" type="number" placeholder="95" {...register('paymentHistory')} />
                {errors.paymentHistory && <p className="text-xs text-rose-400">{errors.paymentHistory.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingLoans">Existing Loans (count)</Label>
              <Input id="existingLoans" type="number" placeholder="0" {...register('existingLoans')} />
              {errors.existingLoans && <p className="text-xs text-rose-400">{errors.existingLoans.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  AI Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Analyze Credit
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
                {/* Gauge + Summary */}
                <Card className={`glass-strong p-6 border-2 ${getRiskBg(result.risk)}`}>
                  <div className="flex flex-col items-center">
                    <div className="relative h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={180} endAngle={0}>
                          <PolarAngleAxis type="number" domain={[300, 900]} angleAxisId={0} tick={false} />
                          <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={20} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold">{inputData?.creditScore}</p>
                        <p className="text-xs text-muted-foreground">Credit Score</p>
                      </div>
                    </div>
                    <p className={`mt-2 text-xl font-bold ${getRiskColor(result.risk)}`}>{result.category}</p>
                    <p className="text-sm text-muted-foreground">{result.financialHealth}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className={`font-bold ${getRiskColor(result.risk)}`}>{result.risk}</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Recovery Time</p>
                      <p className="font-bold">{result.estimatedRecoveryTime}</p>
                    </div>
                  </div>
                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full mt-4">
                    <FileDown className="mr-2 h-4 w-4" /> Download PDF Report
                  </Button>
                </Card>

                {/* Score Breakdown Chart */}
                {result.scoreBreakdown.length > 0 && (
                  <Card className="glass p-6 border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Score Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={result.scoreBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="factor" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* Improvement Plan */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Improvement Plan</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.improvementPlan.map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                {/* Weekly Goals */}
                <Card className="glass p-6 border-border/50">
                  <h3 className="font-semibold mb-3">Weekly Goals</h3>
                  <ul className="space-y-2">
                    {result.weeklyGoals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Calendar className="mt-0.5 h-4 w-4 text-blue-400 shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Monthly Goals */}
                <Card className="glass p-6 border-border/50">
                  <h3 className="font-semibold mb-3">Monthly Goals</h3>
                  <ul className="space-y-2">
                    {result.monthlyGoals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Target className="mt-0.5 h-4 w-4 text-violet-400 shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[400px] flex-col items-center justify-center">
                <div className="glass rounded-2xl p-12 text-center">
                  <Gauge className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Enter your credit details to get an AI-powered analysis</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
