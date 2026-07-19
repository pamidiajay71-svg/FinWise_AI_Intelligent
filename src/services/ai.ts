import { supabase } from '@/lib/supabase';
import { getAIErrorMessage } from '@/lib/errors';
import type { AnalysisType } from '@/types';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analyze`;

export async function callAIAnalysis(
  module: AnalysisType,
  input: Record<string, unknown>,
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ module, input }),
    });

    if (!res.ok) {
      return { data: null, error: getAIErrorMessage(new Error(`HTTP ${res.status}`)) };
    }

    const json = await res.json();
    if (json.error) return { data: null, error: getAIErrorMessage(json.error) };
    return { data: json.data ?? json, error: null };
  } catch (err) {
    return {
      data: null,
      error: getAIErrorMessage(err),
    };
  }
}
