import React, { useState, useEffect } from "react";
import Input from "../Input";
import { useDispatch, useSelector } from "react-redux";
import { setstudentsAttendanceSelectedDay } from "@/redux/attendanceSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const StudentsAttendanceChart = () => {
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { studentAttendanceStatCount, studentsattendanceUpdatedByData } =
    useSelector((state: any) => state.attendanceReducer);
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    dayjs().tz(timeZone).startOf("day")
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
      setSelectedDay(day.tz(timeZone));
    }
  };

  const days = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // update seleted date for student attendance
  useEffect(() => {
    // console.log("seledted day is", selectedDay.tz(timeZone).format());
    if (selectedDay) {
      dispatch(
        setstudentsAttendanceSelectedDay(selectedDay.tz(timeZone).format())
      );
    }
  }, [selectedDay]);

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
                const isSelected = selectedDay?.isSame(day, "day");
                const isToday = day.isSame(dayjs(), "day");
                const isDisabled = !isCurrentMonth;

                return (
                  <div
                    key={day.format("YYYY-MM-DD")}
                    onClick={() => handleDayClick(day)}
                    className={`py-1.5 text-center rounded cursor-pointer text-xs ${
                      isDisabled ? "text-gray-400 cursor-default" : "text-black"
                    } ${isSelected ? "bg-blue-500 text-white" : ""} ${
                      isToday && !isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
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
          {/* leave */}
          <div className="total flex flex-col items-center bg-[#f0f7ff] py-1 rounded-md text-sm">
            <p>Total</p>
            <span className="text-lg font-bold">
              {studentAttendanceStatCount?.total || 0}
            </span>
          </div>
          {/* present */}
          <div className="total flex flex-col items-center bg-[#d9ffdb] p-1 rounded-md text-sm">
            <p>Present</p>
            <span className="text-lg font-bold">
              {studentAttendanceStatCount?.present || 0}
            </span>
          </div>

          {/* absent */}
          <div className="total flex flex-col items-center bg-[#ffdede] p-1 rounded-md text-sm">
            <p>Absent</p>
            <span className="text-lg font-bold">
              {studentAttendanceStatCount?.absent || 0}
            </span>
          </div>
        </div>

        <h3 className="font-semibold px-3 mb-1 mt-2 text-center text-xl">
          Latest Update
        </h3>
        <div className="mt-1 px-3">
          {studentsattendanceUpdatedByData ? (
            <>
              <p className="text-md">
                by: {"  "}
                <span className="font-bold">
                  {studentsattendanceUpdatedByData?.userName}
                </span>
              </p>
              <div className="flex mt-1">
                <span className="bg-gray-500 text-white w-max px-2 py-1 text-xs font-bold rounded-full">
                  Trainer:
                  <span className="ml-1">
                    {studentsattendanceUpdatedByData?.userRole}
                  </span>
                </span>
                <p className="text-sm ml-2">
                  at{" "}
                  {dayjs(studentsattendanceUpdatedByData?.updatedAt)
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

export default StudentsAttendanceChart;
