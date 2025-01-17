"use client";
import React from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

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
        className="px-4 py-2 bg-white border border-black text-black text-xl disabled:opacity-50 hover:bg-black hover:text-white transition-all duration-300"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdNavigateBefore />
      </button>
      <span className="px-4 py-2 text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-white border border-black text-black text-xl disabled:opacity-50 hover:bg-black hover:text-white transition-all duration-300"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <MdNavigateNext />
      </button>
    </div>
  );
}

export default Pagination;

