import { getAllUsers } from "@/redux/allListSlice";
import { Button, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodayIcon from "@mui/icons-material/Today";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import UserAttendanceList from "./UserAttendanceList";
import AttendanceChart from "./AttendanceChart";
import AttendanceHistoryChart from "./AttendanceHistoryChart";
import { getAllAttendanceRecords } from "@/redux/attendanceSlice";
import AttendanceHistoryList from "./AttendanceHistoryList";

const AttendanceComponent = () => {
  const dispatch = useDispatch<any>();

  // selector
  const { allActiveAttedanceRecordsList } = useSelector(
    (state: any) => state.attendanceReducer
  );
  useSelector((state: any) => state.allListReducer);
  const { allActiveUsersList, allUsersLoading } = useSelector(
    (state: any) => state.allListReducer
  );

  const [view, setView] = useState<"dailyattendance" | "history">(
    "dailyattendance"
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllAttendanceRecords());
  }, []);

  return (
    <div className=" flex flex-col h-full w-full ">
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-2 bg-white rounded-md shadow-md p-4">
        <Button
          variant={view === "dailyattendance" ? "contained" : "outlined"}
          onClick={() => setView("dailyattendance")}
          size="small"
        >
          <TodayIcon />
          <span className="ml-1">Daily Attendance</span>
        </Button>
        <Button
          variant={view === "history" ? "contained" : "outlined"}
          onClick={() => setView("history")}
          size="small"
        >
          <EventRepeatIcon />
          <span className="ml-2">Attendance History</span>
        </Button>
      </div>

      {/* Conditional Rendering */}
      {view === "dailyattendance" ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="userattendancelist flex-1 mr-4">
            <UserAttendanceList
              allActiveUsersList={allActiveUsersList}
              allUsersLoading={allUsersLoading}
            />
          </div>
          <AttendanceChart allUsersLoading={allUsersLoading} />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="attendancehistorylist flex-1 mr-4">
            <AttendanceHistoryList />
          </div>
          <AttendanceHistoryChart
            attendanceRecords={allActiveAttedanceRecordsList}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceComponent;
