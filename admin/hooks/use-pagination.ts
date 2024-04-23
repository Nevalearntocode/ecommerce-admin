import { useCallback, useState } from "react";

const usePagination = <T>(items: T[], itemsPerPage = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
  };
};

export default usePagination;
