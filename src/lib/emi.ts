import type { EMIInput, EMIResult } from '@/types';

export function calculateEMI(input: EMIInput): EMIResult {
  const { loanAmount, interestRate, loanTenure } = input;
  const monthlyRate = interestRate / 12 / 100;

  let monthlyEMI: number;
  if (monthlyRate === 0) {
    monthlyEMI = loanAmount / loanTenure;
  } else {
    monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1);
  }

  const totalPayment = monthlyEMI * loanTenure;
  const totalInterest = totalPayment - loanAmount;

  const amortization = [];
  let balance = loanAmount;
  for (let month = 1; month <= loanTenure; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyEMI - interest;
    balance = Math.max(0, balance - principal);
    amortization.push({
      month,
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    amortization,
  };
}
