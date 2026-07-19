import { z } from 'zod';

/**
 * Shared validation schemas — reused across auth and form pages.
 */

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const loanSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  age: z.coerce.number().min(18, 'Must be 18+').max(100, 'Invalid age'),
  occupation: z.string().min(2, 'Enter occupation'),
  employmentType: z.string().min(1, 'Select employment type'),
  monthlyIncome: z.coerce.number().positive('Must be positive'),
  existingEMI: z.coerce.number().min(0, 'Must be 0 or positive'),
  creditScore: z.coerce.number().min(300, 'Min 300').max(900, 'Max 900'),
  loanAmount: z.coerce.number().positive('Must be positive'),
  loanPurpose: z.string().min(2, 'Enter loan purpose'),
  loanDuration: z.coerce.number().min(1, 'Min 1 month').max(360, 'Max 360 months'),
});

export const creditSchema = z.object({
  creditScore: z.coerce.number().min(300, 'Min 300').max(900, 'Max 900'),
  income: z.coerce.number().positive('Must be positive'),
  creditCardUsage: z.coerce.number().min(0, 'Min 0%').max(100, 'Max 100%'),
  paymentHistory: z.coerce.number().min(0, 'Min 0%').max(100, 'Max 100%'),
  existingLoans: z.coerce.number().min(0, 'Min 0'),
});

export const advisorSchema = z.object({
  income: z.coerce.number().positive('Must be positive'),
  expenses: z.coerce.number().min(0, 'Must be 0 or positive'),
  savings: z.coerce.number().min(0, 'Must be 0 or positive'),
  investments: z.coerce.number().min(0, 'Must be 0 or positive'),
  insurance: z.coerce.number().min(0, 'Must be 0 or positive'),
  debt: z.coerce.number().min(0, 'Must be 0 or positive'),
  financialGoal: z.string().min(2, 'Enter a goal'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type LoanFormData = z.infer<typeof loanSchema>;
export type CreditFormData = z.infer<typeof creditSchema>;
export type AdvisorFormData = z.infer<typeof advisorSchema>;
