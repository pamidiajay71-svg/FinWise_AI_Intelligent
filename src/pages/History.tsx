import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  FileDown,
  FileText,
  Filter,
  ArrowUpDown,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchAnalyses, deleteAnalysis } from '@/services/analytics';
import { downloadFile, formatDate, getRiskColor, getRiskBg } from '@/lib/utils';
import { RowSkeleton } from '@/components/Loading';
import type { AnalysisRecord, AnalysisType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const typeLabels: Record<AnalysisType, string> = {
  loan: 'Loan Eligibility',
  credit: 'Credit Analyzer',
  emi: 'EMI Calculator',
  advisor: 'AI Advisor',
};

const typeColors: Record<AnalysisType, string> = {
  loan: 'bg-blue-500/15 text-blue-400',
  credit: 'bg-violet-500/15 text-violet-400',
  emi: 'bg-cyan-500/15 text-cyan-400',
  advisor: 'bg-fuchsia-500/15 text-fuchsia-400',
};

export default function History() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'title'>('date_desc');
  const [viewRecord, setViewRecord] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const { data, error } = await fetchAnalyses();
    if (error) toast.error(error);
    setRecords(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteAnalysis(id);
    if (error) {
      toast.error(error);
    } else {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success('Record deleted');
    }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Date', 'Type', 'Title', 'Risk', 'Eligibility', 'Score', 'EMI'];
    const rows = filtered.map((r) => [
      formatDate(r.created_at),
      typeLabels[r.type as AnalysisType],
      r.title,
      r.risk_category ?? '',
      r.eligibility ?? '',
      r.financial_score?.toString() ?? '',
      r.emi?.toString() ?? '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, `finwise-history-${Date.now()}.csv`, 'text/csv');
    toast.success('CSV exported');
  };

  const handleCopy = (record: AnalysisRecord) => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    toast.success('Record copied to clipboard');
  };

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          typeLabels[r.type as AnalysisType].toLowerCase().includes(q) ||
          (r.risk_category ?? '').toLowerCase().includes(q),
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter((r) => r.type === typeFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [records, search, typeFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
            <HistoryIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analysis History</h1>
            <p className="text-sm text-muted-foreground">Search, filter, and export your past analyses</p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <Card className="glass-strong p-4 border-border/50 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, type, or risk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Search analysis history"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="loan">Loan Eligibility</SelectItem>
              <SelectItem value="credit">Credit Analyzer</SelectItem>
              <SelectItem value="emi">EMI Calculator</SelectItem>
              <SelectItem value="advisor">AI Advisor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-full sm:w-44">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportCSV} variant="outline" disabled={filtered.length === 0}>
            <FileDown className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="glass-strong border-border/50 overflow-hidden">
        {loading ? (
          <RowSkeleton count={5} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <HistoryIcon className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No analyses found. Run an analysis to see it here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card/95 backdrop-blur z-10">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(record.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[record.type as AnalysisType]}>
                        {typeLabels[record.type as AnalysisType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.title}</TableCell>
                    <TableCell>
                      {record.risk_category ? (
                        <span className={`text-xs font-medium ${getRiskColor(record.risk_category)}`}>
                          {record.risk_category}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.eligibility ? (
                        <span className={`text-xs font-medium ${getRiskColor(record.eligibility)}`}>
                          {record.eligibility}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-bold">
                      {record.financial_score ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setViewRecord(record)} title="View details">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleCopy(record)} title="Copy JSON">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(record.id)} className="text-rose-400" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{viewRecord?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{viewRecord && typeLabels[viewRecord.type as AnalysisType]}</p>
                </div>
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{viewRecord && formatDate(viewRecord.created_at)}</p>
                </div>
                {viewRecord?.risk_category && (
                  <div className={`glass rounded-lg p-3 ${getRiskBg(viewRecord.risk_category)}`}>
                    <p className="text-xs text-muted-foreground">Risk</p>
                    <p className={`text-sm font-medium ${getRiskColor(viewRecord.risk_category)}`}>{viewRecord.risk_category}</p>
                  </div>
                )}
                {viewRecord?.eligibility && (
                  <div className={`glass rounded-lg p-3 ${getRiskBg(viewRecord.eligibility)}`}>
                    <p className="text-xs text-muted-foreground">Eligibility</p>
                    <p className={`text-sm font-medium ${getRiskColor(viewRecord.eligibility)}`}>{viewRecord.eligibility}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Input</p>
                <pre className="glass rounded-lg p-3 text-xs overflow-auto">{JSON.stringify(viewRecord?.input, null, 2)}</pre>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Result</p>
                <pre className="glass rounded-lg p-3 text-xs overflow-auto">{JSON.stringify(viewRecord?.result, null, 2)}</pre>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
