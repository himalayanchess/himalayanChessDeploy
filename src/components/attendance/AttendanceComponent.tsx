import { getAllUsers } from "@/redux/allListSlice";
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserAttendanceList from "./UserAttendanceList";
import AttendanceChart from "./AttendanceChart";

const AttendanceComponent = () => {
  // dispath
  const dispatch = useDispatch<any>();

  // selector
  const { allActiveUsersList, allUsersLoading } = useSelector(
    (state: any) => state.allListReducer
  );

  //state vars

  // fetch initial active users
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  return (
    <div className="flex-1 flex border overflow-hidden">
      {/* user attendance list */}

      <div className="userattendancelist flex-1 mr-4">
        <UserAttendanceList
          allActiveUsersList={allActiveUsersList}
          allUsersLoading={allUsersLoading}
        />
      </div>

      {/* chart compoent */}
      <AttendanceChart allUsersLoading={allUsersLoading} />
    </div>
  );
};

export default AttendanceComponent;
