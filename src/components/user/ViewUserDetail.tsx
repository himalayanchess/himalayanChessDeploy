"use client";
import React, { useEffect, useState } from "react";

import { Button, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";

import { useSession } from "next-auth/react";
import { fetchAllProjects } from "@/redux/allListSlice";
import UserAttendanceChart from "../student/UserAttendanceChart";
import BasicUserInformation from "./userrecorddetail/BasicUserInformation";
import UserProjectsInformation from "./userrecorddetail/UserProjectsInformation";
import UserActivityRecords from "./userrecorddetail/UserActivityRecords";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewUserDetail = ({ userRecord, loading }: any) => {
  const dispatch = useDispatch<any>();
  const session = useSession();
  // use selector
  const { allActiveTrainersActivityRecords } = useSelector(
    (state: any) => state.trainerHistoryReducer
  );
  const { allActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );

  const menuItems = [
    { label: "Basic Information", value: "basic" },
    { label: "Projects", value: "projects" },
    { label: "Activity Records", value: "activity" },
  ];

  // show dynamic compnent
  const showComponent = () => {
    if (userRecord) {
      switch (selectedMenu) {
        case "basic":
          return <BasicUserInformation userRecord={userRecord} />;
        case "projects":
          return <UserProjectsInformation userRecord={userRecord} />;
        case "activity":
          return <UserActivityRecords userRecord={userRecord} />;
        default:
          return <BasicUserInformation userRecord={userRecord} />;
      }
    }
  };

  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };

  // console.log("all activeprojects ", allActiveProjects);

  // state vars

  const [loaded, setLoaded] = useState(false);

  // loaded
  useEffect(() => {
    if (userRecord) {
      setLoaded(true);
    }
  }, [userRecord]);

  // get initial all trainer activity records and projectlist (active)
  useEffect(() => {
    if (userRecord) {
      dispatch(fetchAllTrainersActivityRecords({ trainerId: userRecord?._id }));
      dispatch(fetchAllProjects());
    }
  }, [userRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="  flex-1 h-full flex w-full  ">
      {loaded && loading ? (
        <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
          <CircularProgress />
          <span className="mt-2">Loading user details ...</span>
        </div>
      ) : (
        <div className="userdetails w-full h-full overflow-auto bg-white rounded-md shadow-md mr-4 px-10 py-4 flex flex-col">
          <div className="header flex items-center justify-start gap-7 ">
            <h1 className="text-2xl font-bold">User Record Detail</h1>

            {/* menu buttons */}
            <div className="menuButtons my-2 flex gap-3">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant={
                    selectedMenu === item.value ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => handleMenuClick(item.value)}
                  disabled={
                    item?.value?.toLowerCase() != "basic" &&
                    userRecord?.role?.toLowerCase() != "trainer"
                  }
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* divider */}
          <Divider style={{ margin: ".4rem 0" }} />

          <div className="flex-1 h-full flex  overflow-y-auto">
            {showComponent()}
          </div>
        </div>
      )}
      {/* user attendance chart */}
      <div className="userattendancechart w-[35%] h-full flex flex-col justify-between ">
        <UserAttendanceChart studentId={userRecord?._id} />
      </div>
    </div>
  );
};

export default ViewUserDetail;
