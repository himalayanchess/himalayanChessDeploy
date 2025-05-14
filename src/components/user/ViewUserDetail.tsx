"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  LayoutList,
  IdCard,
  Edit,
  DollarSign,
} from "lucide-react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Button, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";

import { useSession } from "next-auth/react";
import {
  fetchAllProjects,
  getAllSelectedUsersPaymentRecords,
} from "@/redux/allListSlice";
import UserAttendanceChart from "../student/UserAttendanceChart";
import BasicUserInformation from "./userrecorddetail/BasicUserInformation";
import UserProjectsInformation from "./userrecorddetail/UserProjectsInformation";
import UserActivityRecords from "./userrecorddetail/UserActivityRecords";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import UserPaymentRecords from "./userrecorddetail/UserPaymentRecords";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewUserDetail = ({ userRecord, loading }: any) => {
  const { allActiveProjects, allProjectsLoading } = useSelector(
    (state: any) => state.allListReducer
  );
  // Selectors
  const {
    allActiveTrainersActivityRecords,
    allTrainersActivityRecordsLoading,
  } = useSelector((state: any) => state.trainerHistoryReducer);
  //use selector
  const {
    allActiveSelectedUsersPaymentRecordsList,
    allFilteredActiveSelectedUsersPaymentRecordsList,
    allSelectedUsersPaymentRecordsLoading,
  } = useSelector((state: any) => state.allListReducer);

  const dispatch = useDispatch<any>();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };

  const menuItems = [
    { label: "Basic Information", value: "basic", icon: <InfoOutlinedIcon /> },
    { label: "Projects", value: "projects", icon: <School /> },
    { label: "Activity Records", value: "activity", icon: <LayoutList /> },
    ...(session?.data?.user?.role?.toLowerCase() === "superadmin"
      ? [{ label: "Payment Records", value: "payment", icon: <DollarSign /> }]
      : []),
  ];

  // show dynamic compnent
  const showComponent = () => {
    if (userRecord) {
      switch (selectedMenu) {
        case "basic":
          return <BasicUserInformation userRecord={userRecord} />;
        case "projects":
          return (
            <UserProjectsInformation
              userRecord={userRecord}
              allActiveProjects={allActiveProjects}
              allProjectsLoading={allProjectsLoading}
            />
          );
        case "activity":
          return (
            <UserActivityRecords
              userRecord={userRecord}
              allActiveTrainersActivityRecords={
                allActiveTrainersActivityRecords
              }
              allTrainersActivityRecordsLoading={
                allTrainersActivityRecordsLoading
              }
            />
          );
        case "payment":
          return (
            <UserPaymentRecords
              allActiveSelectedUsersPaymentRecordsList={
                allActiveSelectedUsersPaymentRecordsList
              }
              allFilteredActiveSelectedUsersPaymentRecordsList={
                allFilteredActiveSelectedUsersPaymentRecordsList
              }
              allSelectedUsersPaymentRecordsLoading={
                allSelectedUsersPaymentRecordsLoading
              }
            />
          );
        default:
          return <BasicUserInformation userRecord={userRecord} />;
      }
    }
  };

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

  // fetch initial data for user payment
  useEffect(() => {
    if (userRecord) {
      dispatch(getAllSelectedUsersPaymentRecords(userRecord?._id));
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
          <span className="mt-2">Loading user details...</span>
        </div>
      ) : (
        <div className="userdetails w-full h-full overflow-auto bg-white rounded-md shadow-md mr-4 px-7 py-4 flex flex-col">
          <div className="header flex items-start justify-between  gap-7 ">
            <div className="title flex flex-col ">
              <div className="text-2xl font-bold flex items-center">
                <PersonOutlineOutlinedIcon sx={{ fontSize: "1.8rem" }} />
                <span className="ml-1 mr-3">User Record Detail</span>
                {isSuperOrGlobalAdmin && (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/users/updateuser/${
                      userRecord?._id
                    }`}
                  >
                    <Button variant="text" size="small">
                      <Edit />
                      <span className="ml-1">Edit</span>
                    </Button>
                  </Link>
                )}
              </div>
              <p>of {userRecord?.name}</p>
            </div>

            {/* home button */}
            <Link href={`/${session?.data?.user?.role?.toLowerCase()}/users`}>
              <Button
                className="homebutton"
                color="inherit"
                sx={{ color: "gray" }}
              >
                <HomeOutlinedIcon />
                <span className="ml-1">Home</span>
              </Button>
            </Link>
          </div>
          {/* menu buttons */}
          <div className="menuButtons mt-2 flex gap-3">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant={selectedMenu === item.value ? "contained" : "outlined"}
                size="small"
                onClick={() => handleMenuClick(item.value)}
                disabled={
                  item?.value?.toLowerCase() != "basic" &&
                  userRecord?.role?.toLowerCase() != "trainer"
                }
                sx={{ padding: "0.3rem 0.7rem" }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* divider */}
          <Divider style={{ margin: ".8rem 0" }} />

          <div className="flex-1 h-full flex  overflow-y-auto">
            {showComponent()}
          </div>
        </div>
      )}
      {/* user attendance chart */}
      <div className="userattendancechart w-[30%] h-full flex flex-col justify-between ">
        <UserAttendanceChart userId={userRecord?._id} />
      </div>
    </div>
  );
};

export default ViewUserDetail;
