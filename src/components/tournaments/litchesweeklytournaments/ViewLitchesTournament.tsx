import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, Divider } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Mail,
  CircleArrowRight,
  Book,
  Component,
  MapPinHouse,
  SquareCode,
  Earth,
  Star,
  MapPin,
  CircleUser,
  Phone,
  Edit,
} from "lucide-react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BasicLitchesTournamentInfo from "./viewlitchestournamentdetails/BasicLitchesTournamentInfo";
import LitchesTournamentWinners from "./viewlitchestournamentdetails/LitchesTournamentWinners";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewLitchesTournament = ({ litchesTournamentRecord }: any) => {
  // console.log(litchesTournamentRecord);
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

  const menuItems = [
    { label: "Overview", value: "basic", icon: <InfoOutlinedIcon /> },
    {
      label: "Winners",
      value: "winners",
      icon: <Component />,
    },
  ];

  const showComponent = () => {
    if (litchesTournamentRecord) {
      console.log("show comp", selectedMenu);

      switch (selectedMenu) {
        case "basic":
          return (
            <BasicLitchesTournamentInfo
              litchesTournamentRecord={litchesTournamentRecord}
            />
          );
        case "winners":
          return (
            <LitchesTournamentWinners
              litchesTournamentRecord={litchesTournamentRecord}
              winnersList={litchesTournamentRecord?.litchesWeeklyWinners}
            />
          );
        default:
          return (
            <BasicLitchesTournamentInfo
              litchesTournamentRecord={litchesTournamentRecord}
            />
          );
      }
    }
  };

  useEffect(() => {
    if (litchesTournamentRecord) {
      setLoaded(true);
    }
  }, [litchesTournamentRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex items-end justify-between">
        <div className="title-name flex flex-col">
          <h1 className="text-2xl font-bold flex items-center">
            <MapPinHouse />
            <span className="ml-2 mr-3">Litches Tournament Detail</span>
            {/* {session?.data?.user?.role?.toLowerCase() == "superadmin" && ( */}
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/litchesweeklytournament/updatelitchesweeklytournament/${
                litchesTournamentRecord?._id
              }`}
              className="mr-3"
            >
              <Button variant="text" size="small">
                <Edit />
                <span className="ml-1">Edit</span>
              </Button>
            </Link>
            {/* )} */}
          </h1>

          <span>of {litchesTournamentRecord?.tournamentName}</span>
        </div>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/litchesweeklytournament`}
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
        </div>
      </div>

      {/* menu buttons */}
      <div className="w-full menuButtons mt-2 flex  gap-2">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant={selectedMenu === item.value ? "contained" : "outlined"}
            size="medium"
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

      <div className="flex-1 h-full  overflow-y-auto  w-full gap-4">
        {showComponent()}
      </div>
    </div>
  );
};

export default ViewLitchesTournament;
