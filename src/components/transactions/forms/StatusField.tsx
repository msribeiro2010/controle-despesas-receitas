
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./transactionSchema";

interface StatusFieldProps {
  form: UseFormReturn<TransactionFormData>;
}

const StatusField = ({ form }: StatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="PENDING">A Vencer</SelectItem>
              <SelectItem value="DUE">Pagar</SelectItem>
              <SelectItem value="PAID">Pago</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusField;
