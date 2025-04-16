import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Input from "../Input";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendanceRecords } from "@/redux/attendanceSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

// Status colors mapping
const statusColors = {
  present: "bg-green-200 text-green-700",
  absent: "bg-red-200 text-red-700",
  leave: "bg-blue-200 text-blue-700",
  holiday: "bg-purple-200 text-purple-700",
  undefined: "bg-gray-100 text-gray-700",
};

interface UserAttendanceChartProps {
  userId: string;
}

const UserAttendanceChart: React.FC<UserAttendanceChartProps> = ({
  userId = "",
}) => {
  const dispatch = useDispatch<any>();
  const { allActiveAttedanceRecordsList, allAttedanceRecordsListLoading } =
    useSelector((state: any) => state.attendanceReducer);

  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().tz(timeZone).format("YYYY-MM")
  );
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Get all attendance records on mount
  useEffect(() => {
    dispatch(getAllAttendanceRecords());
  }, [dispatch]);

  // Filter data when selected month or userId changes
  useEffect(() => {
    if (allActiveAttedanceRecordsList.length === 0 || !userId) {
      setFilteredData([]);
      return;
    }

    const startDate = dayjs(selectedMonth)
      .tz(timeZone)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = dayjs(selectedMonth)
      .tz(timeZone)
      .endOf("month")
      .format("YYYY-MM-DD");

    const filtered = allActiveAttedanceRecordsList
      .filter((record: any) => {
        if (!record.utcDate) return false;
        const recordDate = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");
        return recordDate >= startDate && recordDate <= endDate;
      })
      .map((record: any) => {
        const studentAttendance = record.userAttendance?.find(
          (ua: any) => ua.userId === userId
        );

        return {
          ...record,
          studentStatus: studentAttendance?.status || "undefined",
          studentName: studentAttendance?.userName || "Unknown",
          formattedDate: dayjs(record.utcDate)
            .tz(timeZone)
            .format("YYYY-MM-DD"),
        };
      });

    setFilteredData(filtered);
  }, [selectedMonth, allActiveAttedanceRecordsList, userId]);

  // Generate the calendar grid with fixed 6 rows
  const generateCalendar = () => {
    const daysInMonth = dayjs(selectedMonth).tz(timeZone).daysInMonth();
    const firstDayOfMonth = dayjs(selectedMonth)
      .tz(timeZone)
      .startOf("month")
      .day();
    const today = dayjs().tz(timeZone).format("YYYY-MM-DD");

    const totalCells = 42; // 7 days * 6 weeks
    const calendarGrid = [];
    let week = [];

    // Fill in the days of the month
    for (let i = 1; i <= totalCells; i++) {
      const dayOfMonth = i - firstDayOfMonth;
      const isDayInMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth;

      if (isDayInMonth) {
        const day = dayOfMonth.toString().padStart(2, "0");
        const currentDate = `${selectedMonth}-${day}`;
        const formattedDate = dayjs(currentDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");

        // Find attendance record for this date
        const attendanceRecord = filteredData.find(
          (record) => record.formattedDate === formattedDate
        );

        week.push({
          date: formattedDate,
          day: dayOfMonth,
          status: attendanceRecord?.studentStatus,
          isToday: formattedDate === today,
          isCurrentMonth: true,
        });
      } else {
        week.push({
          date: null,
          day: null,
          status: null,
          isToday: false,
          isCurrentMonth: false,
        });
      }

      if (week.length === 7) {
        calendarGrid.push(week);
        week = [];
      }
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendar();

  // Prepare data for the bar chart (monthly summary)
  const prepareChartData = () => {
    const summary = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Holiday: 0,
    };

    filteredData.forEach((record) => {
      const status = record.studentStatus;
      if (status && status !== "undefined") {
        const formattedStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        if (summary.hasOwnProperty(formattedStatus)) {
          summary[formattedStatus as keyof typeof summary]++;
        }
      }
    });

    const attendanceChartColors = {
      Total: "#e8e8e8",
      Present: "#d9ffdb",
      Absent: "#ffdede",
      Leave: "#f0f7ff",
      Holiday: "#f0deff",
    };

    const total = Object.values(summary).reduce((sum, count) => sum + count, 0);

    return [
      {
        name: "Total",
        value: total,
        color: attendanceChartColors["Total"],
      },
      ...Object.keys(summary).map((key) => ({
        name: key,
        value: summary[key as keyof typeof summary],
        color: attendanceChartColors[key as keyof typeof attendanceChartColors],
      })),
    ];
  };

  const chartData = prepareChartData();

  if (allAttedanceRecordsListLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Calendar Section */}
      <div className="bg-white h-[49%] shadow-md rounded-md p-2 flex-1 flex flex-col items-center">
        <div className="mb-2 mt-1 w-[90%]">
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedMonth(e.target.value)
            }
          />
        </div>

        <div className="flex justify-center w-[75%]">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="border-b">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center mt-1">
              {calendarGrid.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`aspect-square flex items-center justify-center text-xs rounded-md ${
                        day.isCurrentMonth
                          ? day.status
                            ? statusColors[
                                (day.status as keyof typeof statusColors) ||
                                  "undefined"
                              ]
                            : "bg-white"
                          : "bg-gray-200 opacity-40"
                      } ${day?.isToday ? "ring-2 ring-blue-500" : ""}`}
                      title={
                        day.isCurrentMonth
                          ? `${day.date}: ${day.status || "No record"}`
                          : ""
                      }
                    >
                      {day.isCurrentMonth ? day.day : ""}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white h-[49%] shadow-md rounded-md py-2 px-5 flex-1 ">
        <h3 className="text-lg font-medium mb-2 text-center">
          Attendance Summary
        </h3>
        <div className="counts grid grid-cols-2 gap-2 mt-1 mb-0">
          {chartData.map((data: any, index: number) => (
            <div
              key={index}
              className="total flex flex-col items-center p-2.5 rounded-md text-sm"
              style={{
                backgroundColor: data.color,
              }}
            >
              <p>{data.name}</p>
              <span className="text-lg font-bold">{data.value}</span>
            </div>
          ))}
        </div>

        {/* <ResponsiveContainer width="90%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" name="Students">
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer> */}
      </div>
    </div>
  );
};

export default UserAttendanceChart;
