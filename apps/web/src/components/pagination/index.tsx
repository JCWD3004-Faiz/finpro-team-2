"use client";
import React from "react";
import {MdNavigateNext, MdNavigateBefore} from "react-icons/md"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className="px-4 py-2 bg-gray-800 text-white rounded-l disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdNavigateBefore/>
      </button>
      <span className="px-4 py-2 text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-800 text-white rounded-r disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <MdNavigateNext/>
      </button>
    </div>
  );
}

export default Pagination;
