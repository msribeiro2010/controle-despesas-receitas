
import { TableCell, TableRow } from "@/components/ui/table";

const EmptyTransactionState = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
        Nenhuma transação encontrada.
      </TableCell>
    </TableRow>
  );
};

export default EmptyTransactionState;
