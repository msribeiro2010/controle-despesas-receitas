
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface FilePreviewProps {
  filePreview: string;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const FilePreview = ({ filePreview, zoomLevel, onZoomIn, onZoomOut }: FilePreviewProps) => {
  return (
    <div className="mt-4 border rounded p-3 w-full max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Pré-visualização:</p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs">{Math.round(zoomLevel * 100)}%</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onZoomIn}
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-auto max-h-[400px] border">
        <img 
          src={filePreview} 
          alt="Pré-visualização da fatura" 
          className="mx-auto object-contain transition-transform duration-200"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center top',
            maxWidth: `${100 / zoomLevel}%`
          }}
        />
      </div>
    </div>
  );
};

export default FilePreview;
