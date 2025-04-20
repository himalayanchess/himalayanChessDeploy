import { getAllUsers } from "@/redux/allListSlice";
import { Button, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodayIcon from "@mui/icons-material/Today";
import { CircleUser, Users } from "lucide-react";

import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import UserAttendanceList from "./UserAttendanceList";
import AttendanceChart from "./AttendanceChart";
import AttendanceHistoryChart from "./AttendanceHistoryChart";
import { getAllAttendanceRecords } from "@/redux/attendanceSlice";
import AttendanceHistoryList from "./AttendanceHistoryList";
import StudentsAttendanceList from "./StudentsAttendanceList";
import StudentsAttendanceChart from "./StudentsAttendanceChart";

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

  const [view, setView] = useState<
    "dailyattendance" | "usersattendance" | "studentsattendance"
  >("dailyattendance");

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
          variant={view === "usersattendance" ? "contained" : "outlined"}
          onClick={() => setView("usersattendance")}
          size="small"
        >
          <CircleUser />
          <span className="ml-2">Users Attendance</span>
        </Button>

        <Button
          variant={view === "studentsattendance" ? "contained" : "outlined"}
          onClick={() => setView("studentsattendance")}
          size="small"
        >
          <Users />
          <span className="ml-2">Students Attendance</span>
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
      ) : view === "usersattendance" ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="attendancehistorylist flex-1 mr-4">
            <AttendanceHistoryList />
          </div>
          <AttendanceHistoryChart
            attendanceRecords={allActiveAttedanceRecordsList}
          />
        </div>
      ) : view === "studentsattendance" ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="attendancehistorylist flex-1 mr-4">
            <StudentsAttendanceList
            // studentsAttendanceRecord={studentsAttendanceRecord}
            />
          </div>
          <StudentsAttendanceChart
          // attendanceRecords={allActiveAttedanceRecordsList}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AttendanceComponent;
