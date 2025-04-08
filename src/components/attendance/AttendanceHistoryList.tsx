import React from "react";
import { CalendarCheck2 } from "lucide-react";
import dayjs from "dayjs";
import HistoryIcon from "@mui/icons-material/History";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider } from "@mui/material";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AttendanceHistoryList = () => {
  const { selectedDatesAttendanceRecord } = useSelector(
    (state: any) => state.attendanceReducer
  );

  const isLoading = selectedDatesAttendanceRecord === null;

  return (
    <div className="flex flex-col h-full bg-white p-5 rounded-md shadow-md">
      {/* header */}
      <div className="header flex justify-between items-center">
        {/* title */}
        <p className="text-2xl flex items-center">
          <HistoryIcon sx={{ fontSize: "1.7rem" }} />
          <span className="ml-2">Attendance History</span>
        </p>

        {/* right side */}
        <div className="flex items-center text-xl">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <CircularProgress size={20} />
              <span>Loading...</span>
            </div>
          ) : !selectedDatesAttendanceRecord ? (
            <span className="text-gray-500 text-sm">Invalid record</span>
          ) : (
            <>
              <span>
                {dayjs(selectedDatesAttendanceRecord?.utcDate)
                  .tz(timeZone)
                  .startOf("day")
                  .format("MMMM D, YYYY - dddd")}
              </span>
              <span className="ml-4">
                #Week{dayjs().tz(timeZone).startOf("day").week()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".5rem 0" }} />

      {/* attendance list */}
      <div className="attendanceTable mt-2 rounded-md border h-full flex-1 overflow-y-auto">
        {/* Header */}
        <div className="py-2  grid grid-cols-[70px,repeat(3,1fr)] bg-gray-100 ">
          <span className="font-bold text-center text-sm">SN</span>
          <span className="font-bold text-sm">Name</span>
          <span className="font-bold text-sm">Role</span>
          <span className="font-bold text-center  text-sm">Status</span>
        </div>

        {/* attendance data */}
        <div className="mt-2">
          {selectedDatesAttendanceRecord?.userAttendance.length > 0 ? (
            selectedDatesAttendanceRecord?.userAttendance.map(
              (record: any, index: number) => (
                <div
                  key={record.id || index}
                  className="py-3 border-b grid grid-cols-[70px,repeat(3,1fr)] items-center transition-all ease duration-150 hover:bg-gray-100"
                >
                  <p className="text-center text-sm">{index + 1}</p>
                  <p className="text-left text-sm">{record.userName}</p>
                  <p className="text-left text-sm">{record.userRole}</p>
                  <p className="text-left text-sm">
                    <span
                      className={`px-2 py-1 rounded-md text-white text-xs font-medium
      ${
        record.status === "present"
          ? "bg-green-400"
          : record.status === "absent"
          ? "bg-red-400"
          : record.status === "leave"
          ? "bg-blue-400"
          : record.status === "holiday"
          ? "bg-purple-400"
          : "bg-gray-400"
      }
    `}
                    >
                      {record.status}
                    </span>
                  </p>
                </div>
              )
            )
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No attendance records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryList;
