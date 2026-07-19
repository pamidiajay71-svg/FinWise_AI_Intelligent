import { supabase } from '@/lib/supabase';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-sheet`;

export async function sendToGoogleSheet(data: Record<string, unknown>): Promise<boolean> {
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
      body: JSON.stringify(data),
    });

    return res.ok;
  } catch {
    return false;
  }
}
