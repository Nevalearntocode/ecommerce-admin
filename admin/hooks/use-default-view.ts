import { useCallback, useEffect, useState } from "react";

function useDefaultView(storageKey: string, initialView: string) {
  const [viewState, setViewState] = useState<string | null>(null);

  useEffect(() => {
    const storedView = localStorage.getItem(storageKey);
    if (storedView === null) {
      setViewState(initialView);
    } else {
      setViewState(storedView);
    }
  }, []);

  useEffect(() => {
    if (viewState) {
      localStorage.setItem(storageKey, viewState);
    }
  }, [viewState]);

    const handleCardViewClick = useCallback(() => {
      setViewState("card");
    }, []);

    const handleDatatableViewClick = useCallback(() => {
      setViewState("datatable");
    }, []);

  return { viewState, setViewState, handleCardViewClick, handleDatatableViewClick };
}

export default useDefaultView;
