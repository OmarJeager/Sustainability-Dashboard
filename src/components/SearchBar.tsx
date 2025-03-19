
import React, { useState, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useClickAway } from '@/hooks/use-click-away';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGetCurrentLocation: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGetCurrentLocation, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useClickAway(searchRef, () => {
    if (isExpanded && !query) {
      setIsExpanded(false);
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    
    onSearch(query.trim());
  };
  
  const handleClear = () => {
    setQuery('');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div 
          className={`relative flex items-center glass overflow-hidden transition-all duration-300 rounded-full ${
            isExpanded ? 'w-full' : 'w-10 h-10 search-container'
          }`}
        >
          {isExpanded ? (
            <>
              <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                className="w-full py-2 pl-10 pr-10 bg-transparent border-none focus:outline-none focus:ring-0"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full h-full flex items-center justify-center"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {isExpanded && (
          <Button
            type="submit"
            className="ml-2 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300"
            size="sm"
          >
            Search
          </Button>
        )}
        
        <Button
          type="button"
          onClick={onGetCurrentLocation}
          className="ml-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300"
          size="icon"
          variant="ghost"
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
