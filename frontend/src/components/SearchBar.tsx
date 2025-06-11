import React, { useState } from "react";
import { Input, IconButton } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Input
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        endDecorator={
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        }
        sx={{ width: 400, marginBottom: "20px" }}
      />
    </>
  );
}
