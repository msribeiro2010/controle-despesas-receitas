
import { Transaction } from "@/types/finance";

// Calculate current balance
export const calculateCurrentBalance = (
  transactions: Transaction[],
  initialBalance: number
): number => {
  return transactions.reduce((acc, transaction) => {
    return transaction.type === "INCOME" 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, initialBalance);
};

// Check if in overdraft
export const isInOverdraft = (currentBalance: number): boolean => {
  return currentBalance < 0;
};

// Filter transactions for current month
export const filterTransactionsForCurrentMonth = (
  transactions: Transaction[]
): Transaction[] => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
};

// Calculate monthly income
export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const monthlyTransactions = filterTransactionsForCurrentMonth(transactions);
  
  return monthlyTransactions
    .filter(transaction => transaction.type === "INCOME")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

// Calculate monthly expenses
export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const monthlyTransactions = filterTransactionsForCurrentMonth(transactions);
  
  return monthlyTransactions
    .filter(transaction => transaction.type === "EXPENSE")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

// Load settings from localStorage
export const loadSavedSettings = () => {
  const savedSettings = localStorage.getItem('financeSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return { initialBalance: 0, overdraftLimit: 1000, notificationsEnabled: true };
};

// Save settings to localStorage
export const saveSettingsToLocalStorage = (
  initialBalance: number,
  overdraftLimit: number,
  notificationsEnabled: boolean
) => {
  localStorage.setItem('financeSettings', JSON.stringify({
    initialBalance,
    overdraftLimit,
    notificationsEnabled
  }));
};
