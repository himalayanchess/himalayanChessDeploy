import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
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
import { Button, Divider } from "@mui/material";
import ManageClass from "./ManageClass";

// Sample data for events
const events = {
  "2025-03-03": [
    {
      institute: "HCA",
      note: "Conference All Day Event",
      batch: "Batch A",
      trainer: "John Doe",
      course: "Mathematics",
    },
  ],
  "2025-03-09": [
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
};

// Color coding for institutes
const instituteColors = {
  HCA: "bg-blue-500",
  "School 1": "bg-green-500",
  "School 2": "bg-yellow-500",
};

const AssignClass = ({ selectedBatch }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthChange = (event) => {
    const selectedMonth = parse(event.target.value, "yyyy-MM", new Date());
    setCurrentDate(selectedMonth);
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    } else {
      console.error("Invalid date selected");
    }
  };

  const goToPresentMonth = () => {
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Ensure there are always 42 cells (7 columns x 6 rows)
  const totalCells = 42;
  const calendarDays = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < days.length) {
      calendarDays.push(days[i]);
    } else {
      calendarDays.push(null); // Pad with null for empty cells
    }
  }

  return (
    <div className="flex-1 flex h-full p-4 gap-4 ">
      {/* Left Section (Calendar and Events) */}
      <div className="bg flex flex-col gap-4">
        {/* Today's Classes Section */}
        <div className="bg-gray-100 p-4 h-[25%] overflow-y-auto rounded-lg ">
          <h3 className="text-lg font-bold mb-2">Today's Classes</h3>
          {selectedDate ? (
            events[format(selectedDate, "yyyy-MM-dd")] ? (
              events[format(selectedDate, "yyyy-MM-dd")].map((event, index) => (
                <div key={index} className="mb-2">
                  <div className="text-sm font-semibold">{event.institute}</div>
                  <div className="text-sm text-gray-600">{event.note}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600">
                No events for this day.
              </div>
            )
          ) : (
            <div className="text-sm text-gray-600">
              Select a date to view events.
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="bg-white  p-4 rounded-lg shadow-md">
          {/* Selected Date and Day */}
          <div className="mb-4">
            <h2 className="text-md font-bold">
              {format(selectedDate, "EEEE, yyyy-MM-dd")}
            </h2>
          </div>

          {/* Month Selection and Reset Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <select
                id="month-select"
                onChange={handleMonthChange}
                value={format(currentDate, "yyyy-MM")}
                className="p-2 border rounded text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(currentDate.getFullYear(), i, 1);
                  return (
                    <option key={i} value={format(monthDate, "yyyy-MM")}>
                      {format(monthDate, "MMMM yyyy")}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={goToPresentMonth}
                className="p-2 rounded hover:bg-gray-200"
              >
                <RestartAltOutlinedIcon />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2">
                <ArrowBackIosIcon sx={{ fontSize: "1rem" }} />
              </button>
              <button onClick={nextMonth} className="p-2">
                <ArrowForwardIosIcon sx={{ fontSize: "1rem" }} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs font-bold text-center">
                {day}
              </div>
            ))}
            {/* Calendar Cells */}
            {calendarDays.map((day, i) => {
              const dayKey = day ? format(day, "yyyy-MM-dd") : null;
              const dayEvents = dayKey ? events[dayKey] || [] : [];
              const isTodayDate = day ? isToday(day) : false;
              const isSelectedDate =
                day && selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={i}
                  className={`aspect-square cursor-pointer relative flex flex-col items-center justify-center text-sm rounded ${
                    !day || !isSameMonth(day, monthStart) ? "bg-gray-100" : ""
                  } ${isTodayDate ? "border-2 border-blue-500" : ""} ${
                    isSelectedDate ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day && <div>{format(day, "d")}</div>}
                  <div className="absolute -top-0.5 left-0.5 flex mt-1 ">
                    {dayEvents.map((event, index) => (
                      <div
                        key={index}
                        className={`${
                          instituteColors[event.institute]
                        } w-1.5 h-1.5 rounded-full mr-1 `}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Section (ManageClass) */}
      <div className="flex-1 w-full ">
        {!selectedBatch ? <p>Batch not selected</p> : <ManageClass />}
      </div>
    </div>
  );
};

export default AssignClass;
