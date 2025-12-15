import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * SearchBar component with optimized user experience.
 * 
 * Features:
 * - Clear button to reset search
 * - Visual feedback when typing
 * - Disabled state during loading
 * - Accessible with proper labels
 * 
 * Note: Debouncing is handled by parent component using useDebounce hook
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search employees by name or department...',
  disabled = false,
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Search employees"
        />
        
        {value && (
          <button
            className="clear-button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      
      {value && value.length < 2 && (
        <p className="search-hint">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
};

export default SearchBar;
