import React, { useState, useMemo } from 'react';
import { 
  Typography, 
  SearchBar, 
  Select, 
  DatePicker, 
  TimePicker, 
  Button, 
  Checkbox, 
  Pagination,
  Collapse,
  Card,
  CardBody
} from '@/components';
import { getIconComponent } from '@/utils';

// Types
interface FilterConfig {
  type: 'search' | 'select' | 'multiSelect' | 'datePicker' | 'dateRange' | 'timePicker' | 'timeRange';
  key: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value?: any;
  onChange?: (value: any) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: string;
  showClear?: boolean;
}

interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  customRender?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface InfinityTableProps<T> {
  // Core data
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  
  // Table configuration
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  
  // Filters
  filters?: FilterConfig[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (selectedIds: string[]) => void;
  rowIdKey?: keyof T;
  
  // Expansion
  expandable?: boolean;
  expandedContent?: (row: T, rowIndex: number) => React.ReactNode;
  
  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    showPageSize?: boolean;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
  };
  
  // Styling
  className?: string;
  tableClassName?: string;
  zebra?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  
  // Actions
  headerActions?: React.ReactNode;
  bulkActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedIds: string[]) => void;
    variant?: string;
    disabled?: boolean;
  }>;
}

// Shimmer Component
const TableShimmer: React.FC<{ columns: number; rows?: number }> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          <td className="p-3">
            <div className="h-4 bg-base-300 rounded w-4"></div>
          </td>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-3">
              <div className="h-4 bg-base-300 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// Filter Row Component
