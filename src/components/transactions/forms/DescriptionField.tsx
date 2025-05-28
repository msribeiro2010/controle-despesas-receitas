
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./transactionSchema";

interface DescriptionFieldProps {
  form: UseFormReturn<TransactionFormData>;
}

const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
