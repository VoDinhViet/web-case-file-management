import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeadingProps {
  title: string;
  description?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Heading({
  title,
  description,
  showBack,
  onBack,
}: HeadingProps) {
  return (
    <div className="flex items-start gap-3">
      {showBack && (
        <Button variant="ghost" size="icon" onClick={onBack} type="button">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
