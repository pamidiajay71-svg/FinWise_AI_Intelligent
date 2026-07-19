import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data = await req.json();

    const webhookUrl = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ success: false, message: "Google Sheets webhook URL not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Forward data to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: data.timestamp ?? new Date().toISOString(),
        name: data.name ?? "",
        income: data.income ?? "",
        creditScore: data.creditScore ?? "",
        loanAmount: data.loanAmount ?? "",
        eligibility: data.eligibility ?? "",
        risk: data.risk ?? "",
        advice: data.advice ?? "",
        emi: data.emi ?? "",
        financialScore: data.financialScore ?? "",
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to send to Google Sheets" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Data sent to Google Sheets" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
