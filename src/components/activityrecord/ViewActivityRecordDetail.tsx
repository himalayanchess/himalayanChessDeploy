import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpenCheck,
  CircleUser,
  Users,
  BookCopy,
  School,
  Component,
  Luggage,
  LayoutList,
  CalendarCheck2,
} from "lucide-react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import StudentRecordComponent from "../trainer/trainerhistory/StudentRecordComponent";
import StudyMaterialListComponent from "@/components/StudyMaterialListComponent";
import DownloadIcon from "@mui/icons-material/Download";
import { exportActivityRecordToExcel } from "@/helpers/exportToExcel/exportActivityRecordToExcel";
import { Button, Divider } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BasicActivityRecordInformation from "./activityrecorddetails/BasicActivityRecordInformation";
import ActivityRecordActivities from "./activityrecorddetails/ActivityRecordActivities";
import ActivityRecordStudyMaterials from "./activityrecorddetails/ActivityRecordStudyMaterials";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewActivityRecordDetail = ({ activityRecord }: any) => {
  const [loaded, setLoaded] = useState(false);
  const session = useSession();
  const [selectedMenu, setSelectedMenu] = useState("basic");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };
  const menuItems = [
    { label: "Overview", value: "basic", icon: <InfoOutlinedIcon /> },
    { label: "Activity Record", value: "activity", icon: <LayoutList /> },
    { label: "Study Materials", value: "studymaterials", icon: <BookCopy /> },
  ];

  // show dynamic compnent
  const showComponent = () => {
    if (activityRecord) {
      switch (selectedMenu) {
        case "basic":
          return (
            <BasicActivityRecordInformation activityRecord={activityRecord} />
          );

        case "activity":
          return <ActivityRecordActivities activityRecord={activityRecord} />;
        case "studymaterials":
          return (
            <ActivityRecordStudyMaterials activityRecord={activityRecord} />
          );

        default:
          return (
            <BasicActivityRecordInformation activityRecord={activityRecord} />
          );
      }
    }
  };

  useEffect(() => {
    if (activityRecord) {
      setLoaded(true);
    }
  }, [activityRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5 ">
      <div className="header flex items-end justify-between mb-0 ">
        <h1 className="text-2xl font-bold flex items-center">
          <LayoutList />
          <span className="ml-2">Activity Record Detail</span>
        </h1>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/${
              session?.data?.user?.role?.toLowerCase() === "trainer"
                ? "trainerhistory"
                : "activityrecords"
            }`}
          >
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>

          <Button
            variant="contained"
            color="success"
            onClick={() => exportActivityRecordToExcel(activityRecord)}
            className="bg-blue-500 text-white rounded-md mb-4"
          >
            <DownloadIcon fontSize="small" />
            <span className="ml-2">Download Excel</span>
          </Button>
        </div>
      </div>

      {/* menu buttons */}
      <div className="menuButtons mt-2 flex gap-3">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant={selectedMenu === item.value ? "contained" : "outlined"}
            size="small"
            onClick={() => handleMenuClick(item.value)}
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
  );
};

export default ViewActivityRecordDetail;
