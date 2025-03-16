import React, { useState, useEffect } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import Dropdown from "@/components/Dropdown";
import { Button } from "@mui/material";

const ClassesHeader = () => {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (currentTime === null) {
    return null; // You can return a loading spinner or placeholder here
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long", // Sunday
      year: "numeric", // 2025
      month: "long", // March
      day: "numeric", // 14
    });
  };

  return (
    <div className="flex flex-col ">
      {/* First Row */}
      <div className="flex flex-col md:flex-row justify-between items-center ">
        {/* Left Section: Date and Affiliation */}
        <div className="flex flex-col items-start space-y-3">
          <div className="flex items-center space-x-3">
            <EventIcon fontSize="medium" />
            <p className="text-2xl font-bold text-gray-800">
              {formatDate(currentTime)}{" "}
              {/* Display current date in the desired format */}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-1 text-sm rounded-full">
            HCA
          </div>
        </div>

        {/* Right Section: Current Time */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <AccessTimeIcon className="text-gray-500" fontSize="large" />
          <span className="text-2xl font-bold text-gray-500">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-4  mt-3 ">
        {/* Batch Name */}
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold text-gray-700">
            HCA_SAT(9-10)
          </span>
          <p className="text-sm text-gray-500">Batch Name</p>
        </div>

        {/* Start Time */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <ScheduleOutlinedIcon className="text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">
              02:45 AM
            </span>
          </div>
          <p className="text-sm text-gray-500">From</p>
        </div>

        {/* End Time */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <ScheduleOutlinedIcon className="text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">
              02:45 AM
            </span>
          </div>
          <p className="text-sm text-gray-500">To</p>
        </div>
      </div>

      {/* thirdrow */}
      {/* Syllabus Dropdown */}
      <div className="flex items-end mt-3">
        <Dropdown label="Syllabus" options={["asd", "pih", "rt"]} />
        <Button variant="contained" color="success" sx={{ marginLeft: "1rem" }}>
          Apply to all
        </Button>
      </div>
    </div>
  );
};

export default ClassesHeader;
