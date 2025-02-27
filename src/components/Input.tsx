import React, { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Input = ({
  placeholder = "",
  type = "text",
  value,
  onChange,
  error,
  helperText,
  required,
  extraClasses,
  label = "",
  ...props
}) => {
  const [showPassword, setshowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={label} className="text-sm block flex ">
        {label} {required && "*"}
        {type == "password" &&
          (showPassword ? (
            <div onClick={() => setshowPassword(false)}>
              <VisibilityOffIcon className="ml-2" sx={{ fontSize: "1.3rem" }} />
            </div>
          ) : (
            <div onClick={() => setshowPassword(true)}>
              <RemoveRedEyeIcon className="ml-2" sx={{ fontSize: "1.3rem" }} />
            </div>
          ))}
      </label>
      <input
        id={label}
        type={type == "password" ? (showPassword ? "text" : type) : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`outline-none border-[1px] p-2 px-3 rounded-md w-full border-gray-150 text-gray-500 text-md ${
          extraClasses && extraClasses
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default Input;
