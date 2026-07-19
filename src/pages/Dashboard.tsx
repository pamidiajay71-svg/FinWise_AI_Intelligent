import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckCircle,
  XCircle,
  Gauge,
  Wallet,
  TrendingUp,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { fetchDashboardStats } from '@/services/analytics';
import type { AnalysisRecord, AnalysisType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ChartSkeleton } from '@/components/Loading';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const typeColors: Record<AnalysisType, string> = {
  loan: 'hsl(217 91% 60%)',
  credit: 'hsl(280 65% 65%)',
  emi: 'hsl(190 95% 45%)',
  advisor: 'hsl(340 75% 60%)',
};

export default function Dashboard() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then(({ data, error }) => {
      if (!error) setRecords(data ?? []);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const loans = records.filter((r) => r.type === 'loan');
    const approved = loans.filter((r) => r.eligibility === 'Eligible').length;
    const rejected = loans.filter((r) => r.eligibility === 'Rejected').length;
    const creditScores = records.filter((r) => r.financial_score).map((r) => r.financial_score!);
    const avgCredit = creditScores.length ? Math.round(creditScores.reduce((a, b) => a + b, 0) / creditScores.length) : 0;
    const incomes = records.map((r) => Number((r.input as Record<string, unknown>).monthlyIncome ?? (r.input as Record<string, unknown>).income ?? 0)).filter(Boolean);
    const avgIncome = incomes.length ? Math.round(incomes.reduce((a, b) => a + b, 0) / incomes.length) : 0;
    const emis = records.filter((r) => r.emi).map((r) => Number(r.emi));
    const avgEMI = emis.length ? Math.round(emis.reduce((a, b) => a + b, 0) / emis.length) : 0;

    return {
      total: records.length,
      approved,
      rejected,
      avgCredit,
      avgIncome,
      avgEMI,
    };
  }, [records]);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      counts[r.type] = (counts[r.type] ?? 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      name: type,
      value: count,
      fill: typeColors[type as AnalysisType],
    }));
  }, [records]);

  const riskDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      const risk = r.risk_category ?? r.eligibility;
      if (risk) counts[risk] = (counts[risk] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: name.includes('Low') || name.includes('Eligible') ? 'hsl(160 60% 45%)' : name.includes('Medium') ? 'hsl(43 74% 60%)' : 'hsl(0 75% 60%)',
    }));
  }, [records]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    records.forEach((r) => {
      const d = new Date(r.created_at);
      const key = `${d.toLocaleString('en', { month: 'short' })}`;
      months[key] = (months[key] ?? 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [records]);

  const cards = [
    { icon: Activity, label: 'Total Analyses', value: stats.total, color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Loans Approved', value: stats.approved, color: 'from-emerald-500 to-green-500' },
    { icon: XCircle, label: 'Loans Rejected', value: stats.rejected, color: 'from-rose-500 to-red-500' },
    { icon: Gauge, label: 'Avg Credit Score', value: stats.avgCredit || '—', color: 'from-indigo-500 to-violet-500' },
    { icon: Wallet, label: 'Avg Income', value: stats.avgIncome ? formatCurrency(stats.avgIncome) : '—', color: 'from-amber-500 to-orange-500' },
    { icon: TrendingUp, label: 'Avg EMI', value: stats.avgEMI ? formatCurrency(stats.avgEMI) : '—', color: 'from-cyan-500 to-teal-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your financial analytics overview</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass p-4 border-border/50 card-hover">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} shadow-lg`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <Card className="glass p-12 border-border/50 text-center">
          <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No data yet. Run some analyses to see your dashboard come alive.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Activity */}
          <Card className="glass p-6 border-border/50">
            <h3 className="font-semibold mb-4">Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(217 91% 60%)" strokeWidth={2} dot={{ fill: 'hsl(217 91% 60%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Type Distribution */}
          <Card className="glass p-6 border-border/50">
            <h3 className="font-semibold mb-4">Analysis Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={typeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
                  {typeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Distribution */}
          <Card className="glass p-6 border-border/50">
            <h3 className="font-semibold mb-4">Risk Distribution</h3>
            {riskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                No risk data available
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="glass p-6 border-border/50">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-[250px] overflow-auto">
              {records.slice(0, 8).map((r) => (
                <div key={r.id} className="flex items-center justify-between glass rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {r.risk_category && (r.risk_category.includes('High') || r.eligibility === 'Rejected') ? (
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                    ) : r.risk_category && (r.risk_category.includes('Low') || r.eligibility === 'Eligible') ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Activity className="h-4 w-4 text-blue-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{r.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
