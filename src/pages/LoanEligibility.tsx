import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Landmark,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileDown,
  Sparkles,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { callAIAnalysis } from '@/services/ai';
import { saveAnalysis } from '@/services/analytics';
import { sendToGoogleSheet } from '@/services/googleSheet';
import { generateLoanReport, savePDF } from '@/services/pdf';
import type { LoanInput, LoanResult } from '@/types';
import { formatCurrency, getRiskColor, getRiskBg } from '@/lib/utils';
import { loanSchema, type LoanFormData } from '@/lib/validation';
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

export default function LoanEligibility() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [inputData, setInputData] = useState<LoanInput | null>(null);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      name: profile?.full_name || '',
      employmentType: '',
      existingEMI: 0,
      loanDuration: 60,
    },
  });

  const employmentType = watch('employmentType');

  const onSubmit = async (data: LoanFormData) => {
    setLoading(true);
    setResult(null);
    const input: LoanInput = {
      name: data.name,
      age: data.age,
      occupation: data.occupation,
      employmentType: data.employmentType,
      monthlyIncome: data.monthlyIncome,
      existingEMI: data.existingEMI,
      creditScore: data.creditScore,
      loanAmount: data.loanAmount,
      loanPurpose: data.loanPurpose,
      loanDuration: data.loanDuration,
    };
    setInputData(input);

    const { data: aiData, error } = await callAIAnalysis('loan', input as unknown as Record<string, unknown>);
    setLoading(false);

    if (error || !aiData) {
      toast.error(error || 'Failed to analyze. Please try again.');
      return;
    }

    const loanResult = aiData as unknown as LoanResult;
    setResult(loanResult);

    await saveAnalysis('loan', `Loan: ${input.loanPurpose}`, input as unknown as Record<string, unknown>, aiData, {
      risk_category: loanResult.riskCategory,
      eligibility: loanResult.eligibility,
    });

    sendToGoogleSheet({
      timestamp: new Date().toISOString(),
      name: input.name,
      income: input.monthlyIncome,
      creditScore: input.creditScore,
      loanAmount: input.loanAmount,
      eligibility: loanResult.eligibility,
      risk: loanResult.riskCategory,
      advice: loanResult.recommendations.join('; '),
    });

    toast.success('Analysis complete!');
  };

  const handleDownloadPDF = () => {
    if (!result || !inputData) return;
    const doc = generateLoanReport(inputData as unknown as Record<string, unknown>, result, profile?.full_name || user?.email || '');
    savePDF(doc, `loan-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  };

  const eligibilityIcon = result?.eligibility === 'Eligible' ? CheckCircle :
    result?.eligibility === 'Medium Risk' ? AlertTriangle : XCircle;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Loan Eligibility Checker</h1>
            <p className="text-sm text-muted-foreground">AI-powered analysis of your loan approval chances</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <Card className="glass-strong p-6 border-border/50">
          <h2 className="mb-6 text-lg font-semibold">Enter Your Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register('name')} />
                {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="30" {...register('age')} />
                {errors.age && <p className="text-xs text-rose-400">{errors.age.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" placeholder="Software Engineer" {...register('occupation')} />
                {errors.occupation && <p className="text-xs text-rose-400">{errors.occupation.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={employmentType}
                  onValueChange={(v) => setValue('employmentType', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Business Owner">Business Owner</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <p className="text-xs text-rose-400">{errors.employmentType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <Input id="monthlyIncome" type="number" placeholder="50000" {...register('monthlyIncome')} />
                {errors.monthlyIncome && <p className="text-xs text-rose-400">{errors.monthlyIncome.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="existingEMI">Existing EMI (₹)</Label>
                <Input id="existingEMI" type="number" placeholder="0" {...register('existingEMI')} />
                {errors.existingEMI && <p className="text-xs text-rose-400">{errors.existingEMI.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input id="creditScore" type="number" placeholder="750" {...register('creditScore')} />
                {errors.creditScore && <p className="text-xs text-rose-400">{errors.creditScore.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <Input id="loanAmount" type="number" placeholder="500000" {...register('loanAmount')} />
                {errors.loanAmount && <p className="text-xs text-rose-400">{errors.loanAmount.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loanPurpose">Loan Purpose</Label>
                <Input id="loanPurpose" placeholder="Home Loan" {...register('loanPurpose')} />
                {errors.loanPurpose && <p className="text-xs text-rose-400">{errors.loanPurpose.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanDuration">Duration (months)</Label>
                <Input id="loanDuration" type="number" placeholder="60" {...register('loanDuration')} />
                {errors.loanDuration && <p className="text-xs text-rose-400">{errors.loanDuration.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  AI Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Analyze Eligibility
                </span>
              )}
            </Button>
          </form>
        </Card>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <CardSkeleton />
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Main result card */}
                <Card className={`glass-strong p-6 border-2 ${getRiskBg(result.eligibility)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = eligibilityIcon;
                        return <Icon className={`h-8 w-8 ${getRiskColor(result.eligibility)}`} />;
                      })()}
                      <div>
                        <p className="text-sm text-muted-foreground">Eligibility Status</p>
                        <p className={`text-xl font-bold ${getRiskColor(result.eligibility)}`}>{result.eligibility}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Approval</p>
                      <p className="text-3xl font-bold gradient-text">{result.approvalPercentage}%</p>
                    </div>
                  </div>

                  {/* Approval bar */}
                  <div className="mb-4">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.approvalPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          result.eligibility === 'Eligible' ? 'bg-emerald-500' :
                          result.eligibility === 'Medium Risk' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Max Loan Amount</p>
                      <p className="text-lg font-bold">{formatCurrency(result.maxLoanAmount)}</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Risk Category</p>
                      <p className={`text-lg font-bold ${getRiskColor(result.riskCategory)}`}>{result.riskCategory}</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">DTI Ratio</p>
                      <p className="text-lg font-bold">{result.dtiRatio}%</p>
                    </div>
                    <div className="glass rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Credit Score</p>
                      <p className="text-lg font-bold">{inputData?.creditScore}</p>
                    </div>
                  </div>

                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full mt-4">
                    <FileDown className="mr-2 h-4 w-4" /> Download PDF Report
                  </Button>
                </Card>

                {/* Financial Analysis */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Financial Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.financialAnalysis}</p>
                </Card>

                {/* Reasons */}
                <Card className="glass p-6 border-border/50">
                  <h3 className="font-semibold mb-3">Key Reasons</h3>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {reason}
                      </motion.li>
                    ))}
                  </ul>
                </Card>

                {/* Recommendations */}
                <Card className="glass p-6 border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-[400px] flex-col items-center justify-center"
              >
                <div className="glass rounded-2xl p-12 text-center">
                  <Landmark className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Fill in your details and click analyze to see your loan eligibility</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
