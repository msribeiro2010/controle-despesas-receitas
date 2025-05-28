
import { useState } from "react";
import InvoiceImageDisplay from "./InvoiceImageDisplay";
import InvoiceEmptyState from "./InvoiceEmptyState";
import InvoiceZoomControls from "./InvoiceZoomControls";
import InvoiceHeader from "./InvoiceHeader";

interface InvoiceViewerProps {
  attachment: { name: string; url: string } | null;
  transactionId: string;
  invoiceActualAmount: number | null;
  transactionAmount: number;
  transactionType: "INCOME" | "EXPENSE";
  formatCurrency: (amount: number) => string;
}

const InvoiceViewer = ({ 
  attachment, 
  transactionId, 
  invoiceActualAmount, 
  transactionAmount, 
  transactionType, 
  formatCurrency 
}: InvoiceViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const hasValidAttachment = () => {
    console.log("Verificando anexo:", attachment);
    
    // Verifica se há um anexo
    if (!attachment) {
      console.log("Nenhum anexo encontrado");
      return false;
    }
    
    // Verifica se há URL
    if (!attachment.url || attachment.url.trim() === "") {
      console.log("URL do anexo está vazia");
      return false;
    }
    
    console.log("Anexo válido encontrado:", attachment.url);
    return true;
  };

  const showImageDisplay = hasValidAttachment();
  
  console.log("InvoiceViewer - Mostrar imagem:", showImageDisplay);

  return (
    <div className="bg-gray-50 border rounded-md w-full p-4 md:p-6 flex flex-col items-center">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        <InvoiceHeader 
          transactionId={transactionId}
          invoiceActualAmount={invoiceActualAmount}
          transactionAmount={transactionAmount}
          transactionType={transactionType}
          formatCurrency={formatCurrency}
        />
        
        {showImageDisplay && (
          <InvoiceZoomControls 
            zoomLevel={zoomLevel}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
        )}
      </div>
      
      <div className="w-full bg-white border shadow-sm rounded-md overflow-auto mb-4 p-2">
        <div className="min-h-[500px] flex justify-center items-center">
          {showImageDisplay ? (
            <InvoiceImageDisplay 
              attachment={attachment!}
              transactionId={transactionId}
              zoomLevel={zoomLevel}
            />
          ) : (
            <InvoiceEmptyState 
              attachment={attachment}
              transactionId={transactionId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;
