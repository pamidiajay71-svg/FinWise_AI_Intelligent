import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AIRequest {
  module: "loan" | "credit" | "emi" | "advisor";
  input: Record<string, unknown>;
}

function getSystemPrompt(module: string): string {
  const base = "You are FinWise AI, an expert financial analyst. You MUST respond with ONLY valid JSON. No markdown, no explanation outside JSON. The JSON must match the exact schema specified.";

  switch (module) {
    case "loan":
      return `${base}

Analyze the loan eligibility based on the provided user data. Calculate:
- Debt-to-Income (DTI) ratio = (existingEMI + estimatedNewEMI) / monthlyIncome * 100
- Estimated EMI for the requested loan at ~10.5% annual interest

Respond with this exact JSON schema:
{
  "eligibility": "Eligible" | "Medium Risk" | "Rejected",
  "approvalPercentage": number (0-100),
  "maxLoanAmount": number,
  "riskCategory": "Low Risk" | "Medium Risk" | "High Risk",
  "reasons": string[] (3-5 key reasons),
  "financialAnalysis": string (2-3 sentence summary),
  "recommendations": string[] (3-5 actionable recommendations),
  "dtiRatio": number (the calculated DTI percentage, 1 decimal)
}

Rules:
- Eligible: credit score >= 700, DTI < 40%, approvalPercentage >= 70
- Medium Risk: credit score 600-699, DTI 40-50%, approvalPercentage 40-69
- Rejected: credit score < 600, DTI > 50%, approvalPercentage < 40
- maxLoanAmount should be realistic based on income and DTI`;

    case "credit":
      return `${base}

Analyze the credit score and financial health. Respond with this exact JSON schema:
{
  "category": string (e.g., "Excellent", "Good", "Fair", "Poor"),
  "financialHealth": string (1-2 sentence summary),
  "risk": "Low Risk" | "Medium Risk" | "High Risk",
  "improvementPlan": string[] (4-6 actionable steps),
  "estimatedRecoveryTime": string (e.g., "3-6 months", "6-12 months"),
  "weeklyGoals": string[] (3-4 weekly goals),
  "monthlyGoals": string[] (3-4 monthly goals),
  "scoreBreakdown": [{"factor": string, "weight": number, "score": number}] (4-5 factors: Payment History 35%, Credit Utilization 30%, Credit Age 15%, Credit Mix 10%, New Credit 10%)
}

Rules:
- Excellent: 750-900, Good: 650-749, Fair: 550-649, Poor: 300-549
- Consider creditCardUsage (lower is better) and paymentHistory (higher is better)`;

    case "advisor":
      return `${base}

Generate personalized financial advice. Respond with this exact JSON schema:
{
  "budgetPlan": [{"category": string, "amount": number, "percentage": number}] (6-8 categories that sum to 100%),
  "savingsStrategy": string[] (4-6 strategies),
  "investmentAdvice": string[] (4-6 recommendations based on risk profile),
  "emergencyFund": string (detailed recommendation, 2-3 sentences),
  "insuranceAdvice": string[] (3-4 recommendations),
  "taxSaving": string[] (3-4 tax-saving tips),
  "debtReduction": string[] (3-4 debt reduction strategies),
  "financialHealthScore": number (0-100),
  "roadmap": [{"month": string, "goal": string}] (12 entries, Month 1 to Month 12)
}

Rules:
- Budget categories should include: Housing, Food, Transport, Utilities, Savings, Investments, Insurance, Entertainment
- financialHealthScore based on savings rate, debt-to-income, emergency fund adequacy
- Roadmap should be progressive — earlier months focus on basics, later months on growth`;

    default:
      return base;
  }
}

function buildUserMessage(module: string, input: Record<string, unknown>): string {
  return `Analyze this financial data and respond with the JSON schema only.\n\n${JSON.stringify(input, null, 2)}`;
}

