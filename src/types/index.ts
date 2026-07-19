// ===== FinWise AI — Type Definitions =====

export type AnalysisType = 'loan' | 'credit' | 'emi' | 'advisor';

export type RiskCategory = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type EligibilityStatus = 'Eligible' | 'Medium Risk' | 'Rejected';

// ---- Loan Eligibility ----
export interface LoanInput {
  name: string;
  age: number;
  occupation: string;
  employmentType: string;
  monthlyIncome: number;
  existingEMI: number;
  creditScore: number;
  loanAmount: number;
  loanPurpose: string;
  loanDuration: number; // months
}

export interface LoanResult {
  eligibility: EligibilityStatus;
  approvalPercentage: number;
  maxLoanAmount: number;
  riskCategory: RiskCategory;
  reasons: string[];
  financialAnalysis: string;
  recommendations: string[];
  dtiRatio: number;
}

// ---- Credit Score Analyzer ----
export interface CreditInput {
  creditScore: number;
  income: number;
  creditCardUsage: number; // percentage
  paymentHistory: number; // percentage on-time
  existingLoans: number;
}

export interface CreditResult {
  category: string;
  financialHealth: string;
  risk: RiskCategory;
  improvementPlan: string[];
  estimatedRecoveryTime: string;
  weeklyGoals: string[];
  monthlyGoals: string[];
  scoreBreakdown: { factor: string; weight: number; score: number }[];
}

// ---- EMI Calculator ----
export interface EMIInput {
  loanAmount: number;
  interestRate: number; // annual %
  loanTenure: number; // months
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  amortization: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

// ---- AI Financial Advisor ----
export interface AdvisorInput {
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  insurance: number;
  debt: number;
  financialGoal: string;
}

export interface AdvisorResult {
  budgetPlan: { category: string; amount: number; percentage: number }[];
  savingsStrategy: string[];
  investmentAdvice: string[];
  emergencyFund: string;
  insuranceAdvice: string[];
  taxSaving: string[];
  debtReduction: string[];
  financialHealthScore: number;
  roadmap: { month: string; goal: string }[];
}

// ---- Database ----
export interface AnalysisRecord {
  id: string;
  user_id: string;
  type: AnalysisType;
  title: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  risk_category: string | null;
  eligibility: string | null;
  financial_score: number | null;
  emi: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  theme: string;
  created_at: string;
  updated_at: string;
}

// ---- AI API ----
export interface AIRequest {
  module: AnalysisType;
  input: Record<string, unknown>;
}

export interface AIResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}
