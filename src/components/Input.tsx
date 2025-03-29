import React, { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import { generateRandomPassword } from "@/helpers/generateRandomPassword";

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
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  // generate random password and update form state
  const setRandomPassword = () => {
    const randomPassword = generateRandomPassword(12);
    onChange(randomPassword); // Update react-hook-form state
  };

  return (
    <div className="w-full">
      <label htmlFor={label} className="text-sm flex justify-between">
        <div className="label-icon flex justify-between">
          <span>
            {label} {required && "*"}
          </span>
          {type === "password" &&
            (showPassword ? (
              <div
                onClick={() => setShowPassword(false)}
                title="Toggle password"
                className="cursor-pointer"
              >
                <VisibilityOffIcon
                  className="ml-2"
                  sx={{ fontSize: "1.3rem" }}
                />
              </div>
            ) : (
              <div
                onClick={() => setShowPassword(true)}
                title="Toggle password"
                className="cursor-pointer"
              >
                <RemoveRedEyeIcon
                  className="ml-2"
                  sx={{ fontSize: "1.3rem" }}
                />
              </div>
            ))}
        </div>
        {type === "password" && (
          <div
            onClick={setRandomPassword}
            title="Generate random password"
            className="flex items-center cursor-pointer mr-2"
          >
            <ModelTrainingIcon
              className="ml-2"
              sx={{ fontSize: "1.3rem", color: "gray" }}
            />
            <span className="text-gray-500">Generate</span>
          </div>
        )}
      </label>
      <input
        id={label}
        type={type === "password" ? (showPassword ? "text" : type) : type}
        placeholder={placeholder}
        onClick={(e) => {
          if (type === "date") {
            e.preventDefault(); // Prevent default focus behavior
            e.target.showPicker(); // Open the date picker
          }
        }}
        value={value} // Controlled by react-hook-form
        onChange={onChange} // Update react-hook-form state
        className={`outline-none border-[1px] p-2 px-3 rounded-md w-full border-gray-300 text-gray-500 text-md ${
          extraClasses && extraClasses
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs">{helperText}</p>}
    </div>
  );
};

export default Input;
