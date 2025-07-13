import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  const getVisiblePages = () => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`join ${className}`}>
      {showFirstLast && currentPage > 1 && (
        <button
          className="join-item btn"
          onClick={() => onPageChange(1)}
        >
          «
        </button>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <button
          className="join-item btn"
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showPrevNext && currentPage < totalPages && (
        <button
          className="join-item btn"
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      )}

      {showFirstLast && currentPage < totalPages && (
        <button
          className="join-item btn"
          onClick={() => onPageChange(totalPages)}
        >
          »
        </button>
      )}
    </div>
  );
};