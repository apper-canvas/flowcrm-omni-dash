import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      // Simple debounce implementation
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <motion.div
      layout
      className={`relative ${className}`}
      animate={{ width: isExpanded ? 320 : 240 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-8"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-surface-100 rounded-r-lg transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-surface-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;