import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const AssignedClasses = () => {
  return (
    <div className="px-4">
      <h1 className="text-lg font-bold mb-3">Assigned Classes</h1>

      <div className="assigned-classes-list flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, i) => i).map((el) => {
          return (
            <div
              key={el}
              className="py-2 px-3 border border-gray-50 shadow-md rounded-md cursor-pointer hover:bg-gray-100"
            >
              <p className="text-sm">HCA_SAT(8-9)</p>
              <div className="trainer">
                <AccountCircleIcon sx={{ fontSize: "1rem", color: "gray" }} />
                <span className="ml-0.5 text-xs text-gray-500">Teacher1</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignedClasses;
