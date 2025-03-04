"use client";
import React from "react";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parse,
  isToday,
} from "date-fns";

// Sample data for events
const events = {
  "2025-03-28": [
    {
      institute: "HCA",
      note: "Conference All Day Event",
      batch: "Batch A",
      trainer: "John Doe",
      course: "Mathematics",
    },
    {
      institute: "School 1",
      note: "Workshop",
      batch: "Batch B",
      trainer: "Jane Smith",
      course: "Science",
    },
  ],
  "2025-03-03": [
    {
      institute: "HCA",
      note: "Conference All Day Event",
      batch: "Batch A",
      trainer: "John Doe",
      course: "Mathematics",
    },
    {
      institute: "School 1",
      note: "Workshop",
      batch: "Batch B",
      trainer: "Jane Smith",
      course: "Science",
    },
  ],
  "2025-03-04": [
    {
      institute: "School 1",
      note: "10:30a Meeting",
      batch: "Batch C",
      trainer: "Alice Johnson",
      course: "History",
    },
  ],
  "2025-03-16": [
    {
      institute: "School 2",
      note: "Repeating Event",
      batch: "Batch D",
      trainer: "Bob Brown",
      course: "Geography",
    },
  ],
  // Add more events as needed
};

// Color coding for institutes
const instituteColors = {
  HCA: "bg-blue-300",
  "School 1": "bg-green-300",
  "School 2": "bg-yellow-300",
};

const AssignClass = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [menuOption, setMenuOption] = useState("HCA"); // Default menu option
  const today = new Date(); // Get today's date

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthChange = (event) => {
    const selectedMonth = parse(event.target.value, "yyyy-MM", new Date());
    setCurrentDate(selectedMonth);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const goToPresentMonth = () => {
    const today = new Date();
    setCurrentDate(today); // Set currentDate to today's date
    setSelectedDate(today); // Set selectedDate to today
  };

  const handleAssign = () => {
    if (selectedDate) {
      const dayKey = format(selectedDate, "yyyy-MM-dd");
      const newEvent = {
        institute: menuOption === "HCA" ? "HCA" : "School 1",
        note: "Assigned Event",
        batch: selectedBatch,
        trainer: selectedTrainer,
        course: selectedCourse,
        project: selectedProject,
      };
      if (!events[dayKey]) events[dayKey] = [];
      events[dayKey].push(newEvent);
      alert("Event assigned successfully!");
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="flex-1 flex  px-4 overflow-hidden">
      {/* calendar-event container */}
      <div className="flex-[0.35] flex flex-col   ">
        {/* Calendar Section */}
        <div className="calendar w-full">
          {/* Display Selected Date */}
          {selectedDate && (
            <div className="mb-4 text-lg font-semibold">
              {format(selectedDate, "EEEE yyyy-MM-dd")}
            </div>
          )}

          {/* Select Month */}
          <div className="mb-2">
            <select
              id="month-select"
              onChange={handleMonthChange}
              value={format(currentDate, "yyyy-MM")}
              className="p-2 border rounded text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(2025, i, 1);
                return (
                  <option
                    key={i}
                    value={format(monthDate, "yyyy-MM")}
                    className="text-sm"
                  >
                    {format(monthDate, "MMMM yyyy")}
                  </option>
                );
              })}
            </select>
            <button
              onClick={goToPresentMonth}
              className="ml-4 py-1 px-3 bg-blue-200 rounded hover:bg-blue-300"
            >
              Reset
            </button>
          </div>
          <div className="p-0 w-full">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-1 ">
              <button onClick={prevMonth} className="p-2">
                <ArrowBackIosIcon sx={{ fontSize: "1rem" }} />
              </button>
              <h2 className="text-md ">{format(currentDate, "MMMM yyyy")}</h2>
              <button onClick={nextMonth} className="p-2">
                <ArrowForwardIosIcon sx={{ fontSize: "1rem" }} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`p-2 text-center cursor-pointer ${
                    !isSameMonth(day, monthStart) ? "text-gray-400" : ""
                  } ${isSameDay(day, selectedDate) ? "bg-blue-200" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignClass;
