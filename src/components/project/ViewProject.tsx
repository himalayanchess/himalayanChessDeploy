import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BasicProjectInformation from "./projectrecorddetails/BasicProjectInformation";
import ProjectAssignedTrainers from "./projectrecorddetails/ProjectAssignedTrainers";
import ProjectTimeSlots from "./projectrecorddetails/ProjectTimeSlots";
import ProjectActivityRecords from "./projectrecorddetails/ProjectActivityRecords";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActivityRecords } from "@/redux/activityRecordSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewProjectDetail = ({ projectRecord }: any) => {
  // console.log(projectRecord);
  // selector
  const { allActiveActivityRecords, allActivityRecordsLoading } = useSelector(
    (state: any) => state.activityRecordReducer
  );

  const dispatch = useDispatch<any>();

  const session = useSession();

  const [loaded, setLoaded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    console.log("menu", menuValue);

    setSelectedMenu(menuValue); // Update the selected menu
  };
  // menu items
  const menuItems = [
    { label: "Basic Information", value: "basic" },
    { label: "Assigned Trainers", value: "trainers" },
    { label: "Time Slots", value: "timeslots" },
    { label: "Activity Records", value: "activity" },
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

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      {/* header */}
      <div className="header flex items-center justify-start gap-7 ">
        <h1 className="text-2xl font-bold">Project Detail</h1>

        {/* menu buttons */}
        <div className="menuButtons my-2 flex gap-3">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={selectedMenu === item.value ? "contained" : "outlined"}
              size="small"
              onClick={() => handleMenuClick(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
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
