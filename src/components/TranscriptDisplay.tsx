
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

interface TranscriptDisplayProps {
  transcript: TranscriptEntry[];
  searchTerm: string;
  showTimestamps: boolean;
}

const TranscriptDisplay = ({ transcript, searchTerm, showTimestamps }: TranscriptDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const highlightText = (text: string, searchTerm: string): JSX.Element => {
    if (!searchTerm) return <>{text}</>;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const copyFullTranscript = () => {
    const fullText = transcript.map(entry => 
      showTimestamps ? `[${formatTime(entry.start)}] ${entry.text}` : entry.text
    ).join('\n');
    
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copied to clipboard! 📋",
      description: "Full transcript copied successfully",
    });
  };

  const filteredTranscript = searchTerm 
    ? transcript.filter(entry => 
        entry.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transcript;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? "Collapse" : "Expand"} Transcript
          </Button>
          
          {searchTerm && (
            <Badge variant="secondary">
              {filteredTranscript.length} match{filteredTranscript.length !== 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyFullTranscript}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy All
        </Button>
      </div>

      {isExpanded && (
        <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted/30">
          {filteredTranscript.length > 0 ? (
            <div className="space-y-3">
              {filteredTranscript.map((entry, index) => (
                <div key={index} className="flex gap-3 hover:bg-muted/50 p-2 rounded transition-colors">
                  {showTimestamps && (
                    <Badge variant="outline" className="shrink-0 font-mono text-xs">
                      {formatTime(entry.start)}
                    </Badge>
                  )}
                  <p className="text-sm leading-relaxed">
                    {highlightText(entry.text, searchTerm)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No matches found for "{searchTerm}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
