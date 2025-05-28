
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Paperclip, X, AlertTriangle, Trash2 } from "lucide-react";

interface AttachmentFieldProps {
  attachment: { name: string; url: string } | null;
  setAttachment: (attachment: { name: string; url: string } | null) => void;
}

const AttachmentField = ({ attachment, setAttachment }: AttachmentFieldProps) => {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddAttachment = () => {
    if (fileName && fileUrl) {
      // Validate URL format
      try {
        new URL(fileUrl);
        setAttachment({ name: fileName, url: fileUrl });
        setFileName("");
        setFileUrl("");
        setIsEditing(false);
      } catch (error) {
        console.error("URL inválida:", fileUrl);
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setIsEditing(false);
    setFileName("");
    setFileUrl("");
  };

  const handleEditAttachment = () => {
    if (attachment) {
      setFileName(attachment.name);
      setFileUrl(attachment.url);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFileName("");
    setFileUrl("");
  };

  const isTemporaryUrl = (url: string) => {
    return url.startsWith('blob:') || url.startsWith('data:');
  };

  return (
    <FormItem>
      <FormLabel>Anexo (opcional)</FormLabel>
      {attachment && !isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 border rounded">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm flex-1 truncate">{attachment.name}</span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEditAttachment}
                title="Editar anexo"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAttachment}
                title="Remover anexo"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          
          {isTemporaryUrl(attachment.url) && (
            <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium">URL Temporária</p>
                <p>Este arquivo usa uma URL temporária que pode expirar. Para uma solução permanente, considere usar um serviço de armazenamento de arquivos.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Nome do arquivo"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <Input
            placeholder="URL do arquivo (ex: https://exemplo.com/fatura.pdf)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            type="url"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAttachment}
              disabled={!fileName || !fileUrl}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              {attachment ? "Atualizar Anexo" : "Adicionar Anexo"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <p>• Use URLs permanentes para evitar que as faturas fiquem indisponíveis</p>
            <p>• Evite URLs temporárias que começam com "blob:" ou "data:"</p>
          </div>
        </div>
      )}
    </FormItem>
  );
};

export default AttachmentField;
