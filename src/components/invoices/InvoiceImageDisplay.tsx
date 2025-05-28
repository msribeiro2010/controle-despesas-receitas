
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface InvoiceImageDisplayProps {
  attachment: { name: string; url: string };
  transactionId: string;
  zoomLevel: number;
}

const InvoiceImageDisplay = ({ attachment, transactionId, zoomLevel }: InvoiceImageDisplayProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("InvoiceImageDisplay - Carregando anexo:", attachment);

  const handleImageError = () => {
    console.log("Erro ao carregar imagem da fatura:", attachment?.url);
    setImageLoadError(true);
    setIsRetrying(false);
  };

  const handleImageLoad = () => {
    console.log("Imagem da fatura carregada com sucesso");
    setImageLoadError(false);
    setIsRetrying(false);
    setRetryAttempts(0);
  };

  const retryImageLoad = () => {
    if (retryAttempts >= 3) {
      toast({
        title: "Limite de tentativas atingido",
        description: "Não foi possível carregar a imagem após várias tentativas.",
        variant: "destructive"
      });
      return;
    }

    console.log(`Tentativa ${retryAttempts + 1} de recarregar a imagem da fatura...`);
    setIsRetrying(true);
    setImageLoadError(false);
    setRetryAttempts(prev => prev + 1);
    
    const img = new Image();
    img.onload = () => {
      console.log("Imagem recarregada com sucesso na tentativa manual");
      setImageLoadError(false);
      setIsRetrying(false);
    };
    img.onerror = () => {
      console.log("Falha ao recarregar a imagem na tentativa manual");
      setImageLoadError(true);
      setIsRetrying(false);
      toast({
        title: "Erro ao carregar fatura",
        description: "Não foi possível carregar a imagem da fatura. Verifique se o arquivo ainda existe ou tente novamente.",
        variant: "destructive"
      });
    };
    img.src = `${attachment.url}?retry=${retryAttempts + 1}&t=${Date.now()}`;
  };

  const handleEditTransaction = () => {
    navigate(`/transactions?edit=${transactionId}`);
  };

  const isBlobUrl = () => {
    return attachment?.url?.startsWith('blob:') || false;
  };

  const isDataUrl = () => {
    return attachment?.url?.startsWith('data:') || false;
  };

  // Verificar se é um arquivo PDF
  const isPdfFile = () => {
    return attachment?.name?.toLowerCase().endsWith('.pdf') || 
           attachment?.url?.toLowerCase().includes('.pdf') ||
           attachment?.url?.toLowerCase().includes('pdf');
  };

  console.log("InvoiceImageDisplay - É PDF?", isPdfFile());
  console.log("InvoiceImageDisplay - É blob URL?", isBlobUrl());
  console.log("InvoiceImageDisplay - É data URL?", isDataUrl());

  if (imageLoadError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-medium">Erro ao carregar a fatura</p>
        <p className="text-sm">
          A imagem da fatura não pôde ser carregada. O arquivo pode ter sido removido ou corrompido.
        </p>
        <p className="text-xs text-muted-foreground">
          Arquivo: {attachment.name}
        </p>
        <div className="space-y-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleEditTransaction}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Transação
          </Button>
          
          {!isBlobUrl() && !isDataUrl() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryImageLoad}
              disabled={isRetrying || retryAttempts >= 3}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Tentando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente {retryAttempts > 0 && `(${retryAttempts}/3)`}
                </>
              )}
            </Button>
          )}
          
          {retryAttempts > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Tentativas de carregamento: {retryAttempts}/3</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Se for um PDF, mostrar uma mensagem especial
  if (isPdfFile()) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-medium">Arquivo PDF detectado</p>
        <p className="text-sm text-center">
          Este é um arquivo PDF que não pode ser visualizado diretamente. 
          Clique no link abaixo para abrir em uma nova aba.
        </p>
        <p className="text-xs text-muted-foreground">
          Arquivo: {attachment.name}
        </p>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => window.open(attachment.url, '_blank')}
        >
          Abrir PDF em Nova Aba
        </Button>
      </div>
    );
  }

  return (
    <img 
      src={attachment.url}
      alt="Fatura" 
      className="transition-transform duration-200 max-w-full h-auto"
      style={{ 
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'center top',
        maxWidth: `${100 / zoomLevel}%`
      }}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default InvoiceImageDisplay;
