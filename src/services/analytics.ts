import { supabase } from '@/lib/supabase';
import { getDatabaseErrorMessage } from '@/lib/errors';
import type { AnalysisRecord, AnalysisType } from '@/types';

export async function saveAnalysis(
  type: AnalysisType,
  title: string,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
  extra?: {
    risk_category?: string;
    eligibility?: string;
    financial_score?: number;
    emi?: number;
  },
): Promise<{ data: AnalysisRecord | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        type,
        title,
        input,
        result,
        risk_category: extra?.risk_category ?? null,
        eligibility: extra?.eligibility ?? null,
        financial_score: extra?.financial_score ?? null,
        emi: extra?.emi ?? null,
      })
      .select()
      .single();

    return { data: data as AnalysisRecord | null, error: error ? getDatabaseErrorMessage(error) : null };
  } catch (err) {
    return { data: null, error: getDatabaseErrorMessage(err) };
  }
}

export async function fetchAnalyses(): Promise<{
  data: AnalysisRecord[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data as AnalysisRecord[] | null, error: error ? getDatabaseErrorMessage(error) : null };
  } catch (err) {
    return { data: null, error: getDatabaseErrorMessage(err) };
  }
}

export async function deleteAnalysis(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('analyses').delete().eq('id', id);
    return { error: error ? getDatabaseErrorMessage(error) : null };
  } catch (err) {
    return { error: getDatabaseErrorMessage(err) };
  }
}

export async function fetchDashboardStats(): Promise<{
  data: AnalysisRecord[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    return { data: data as AnalysisRecord[] | null, error: error ? getDatabaseErrorMessage(error) : null };
  } catch (err) {
    return { data: null, error: getDatabaseErrorMessage(err) };
  }
}
