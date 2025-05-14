import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  Component,
  LayoutList,
  Luggage,
  CircleFadingArrowUp,
  CalendarCheck2,
  Edit,
  DollarSign,
} from "lucide-react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import Link from "next/link";
import { useSession } from "next-auth/react";
import BasicProjectInformation from "./projectrecorddetails/BasicProjectInformation";
import ProjectAssignedTrainers from "./projectrecorddetails/ProjectAssignedTrainers";
import ProjectTimeSlots from "./projectrecorddetails/ProjectTimeSlots";
import ProjectActivityRecords from "./projectrecorddetails/ProjectActivityRecords";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActivityRecords } from "@/redux/activityRecordSlice";
import ProjectPaymentRecords from "./projectrecorddetails/ProjectPaymentRecords";
import { getAllSelectedProjectsPaymentRecords } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewProjectDetail = ({ projectRecord }: any) => {
  // selector
  const { allActiveActivityRecords, allActivityRecordsLoading } = useSelector(
    (state: any) => state.activityRecordReducer
  );
  //use selector for projects payment
  const {
    allActiveSelectedProjectsPaymentRecordsList,
    allFilteredActiveSelectedProjectsPaymentRecordsList,
    allSelectedProjectsPaymentRecordsLoading,
  } = useSelector((state: any) => state.allListReducer);

  const dispatch = useDispatch<any>();

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  const [loaded, setLoaded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };
  // menu items
  const menuItems = [
    { label: "Basic Information", value: "basic", icon: <InfoOutlinedIcon /> },
    { label: "Assigned Trainers", value: "trainers", icon: <CircleUser /> },
    {
      label: "Time Slots",
      value: "timeslots",
      icon: <AccessTimeOutlinedIcon />,
    },
    { label: "Activity Records", value: "activity", icon: <LayoutList /> },
    ...(session?.data?.user?.role?.toLowerCase() === "superadmin"
      ? [
          {
            label: "Payment Records",
            value: "payment",
            icon: <DollarSign />,
          },
        ]
      : []),
  ];

  // show dynamic compnent
  const showComponent = () => {
    if (projectRecord) {
      switch (selectedMenu) {
        case "basic":
          return <BasicProjectInformation projectRecord={projectRecord} />;
        case "trainers":
          return <ProjectAssignedTrainers projectRecord={projectRecord} />;
        case "timeslots":
          return <ProjectTimeSlots projectRecord={projectRecord} />;
        case "activity":
          return (
            <ProjectActivityRecords
              projectRecord={projectRecord}
              allActiveActivityRecords={allActiveActivityRecords}
              allActivityRecordsLoading={allActivityRecordsLoading}
            />
          );
        case "payment":
          return (
            <ProjectPaymentRecords
              allActiveSelectedProjectsPaymentRecordsList={
                allActiveSelectedProjectsPaymentRecordsList
              }
              allFilteredActiveSelectedProjectsPaymentRecordsList={
                allFilteredActiveSelectedProjectsPaymentRecordsList
              }
              allSelectedProjectsPaymentRecordsLoading={
                allSelectedProjectsPaymentRecordsLoading
              }
            />
          );
        default:
          return <BasicProjectInformation projectRecord={projectRecord} />;
      }
    }
  };

  useEffect(() => {
    if (projectRecord) {
      setLoaded(true);
      dispatch(fetchAllActivityRecords());
    }
  }, [projectRecord]);

  // fetch initial data for project payment
  useEffect(() => {
    if (projectRecord) {
      dispatch(getAllSelectedProjectsPaymentRecords(projectRecord?._id));
    }
  }, [projectRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      {/* header */}
      <div className="header flex items-center justify-between gap-7 ">
        <div className=" ">
          <div className="flex items-center font-bold text-2xl ">
            <School />
            <span className="ml-2 mr-3">Project Detail</span>
            {!isSuperOrGlobalAdmin && (
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/projects/updateproject/${
                  projectRecord?._id
                }`}
              >
                <Button variant="text" size="small">
                  <Edit />
                  <span className="ml-1">Edit</span>
                </Button>
              </Link>
            )}
          </div>
          <span className="text-md">of {projectRecord?.name}</span>
        </div>

        {/* home button */}
        <Link href={`/${session?.data?.user?.role?.toLowerCase()}/projects`}>
          <Button className="homebutton" color="inherit" sx={{ color: "gray" }}>
            <HomeOutlinedIcon />
            <span className="ml-1">Home</span>
          </Button>
        </Link>
      </div>
      {/* menu buttons */}
      <div className="menuButtons my-2 flex gap-3">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant={selectedMenu === item.value ? "contained" : "outlined"}
            size="small"
            onClick={() => handleMenuClick(item.value)}
            sx={{ padding: "0.3rem 0.7rem" }}
          >
            {item.icon}
            <span className="ml-1.5">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      {/* dynamic component */}
      <div className="flex-1 h-full flex bg-  overflow-y-auto">
        {showComponent()}
      </div>
    </div>
  );
};

export default ViewProjectDetail;
