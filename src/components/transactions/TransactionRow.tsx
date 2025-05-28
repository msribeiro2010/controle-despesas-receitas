
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import TransactionActions from "./TransactionActions";
import { format, parseISO } from "date-fns";

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionRow = ({ transaction, onEdit, onDelete }: TransactionRowProps) => {
  // Format the date properly to ensure correct display
  const formatTransactionDate = (dateString: string) => {
    try {
      // Parse the ISO string and format it to local date
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if there's an error
    }
  };

  return (
    <TableRow>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.category}</TableCell>
      <TableCell>
        {formatTransactionDate(transaction.date)}
      </TableCell>
      <TableCell><StatusBadge status={transaction.status} /></TableCell>
      <TableCell 
        className={`text-right font-medium ${
          transaction.type === "INCOME" 
            ? "text-finance-income" 
            : "text-finance-expense"
        }`}
      >
        {transaction.type === "INCOME" ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </TableCell>
      <TableCell>
        <TransactionActions 
          transaction={transaction} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
