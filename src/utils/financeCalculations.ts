
import { Transaction } from "@/types/finance";

// Calculate the current balance based on initial balance and transactions
export const calculateCurrentBalance = (initialBalance: number, transactions: Transaction[]): number => {
  console.log("=== CALCULANDO SALDO ===");
  console.log("Saldo inicial:", initialBalance);
  console.log("Total de transações:", transactions.length);
  
  const transactionsBalance = transactions.reduce((acc, transaction) => {
    console.log(`Transação: ${transaction.type} - ${transaction.amount} - Status: ${transaction.status}`);
    
    // Incluir TODAS as transações no cálculo do saldo, independente do status
    if (transaction.type === "INCOME") {
      console.log(`Adicionando receita: ${transaction.amount}`);
      return acc + transaction.amount;
    } else {
      console.log(`Subtraindo despesa: ${transaction.amount}`);
      return acc - transaction.amount;
    }
  }, 0);

  const finalBalance = initialBalance + transactionsBalance;
  console.log("Saldo das transações:", transactionsBalance);
  console.log("Saldo final calculado:", finalBalance);
  
  return finalBalance;
};

// Calculate monthly income (all income transactions from the current month)
export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    if (
      transaction.type === "INCOME" &&
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    ) {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);
};

// Calculate monthly expenses (all expense transactions from the current month)
export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    if (
      transaction.type === "EXPENSE" &&
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    ) {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);
};
