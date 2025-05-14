import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DownloadIcon from "@mui/icons-material/Download";
import { Button, Divider } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

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
  Trophy,
  List,
} from "lucide-react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BasicHcaCircuitTournamentInfo from "./viewhcacircuitdetails/BasicHcaCircuitTournamentInfo";
import HcaCircuitTournamentLeaderboard from "./viewhcacircuitdetails/HcaCircuitTournamentLeaderboard";
import HcaCircuitTournamentSeries from "./viewhcacircuitdetails/HcaCircuitTournamentSeries";
import { useDispatch, useSelector } from "react-redux";
import { fetchallmainhcacircuitseriestournaments } from "@/redux/allHcaCircuitTournamentSlice";
import Tournament from "@/models/TournamentModel";
import { exportHcaCircuitTournamentToExcel } from "@/helpers/exportToExcel/singletorunamentrecord/exportHcaCircuitTournamentToExcel";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewHcaCircuitTournament = ({ hcaCircuitTournamentRecord }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  // no need filter becase we show all the series trounaments
  const {
    allActiveMainHcaCircuitSeriesTournamentsList,
    allMainHcaCircuitSeriesTournamentsLoading,
  } = useSelector((state: any) => state.allHcaCircuitTournamentReducer);
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
      label: "Series Tournaments",
      value: "hcacircuitseries",
      icon: <List />,
    },
    {
      label: "Leaderboard",
      value: "hcacircuitleaderboard",
      icon: <LeaderboardOutlinedIcon />,
    },
  ];

  // 📌 Calculate leaderboard
  const leaderboard = useMemo(() => {
    const leaderboardMap = new Map<
      string,
      {
        studentName: string;
        studentId: string;
        fideId: number;
        branchName: string;
        circuitPoints: number;
        tournamentCount: number; // 🆕 Add count field
      }
    >();

    allActiveMainHcaCircuitSeriesTournamentsList.forEach((tournament: any) => {
      tournament.participants
        ?.filter((participant: any) => participant?.activeStatus)
        ?.forEach((participant: any) => {
          const key = participant.studentId;
          const existing = leaderboardMap.get(key);

          if (existing) {
            existing.circuitPoints += participant.circuitPoints;
            existing.tournamentCount += 1; // 🆕 Increment count
          } else {
            leaderboardMap.set(key, {
              studentName: participant.studentName,
              studentId: participant.studentId,
              fideId: participant.fideId || 0,
              branchName: tournament.branchName,
              circuitPoints: participant.circuitPoints,
              tournamentCount: 1, // 🆕 Initial count
            });
          }
        });
    });

    return Array.from(leaderboardMap.values()).sort(
      (a, b) => b.circuitPoints - a.circuitPoints
    );
  }, [allActiveMainHcaCircuitSeriesTournamentsList]);

  //export to excel
  const exportToExcel = () => {
    // overall export of main hca circut Tournament, its series and leaderboard
    exportHcaCircuitTournamentToExcel(
      hcaCircuitTournamentRecord,
      allActiveMainHcaCircuitSeriesTournamentsList,
      leaderboard
    );
  };

  const showComponent = () => {
    if (hcaCircuitTournamentRecord) {
      switch (selectedMenu) {
        case "basic":
          return (
            <BasicHcaCircuitTournamentInfo
              hcaCircuitTournamentRecord={hcaCircuitTournamentRecord}
            />
          );
        case "hcacircuitseries":
          return (
            <HcaCircuitTournamentSeries
              hcaCircuitTournamentRecord={hcaCircuitTournamentRecord}
              allActiveMainHcaCircuitSeriesTournamentsList={
                allActiveMainHcaCircuitSeriesTournamentsList
              }
              loading={allMainHcaCircuitSeriesTournamentsLoading}
            />
          );
        case "hcacircuitleaderboard":
          return (
            <HcaCircuitTournamentLeaderboard
              hcaCircuitTournamentRecord={hcaCircuitTournamentRecord}
              leaderboard={leaderboard}
              loading={allMainHcaCircuitSeriesTournamentsLoading}
            />
          );
        default:
          return (
            <BasicHcaCircuitTournamentInfo
              hcaCircuitTournamentRecord={hcaCircuitTournamentRecord}
            />
          );
      }
    }
  };

  useEffect(() => {
    if (hcaCircuitTournamentRecord) {
      setLoaded(true);
      dispatch(
        fetchallmainhcacircuitseriestournaments(hcaCircuitTournamentRecord?._id)
      );
    }
  }, [hcaCircuitTournamentRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex items-start justify-between">
        <div className="title-name flex flex-col">
          <h1 className="text-2xl font-bold flex items-center">
            <Trophy />
            <span className="ml-2 mr-3">HCA Circuit Tournament Detail</span>
            {/* {session?.data?.user?.role?.toLowerCase() == "superadmin" && ( */}
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/hcacircuit/updatehcacircuittournament/${
                hcaCircuitTournamentRecord?._id
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

          <span>of {hcaCircuitTournamentRecord?.tournamentName}</span>
        </div>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/hcacircuit`}
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
      <div className="w-full menuButtons mt-2 flex justify-between">
        <div className="buttons flex gap-2">
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

        <Button
          onClick={exportToExcel}
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
        >
          Export to Excel
        </Button>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="flex-1 h-full  overflow-y-auto  w-full flex flex-col">
        {showComponent()}
      </div>
    </div>
  );
};

export default ViewHcaCircuitTournament;
