import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ placeholder = "Search", value, onChange }: any) => {
  return (
    <div className="border border-gray-300  py-1 px-2 rounded-md">
      <SearchIcon sx={{ color: "gray" }} />
      <input
        type="text"
        className="ml-2 text-gray-600 outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
