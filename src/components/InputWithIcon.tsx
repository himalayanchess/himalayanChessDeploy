import React, { useState } from "react";
import { IconButton, FormHelperText } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const InputWithIcon = ({
  type = "text",
  placeholder = "",
  value = "", // Default value to avoid undefined or null
  onChange,
  Icon,
  error,
  helperText,
  ...props
}: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordToggle = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const inputType = isPasswordVisible ? "text" : "password";

  return (
    <div className="mb-4">
      <div className="flex items-center border-b border-gray-300 w-full p-2 ">
        <Icon className="mr-3 text-gray-500" />
        <input
          type={type === "password" ? inputType : type}
          placeholder={placeholder}
          value={value} // Ensure `value` is always defined
          onChange={onChange}
          {...props}
          className={`outline-none text-md w-full ${
            error ? "border-red-500" : ""
          }`}
        />
        {type === "password" && (
          <IconButton onClick={handlePasswordToggle} className="ml-3">
            {isPasswordVisible ? (
              <VisibilityOffIcon sx={{ fontSize: "1.2rem" }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: "1.2rem" }} />
            )}
          </IconButton>
        )}
      </div>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </div>
  );
};

export default InputWithIcon;
