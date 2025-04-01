import React, { useEffect, useState } from "react";
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
import AssignedClasses from "./AssignedClasses";
import { fetchAssignedClasses } from "@/redux/assignedClassesSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

// Color coding for institutes
const instituteColors = {
  hca: "bg-blue-100",
  school: "bg-yellow-100",
};

const AssignClass = () => {
  const dis = useDispatch<any>();
  const { allActiveAssignedClasses, status, error } = useSelector(
    (state) => state.assignedClassesReducer
  );
  const [filteredProjectNames, setfilteredProjectNames] = useState<any>([]);

  // Use dayjs() instead of new Date() to get the current date
  // giving utc even after adding time zone
  // it is giving object but in hadle click it is formattin format()
  // convert to nepali date first in route.ts

  const today = dayjs().tz(timeZone, true);
  const [currentDate, setCurrentDate] = useState<any>(today);
  const [selectedDate, setSelectedDate] = useState<any>(today);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleMonthChange = (event) => {
    const selectedMonth = parse(event.target.value, "yyyy-MM", new Date());
    setCurrentDate(selectedMonth);
  };

  const handleDateClick = (day) => {
    if (day) {
      // send nepali timeze zone date
      // console.log("Selected day", dayjs(day).tz(timeZone).format());

      setSelectedDate(dayjs(day).tz(timeZone).format());
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

  useEffect(() => {
    // Convert selectedDate to YYYY-MM-DD format using dayjs

    const selectedNepaliDateOnly = dayjs(selectedDate)
      .tz(timeZone)
      .startOf("day")
      .format("YYYY-MM-DD");

    // Filter allActiveAssignedClasses by the selectedDate
    const filteredClasses = allActiveAssignedClasses.filter((assignedClass) => {
      // Convert assignedClass.date to YYYY-MM-DD format using dayjs
      const assignedClassDate = dayjs(assignedClass.nepaliDate).format(
        "YYYY-MM-DD"
      );

      // Compare only the date part
      return assignedClassDate == selectedNepaliDateOnly;
    });

    console.log(filteredClasses);
    // - If affiliatedTo is "hca", we just add "hca"
    // - If affiliatedTo is "school", we add the projectName
    const uniqueProjectNames = [
      ...new Set(
        filteredClasses.map((assignedClass) =>
          assignedClass?.affiliatedTo?.toLowerCase() === "hca"
            ? "HCA"
            : assignedClass.projectName
        )
      ),
    ];

    setfilteredProjectNames(uniqueProjectNames); // Logs unique affiliations for the selectedDate
  }, [selectedDate, allActiveAssignedClasses]);

  return (
    <div className="flex-1 flex h-full gap-4 ">
      {/* Left Section (Calendar and Events) */}
      <div className="bg flex flex-col gap-2">
        {/* Today's Classes Section */}
        <div className="bg-gray-100 p-2 px-4 h-[25%] w-[330px]  overflow-y-auto rounded-lg ">
          <h3 className="text-lg font-bold mb-1 ">Today's Classes</h3>

          {selectedDate ? (
            <div className="uniqueprojects flex flex-wrap gap-2">
              {filteredProjectNames.length == 0 ? (
                <p className="text-sm text-gray-500">Class not assigned</p>
              ) : (
                filteredProjectNames?.map((uniqueProject: any, index: any) => (
                  <p
                    key={`uniqueProject${index}`}
                    className={`bg-gray-400 text-white w-max rounded-full px-3 py-1 text-sm`}
                  >
                    {uniqueProject}
                  </p>
                ))
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Select a date to view events.
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="bg-white  p-4 border border-gray-100 rounded-lg shadow-md">
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
                  const monthDate = new Date(currentDate.year(), i, 1);
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
              <div key={day} className="text-xs p-1.5 font-bold text-center">
                {day}
              </div>
            ))}
            {/* Calendar Cells */}
            {calendarDays.map((day, i) => {
              const dayKey = day ? format(day, "yyyy-MM-dd") : null;
              const isTodayDate = day ? isToday(day) : false;
              const isSelectedDate =
                day && selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = day && isSameMonth(day, monthStart);

              return (
                <div
                  key={i}
                  className={`aspect-square cursor-pointer relative flex flex-col items-center justify-center text-sm rounded ${
                    !isCurrentMonth
                      ? "bg-gray-100 opacity-50 pointer-events-none"
                      : ""
                  } ${isTodayDate ? "border-2 border-blue-500" : ""} ${
                    isSelectedDate ? "bg-blue-100" : ""
                  }`}
                  onClick={
                    isCurrentMonth ? () => handleDateClick(day) : undefined
                  }
                >
                  {day && <div>{format(day, "d")}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Middle Section (ManageClass) */}
      <div className="flex-1 w-full ">
        <ManageClass selectedDate={selectedDate} />
      </div>
      {/* Rignt Section (AssignedClasses) */}
      <div className="flex-[0.5] w-full ">
        <AssignedClasses selectedDate={selectedDate} />
      </div>{" "}
    </div>
  );
};

export default AssignClass;
