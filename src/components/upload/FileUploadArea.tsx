
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image, Scan } from "lucide-react";

interface FileUploadAreaProps {
  onFileChange: (file: File | null) => void;
  isExtracting: boolean;
}

const FileUploadArea = ({ onFileChange, isExtracting }: FileUploadAreaProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Fatura</CardTitle>
        <CardDescription>
          Faça upload de um arquivo PDF ou imagem de fatura para extrair as transações automaticamente usando OCR.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
          <Image className="h-12 w-12 text-primary/40 mb-4" />
          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              Arraste e solte ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground">
              Suporta formatos PDF, JPG e PNG - OCR automático incluído
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Label htmlFor="file" className="sr-only">Escolher arquivo</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              className="cursor-pointer" 
              onChange={handleFileChange}
            />
          </div>
          
          {isExtracting && (
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Scan className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Extraindo dados da fatura...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadArea;
