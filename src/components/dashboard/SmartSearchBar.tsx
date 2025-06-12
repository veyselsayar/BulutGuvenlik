import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { Finding } from '../../types/findings';

interface SmartSearchBarProps {
  findings: Finding[];
  onSearch: (query: string) => void;
  currentQuery: string;
}

interface SearchSuggestion {
  type: 'finding' | 'category' | 'recent';
  text: string;
  highlight?: string;
  count?: number;
  finding?: Finding;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  findings,
  onSearch,
  currentQuery
}) => {
  const [query, setQuery] = useState(currentQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(findings, {
    keys: ['title', 'description', 'severity', 'resource'],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cloudguard-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent searches and popular categories when empty
      const categorySuggestions: SearchSuggestion[] = [
        { type: 'category', text: 'CRITICAL', count: findings.filter(f => f.severity === 'CRITICAL').length },
        { type: 'category', text: 'HIGH', count: findings.filter(f => f.severity === 'HIGH').length },
        { type: 'category', text: 'S3', count: findings.filter(f => f.resource?.includes('s3')).length },
        { type: 'category', text: 'IAM', count: findings.filter(f => f.resource?.includes('iam')).length }
      ].filter(s => s.count && s.count > 0);
      

      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 3).map(search => ({
        type: 'recent',
        text: search
      }));

      setSuggestions([...recentSuggestions, ...categorySuggestions]);
    } else {
      // Fuzzy search with spell correction
      const results = fuse.search(query);
      const findingSuggestions: SearchSuggestion[] = results.slice(0, 5).map(result => ({
        type: 'finding',
        text: result.item.title,
        finding: result.item,
        highlight: result.matches?.[0]?.value
      }));

      // Add category suggestions if query matches
      const categorySuggestions: SearchSuggestion[] = [];
      const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
      const resources = ['S3', 'IAM', 'EC2', 'RDS', 'CloudTrail'];
      
      [...severities, ...resources].forEach(category => {
        if (category.toLowerCase().includes(query.toLowerCase())) {
          const count = category.length <= 4 
            ? findings.filter(f => f.severity === category).length
            : findings.filter(f => f.resource?.toLowerCase().includes(category.toLowerCase())).length;
          
          if (count > 0) {
            categorySuggestions.push({
              type: 'category',
              text: category,
              count
            });
          }
        }
      });

      setSuggestions([...findingSuggestions, ...categorySuggestions]);
    }
  }, [query, findings, recentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('cloudguard-recent-searches', JSON.stringify(newRecent));
      
      onSearch(searchQuery);
    }
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const searchText = suggestion.type === 'finding' ? suggestion.finding?.title || suggestion.text : suggestion.text;
    setQuery(searchText);
    handleSearch(searchText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Zafiyet ara... (örn: S3, kritik, IAM)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="block w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.text}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                  index === selectedIndex ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                } ${index === 0 ? 'rounded-t-xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-xl' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  {suggestion.type === 'recent' && <Clock className="h-4 w-4 text-gray-400" />}
                  {suggestion.type === 'category' && <TrendingUp className="h-4 w-4 text-primary-500" />}
                  {suggestion.type === 'finding' && <Search className="h-4 w-4 text-gray-400" />}
                  
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.text}
                    </div>
                    {suggestion.type === 'finding' && suggestion.finding && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                        {suggestion.finding.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {suggestion.count && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {suggestion.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearchBar;