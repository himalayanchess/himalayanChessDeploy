import React from "react";

const Input = ({
  placeholder = "",
  type = "text",
  value,
  onChange,
  error,
  helperText,
  label = "",
  ...props
}) => {
  return (
    <div>
      <label htmlFor={label} className="text-sm block">
        {label}
      </label>
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`outline-none border-[1px] p-2 px-3 rounded-md w-full border-gray-400 text-gray-500 text-md `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default Input;
