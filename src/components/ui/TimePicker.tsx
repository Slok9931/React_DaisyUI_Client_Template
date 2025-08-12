import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Typography } from '../Typography';
import { getIconComponent } from '@/utils';

type TimePickerSize = 'xs' | 'sm' | 'md' | 'lg';
type TimePickerVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface TimeRange {
  startTime: string | null;
  endTime: string | null;
}

interface TimePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: TimePickerSize;
  variant?: TimePickerVariant;
  placeholder?: string;
  value?: string;
  onChange?: (time: string | null) => void;
  // Time range props
  timeRange?: boolean;
  rangeValue?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  // Common props
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  format?: '12h' | '24h';
  step?: number; // minutes step (5, 10, 15, 30)
  showNow?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'bordered',
  placeholder,
  value,
  onChange,
  timeRange = false,
  rangeValue,
  onRangeChange,
  minTime,
  maxTime,
  disabled = false,
  format = '12h',
  step = 15,
  showNow = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default placeholders
  const defaultPlaceholder = timeRange ? 'Select time range...' : 'Select time...';
  const finalPlaceholder = placeholder || defaultPlaceholder;

  // Generate hours based on format
  const hours = format === '24h' 
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);

  // Generate minutes based on step
  const minutes = Array.from({ length: 60 / step }, (_, i) => i * step);

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (format === '24h') {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }
  };

  // Format time range for display
  const formatTimeRange = (range: TimeRange) => {
    if (!range.startTime && !range.endTime) return '';
    if (range.startTime && !range.endTime) return formatTime(range.startTime);
    if (!range.startTime && range.endTime) return formatTime(range.endTime);
    return `${formatTime(range.startTime!)} - ${formatTime(range.endTime!)}`;
  };

  // Convert 12h format to 24h
  const convertTo24h = (hour: number, period: 'AM' | 'PM') => {
    if (format === '24h') return hour;
    if (period === 'AM') {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  // Parse time string to components
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: null, minute: null, period: 'AM' as const };
    
    const [time, period] = timeStr.includes(' ') ? timeStr.split(' ') : [timeStr, ''];
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    if (format === '24h') {
      return { hour, minute, period: hour >= 12 ? 'PM' as const : 'AM' as const };
    } else {
      return { hour, minute, period: (period as 'AM' | 'PM') || 'AM' };
    }
  };

  // Update input value when value changes
  useEffect(() => {
    if (timeRange && rangeValue) {
      setInputValue(formatTimeRange(rangeValue));
    } else if (!timeRange && value) {
      setInputValue(formatTime(value));
      const { hour, minute, period } = parseTime(value);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    } else {
      setInputValue('');
      setSelectedHour(null);
      setSelectedMinute(null);
    }
  }, [value, rangeValue, format, timeRange]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if time is disabled
  const isTimeDisabled = (hour: number, minute: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    if (minTime && timeStr < minTime) return true;
    if (maxTime && timeStr > maxTime) return true;
    return false;
  };

  // Handle time selection
  const handleTimeSelect = () => {
    if (selectedHour === null || selectedMinute === null) return;

    const hour24 = format === '24h' ? selectedHour : convertTo24h(selectedHour, selectedPeriod);
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    
    if (isTimeDisabled(hour24, selectedMinute)) return;

    if (timeRange) {
      const currentRange = rangeValue || { startTime: null, endTime: null };
      
      if (!currentRange.startTime || (currentRange.startTime && currentRange.endTime)) {
        // Start new range
        onRangeChange?.({ startTime: timeString, endTime: null });
      } else if (currentRange.startTime && !currentRange.endTime) {
        // Complete the range
        if (timeString >= currentRange.startTime) {
          onRangeChange?.({ startTime: currentRange.startTime, endTime: timeString });
          setIsOpen(false);
        } else {
          // If selected time is before start time, make it the new start time
          onRangeChange?.({ startTime: timeString, endTime: null });
        }
      }
    } else {
      onChange?.(timeString);
      setIsOpen(false);
    }
  };

  // Handle now button
  const handleNow = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = Math.floor(now.getMinutes() / step) * step;
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    if (timeRange) {
      onRangeChange?.({ startTime: timeString, endTime: timeString });
    } else {
      onChange?.(timeString);
    }
    setIsOpen(false);
  };

  // Handle clear
  const handleClear = () => {
    if (timeRange) {
      onRangeChange?.({ startTime: null, endTime: null });
    } else {
      onChange?.(null);
    }
    setSelectedHour(null);
    setSelectedMinute(null);
    setIsOpen(false);
  };

  const hasValue = timeRange 
    ? (rangeValue?.startTime || rangeValue?.endTime)
    : value;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <Typography variant="body2" className="label-text">{label}</Typography>
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        {/* Time Input */}
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
          endIcon={getIconComponent(timeRange ? "Clock" : "Clock", 16, "w-4 h-4 text-base-content/70")}
        />

        {/* Time Picker Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 min-w-80">
            {/* Range instruction text */}
            {timeRange && (
              <div className="mb-4 text-center">
                <Typography variant="caption" className="text-base-content/70">
                  {!rangeValue?.startTime 
                    ? "Select start time"
                    : !rangeValue?.endTime 
                    ? "Select end time" 
                    : "Range selected"
                  }
                </Typography>
              </div>
            )}

            {/* Time Selection Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Hours */}
              <div>
                <Typography variant="caption" className="block text-center mb-2 font-medium">
                  Hour
                </Typography>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      className={`
                        w-full p-2 text-sm rounded hover:bg-base-200 transition-colors
                        ${selectedHour === hour ? 'bg-primary text-primary-content' : ''}
                      `}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {format === '24h' ? hour.toString().padStart(2, '0') : hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes */}
              <div>
                <Typography variant="caption" className="block text-center mb-2 font-medium">
                  Minute
                </Typography>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      className={`
                        w-full p-2 text-sm rounded hover:bg-base-200 transition-colors
                        ${selectedMinute === minute ? 'bg-primary text-primary-content' : ''}
                      `}
                      onClick={() => setSelectedMinute(minute)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM for 12h format */}
              {format === '12h' && (
                <div>
                  <Typography variant="caption" className="block text-center mb-2 font-medium">
                    Period
                  </Typography>
                  <div className="space-y-2">
                    {['AM', 'PM'].map((period) => (
                      <button
                        key={period}
                        className={`
                          w-full p-2 text-sm rounded hover:bg-base-200 transition-colors
                          ${selectedPeriod === period ? 'bg-primary text-primary-content' : ''}
                        `}
                        onClick={() => setSelectedPeriod(period as 'AM' | 'PM')}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Set Time Button */}
            {selectedHour !== null && selectedMinute !== null && (
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleTimeSelect}
                  className="w-full"
                >
                  {timeRange 
                    ? (!rangeValue?.startTime ? 'Set Start Time' : !rangeValue?.endTime ? 'Set End Time' : 'Update Range')
                    : 'Set Time'
                  }
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-base-300 mt-4">
              <div className="flex gap-2">
                {showNow && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNow}
                  >
                    Now
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
                variant="secondary"
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