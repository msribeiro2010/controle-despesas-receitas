
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { InvoiceOcrResult } from "@/services/invoiceOcrService";

interface ProcessInvoiceButtonProps {
  selectedFile: File | null;
  isProcessing: boolean;
  isExtracting: boolean;
  extractionResult: InvoiceOcrResult | null;
  onProcessInvoice: () => void;
}

const ProcessInvoiceButton = ({
  selectedFile,
  isProcessing,
  isExtracting,
  extractionResult,
  onProcessInvoice
}: ProcessInvoiceButtonProps) => {
  return (
    <div className="mt-6">
      <p className="text-sm text-muted-foreground mb-4">
        {extractionResult 
          ? "Os dados foram extraídos automaticamente. Revise e processe a fatura."
          : "Nota: O processamento OCR pode demorar alguns instantes dependendo do tamanho e qualidade do documento."
        }
      </p>
      <Button 
        onClick={onProcessInvoice} 
        disabled={!selectedFile || isProcessing || isExtracting}
        className="flex items-center gap-2"
      >
        {isProcessing ? "Processando..." : "Processar Fatura"}
        {!isProcessing && <UploadIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ProcessInvoiceButton;
