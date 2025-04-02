import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
}

const StudentAttendance = ({ studentRecord }: { studentRecord: any }) => {
  const dispatch = useDispatch<any>();
  const { allActiveActivityRecords } = useSelector(
    (state: any) => state.activityRecordReducer
  );

  const [dailyAttendance, setDailyAttendance] = useState<AttendanceDay[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  // Generate the calendar grid for the selected month
  const generateCalendar = () => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const firstDayOfMonth = dayjs(selectedMonth).startOf("month").day();

    const calendarGrid: (AttendanceDay | null)[][] = [];
    let week: (AttendanceDay | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }

    // Fill in the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = dayjs(`${selectedMonth}-${i}`).format("YYYY-MM-DD");

      const attendanceStatus = dailyAttendance.find(
        (entry) => entry.date === currentDate
      )?.status;

      week.push({ date: currentDate, status: attendanceStatus });

      if (week.length === 7) {
        calendarGrid.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      calendarGrid.push(week);
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendar();

  const filterAttendanceByMonth = () => {
    const selectedMonthFormatted = dayjs(selectedMonth).format("YYYY-MM");
    const dailyAttendanceMap: Record<string, string> = {};

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHoliday = 0;

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
        if (status === "holiday") totalHoliday += 1;
        return { date, status };
      }
    );

    setAttendanceData([
      { name: "Total", value: finalAttendance.length },
      { name: "Present", value: totalPresent },
      { name: "Absent", value: totalAbsent },
      { name: "Holiday", value: totalHoliday },
    ]);

    setDailyAttendance(finalAttendance);
  };

  useEffect(() => {
    if (allActiveActivityRecords.length > 0 && studentRecord) {
      filterAttendanceByMonth();
    }
  }, [selectedMonth, allActiveActivityRecords, studentRecord]);

  useEffect(() => {
    if (studentRecord) {
      dispatch(fetchAllActivityRecords());
    }
  }, [studentRecord]);

  return (
    <div>
      <div className="attendance-container w-[full%]  mr-7 flex flex-col gap-2">
        <div className="month-selector my-2">
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e: any) => setSelectedMonth(e.target.value)}
          />
        </div>

        <h1 className="text-center">Monthly Attendance Calendar</h1>

        <div className="flex justify-center">
          <div className="w-[300px] border p-2 bg-white shadow-md rounded-lg">
            <div className="grid grid-cols-7 gap-0.5 text-center text-gray-700 font-medium text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 border-b">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center mt-1">
              {calendarGrid.map((week, weekIndex) => (
                <React.Fragment key={`week-${weekIndex}`}>
                  {week.map((day, dayIndex) => (
                    <div
                      key={
                        day
                          ? `day-${day.date}`
                          : `empty-${weekIndex}-${dayIndex}`
                      }
                      title={day?.status ? day.status.toLowerCase() : ""}
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

        <h1 className="mt-3 text-center">Monthly Attendance Chart</h1>

        <div className="">
          {attendanceData.length > 0 && (
            <div className="pr-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" fill="#F38C79" barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
