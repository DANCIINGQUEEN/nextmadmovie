"use client"
import { createContext, useState, useContext, useEffect } from "react";

const PageNumberContext = createContext({});
export const usePageNumber = () => useContext(PageNumberContext);

function readSession(key, fallback) {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? parseInt(saved, 10) : fallback;
  } catch {
    return fallback;
  }
}

export const PageNumberProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(() => readSession("currentPage", 1));
  const [currentFilteredPage, setCurrentFilteredPage] = useState(() => readSession("currentFilteredPage", 1));

  useEffect(() => {
    try { sessionStorage.setItem("currentPage", currentPage); } catch {}
  }, [currentPage]);

  useEffect(() => {
    try { sessionStorage.setItem("currentFilteredPage", currentFilteredPage); } catch {}
  }, [currentFilteredPage]);

  return (
    <PageNumberContext.Provider value={{ currentPage, setCurrentPage, currentFilteredPage, setCurrentFilteredPage }}>
      {children}
    </PageNumberContext.Provider>
  );
};
