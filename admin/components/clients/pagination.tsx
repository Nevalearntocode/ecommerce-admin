// components/shared/Pagination.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      {/* Previous Button */}
      <Button
        variant={`ghost`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="h-8"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            variant={`ghost`}
            onClick={() => handlePageChange(i + 1)}
            className={cn("h-8", currentPage === i + 1 && "bg-black/20")}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="h-8"
        variant={`ghost`}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
