// components/Dropdown.js
import { useState } from "react";

const Dropdown = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-64">
      {" "}
      {/* Fixed width container */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-64 flex justify-between items-center px-4 py-2 border rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span className="truncate">{selected}</span>{" "}
        {/* Prevents text from pushing width */}
        <span className="ml-2 text-gray-500">&#9662;</span>{" "}
        {/* Downward Arrow */}
      </button>
      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-64 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
