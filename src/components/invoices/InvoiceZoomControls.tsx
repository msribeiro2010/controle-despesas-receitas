
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface InvoiceZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const InvoiceZoomControls = ({ zoomLevel, onZoomIn, onZoomOut }: InvoiceZoomControlsProps) => {
  return (
    <div className="flex items-center space-x-2 mt-2 md:mt-0">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomOut}
        disabled={zoomLevel <= 0.5}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-xs">{Math.round(zoomLevel * 100)}%</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomIn}
        disabled={zoomLevel >= 3}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default InvoiceZoomControls;
