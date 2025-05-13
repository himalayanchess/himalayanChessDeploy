import { Button } from "@mui/material";
import { HandHelping, Laptop, Medal, Star, Trophy } from "lucide-react";
import React, { useState } from "react";
import StudentsLichessTournamentsList from "./studentstournaments/StudentsLichessTournamentsList";
import StudentsOtherTournamentsList from "./studentstournaments/StudentsOtherTournamentsList";
import StudentsTournamentsOrganizedByHcaList from "./studentstournaments/StudentsTournamentsOrganizedByHcaList";
import StudentsTournamentsHcaHelpInList from "./studentstournaments/StudentsTournamentsHcaHelpInList";
import StudentsHcaCircuitSeriesTournamentList from "./studentstournaments/StudentsHcaCircuitSeriesTournamentList";

const StudentEventInfo = ({
  studentRecord,
  // students lichess tournaments list
  studentsLichessTournamentsList,
  studentsLichessTournamentsLoading,

  // students lichess tournaments list
  studentsOtherTournamentsList,
  studentsOtherTournamentsLoading,

  // students tournaments organized by hca
  studentsTournamentsOrganizedByHcaList,
  studentsTournamentsOrganizedByHcaLoading,

  // students tournaments hca help in
  studentsTournamentsHcaHelpInList,
  studentsTournamentsHcaHelpInLoading,

  // students hca circuit series tournaments
  studentsHcaCircuitSeriesTournamentList,
  studentsHcaCircuitSeriesTournamentLoading,
}: any) => {
  const [selectedMenu, setSelectedMenu] = useState("lichess");

  const handleMenuClick = (menuValue: any) => {
    setSelectedMenu(menuValue); // Update the selected menu
  };

  const menuItems = [
    { label: "Lichess", value: "lichess", icon: <Laptop size={17} /> },
    {
      label: "Other Tournaments",
      value: "othertournaments",
      icon: <Star size={17} />,
    },
    {
      label: "Organized by HCA",
      value: "tournamentsorganizedbyhca",
      icon: <Trophy size={17} />,
    },
    {
      label: "HCA Help In",
      value: "tournamentshcahelpin",
      icon: <HandHelping size={17} />,
    },
    {
      label: "HCA Circuit",
      value: "hcacircuit",
      icon: <Medal size={17} />,
    },
  ];

  // show dynamic compnent
  const showComponent = () => {
    switch (selectedMenu) {
      case "lichess":
        return (
          <StudentsLichessTournamentsList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsLichessTournamentsList}
            loading={studentsLichessTournamentsLoading}
          />
        );
      case "othertournaments":
        return (
          <StudentsOtherTournamentsList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsOtherTournamentsList}
            loading={studentsOtherTournamentsLoading}
          />
        );
      case "tournamentsorganizedbyhca":
        return (
          <StudentsTournamentsOrganizedByHcaList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsTournamentsOrganizedByHcaList}
            loading={studentsTournamentsOrganizedByHcaLoading}
          />
        );
      case "tournamentshcahelpin":
        return (
          <StudentsTournamentsHcaHelpInList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsTournamentsHcaHelpInList}
            loading={studentsTournamentsHcaHelpInLoading}
          />
        );
      case "hcacircuit":
        return (
          <StudentsHcaCircuitSeriesTournamentList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsHcaCircuitSeriesTournamentList}
            loading={studentsHcaCircuitSeriesTournamentLoading}
          />
        );
      default:
        return (
          <StudentsLichessTournamentsList
            studentId={studentRecord?._id}
            studentName={studentRecord?.name}
            tournamentList={studentsLichessTournamentsList}
            loading={studentsLichessTournamentsLoading}
          />
        );
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col">
      <p className="font-bold text-sm text-gray-500">Tournament Information</p>

      {/* menu items */}
      <div className="w-full menuButtons my-2 flex  gap-2">
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

      {/* dynamic component */}
      <div className="flex-1 h-full flex  overflow-y-auto">
        {showComponent()}
      </div>
    </div>
  );
};

export default StudentEventInfo;
