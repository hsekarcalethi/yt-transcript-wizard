
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileImage, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

interface VideoData {
  id: string;
  title: string;
  transcript: TranscriptEntry[];
  url: string;
}

interface DownloadOptionsProps {
  video: VideoData;
}

const DownloadOptions = ({ video }: DownloadOptionsProps) => {
  const { toast } = useToast();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadTXT = () => {
    const content = video.transcript.map(entry => 
      `[${Math.floor(entry.start / 60)}:${(Math.floor(entry.start) % 60).toString().padStart(2, '0')}] ${entry.text}`
    ).join('\n');
    
    downloadFile(content, `${video.title}.txt`, 'text/plain');
    toast({
      title: "TXT downloaded! 📄",
      description: "Plain text transcript saved",
    });
  };

  const downloadSRT = () => {
    let content = '';
    video.transcript.forEach((entry, index) => {
      const startTime = formatTime(entry.start);
      const endTime = formatTime(entry.start + entry.duration);
      
      content += `${index + 1}\n`;
      content += `${startTime} --> ${endTime}\n`;
      content += `${entry.text}\n\n`;
    });
    
    downloadFile(content, `${video.title}.srt`, 'text/srt');
    toast({
      title: "SRT downloaded! 🎬",
      description: "Subtitle file saved",
    });
  };

  const downloadJSON = () => {
    const data = {
      title: video.title,
      videoId: video.id,
      url: video.url,
      transcript: video.transcript,
      downloadedAt: new Date().toISOString()
    };
    
    downloadFile(JSON.stringify(data, null, 2), `${video.title}.json`, 'application/json');
    toast({
      title: "JSON downloaded! 📊",
      description: "Structured data saved",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={downloadTXT} className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Download as TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadSRT} className="flex items-center gap-2">
          <FileImage className="w-4 h-4" />
          Download as SRT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadJSON} className="flex items-center gap-2">
          <FileCode className="w-4 h-4" />
          Download as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadOptions;
