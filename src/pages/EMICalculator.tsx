import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  FileDown,
  Sparkles,
  Wallet,
  TrendingDown,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { calculateEMI } from '@/lib/emi';
import { saveAnalysis } from '@/services/analytics';
import { generateEMIReport, savePDF } from '@/services/pdf';
import type { EMIInput, EMIResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function EMICalculator() {
  const { user, profile } = useAuth();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(60);
  const [result, setResult] = useState<EMIResult | null>(null);

  const input: EMIInput = useMemo(
    () => ({ loanAmount, interestRate, loanTenure }),
    [loanAmount, interestRate, loanTenure],
  );

  const handleCalculate = () => {
    const res = calculateEMI(input);
    setResult(res);
    saveAnalysis('emi', `EMI: ${formatCurrency(loanAmount)} @ ${interestRate}% for ${loanTenure}m`, input as unknown as Record<string, unknown>, res as unknown as Record<string, unknown>, { emi: res.monthlyEMI });
    toast.success('EMI calculated!');
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = generateEMIReport(input as unknown as Record<string, unknown>, result, profile?.full_name || user?.email || '');
    savePDF(doc, `emi-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  };

  const pieData = result
    ? [
        { name: 'Principal', value: result.monthlyEMI * result.amortization.length - result.totalInterest, fill: 'hsl(217 91% 60%)' },
        { name: 'Interest', value: result.totalInterest, fill: 'hsl(280 65% 65%)' },
      ]
    : [];

  const barData = result
    ? result.amortization.filter((_, i) => i % Math.max(1, Math.floor(result.amortization.length / 12)) === 0).map((a) => ({
        month: `M${a.month}`,
        Principal: a.principal,
        Interest: a.interest,
      }))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">EMI Calculator</h1>
            <p className="text-sm text-muted-foreground">Calculate your monthly EMI with full amortization schedule</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Input */}
        <Card className="glass-strong p-6 border-border/50 lg:col-span-1">
          <h2 className="mb-6 text-lg font-semibold">Loan Details</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Loan Amount</Label>
                <span className="text-sm font-bold text-primary">{formatCurrency(loanAmount)}</span>
              </div>
              <Input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="accent-primary"
              />
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                placeholder="500000"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Interest Rate (% p.a.)</Label>
                <span className="text-sm font-bold text-primary">{interestRate}%</span>
              </div>
              <Input
                type="range"
                min={1}
                max={30}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="accent-primary"
              />
              <Input
                type="number"
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="10.5"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Loan Tenure (months)</Label>
                <span className="text-sm font-bold text-primary">{loanTenure} months</span>
              </div>
              <Input
                type="range"
                min={1}
                max={360}
                step={1}
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="accent-primary"
              />
              <Input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                placeholder="60"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" /> Calculate EMI
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="glass p-6 border-border/50 card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    <p className="text-xs text-muted-foreground">Monthly EMI</p>
                  </div>
                  <p className="text-2xl font-bold gradient-text">{formatCurrency(result.monthlyEMI)}</p>
                </Card>
                <Card className="glass p-6 border-border/50 card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-violet-400" />
                    <p className="text-xs text-muted-foreground">Total Interest</p>
                  </div>
                  <p className="text-2xl font-bold text-violet-400">{formatCurrency(result.totalInterest)}</p>
                </Card>
                <Card className="glass p-6 border-border/50 card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="h-5 w-5 text-emerald-400" />
                    <p className="text-xs text-muted-foreground">Total Payment</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.totalPayment)}</p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="glass p-6 border-border/50">
                  <h3 className="font-semibold mb-4">Principal vs Interest</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="glass p-6 border-border/50">
                  <h3 className="font-semibold mb-4">Payment Timeline</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="Principal" stackId="a" fill="hsl(217 91% 60%)" />
                      <Bar dataKey="Interest" stackId="a" fill="hsl(280 65% 65%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Download button */}
              <Button onClick={handleDownloadPDF} variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" /> Download Full Amortization Report (PDF)
              </Button>

              {/* Amortization Table */}
              <Card className="glass p-6 border-border/50">
                <h3 className="font-semibold mb-4">Amortization Schedule</h3>
                <ScrollArea className="h-[400px] rounded-lg border border-border/50">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card/95 backdrop-blur">
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.amortization.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell>{formatNumber(row.principal)}</TableCell>
                          <TableCell>{formatNumber(row.interest)}</TableCell>
                          <TableCell>{formatNumber(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </motion.div>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
              <div className="glass rounded-2xl p-12 text-center">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Adjust the sliders and click Calculate EMI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
