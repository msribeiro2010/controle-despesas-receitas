
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionFormData } from "./transactionSchema";

interface TransactionTypeFieldProps {
  form: UseFormReturn<TransactionFormData>;
  disabled?: boolean;
}

const TransactionTypeField = ({ form, disabled = false }: TransactionTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="INCOME">Receita</SelectItem>
              <SelectItem value="EXPENSE">Despesa</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransactionTypeField;
