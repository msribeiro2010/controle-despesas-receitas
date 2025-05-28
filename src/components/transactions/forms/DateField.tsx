
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormData } from "./transactionSchema";

interface DateFieldProps {
  form: UseFormReturn<TransactionFormData>;
}

const DateField = ({ form }: DateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => {
        // Convert string date to Date object for the calendar
        const selectedDate = field.value ? new Date(field.value) : undefined;
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Data</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Convert Date back to ISO string for the form
                      const correctedDate = new Date(date);
                      correctedDate.setHours(12, 0, 0, 0);
                      field.onChange(correctedDate.toISOString().split('T')[0]);
                    }
                  }}
                  disabled={(date: Date) => {
                    return date < new Date(1900, 0, 1);
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DateField;
