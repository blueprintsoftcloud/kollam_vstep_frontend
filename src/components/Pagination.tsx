import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Pagination Component
 * Displays Previous/Next buttons and page numbers
 * Matches existing Tailwind styling throughout the app
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4 py-6">
      {/* Pagination Info */}
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
        of <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center  ">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
          aria-label="Previous page"
          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            canGoPrevious && !isLoading
              ? "bg-blue-50 text-[#001A39] hover:bg-blue-100 border border-blue-200 cursor-pointer"
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {/* First page button if not visible */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className="px-2.5 py-2 rounded-lg font-medium text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 py-2 text-slate-400 text-sm">...</span>
              )}
            </>
          )}

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              aria-current={page === currentPage ? "page" : undefined}
              className={`px-2.5 py-2 rounded-lg font-medium text-sm transition-all border cursor-pointer ${
                page === currentPage
                  ? "bg-[#001A39] text-white "
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page button if not visible */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 py-2 text-slate-400 text-sm">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={isLoading}
                className="px-2.5 py-2 rounded-lg font-medium text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          aria-label="Next page"
          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            canGoNext && !isLoading
              ? "bg-blue-50 text-[#001A39] hover:bg-blue-100 border border-blue-200 cursor-pointer"
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
