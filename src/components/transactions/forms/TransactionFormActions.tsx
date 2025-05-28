
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface TransactionFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditMode: boolean;
  isBlocked?: boolean;
}

const TransactionFormActions = ({ 
  isSubmitting, 
  onCancel, 
  isEditMode, 
  isBlocked = false 
}: TransactionFormActionsProps) => {
  return (
    <DialogFooter className="gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || isBlocked}
        className={isBlocked ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isSubmitting 
          ? "Processando..." 
          : isEditMode 
            ? "Atualizar" 
            : isBlocked 
              ? "Bloqueado"
              : "Salvar"
        }
      </Button>
    </DialogFooter>
  );
};

export default TransactionFormActions;
