import { useEffect, useState } from "react";

function useFilter<T>(
  initialItems: T[],
  filterProperty: keyof T,
  initialSearchInput = "",
) {
  const [searchInput, setSearchInput] = useState(initialSearchInput);
  const [filteredItems, setFilteredItems] = useState(initialItems);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredItems(initialItems);
    } else {
      const lowerCaseSearch = searchInput.toLowerCase();
      const filtered = initialItems.filter((item) =>
        (item[filterProperty] as string)
          .toLowerCase()
          .includes(lowerCaseSearch),
      );
      setFilteredItems(filtered);
    }
  }, [searchInput, initialItems, filterProperty]);

  return { searchInput, setSearchInput, filteredItems };
}

export default useFilter;
