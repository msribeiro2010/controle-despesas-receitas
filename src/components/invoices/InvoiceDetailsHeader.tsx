
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface InvoiceDetailsHeaderProps {
  title: string;
  description: string;
  onGoBack: () => void;
}

const InvoiceDetailsHeader = ({ title, description, onGoBack }: InvoiceDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default InvoiceDetailsHeader;
