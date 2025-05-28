
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./transactionSchema";

interface AmountFieldProps {
  form: UseFormReturn<TransactionFormData>;
}

const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor</FormLabel>
          <FormControl>
            <Input type="number" step="0.01" min="0" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountField;
