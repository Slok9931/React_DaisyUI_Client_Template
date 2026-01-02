import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Typography } from '../Typography';
import { getIconComponent } from '@/utils';

type DatePickerSize = 'xs' | 'sm' | 'md' | 'lg';
type DatePickerVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | null) => void;
  // Date range props
  dateRange?: boolean;
  rangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  // Common props
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  format?: string;
  showToday?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'bordered',
  placeholder,
  value,
  onChange,
  dateRange = false,
  rangeValue,
  onRangeChange,
  minDate,
  maxDate,
  disabled = false,
  format = 'MM/DD/YYYY',
  showToday = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    dateRange 
      ? (getValidDate(rangeValue?.startDate).getMonth())
      : (getValidDate(value).getMonth())
  );
  const [currentYear, setCurrentYear] = useState(
    dateRange 
      ? (getValidDate(rangeValue?.startDate).getFullYear())
      : (getValidDate(value).getFullYear())
  );
  const [inputValue, setInputValue] = useState('');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();

  // Default placeholders
  const defaultPlaceholder = dateRange ? 'Select date range...' : 'Select date...';
  const finalPlaceholder = placeholder || defaultPlaceholder;

  // Format date for display
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  };

  // Format date range for display
  const formatDateRange = (range: DateRange) => {
    if (!range.startDate && !range.endDate) return '';
    if (range.startDate && !range.endDate) return formatDate(range.startDate);
    if (!range.startDate && range.endDate) return formatDate(range.endDate);
    return `${formatDate(range.startDate!)} - ${formatDate(range.endDate!)}`;
  };

  // Update input value when value changes
  useEffect(() => {
    if (dateRange && rangeValue) {
      setInputValue(formatDateRange(rangeValue));
      if (rangeValue.startDate) {
        setCurrentMonth(rangeValue.startDate.getMonth());
        setCurrentYear(rangeValue.startDate.getFullYear());
      }
    } else if (!dateRange && value) {
      setInputValue(formatDate(value));
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
    } else {
      setInputValue('');
    }
  }, [value, rangeValue, format, dateRange]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Check if date is selected (single date mode)
  const isDateSelected = (date: Date) => {
    if (dateRange && rangeValue) {
      const { startDate, endDate } = rangeValue;
      return (startDate && isSameDay(date, startDate)) || 
             (endDate && isSameDay(date, endDate));
    }
    return value && isSameDay(date, value);
  };

  // Check if date is in range (range mode)
  const isDateInRange = (date: Date) => {
    if (!dateRange || !rangeValue?.startDate || !rangeValue?.endDate) return false;
    return date >= rangeValue.startDate && date <= rangeValue.endDate;
  };

  // Check if date is hovered in range
  const isDateInHoverRange = (date: Date) => {
    if (!dateRange || !rangeValue?.startDate || !hoveredDate || rangeValue?.endDate) return false;
    const start = rangeValue.startDate;
    const end = hoveredDate;
    return date >= start && date <= end;
  };

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (isDateDisabled(selectedDate)) return;

    if (dateRange) {
      const currentRange = rangeValue || { startDate: null, endDate: null };
      
      if (!currentRange.startDate || (currentRange.startDate && currentRange.endDate)) {
        // Start new range
        onRangeChange?.({ startDate: selectedDate, endDate: null });
      } else if (currentRange.startDate && !currentRange.endDate) {
        // Complete the range
        if (selectedDate >= currentRange.startDate) {
          onRangeChange?.({ startDate: currentRange.startDate, endDate: selectedDate });
          setIsOpen(false);
        } else {
          // If selected date is before start date, make it the new start date
          onRangeChange?.({ startDate: selectedDate, endDate: null });
        }
      }
      setHoveredDate(null);
    } else {
      onChange?.(selectedDate);
      setIsOpen(false);
    }
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle today button
  const handleToday = () => {
    const todayDate = new Date();
    setCurrentMonth(todayDate.getMonth());
    setCurrentYear(todayDate.getFullYear());
    
    if (dateRange) {
      onRangeChange?.({ startDate: todayDate, endDate: todayDate });
    } else {
      onChange?.(todayDate);
    }
    setIsOpen(false);
  };

  // Handle clear
  const handleClear = () => {
    if (dateRange) {
      onRangeChange?.({ startDate: null, endDate: null });
    } else {
      onChange?.(null);
    }
    setIsOpen(false);
    setHoveredDate(null);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-8 h-8"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const inRange = isDateInRange(date);
      const inHoverRange = isDateInHoverRange(date);
      const isTodayDate = isToday(date);

      days.push(
        <button
          key={day}
          className={`
            w-8 h-8 text-sm rounded-md flex items-center justify-center transition-colors relative
            ${disabled 
              ? 'text-base-content/30 cursor-not-allowed' 
              : 'hover:bg-primary hover:text-primary-content cursor-pointer'
            }
            ${selected ? 'bg-primary text-primary-content' : ''}
            ${inRange && !selected ? 'bg-primary/20 text-primary' : ''}
            ${inHoverRange && !selected && !inRange ? 'bg-primary/10 text-primary' : ''}
            ${isTodayDate && !selected && !inRange ? 'bg-accent text-accent-content' : ''}
          `}
          onClick={() => handleDateSelect(day)}
          onMouseEnter={() => dateRange && setHoveredDate(date)}
          disabled={disabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const hasValue = dateRange 
    ? (rangeValue?.startDate || rangeValue?.endDate)
    : value;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        {/* Date Input */}
        <Input
          value={inputValue}
          placeholder={finalPlaceholder}
          size={size}
          variant={variant}
          error={error}
          readOnly
          disabled={disabled}
          className={`cursor-pointer ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          endIcon={getIconComponent(dateRange ? "CalendarRange" : "Calendar", 16, "w-4 h-4 text-base-content/70")}
        />

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 min-w-80">
            {/* Header with month/year navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrevMonth}
                className="btn-square"
              >
                {getIconComponent("ChevronLeft", 16, "w-4 h-4")}
              </Button>
              
              <Typography variant="body1" className="font-semibold">
                {months[currentMonth]} {currentYear}
              </Typography>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNextMonth}
                className="btn-square"
              >
                {getIconComponent("ChevronRight", 16, "w-4 h-4")}
              </Button>
            </div>

            {/* Range instruction text */}
            {dateRange && (
              <div className="mb-4 text-center">
                <Typography variant="caption" className="text-base-content/70">
                  {!rangeValue?.startDate 
                    ? "Select start date"
                    : !rangeValue?.endDate 
                    ? "Select end date" 
                    : "Range selected"
                  }
                </Typography>
              </div>
            )}

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="w-8 h-8 flex items-center justify-center">
                  <Typography variant="caption" className="font-medium text-base-content/70">
                    {day}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {generateCalendarDays()}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-base-300">
              <div className="flex gap-2">
                {showToday && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleToday}
                  >
                    Today
                  </Button>
                )}
                {hasValue && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
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

const getValidDate = (date: any) => date instanceof Date ? date : new Date();