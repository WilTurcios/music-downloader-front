import React, { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export function Search({ onSearch, disabled = false }: SearchProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query.trim());
  };

  return (
    <div className="sticky top-0 z-40 bg-white">
      <form
        onSubmit={handleSearch}
        className="flex items-center space-x-2 p-4 bg-gray-100 rounded-md shadow-md"
      >
      <input
        type="text"
        placeholder="Search for a song..."
        value={query}
        onChange={handleInputChange}
        disabled={disabled}
        className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          Search
        </button>
      </form>
    </div>
  );
}
