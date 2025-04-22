"use client";

import styles from "@/styles/searchBar.module.css";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      router.push(`/allProfilesFound?query=${encodeURIComponent(searchText.trim())}`);
    }
    if (onSearch) onSearch();
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Buscar a tu mejor candidato..."
        className={styles.searchBar}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        <FiSearch size={20} color="white" />
      </button>
    </div>
  );
};

export default SearchBar;
