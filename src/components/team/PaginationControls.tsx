import React from "react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center justify-center gap-2 p-4">
    <button className="btn btn-xs" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
    <span className="text-xs">Page {page} of {totalPages}</span>
    <button className="btn btn-xs" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
  </div>
);

export default PaginationControls; 