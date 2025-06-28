
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearch }: SearchBarProps) => {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search within transcript..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 pr-10 w-64"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSearch("")}
          className="absolute right-1 p-1 h-6 w-6"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