const FilterRow: React.FC<{ filters: FilterConfig[] }> = ({ filters }) => {
  if (!filters.length) return null;

  return (
    <div className="bg-base-50 border-b border-base-300 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filters.map((filter) => {
          switch (filter.type) {
            case 'search':
              return (
                <div key={filter.key}>
                  <Typography variant="caption" className="block mb-1">
                    {filter.label}
                  </Typography>
                  <SearchBar
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                    placeholder={filter.placeholder}
                    width="w-full"
                  />
                </div>
              );
              
            case 'select':
            case 'multiSelect':
              return (
                <div key={filter.key}>
                  <Select
                    label={filter.label}
                    options={filter.options || []}
                    value={filter.value}
                    onChange={filter.onChange}
                    placeholder={filter.placeholder}
                    multiSelect={filter.type === 'multiSelect'}
                    size={filter.size || 'sm'}
                  />
                </div>
              );
              
            case 'datePicker':
              return (
                <div key={filter.key}>
                  <DatePicker
                    label={filter.label}
                    value={filter.value}
                    onChange={filter.onChange}
                    placeholder={filter.placeholder}
                    size={filter.size || 'sm'}
                  />
                </div>
              );
              
            case 'dateRange':
              return (
                <div key={filter.key}>
                  <DatePicker
                    label={filter.label}
                    dateRange={true}
                    rangeValue={filter.value}
                    onRangeChange={filter.onChange}
                    size={filter.size || 'sm'}
                  />
                </div>
              );
              
            case 'timePicker':
              return (
                <div key={filter.key}>
                  <TimePicker
                    label={filter.label}
                    value={filter.value}
                    onChange={filter.onChange}
                    placeholder={filter.placeholder}
                    size={filter.size || 'sm'}
                  />
                </div>
              );
              
            case 'timeRange':
              return (
                <div key={filter.key}>
                  <TimePicker
                    label={filter.label}
                    timeRange={true}
                    rangeValue={filter.value}
                    onRangeChange={filter.onChange}
                    size={filter.size || 'sm'}
                  />
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export const InfinityTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  title,
  subtitle,
  icon,
  filters = [],
  selectable = false,
  selectedRows = [],
  onRowSelect,
  rowIdKey = 'id' as keyof T,
  expandable = false,
  expandedContent,
  pagination,
  className = '',
  tableClassName = '',
  zebra = true,
  compact = false,
  hoverable = true,
  bordered = true,
  headerActions,
  bulkActions = [],
}: InfinityTableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedRows, rowId]
      : selectedRows.filter(id => id !== rowId);
    onRowSelect?.(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    const allIds = data.map(row => String(row[rowIdKey]));
    onRowSelect?.(checked ? allIds : []);
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  // Handle row expansion
  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Table classes
  const tableClasses = [
    'table w-full',
    zebra && 'table-zebra',
    compact && 'table-compact',
    hoverable && 'table-hover',
    tableClassName
  ].filter(Boolean).join(' ');

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            {title && (
              <Typography variant="h4" className="font-semibold text-base-content">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" className="text-base-content/70">
                {subtitle}
              </Typography>
            )}
          </div>
        </div>
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {hasSelectedRows && bulkActions.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between gap-4">
            <Typography variant="body2" className="font-medium">
              {selectedRows.length} row(s) selected
            </Typography>
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant as any || 'ghost'}
                  onClick={() => action.onClick(selectedRows)}
                  disabled={action.disabled}
                  className="gap-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterRow filters={filters} />

      {/* Table Card */}
      <Card className={bordered ? 'border border-base-300 overflow-hidden' : ''}>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className={tableClasses}>
              {/* Table Header */}
              <thead className="bg-base-200">
                <tr>
                  {/* Selection checkbox column */}
                  {selectable && (
                    <th className="w-12 p-3">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        size="sm"
                      />
                    </th>
                  )}
                  
                  {/* Expansion column */}
                  {expandable && (
                    <th className="w-12 p-3"></th>
                  )}
                  
                  {/* Data columns */}
                  {columns.map((column) => (
                    <th 
                      key={String(column.key)} 
                      className={`p-3 ${column.className || ''}`}
                      style={{ width: column.width }}
                    >
                      <div className={`flex items-center gap-2 ${
                        column.align === 'center' ? 'justify-center' :
                        column.align === 'right' ? 'justify-end' : 'justify-start'
                      }`}>
                        <Typography variant="body2" className="font-semibold">
                          {column.header}
                        </Typography>
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(String(column.key))}
                            className="btn btn-ghost btn-xs p-1"
                          >
                            {sortConfig?.key === column.key ? (
                              sortConfig.direction === 'asc' ? 
                              getIconComponent('ChevronUp', 14, 'text-primary') :
                              getIconComponent('ChevronDown', 14, 'text-primary')
                            ) : (
                              getIconComponent('ChevronsUpDown', 14, 'text-base-content/50')
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <TableShimmer 
                    columns={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} 
                    rows={pagination?.pageSize || 10}
                  />
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
                      className="text-center p-8"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {getIconComponent('Database', 48, 'text-base-content/30')}
                        <Typography variant="h6" className="text-base-content/50">
                          No data found
                        </Typography>
                        <Typography variant="body2" className="text-base-content/30">
                          There are no records to display
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((row, rowIndex) => {
                    const rowId = String(row[rowIdKey]);
                    const isSelected = selectedRows.includes(rowId);
                    const isExpanded = expandedRows.has(rowId);
                    
                    return (
                      <React.Fragment key={rowId}>
                        {/* Main row */}
                        <tr className={`${isSelected ? 'bg-primary/5' : ''} group`}>
                          {/* Selection checkbox */}
                          {selectable && (
                            <td className="p-3">
                              <Checkbox
                                checked={isSelected}
                                onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                                size="sm"
                              />
                            </td>
                          )}
                          
                          {/* Expansion toggle */}
                          {expandable && (
                            <td className="p-3">
                              <button
                                onClick={() => toggleRowExpansion(rowId)}
                                className="btn btn-ghost btn-xs p-1"
                              >
                                {getIconComponent(
                                  isExpanded ? 'ChevronDown' : 'ChevronRight', 
                                  16, 
                                  'transition-transform'
                                )}
                              </button>
                            </td>
                          )}
                          
                          {/* Data cells */}
                          {columns.map((column) => (
                            <td 
                              key={String(column.key)} 
                              className={`p-3 ${column.className || ''}`}
                            >
                              <div className={`${
                                column.align === 'center' ? 'text-center' :
                                column.align === 'right' ? 'text-right' : 'text-left'
                              }`}>
                                {column.customRender ? 
                                  column.customRender(row[column.key], row, rowIndex) :
                                  <Typography variant="body2">
                                    {String(row[column.key] || '')}
                                  </Typography>
                                }
                              </div>
                            </td>
                          ))}
                        </tr>
                        
                        {/* Expanded content row */}
                        {expandable && isExpanded && expandedContent && (
                          <tr className="bg-base-50">
                            <td 
                              colSpan={columns.length + (selectable ? 1 : 0) + 1}
                              className="p-0"
                            >
                              <Collapse title='' defaultOpen={isExpanded}>
                                <div className="p-4">
                                  {expandedContent(row, rowIndex)}
                                </div>
                              </Collapse>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Typography variant="body2" className="text-base-content/70">
              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
              {pagination.totalItems} entries
            </Typography>
            
            {pagination.showPageSize && pagination.pageSizeOptions && (
              <Select
                options={pagination.pageSizeOptions.map(size => ({
                  value: String(size),
                  label: `${size} per page`
                }))}
                value={String(pagination.pageSize)}
                onChange={(value) => pagination.onPageSizeChange?.(Number(value))}
                size="sm"
                className="w-auto"
              />
            )}
          </div>
          
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            showFirstLast={true}
            showPrevNext={true}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  );
};