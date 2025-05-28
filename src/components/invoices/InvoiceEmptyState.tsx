
import { FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface InvoiceEmptyStateProps {
  attachment: { name: string; url: string } | null;
  transactionId: string;
}

const InvoiceEmptyState = ({ attachment, transactionId }: InvoiceEmptyStateProps) => {
  const navigate = useNavigate();

  const handleEditTransaction = () => {
    navigate(`/transactions?edit=${transactionId}`);
  };

  const isBlobUrl = () => {
    return attachment?.url?.startsWith('blob:') || false;
  };

  const isDataUrl = () => {
    return attachment?.url?.startsWith('data:') || false;
  };

  const getEmptyStateMessage = () => {
    if (isBlobUrl()) {
      return {
        title: "Fatura temporária expirada",
        description: "A fatura foi anexada temporariamente e não está mais disponível. Edite a transação para anexar novamente."
      };
    }
    if (isDataUrl()) {
      return {
        title: "Formato de imagem inválido",
        description: "O formato da imagem não é suportado para visualização."
      };
    }
    return {
      title: "Nenhuma imagem de fatura disponível",
      description: "Esta transação não possui uma fatura anexada."
    };
  };

  const { title, description } = getEmptyStateMessage();

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
      <FileText className="h-16 w-16 text-muted-foreground/50" />
      <div className="text-center max-w-md">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm mt-1">{description}</p>
        {attachment && (
          <>
            <p className="text-xs mt-2 text-muted-foreground">
              Arquivo: {attachment.name}
            </p>
            <div className="mt-3 space-y-2">
              {isBlobUrl() && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleEditTransaction}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Transação
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceEmptyState;
