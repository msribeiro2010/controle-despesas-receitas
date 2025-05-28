
export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionStatus = "PENDING" | "DUE" | "PAID";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  description: string;
  status: TransactionStatus;
  attachment?: {
    name: string;
    url: string;
  };
  password?: string; // Optional password for protected invoices
  actualAmount?: number; // The actual amount that might differ from transaction amount
  user_id?: string; // ID do usuário no Supabase
}

export interface FinanceContextType {
  initialBalance: number;
  setInitialBalance: (balance: number) => void;
  overdraftLimit: number;
  setOverdraftLimit: (limit: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  currentBalance: number;
  inOverdraft: boolean;
  monthlyIncome: number;
  monthlyExpenses: number;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
}
