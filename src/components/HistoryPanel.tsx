
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2 } from "lucide-react";

interface HistoryPanelProps {
  history: string[];
  onSelectUrl: (url: string) => void;
  onClearHistory: () => void;
}

const HistoryPanel = ({ history, onSelectUrl, onClearHistory }: HistoryPanelProps) => {
  const truncateUrl = (url: string) => {
    if (url.length > 50) {
      return url.substring(0, 47) + "...";
    }
    return url;
  };

  return (
    <Card className="mb-6 bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent URLs
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {history.slice(0, 5).map((url, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs py-1"
              onClick={() => onSelectUrl(url)}
            >
              {truncateUrl(url)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
