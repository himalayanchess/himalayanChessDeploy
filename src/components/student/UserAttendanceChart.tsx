import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Input from "../Input";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const UserAttendanceChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [dailyAttendance, setDailyAttendance] = useState<any>([]);

  // Generate the calendar grid for the selected month
  const generateCalendar = () => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const firstDayOfMonth = dayjs(selectedMonth).startOf("month").day(); // Get the first day of the month (0=Sunday, 1=Monday, etc.)

    const calendarGrid = [];
    let week = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null); // Empty cell for padding
    }

    // Fill in the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = dayjs(`${selectedMonth}-${i}`).format("YYYY-MM-DD");

      const attendanceStatus = dailyAttendance.find(
        (entry: any) => entry.date === currentDate
      )?.status;

      week.push({ date: currentDate, status: attendanceStatus });

      // If the week is full (7 days), push it to the calendar grid and start a new week
      if (week.length === 7) {
        calendarGrid.push(week);
        week = [];
      }
    }

    // If there are any remaining days in the last week, push them to the calendar grid
    if (week.length > 0) {
      calendarGrid.push(week);
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendar();

  return (
    <>
      <div className="month-calendar h-[49%] bg-white shadow-md rounded-md px-7 py-2">
        <div className="month-selector mb-2">
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e: any) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <div className="w-[270px]  p-2 bg-white  rounded-lg">
            <div className="grid grid-cols-7 gap-0.5 text-center text-gray-700 font-medium text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 border-b">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center mt-1">
              {calendarGrid.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      title={`${day?.status?.toLowerCase()}`}
                      className={`aspect-square flex items-center justify-center text-xs rounded-md ${
                        day
                          ? day.status === "present"
                            ? "bg-green-200 text-green-700"
                            : day.status === "absent"
                            ? "bg-red-200 text-red-700"
                            : "hover:bg-gray-100"
                          : "opacity-50"
                      } ${
                        day?.date === new Date().toISOString().slice(0, 10)
                          ? "border border-blue-500"
                          : ""
                      }`}
                    >
                      {day ? day.date.slice(-2) : ""}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* chart */}
      <div className="month-calendar h-[49%] bg-white shadow-md rounded-md px-7 py-2">
        <div className="pr-3">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }} // Reduce font size
              />
              <YAxis
                tick={{ fontSize: 12 }} // Reduce font size
              />
              <Tooltip contentStyle={{ fontSize: 12 }} /> // Reduce tooltip font
              size
              <Legend wrapperStyle={{ fontSize: 12 }} /> // Reduce legend font
              size
              <Bar dataKey="value" fill="#F38C79" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default UserAttendanceChart;
