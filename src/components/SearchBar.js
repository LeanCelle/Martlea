"use client";

import styles from "@/styles/searchBar.module.css";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmedText = searchText.trim();
    if (!trimmedText) return;

    router.push(`/allProfilesFound?query=${encodeURIComponent(trimmedText)}`);

    if (onSearch) {
      onSearch(trimmedText);
    }

    setSearchText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Buscar a tu mejor candidato..."
        className={styles.searchBar}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Campo de búsqueda de candidatos"
      />
      <button
        type="button"
        className={styles.searchButton}
        onClick={handleSearch}
        aria-label="Buscar candidato"
      >
        <FiSearch size={20} color="white" />
      </button>
    </div>
  );
};

export default SearchBar;
