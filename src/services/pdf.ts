import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { LoanResult, CreditResult, EMIResult, AdvisorResult } from '@/types';
import { formatCurrency } from '@/lib/utils';

const BRAND = 'FinWise AI';
const TAGLINE = 'Intelligent Loan Eligibility, Credit Analysis & Financial Advisory';

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND, 14, 16);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(TAGLINE, 14, 23);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 32);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated: ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'full', timeStyle: 'short' }).format(new Date())}`,
    196,
    32,
    { align: 'right' },
  );
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 282, 196, 282);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${BRAND} — Confidential Financial Report | Page ${i} of ${pageCount}`,
      105,
      288,
      { align: 'center' },
    );
  }
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, y);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  return y + 8;
}

function addKeyValue(doc: jsPDF, pairs: [string, string][], y: number): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  for (const [key, value] of pairs) {
    doc.setTextColor(100, 116, 139);
    doc.text(`${key}:`, 16, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 80, y);
    doc.setFont('helvetica', 'normal');
    y += 7;
  }
  return y + 3;
}

function addList(doc: jsPDF, items: string[], y: number): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  for (const item of items) {
    doc.text(`• ${item}`, 18, y, { maxWidth: 175 });
    y += 7;
  }
  return y + 3;
}

export function generateLoanReport(
  input: Record<string, unknown>,
  result: LoanResult,
  userName: string,
): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, 'Loan Eligibility Report');

  let y = 45;
  y = addSectionTitle(doc, 'User Information', y);
  y = addKeyValue(
    doc,
    [
      ['Name', userName || 'N/A'],
      ['Age', String(input.age ?? 'N/A')],
      ['Occupation', String(input.occupation ?? 'N/A')],
      ['Monthly Income', formatCurrency(Number(input.monthlyIncome ?? 0))],
      ['Existing EMI', formatCurrency(Number(input.existingEMI ?? 0))],
      ['Credit Score', String(input.creditScore ?? 'N/A')],
      ['Loan Amount Requested', formatCurrency(Number(input.loanAmount ?? 0))],
      ['Loan Purpose', String(input.loanPurpose ?? 'N/A')],
      ['Loan Duration', `${input.loanDuration ?? 'N/A'} months`],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Eligibility Results', y);
  y = addKeyValue(
    doc,
    [
      ['Eligibility', result.eligibility],
      ['Approval Percentage', `${result.approvalPercentage}%`],
      ['Maximum Loan Amount', formatCurrency(result.maxLoanAmount)],
      ['Risk Category', result.riskCategory],
      ['DTI Ratio', `${result.dtiRatio}%`],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Financial Analysis', y);
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(result.financialAnalysis, 14, y, { maxWidth: 182 });
  y += Math.ceil(result.financialAnalysis.length / 90) * 7 + 5;

  if (y > 220) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Reasons', y);
  y = addList(doc, result.reasons, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Recommendations', y);
  y = addList(doc, result.recommendations, y);

  addFooter(doc);
  return doc;
}

export function generateCreditReport(
  input: Record<string, unknown>,
  result: CreditResult,
  userName: string,
): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, 'Credit Score Analysis Report');

  let y = 45;
  y = addSectionTitle(doc, 'User Information', y);
  y = addKeyValue(
    doc,
    [
      ['Name', userName || 'N/A'],
      ['Credit Score', String(input.creditScore ?? 'N/A')],
      ['Income', formatCurrency(Number(input.income ?? 0))],
      ['Credit Card Usage', `${input.creditCardUsage ?? 'N/A'}%`],
      ['Payment History', `${input.paymentHistory ?? 'N/A'}%`],
      ['Existing Loans', String(input.existingLoans ?? 'N/A')],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Credit Analysis', y);
  y = addKeyValue(
    doc,
    [
      ['Category', result.category],
      ['Financial Health', result.financialHealth],
      ['Risk Level', result.risk],
      ['Estimated Recovery Time', result.estimatedRecoveryTime],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Score Breakdown', y);
  autoTable(doc, {
    startY: y,
    head: [['Factor', 'Weight (%)', 'Score']],
    body: result.scoreBreakdown.map((s) => [s.factor, `${s.weight}%`, `${s.score}`]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (y > 220) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Improvement Plan', y);
  y = addList(doc, result.improvementPlan, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Weekly Goals', y);
  y = addList(doc, result.weeklyGoals, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Monthly Goals', y);
  y = addList(doc, result.monthlyGoals, y);

  addFooter(doc);
  return doc;
}

export function generateEMIReport(
  input: Record<string, unknown>,
  result: EMIResult,
  userName: string,
): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, 'EMI Calculation Report');

  let y = 45;
  y = addSectionTitle(doc, 'Loan Details', y);
  y = addKeyValue(
    doc,
    [
      ['Name', userName || 'N/A'],
      ['Loan Amount', formatCurrency(Number(input.loanAmount ?? 0))],
      ['Interest Rate', `${input.interestRate ?? 'N/A'}% p.a.`],
      ['Loan Tenure', `${input.loanTenure ?? 'N/A'} months`],
    ],
    y,
  );

  y = addSectionTitle(doc, 'EMI Summary', y);
  y = addKeyValue(
    doc,
    [
      ['Monthly EMI', formatCurrency(result.monthlyEMI)],
      ['Total Interest', formatCurrency(result.totalInterest)],
      ['Total Payment', formatCurrency(result.totalPayment)],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Amortization Schedule', y);
  autoTable(doc, {
    startY: y,
    head: [['Month', 'Principal', 'Interest', 'Balance']],
    body: result.amortization.map((a) => [
      a.month,
      formatCurrency(a.principal),
      formatCurrency(a.interest),
      formatCurrency(a.balance),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
  });

  addFooter(doc);
  return doc;
}

export function generateAdvisorReport(
  input: Record<string, unknown>,
  result: AdvisorResult,
  userName: string,
): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, 'AI Financial Advisory Report');

  let y = 45;
  y = addSectionTitle(doc, 'Financial Profile', y);
  y = addKeyValue(
    doc,
    [
      ['Name', userName || 'N/A'],
      ['Income', formatCurrency(Number(input.income ?? 0))],
      ['Expenses', formatCurrency(Number(input.expenses ?? 0))],
      ['Savings', formatCurrency(Number(input.savings ?? 0))],
      ['Investments', formatCurrency(Number(input.investments ?? 0))],
      ['Insurance', formatCurrency(Number(input.insurance ?? 0))],
      ['Debt', formatCurrency(Number(input.debt ?? 0))],
      ['Financial Goal', String(input.financialGoal ?? 'N/A')],
      ['Financial Health Score', `${result.financialHealthScore}/100`],
    ],
    y,
  );

  if (y > 200) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Budget Plan', y);
  autoTable(doc, {
    startY: y,
    head: [['Category', 'Amount', 'Percentage']],
    body: result.budgetPlan.map((b) => [b.category, formatCurrency(b.amount), `${b.percentage}%`]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (y > 220) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Savings Strategy', y);
  y = addList(doc, result.savingsStrategy, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Investment Advice', y);
  y = addList(doc, result.investmentAdvice, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Emergency Fund', y);
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(result.emergencyFund, 14, y, { maxWidth: 182 });
  y += Math.ceil(result.emergencyFund.length / 90) * 7 + 5;

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Insurance Advice', y);
  y = addList(doc, result.insuranceAdvice, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Tax Saving Tips', y);
  y = addList(doc, result.taxSaving, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, 'Debt Reduction', y);
  y = addList(doc, result.debtReduction, y);

  if (y > 230) { doc.addPage(); y = 20; }
  y = addSectionTitle(doc, '12-Month Financial Roadmap', y);
  autoTable(doc, {
    startY: y,
    head: [['Month', 'Goal']],
    body: result.roadmap.map((r) => [r.month, r.goal]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  addFooter(doc);
  return doc;
}

export function savePDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}
