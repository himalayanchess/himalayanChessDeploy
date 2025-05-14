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
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

// Color coding for institutes
const instituteColors = {
  hca: "bg-blue-100",
  school: "bg-yellow-100",
};

const AssignClass = () => {
  const session = useSession();
  const dis = useDispatch<any>();
  const { allActiveAssignedClasses, status, error } = useSelector(
    (state: any) => state.assignedClassesReducer
  );
  const [filteredProjectNames, setfilteredProjectNames] = useState<any>([]);

  const today = dayjs().tz(timeZone).startOf("day");
  const [currentDate, setCurrentDate] = useState<any>(today);
  const [selectedDate, setSelectedDate] = useState<any>(today);

  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));
  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));

  const handleMonthChange = (event: any) => {
    const selectedMonth = dayjs(event.target.value);
    setCurrentDate(selectedMonth);
  };

  const handleDateClick = (day: any) => {
    if (day) {
      setSelectedDate(dayjs(day).tz(timeZone).startOf("day"));
    } else {
      console.error("Invalid date selected");
    }
  };

  const goToPresentMonth = () => {
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Convert dayjs to Date for date-fns functions
  const currentDateAsDate = currentDate.toDate();
  const monthStart = startOfMonth(currentDateAsDate);
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
    const user = session?.data?.user;

    const isSuperAdminOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    const selectedNepaliDateOnly = selectedDate
      .tz(timeZone)
      .startOf("day")
      .format("YYYY-MM-DD");

    // Filter by date for everyone, and by branch only if not a super/global admin
    const filteredClasses = allActiveAssignedClasses.filter(
      (assignedClass: any) => {
        const assignedClassDate = dayjs(assignedClass.utcDate)
          .tz(timeZone)
          .startOf("day")
          .format("YYYY-MM-DD");

        const matchesDate = assignedClassDate === selectedNepaliDateOnly;
        const matchesBranch =
          assignedClass?.branchName.toLowerCase() ===
          user?.branchName.toLowerCase();

        return isSuperAdminOrGlobalAdmin
          ? matchesDate
          : matchesDate && matchesBranch;
      }
    );

    if (isSuperAdminOrGlobalAdmin) {
      const uniqueProjectNames = [
        ...new Set(
          filteredClasses.map((assignedClass: any) =>
            assignedClass?.affiliatedTo?.toLowerCase() === "hca"
              ? "HCA"
              : assignedClass.projectName
          )
        ),
      ];
      setfilteredProjectNames(uniqueProjectNames);
    } else {
      // For regular users: if any class exists on selected date, set ["HCA"], else []
      setfilteredProjectNames(filteredClasses.length > 0 ? ["HCA"] : []);
    }
  }, [selectedDate, allActiveAssignedClasses, session?.data?.user]);

  return (
    <div className="flex-1 flex h-full gap-4 ">
      {/* Left Section (Calendar and Events) */}
      <div className="bg flex flex-col gap-2">
        {/* Today's Classes Section */}
        <div className="bg-gray-100 p-2 px-4 h-[25%] w-[330px]  overflow-y-auto rounded-lg ">
          <h3 className="text-lg font-bold mb-1 ">Today&apos;s Classes</h3>

          {selectedDate ? (
            <div className="uniqueprojects flex flex-wrap gap-2">
              {filteredProjectNames.length === 0 ? (
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
              {selectedDate.format("dddd, YYYY-MM-DD")}
            </h2>
          </div>

          {/* Month Selection and Reset Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <select
                id="month-select"
                onChange={handleMonthChange}
                value={currentDate.format("YYYY-MM")}
                className="p-2 border rounded text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = currentDate.month(i);
                  return (
                    <option key={i} value={monthDate.format("YYYY-MM")}>
                      {monthDate.format("MMMM YYYY")}
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
                day && selectedDate && isSameDay(day, selectedDate.toDate());
              const isCurrentMonth = day && isSameMonth(day, monthStart);
              return (
                <div
                  key={i}
                  className={`aspect-square cursor-pointer relative flex flex-col items-center justify-center text-sm rounded
                  ${
                    !isCurrentMonth
                      ? "bg-gray-100 opacity-50 pointer-events-none"
                      : ""
                  }
                  ${isTodayDate ? "border-2 border-blue-500" : ""}
                  ${isSelectedDate ? "bg-blue-100" : ""}
            
                `}
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
      {/* Right Section (AssignedClasses) */}
      <div className="flex-[0.5] w-full ">
        <AssignedClasses selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default AssignClass;
