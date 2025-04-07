import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Input";
import { fetchAllActivityRecords } from "@/redux/activityRecordSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

interface AttendanceDay {
  date: string;
  status?: string;
}

interface AttendanceData {
  name: string;
  value: number;
  color: string;
}

const StudentAttendance = ({ studentRecord }: { studentRecord: any }) => {
  const dispatch = useDispatch<any>();
  const { allActiveActivityRecords } = useSelector(
    (state: any) => state.activityRecordReducer
  );

  const [dailyAttendance, setDailyAttendance] = useState<AttendanceDay[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().tz(timeZone).format("YYYY-MM")
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  // Generate the calendar grid for the selected month
  const generateCalendar = () => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const firstDayOfMonth = dayjs(selectedMonth).startOf("month").day();
    const totalWeeks = 6; // Always show 6 weeks
    const totalCells = totalWeeks * 7; // 42 cells total

    const calendarGrid: (AttendanceDay | null)[][] = [];
    let week: (AttendanceDay | null)[] = [];

    // Fill all cells (6 weeks × 7 days)
    for (let i = 0; i < totalCells; i++) {
      const dayOfMonth = i - firstDayOfMonth + 1;
      const isDayInMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth;

      if (isDayInMonth) {
        const currentDate = dayjs(`${selectedMonth}-${dayOfMonth}`).format(
          "YYYY-MM-DD"
        );
        const attendanceStatus = dailyAttendance.find(
          (entry) => entry.date === currentDate
        )?.status;

        week.push({ date: currentDate, status: attendanceStatus });
      } else {
        week.push(null); // Empty cell for days outside current month
      }

      if (week.length === 7) {
        calendarGrid.push(week);
        week = [];
      }
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendar();

  const filterAttendanceByMonth = () => {
    const selectedMonthFormatted = dayjs(selectedMonth).format("YYYY-MM");
    const dailyAttendanceMap: Record<string, string> = {};

    let totalPresent = 0;
    let totalAbsent = 0;

    allActiveActivityRecords.forEach((record: any) => {
      const recordDate = dayjs(record.utcDate)
        .tz("Asia/Kathmandu")
        .format("YYYY-MM-DD");

      if (dayjs(recordDate).format("YYYY-MM") === selectedMonthFormatted) {
        const studentInRecord = record.studentRecords.find(
          (student: any) => student._id === studentRecord?._id
        );

        if (studentInRecord) {
          if (studentInRecord.attendance === "present") {
            dailyAttendanceMap[recordDate] = "present";
          } else if (
            !dailyAttendanceMap[recordDate] ||
            dailyAttendanceMap[recordDate] !== "present"
          ) {
            dailyAttendanceMap[recordDate] = studentInRecord.attendance;
          }
        }
      }
    });

    const finalAttendance = Object.entries(dailyAttendanceMap).map(
      ([date, status]) => {
        if (status === "present") totalPresent += 1;
        if (status === "absent") totalAbsent += 1;
        return { date, status };
      }
    );

    // Structured data with color information
    setAttendanceData([
      {
        name: "Total",
        value: finalAttendance.length,
        color: "#afbffa", // Light blue
      },
      {
        name: "Present",
        value: totalPresent,
        color: "#9cffbb", // Light green
      },
      {
        name: "Absent",
        value: totalAbsent,
        color: "#ff9ca1",
      },
    ]);

    setDailyAttendance(finalAttendance);
  };

  useEffect(() => {
    if (allActiveActivityRecords) {
      if (allActiveActivityRecords?.length > 0 && studentRecord) {
        filterAttendanceByMonth();
      }
    }
  }, [selectedMonth, allActiveActivityRecords, studentRecord]);

  useEffect(() => {
    if (studentRecord) {
      dispatch(fetchAllActivityRecords());
    }
  }, [studentRecord]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* calendar section */}
      <div className="bg-white h-[49%] shadow-md rounded-md p-2 flex-1 flex flex-col items-center">
        <div className="mb-1 mt-1 w-[90%]">
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e: any) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="flex justify-center w-[67%]">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 border-b">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center mt-1">
              {calendarGrid.map((week, weekIndex) => (
                <React.Fragment key={`week-${weekIndex}`}>
                  {week.map((day, dayIndex) => {
                    const isCurrentMonth =
                      day &&
                      dayjs(day.date).format("YYYY-MM") === selectedMonth;
                    const isToday = day?.date === dayjs().format("YYYY-MM-DD");

                    return (
                      <div
                        key={
                          day
                            ? `day-${day.date}`
                            : `empty-${weekIndex}-${dayIndex}`
                        }
                        title={day?.status ? day.status.toLowerCase() : ""}
                        className={`aspect-square flex items-center justify-center text-xs rounded-md ${
                          day
                            ? isCurrentMonth
                              ? day.status === "present"
                                ? "bg-green-200 text-green-700"
                                : day.status === "absent"
                                ? "bg-red-200 text-red-700"
                                : "hover:bg-gray-100"
                              : "bg-gray-100 text-gray-400" // Gray out days not in current month
                            : "bg-gray-100 text-gray-400" // Gray out empty cells
                        } ${isToday ? "border border-blue-500" : ""}`}
                      >
                        {day ? day.date.slice(-2) : ""}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* chart section */}
      <div className="bg-white h-[49%] shadow-md rounded-md p-2 flex-1 flex flex-col items-center">
        <h1 className="text-center mb-2 mt-1">Monthly Attendance</h1>

        <div className="counts grid  w-full px-4 grid-cols-3 gap-3 mt-1 mb-3">
          {/* Total */}
          <div className="total border flex flex-col items-center bg-[#f0f7ff] py-1.5 rounded-md text-sm">
            <p>Total</p>
            <span className="text-[1.1rem] font-bold">
              {attendanceData.find((item) => item.name === "Total")?.value || 0}
            </span>
          </div>
          {/* Present */}
          <div className="total flex flex-col items-center bg-[#d9ffdb] p-1.5 rounded-md text-sm">
            <p>Present</p>
            <span className="text-[1.1rem] font-bold">
              {attendanceData.find((item) => item.name === "Present")?.value ||
                0}
            </span>
          </div>

          {/* Absent */}
          <div className="total flex flex-col items-center bg-[#ffdede] p-1.5 rounded-md text-sm">
            <p>Absent</p>
            <span className="text-[1.1rem] font-bold">
              {attendanceData.find((item) => item.name === "Absent")?.value ||
                0}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="85%" height="80%">
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" name="Attendance" barSize={50}>
              {attendanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentAttendance;
