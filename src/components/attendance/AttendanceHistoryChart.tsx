import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Input from "../Input";
import {
  setattendanceUpdatedByData,
  setselectedDatesAttendanceRecord,
} from "@/redux/attendanceSlice";
import { useDispatch, useSelector } from "react-redux";
import { MapPinHouse } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AttendanceHistoryChart = ({ attendanceRecords }: any) => {
  const dispatch = useDispatch<any>();
  const { attendanceUpdatedByData } = useSelector(
    (state: any) => state.attendanceReducer
  );

  const [attendanceStatCount, setattendanceStatCount] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    dayjs().tz(timeZone)
  );
  const [currentMonth, setCurrentMonth] = useState(dayjs().tz(timeZone));
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().tz(timeZone).format("YYYY-MM")
  );

  // Update the current month whenever the selectedDate is changed.
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(dayjs(selectedDate).tz(timeZone));
    }
  }, [selectedDate]);

  // Set the selected day's attendance data when component mounts or selectedDate changes
  useEffect(() => {
    if (selectedDay) {
      const attendance = getAttendanceForDay(selectedDay);

      if (attendance.length > 0) {
        const record = attendance[0];

        const lastUpdatedBy =
          record?.updatedBy?.[record.updatedBy.length - 1] || null;

        // 👇 Reduce directly here to calculate status counts
        const statusCount = record.userAttendance?.reduce(
          (acc: any, curr: { status: any }) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
          },
          { present: 0, absent: 0, leave: 0, holiday: 0 }
        );
        setattendanceStatCount(statusCount);
        console.log("Status Count ➜", statusCount); // or dispatch to store if needed

        dispatch(setattendanceUpdatedByData(lastUpdatedBy));
        dispatch(setselectedDatesAttendanceRecord(record));
      } else {
        dispatch(setattendanceUpdatedByData(null));
        dispatch(setselectedDatesAttendanceRecord(null));
      }
    }
  }, [selectedDay, attendanceRecords]);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const generateCalendarDays = () => {
    const days = [];
    let day = startDate;
    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  };

  const handleDayClick = (day: dayjs.Dayjs) => {
    // Only allow clicking on days from the current month
    if (day.month() === currentMonth.month()) {
      setSelectedDay(day);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
    setSelectedDate(currentMonth.subtract(1, "month").format("YYYY-MM"));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
    setSelectedDate(currentMonth.add(1, "month").format("YYYY-MM"));
  };

  const days = generateCalendarDays();

  const getAttendanceForDay = (day: any) => {
    const nepaliTime = day
      .tz("Asia/Kathmandu")
      .startOf("day")
      .format("YYYY-MM-DD");

    const filteredRecords = attendanceRecords.filter((record: any) => {
      const recordDate = dayjs(record.utcDate)
        .tz("Asia/Kathmandu")
        .startOf("day")
        .format("YYYY-MM-DD");
      return recordDate === nepaliTime;
    });

    return filteredRecords;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col w-[25%] h-full rounded-md gap-3">
      {/* Calendar Section */}
      <div className="bg-white h-[70%] shadow-md rounded-md p-2 flex-1 flex flex-col items-center">
        {/* Month Selector Input */}
        <div className="mb-1 mt-1 w-[90%]">
          <Input
            label="Month"
            type="month"
            value={selectedDate}
            onChange={(e: any) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="flex justify-center w-[80%]">
          {/* Weekdays */}
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium text-xs">
              {weekdays.map((day) => (
                <div key={day} className="border-b">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 mt-0.5 mb-1">
              {days.map((day) => {
                const isCurrentMonth = day.month() === currentMonth.month();
                // const hasAttendance =
                //   isCurrentMonth && getAttendanceForDay(day).length > 0;
                const hasAttendance = false;
                const isSelected = selectedDay?.isSame(day, "day");
                const isToday = day.isSame(dayjs(), "day");
                const isDisabled = !isCurrentMonth;

                return (
                  <div
                    key={day.format("YYYY-MM-DD")}
                    onClick={() => handleDayClick(day)}
                    className={`py-1.5 text-center rounded cursor-pointer text-xs ${
                      isDisabled ? "text-gray-400 cursor-default" : "text-black"
                    } ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : hasAttendance
                        ? "bg-blue-100"
                        : "hover:bg-gray-200"
                    } ${isToday && !isSelected ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div>{day.date()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Attendance */}
      <div className="bg-white h-[30%] shadow-md rounded-md p-2 flex-1 flex flex-col">
        <div className="counts px-3 grid grid-cols-2 gap-2 mt-1 mb-2">
          {/* present */}
          <div className="total flex flex-col items-center bg-[#d9ffdb] p-1 rounded-md text-sm">
            <p>Present</p>
            <span className="text-lg font-bold">
              {attendanceStatCount?.present || 0}
            </span>
          </div>

          {/* absent */}
          <div className="total flex flex-col items-center bg-[#ffdede] p-1 rounded-md text-sm">
            <p>Absent</p>
            <span className="text-lg font-bold">
              {attendanceStatCount?.absent || 0}
            </span>
          </div>

          {/* leave */}
          <div className="total flex flex-col items-center bg-[#f0f7ff] py-1 rounded-md text-sm">
            <p>Leave</p>
            <span className="text-lg font-bold">
              {attendanceStatCount?.leave || 0}
            </span>
          </div>

          {/* holiday */}
          <div className="total flex flex-col items-center bg-[#f0deff] p-1 rounded-md text-sm">
            <p>Holiday</p>
            <span className="text-lg font-bold">
              {attendanceStatCount?.holiday || 0}
            </span>
          </div>
        </div>

        <h3 className="font-semibold px-3  mt-2 text-center text-xl">
          Latest Update
        </h3>
        <div className="mt-1 px-4">
          {attendanceUpdatedByData ? (
            <>
              <p className="text-md">
                by: {"  "}
                <span className="font-bold">
                  {attendanceUpdatedByData?.userName}
                </span>
              </p>
              <p className="branch my-1 flex items-center">
                <MapPinHouse className="text-gray-500" size={15} />
                <span className="ml-1 text-sm text-gray-500">
                  {attendanceUpdatedByData?.userBranch}
                </span>
              </p>
              <div className="flex">
                <span className="bg-gray-500 text-white w-max px-2 py-1 text-xs font-bold rounded-full">
                  {attendanceUpdatedByData?.userRole}
                </span>
                <p className="text-sm ml-2">
                  at{" "}
                  {dayjs(attendanceUpdatedByData?.updatedAt)
                    .tz(timeZone)
                    .format("h:mm A")}
                </p>
              </div>
            </>
          ) : (
            <p>
              No records for{" "}
              {dayjs(selectedDay).tz(timeZone).format("D, MMMM YYYY")}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryChart;