function fallbackAnalysis(module: string, input: Record<string, unknown>): Record<string, unknown> {
  if (module === "loan") {
    const monthlyIncome = Number(input.monthlyIncome ?? 0);
    const existingEMI = Number(input.existingEMI ?? 0);
    const creditScore = Number(input.creditScore ?? 650);
    const loanAmount = Number(input.loanAmount ?? 0);
    const loanDuration = Number(input.loanDuration ?? 60);
    const monthlyRate = 0.105 / 12;
    const newEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDuration) / (Math.pow(1 + monthlyRate, loanDuration) - 1);
    const dtiRatio = monthlyIncome > 0 ? ((existingEMI + newEMI) / monthlyIncome) * 100 : 100;
    const eligible = creditScore >= 700 && dtiRatio < 40;
    const medium = creditScore >= 600 && dtiRatio < 50;
    const eligibility = eligible ? "Eligible" : medium ? "Medium Risk" : "Rejected";
    const approvalPercentage = eligible ? 85 : medium ? 55 : 25;
    const maxLoanAmount = Math.round((monthlyIncome * 0.4 - existingEMI) / monthlyRate * (1 - 1 / Math.pow(1 + monthlyRate, loanDuration)));
    return {
      eligibility,
      approvalPercentage,
      maxLoanAmount: Math.max(0, maxLoanAmount),
      riskCategory: eligible ? "Low Risk" : medium ? "Medium Risk" : "High Risk",
      reasons: [
        `Credit score of ${creditScore} is ${creditScore >= 700 ? "excellent" : creditScore >= 600 ? "moderate" : "low"}`,
        `DTI ratio is ${dtiRatio.toFixed(1)}% which is ${dtiRatio < 40 ? "healthy" : dtiRatio < 50 ? "borderline" : "high"}`,
        `Monthly income supports a maximum EMI of ${Math.round(monthlyIncome * 0.4)}`,
      ],
      financialAnalysis: `Based on your credit score of ${creditScore} and DTI ratio of ${dtiRatio.toFixed(1)}%, your loan eligibility is ${eligibility}. Your monthly income of ${monthlyIncome} supports a reasonable EMI burden.`,
      recommendations: [
        creditScore < 700 ? "Improve your credit score by paying bills on time" : "Maintain your good credit score",
        dtiRatio > 40 ? "Reduce existing EMIs before applying for new loans" : "Your DTI is healthy, proceed with application",
        "Compare interest rates from multiple lenders",
        "Consider a shorter tenure to reduce total interest",
      ],
      dtiRatio: Math.round(dtiRatio * 10) / 10,
    };
  }

  if (module === "credit") {
    const creditScore = Number(input.creditScore ?? 650);
    const usage = Number(input.creditCardUsage ?? 30);
    const paymentHistory = Number(input.paymentHistory ?? 95);
    const category = creditScore >= 750 ? "Excellent" : creditScore >= 650 ? "Good" : creditScore >= 550 ? "Fair" : "Poor";
    const risk = creditScore >= 700 ? "Low Risk" : creditScore >= 600 ? "Medium Risk" : "High Risk";
    return {
      category,
      financialHealth: `Your credit score of ${creditScore} places you in the ${category} category. ${paymentHistory >= 90 ? "Your payment history is strong." : "Your payment history needs improvement."}`,
      risk,
      improvementPlan: [
        usage > 30 ? "Reduce credit card utilization below 30%" : "Maintain low credit utilization",
        paymentHistory < 95 ? "Set up automatic payments to avoid missing due dates" : "Continue your excellent payment habits",
        "Avoid applying for multiple credit cards in a short period",
        "Keep old credit accounts open to maintain credit age",
        "Diversify your credit mix with different types of credit",
      ],
      estimatedRecoveryTime: creditScore >= 700 ? "Already healthy" : creditScore >= 600 ? "3-6 months" : "6-12 months",
      weeklyGoals: [
        "Review your credit card statements",
        "Pay at least the minimum on all cards",
        "Check for any billing errors",
      ],
      monthlyGoals: [
        "Pay down credit card balances",
        "Ensure all bills are paid on time",
        "Monitor your credit score changes",
      ],
      scoreBreakdown: [
        { factor: "Payment History", weight: 35, score: Math.round(paymentHistory) },
        { factor: "Credit Utilization", weight: 30, score: Math.round(100 - usage) },
        { factor: "Credit Age", weight: 15, score: 70 },
        { factor: "Credit Mix", weight: 10, score: 60 },
        { factor: "New Credit", weight: 10, score: 80 },
      ],
    };
  }

  if (module === "advisor") {
    const income = Number(input.income ?? 0);
    const expenses = Number(input.expenses ?? 0);
    const savings = Number(input.savings ?? 0);
    const debt = Number(input.debt ?? 0);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const healthScore = Math.min(100, Math.round(40 + savingsRate * 0.6 - (debt > income * 12 ? 20 : 0)));
    return {
      budgetPlan: [
        { category: "Housing", amount: Math.round(income * 0.3), percentage: 30 },
        { category: "Food & Groceries", amount: Math.round(income * 0.15), percentage: 15 },
        { category: "Transport", amount: Math.round(income * 0.1), percentage: 10 },
        { category: "Utilities", amount: Math.round(income * 0.07), percentage: 7 },
        { category: "Savings", amount: Math.round(income * 0.2), percentage: 20 },
        { category: "Investments", amount: Math.round(income * 0.1), percentage: 10 },
        { category: "Insurance", amount: Math.round(income * 0.05), percentage: 5 },
        { category: "Entertainment", amount: Math.round(income * 0.03), percentage: 3 },
      ],
      savingsStrategy: [
        "Automate 20% of your income to savings on payday",
        "Build an emergency fund of 6 months of expenses",
        "Use the 50/30/20 rule as a baseline",
        "Save windfalls and bonuses instead of spending them",
      ],
      investmentAdvice: [
        "Start with index funds for low-cost diversification",
        "Diversify across equity, debt, and gold",
        "Use SIP for disciplined investing",
        "Rebalance your portfolio annually",
      ],
      emergencyFund: `Build an emergency fund covering 6 months of expenses (${Math.round(expenses * 6)}). Keep this in a high-yield savings account or liquid fund for easy access during emergencies.`,
      insuranceAdvice: [
        "Get term life insurance of 10x your annual income",
        "Ensure health insurance covers your family",
        "Consider critical illness cover",
        "Review coverage annually",
      ],
      taxSaving: [
        "Maximize Section 80C investments (ELSS, PPF)",
        "Use NPS for additional 50K deduction under 80CCD",
        "Claim health insurance premium under 80D",
        "Keep records of all deductions",
      ],
      debtReduction: debt > 0 ? [
        "Use the avalanche method — pay off highest-interest debt first",
        "Consider debt consolidation for lower rates",
        "Avoid taking new debt while paying off existing",
        "Make extra payments when possible",
      ] : ["You are debt-free. Maintain this by living within your means."],
      financialHealthScore: healthScore,
      roadmap: [
        { month: "Month 1", goal: "Track all expenses and create a budget" },
        { month: "Month 2", goal: "Start automatic savings transfer" },
        { month: "Month 3", goal: "Build first month of emergency fund" },
        { month: "Month 4", goal: "Start or increase SIP investments" },
        { month: "Month 5", goal: "Review and optimize insurance coverage" },
        { month: "Month 6", goal: "Reach 3 months of emergency fund" },
        { month: "Month 7", goal: "Pay off any high-interest debt" },
        { month: "Month 8", goal: "Diversify investment portfolio" },
        { month: "Month 9", goal: "Review tax-saving investments" },
        { month: "Month 10", goal: "Plan for major financial goals" },
        { month: "Month 11", goal: "Review and rebalance portfolio" },
        { month: "Month 12", goal: "Complete annual financial review" },
      ],
    };
  }

  return {};
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { module, input } = await req.json() as AIRequest;

    if (!module || !input) {
      return new Response(
        JSON.stringify({ error: "Missing module or input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const claudeApiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? Deno.env.get("CLAUDE_API_KEY");

    // If no API key, use fallback calculation
    if (!claudeApiKey) {
      const fallback = fallbackAnalysis(module, input);
      return new Response(
        JSON.stringify({ data: fallback, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = getSystemPrompt(module);
    const userMessage = buildUserMessage(module, input);

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error("Claude API error:", errText);
      const fallback = fallbackAnalysis(module, input);
      return new Response(
        JSON.stringify({ data: fallback, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const claudeData = await claudeResponse.json();
    const textContent = claudeData.content?.[0]?.text ?? "";

    // Parse JSON from Claude's response
    let parsed: Record<string, unknown>;
    try {
      // Extract JSON from potential markdown wrapper
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(textContent);
    } catch {
      console.error("Failed to parse Claude response:", textContent);
      const fallback = fallbackAnalysis(module, input);
      return new Response(
        JSON.stringify({ data: fallback, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ data: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
