import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, lastPage, total, from, to, onPageChange }) => {
  if (!total) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(lastPage, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-polar-night/5 bg-frozen/5">
      <span className="text-xs text-text-primary/40 font-medium">
        Showing {from}–{to} of {total} results
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-text-primary/40 hover:text-polar-night hover:bg-frozen/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-bold text-text-primary/60 hover:bg-frozen/50 transition-colors"
            >
              1
            </button>
            {start > 2 && <span className="text-text-primary/30 text-xs px-1">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
              p === currentPage
                ? 'bg-polar-night text-white shadow-sm'
                : 'text-text-primary/60 hover:bg-frozen/50'
            }`}
          >
            {p}
          </button>
        ))}

        {end < lastPage && (
          <>
            {end < lastPage - 1 && <span className="text-text-primary/30 text-xs px-1">...</span>}
            <button
              onClick={() => onPageChange(lastPage)}
              className="w-8 h-8 rounded-lg text-xs font-bold text-text-primary/60 hover:bg-frozen/50 transition-colors"
            >
              {lastPage}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="p-2 rounded-lg text-text-primary/40 hover:text-polar-night hover:bg-frozen/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
