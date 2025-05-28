
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layouts/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useFinance } from "@/contexts/FinanceContext";
import { extractInvoiceData, validateExtractedAmount, InvoiceOcrResult } from "@/services/invoiceOcrService";
import InvoiceExtractionResults from "@/components/upload/InvoiceExtractionResults";
import FileUploadArea from "@/components/upload/FileUploadArea";
import FilePreview from "@/components/upload/FilePreview";
import ManualInvoiceForm from "@/components/upload/ManualInvoiceForm";
import ProcessInvoiceButton from "@/components/upload/ProcessInvoiceButton";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [invoicePassword, setInvoicePassword] = useState("");
  const [extractionResult, setExtractionResult] = useState<InvoiceOcrResult | null>(null);
  const [manualAmount, setManualAmount] = useState<string>("450");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addTransaction } = useFinance();

  const handleFileChange = async (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      
      // Reset zoom and extraction results when new file is loaded
      setZoomLevel(1);
      setExtractionResult(null);
      
      // Automatically start OCR extraction
      await handleExtractData(file);
    }
  };

  const handleExtractData = async (file: File) => {
    setIsExtracting(true);
    try {
      const result = await extractInvoiceData(file);
      setExtractionResult(result);
      
      toast({
        title: "Extração concluída",
        description: `Dados extraídos com ${Math.round(result.confidence * 100)}% de confiança.`,
        variant: result.confidence >= 0.8 ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Erro na extração OCR:", error);
      toast({
        title: "Erro na extração",
        description: "Não foi possível extrair os dados automaticamente. Use os valores manuais.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleProcessInvoice = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para processar.",
        variant: "destructive"
      });
      return;
    }

    if (isPasswordProtected && !invoicePassword) {
      toast({
        title: "Senha da fatura não definida",
        description: "Por favor, defina uma senha para proteger a fatura.",
        variant: "destructive"
      });
      return;
    }

    // Use dados extraídos ou valores manuais
    const finalAmount = extractionResult ? extractionResult.amount : parseFloat(manualAmount);
    const finalDescription = extractionResult ? extractionResult.description : (isPasswordProtected ? "Fatura do Bradesco (Protegida)" : "Fatura do Bradesco");
    const finalCategory = extractionResult ? extractionResult.category : "Cartão de Crédito";
    const finalDate = extractionResult ? extractionResult.date : new Date().toISOString().split('T')[0];

    if (!validateExtractedAmount(finalAmount)) {
      toast({
        title: "Valor inválido",
        description: "O valor da fatura deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulação de processamento
    setTimeout(() => {
      // Add a new transaction with the uploaded file
      addTransaction({
        type: "EXPENSE",
        amount: finalAmount,
        date: finalDate,
        category: finalCategory,
        description: finalDescription,
        status: "DUE",
        attachment: {
          name: selectedFile.name,
          url: filePreview || ""
        },
        // Add password if the invoice is protected
        ...(isPasswordProtected && { password: invoicePassword }),
        // Store actual amount for comparison if different from the transaction amount
        actualAmount: finalAmount
      });
      
      setIsProcessing(false);
      toast({
        title: "Fatura processada com sucesso",
        description: `A fatura foi extraída e adicionada ao sistema ${isPasswordProtected ? "(protegida por senha)" : ""}.`
      });
      
      // Redireciona para a página de transações
      navigate("/transactions");
    }, 2000);
  };

  const handleExtractionDataChange = (data: Partial<InvoiceOcrResult>) => {
    if (extractionResult) {
      setExtractionResult({ ...extractionResult, ...data });
    }
  };

  const handleEditExtraction = () => {
    // Permitir edição manual dos dados extraídos
    toast({
      title: "Modo de edição ativado",
      description: "Você pode agora editar os dados extraídos diretamente nos campos acima."
    });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Upload de Faturas</h2>
        <p className="text-muted-foreground mt-2">
          Faça upload de suas faturas para processamento automático e extração de transações com OCR.
        </p>
      </div>

      <FileUploadArea onFileChange={handleFileChange} isExtracting={isExtracting} />

      {filePreview && (
        <FilePreview
          filePreview={filePreview}
          zoomLevel={zoomLevel}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      )}

      {/* Mostrar resultados da extração OCR */}
      {extractionResult && (
        <InvoiceExtractionResults
          extractionResult={extractionResult}
          onDataChange={handleExtractionDataChange}
          onEdit={handleEditExtraction}
        />
      )}

      {filePreview && !extractionResult && !isExtracting && (
        <ManualInvoiceForm
          manualAmount={manualAmount}
          setManualAmount={setManualAmount}
          isPasswordProtected={isPasswordProtected}
          setIsPasswordProtected={setIsPasswordProtected}
          invoicePassword={invoicePassword}
          setInvoicePassword={setInvoicePassword}
        />
      )}

      <ProcessInvoiceButton
        selectedFile={selectedFile}
        isProcessing={isProcessing}
        isExtracting={isExtracting}
        extractionResult={extractionResult}
        onProcessInvoice={handleProcessInvoice}
      />
    </AppLayout>
  );
};

export default Upload;
