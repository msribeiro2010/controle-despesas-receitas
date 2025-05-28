
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/contexts/FinanceContext";

interface StatusBadgeProps {
  status: Transaction["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "PAID":
      return (
        <Badge variant="outline" className="bg-finance-income/10 text-finance-income border-finance-income/20">
          Pago
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="outline" className="bg-finance-warning/10 text-finance-warning border-finance-warning/20">
          A Vencer
        </Badge>
      );
    case "DUE":
      return (
        <Badge variant="outline" className="bg-finance-expense/10 text-finance-expense border-finance-expense/20">
          Pagar
        </Badge>
      );
    default:
      return null;
  }
};

export default StatusBadge;
