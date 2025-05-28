
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceOcrResult } from "@/services/invoiceOcrService";

interface InvoiceExtractionResultsProps {
  extractionResult: InvoiceOcrResult;
  onDataChange: (data: Partial<InvoiceOcrResult>) => void;
  onEdit: () => void;
}

const InvoiceExtractionResults = ({ 
  extractionResult, 
  onDataChange, 
  onEdit 
}: InvoiceExtractionResultsProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.8) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dados Extraídos da Fatura</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getConfidenceColor(extractionResult.confidence)}>
              {getConfidenceIcon(extractionResult.confidence)}
              <span className="ml-1">
                {Math.round(extractionResult.confidence * 100)}% confiança
              </span>
            </Badge>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="extracted-amount">Valor Extraído</Label>
            <Input
              id="extracted-amount"
              type="number"
              step="0.01"
              value={extractionResult.amount}
              onChange={(e) => onDataChange({ amount: parseFloat(e.target.value) })}
              className="font-medium text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extracted-category">Categoria</Label>
            <Input
              id="extracted-category"
              value={extractionResult.category}
              onChange={(e) => onDataChange({ category: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="extracted-description">Descrição</Label>
          <Input
            id="extracted-description"
            value={extractionResult.description}
            onChange={(e) => onDataChange({ description: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="extracted-date">Data</Label>
          <Input
            id="extracted-date"
            type="date"
            value={extractionResult.date}
            onChange={(e) => onDataChange({ date: e.target.value })}
          />
        </div>
        
        {extractionResult.confidence < 0.8 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Baixa confiança na extração</p>
                <p>Recomendamos revisar os dados extraídos antes de continuar.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceExtractionResults;
