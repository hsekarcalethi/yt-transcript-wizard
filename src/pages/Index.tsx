
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Search, Download, Clock, Copy, Trash2, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import DownloadOptions from "@/components/DownloadOptions";
import SearchBar from "@/components/SearchBar";
import HistoryPanel from "@/components/HistoryPanel";

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

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedHistory = localStorage.getItem("transcript-history");
    
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const extractVideoIds = (url: string): string[] => {
    const videoRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const playlistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;
    
    const videoMatch = url.match(videoRegex);
    const playlistMatch = url.match(playlistRegex);
    
    if (videoMatch) {
      return [videoMatch[1]];
    }
    
    if (playlistMatch) {
      // For demo purposes, returning mock playlist videos
      return ["dQw4w9WgXcQ", "3tmd-ClpJxA", "kJQP7kiw5Fk"];
    }
    
    return [];
  };

  const mockTranscript: TranscriptEntry[] = [
    { text: "Welcome to this amazing video tutorial", start: 0, duration: 3.5 },
    { text: "Today we're going to learn about React and modern web development", start: 3.5, duration: 4.2 },
    { text: "First, let's talk about the fundamentals of component-based architecture", start: 7.7, duration: 5.1 },
    { text: "React allows us to build reusable UI components that make our code more maintainable", start: 12.8, duration: 6.3 },
    { text: "We can pass data between components using props and manage state effectively", start: 19.1, duration: 5.8 },
    { text: "Let's dive into some practical examples to see how this works in action", start: 24.9, duration: 4.7 },
    { text: "Thank you for watching, and don't forget to subscribe for more content", start: 29.6, duration: 4.2 }
  ];

  const fetchTranscript = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a YouTube URL",
        description: "Paste a video or playlist link to get started",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const videoIds = extractVideoIds(url);
      
      if (videoIds.length === 0) {
        throw new Error("Invalid YouTube URL");
      }

      const newVideos: VideoData[] = [];
      
      // Mock API calls for demo
      for (const videoId of videoIds) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        newVideos.push({
          id: videoId,
          title: `Sample Video Title ${videoId.slice(-4)}`,
          transcript: mockTranscript,
          url: `https://youtube.com/watch?v=${videoId}`
        });
      }
      
      setVideos(newVideos);
      
      // Add to history
      const newHistory = [url, ...history.filter(h => h !== url)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("transcript-history", JSON.stringify(newHistory));
      
      toast({
        title: "Transcript fetched successfully! ✨",
        description: `Found ${newVideos.length} video${newVideos.length > 1 ? 's' : ''}`,
      });
      
    } catch (error) {
      toast({
        title: "Failed to fetch transcript",
        description: "Please check the URL and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setVideos([]);
    setUrl("");
    setSearchTerm("");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg text-white">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                Transcript Fetcher
              </h1>
              <p className="text-sm text-muted-foreground">
                Paste your link to start fetching magic ✨
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="transition-transform hover:scale-105"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Main Input */}
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Paste YouTube video or playlist URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-lg py-3"
                onKeyPress={(e) => e.key === 'Enter' && fetchTranscript()}
              />
              <Button 
                onClick={fetchTranscript} 
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching...
                  </div>
                ) : (
                  "Fetch Transcript"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Panel */}
        {history.length > 0 && (
          <HistoryPanel 
            history={history} 
            onSelectUrl={setUrl}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem("transcript-history");
            }}
          />
        )}

        {/* Controls */}
        {videos.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <SearchBar 
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
              />
              
              <Button
                variant="outline"
                onClick={() => setShowTimestamps(!showTimestamps)}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {showTimestamps ? "Hide" : "Show"} Timestamps
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {videos.length} video{videos.length > 1 ? 's' : ''}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Videos */}
        <div className="space-y-6">
          {videos.map((video, index) => (
            <Card key={video.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {video.title}
                  </CardTitle>
                  <DownloadOptions video={video} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Youtube className="w-4 h-4" />
                  <span>Video {index + 1} of {videos.length}</span>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-6">
                <TranscriptDisplay
                  transcript={video.transcript}
                  searchTerm={searchTerm}
                  showTimestamps={showTimestamps}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-purple-100 dark:from-red-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to fetch transcripts?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Paste any YouTube video or playlist URL above and we'll extract the transcript for you in seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
