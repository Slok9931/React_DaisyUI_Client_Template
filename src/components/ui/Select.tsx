import React, { useState, useRef, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { Checkbox } from './Checkbox';
import { Chip } from './Chip';
import { Typography } from '../Typography';

type SelectSize = 'xs' | 'sm' | 'md' | 'lg';
type SelectVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  options: SelectOption[];
  placeholder?: string;
  multiSelect?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'bordered',
  options,
  placeholder = 'Select an option...',
  multiSelect = false,
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update selectedValues when value prop changes - FIXED THIS USEEFFECT
  useEffect(() => {
    const newSelectedValues = multiSelect 
      ? (Array.isArray(value) ? value : value ? [value] : [])
      : (value ? [typeof value === 'string' ? value : value[0] || ''] : []);
    
    // Only update if the values are actually different
    const currentValuesString = JSON.stringify(selectedValues.sort());
    const newValuesString = JSON.stringify(newSelectedValues.sort());
    
    if (currentValuesString !== newValuesString) {
      setSelectedValues(newSelectedValues);
    }
  }, [value, multiSelect]); // Removed selectedValues from dependency array

  const handleOptionSelect = (optionValue: string) => {
    let newSelectedValues: string[];
    
    if (multiSelect) {
      if (selectedValues.includes(optionValue)) {
        newSelectedValues = selectedValues.filter(v => v !== optionValue);
      } else {
        newSelectedValues = [...selectedValues, optionValue];
      }
    } else {
      newSelectedValues = [optionValue];
      setIsOpen(false);
      setSearchTerm('');
    }
    
    setSelectedValues(newSelectedValues);
    onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0] || '');
  };

  const handleRemoveChip = (valueToRemove: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newSelectedValues);
    onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0] || '');
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    onChange?.(multiSelect ? [] : '');
    setSearchTerm('');
  };

  const getSelectedLabels = () => {
    return selectedValues.map(val => {
      const option = options.find(opt => opt.value === val);
      return option ? option.label : val;
    });
  };

  const selectClasses = [
    'select',
    `select-${variant}`,
    `select-${size}`,
    error && 'select-error',
    'w-full',
    className
  ].filter(Boolean).join(' ');

  const displayText = selectedValues.length > 0 
    ? (multiSelect ? `${selectedValues.length} selected` : getSelectedLabels()[0])
    : placeholder;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <Typography variant="body2" className="label-text">{label}</Typography>
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        {/* Select Input */}
        <div
          className={`${selectClasses} flex items-center justify-between cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedValues.length > 0 ? '' : 'text-base-content/50'}>
            {displayText}
          </span>
        </div>

        {/* Selected Options as Chips */}
        {multiSelect && selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedValues.map((val) => {
              const option = options.find(opt => opt.value === val);
              return (
                <Chip
                  key={val}
                  size="sm"
                  variant="primary"
                  onRemove={() => handleRemoveChip(val)}
                >
                  {option?.label || val}
                </Chip>
              );
            })}
          </div>
        )}

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search Bar */}
            <div className="p-3 border-b border-base-300">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                width="w-full"
              />
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 hover:bg-base-200 cursor-pointer flex items-center gap-3 ${
                      option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                  >
                    {multiSelect ? (
                      <Checkbox
                        checked={selectedValues.includes(option.value)}
                        onChange={() => !option.disabled && handleOptionSelect(option.value)}
                        disabled={option.disabled}
                        size="sm"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedValues.includes(option.value) 
                          ? 'bg-primary border-primary' 
                          : 'border-base-300'
                      }`}>
                        {selectedValues.includes(option.value) && (
                          <div className="w-full h-full rounded-full bg-primary"></div>
                        )}
                      </div>
                    )}
                    <Typography variant="body2">
                      {option.label}
                    </Typography>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center">
                  <Typography variant="body2" className="text-base-content/50">
                    No options found
                  </Typography>
                </div>
              )}
            </div>

            {/* Clear Button */}
            {selectedValues.length > 0 && (
              <div className="p-3 border-t border-base-300">
                <button
                  type="button"
                  className="btn btn-outline btn-sm w-full"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <label className="label">
          <Typography 
            variant="caption" 
            className={`label-text-alt ${error ? 'text-error' : ''}`}
          >
            {error || helperText}
          </Typography>
        </label>
      )}
    </div>
  );
};