import React, { useMemo, useState } from "react";
import { Stack, Pagination, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";

import Link from "next/link";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { exportStudentsLichessTournamentsToExcel } from "@/helpers/exportToExcel/studenttournaments/exportStudentsLichessTournamentsToExcel";
import { Medal } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
let timeZone = "Asia/Kathmandu";

const StudentsLichessTournamentsList = ({
  studentId,
  studentName,
  tournamentList,
  loading,
}: any) => {
  const session = useSession();
  //export to excel
  const exportToExcel = () => {
    exportStudentsLichessTournamentsToExcel(
      tournamentList,
      studentId,
      studentName
    );
  };

  // showing text
  const showingText = `Showing ${tournamentList?.length} records`;

  return (
    <div className=" flex-1 h-full mt-1 flex flex-col bg-white rounded-lg">
      <div className="leaderboard-header flex justify-between items-end mb-2">
        {/* showing text */}
        <span className="text-sm text-gray-600 ">{showingText}</span>
        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={tournamentList?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-y-auto h-full flex-1 border flex flex-col bg-white rounded-lg">
        {/* heading */}
        <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(7,1fr)] gap-1 w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Tournamet Name
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Date
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Type
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Lichess Points
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Medal Points
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Rank
          </span>
        </div>

        {tournamentList?.length === 0 && !loading && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No tournament record</p>
          </div>
        )}
        {/* tournamentList */}
        <div className="table-contents overflow-y-auto h-full flex-1 grid grid-cols-1 grid-rows-7">
          {tournamentList
            ?.slice()
            ?.sort(
              (a: any, b: any) =>
                dayjs.tz(b.date, timeZone).valueOf() -
                dayjs.tz(a.date, timeZone).valueOf()
            )
            ?.map((tournament: any, index: any) => {
              // selectedStudent
              const selectedStudent: any =
                tournament?.lichessWeeklyWinners?.find(
                  (student: any) => student?.studentId == studentId
                );

              return (
                <div
                  key={tournament?._id}
                  className="grid grid-cols-[70px,repeat(7,1fr)] gap-1 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="py-3 text-center  text-xs  text-gray-600">
                    {index + 1}
                  </span>

                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/lichessweeklytournament/${
                      tournament?._id
                    }`}
                    className="py-3 text-left col-span-2 text-xs  text-gray-600  hover:text-blue-500 hover:underline"
                  >
                    {tournament.tournamentName || "N/A"}
                  </Link>
                  {/* date */}
                  <span className="  text-xs text-gray-700">
                    {tournament?.date
                      ? dayjs(tournament?.date)
                          .tz(timeZone)
                          .format("MMMM D, YYYY")
                      : "N/A"}
                  </span>
                  {/* tournament type */}
                  <span className=" text-xs text-gray-700 flex items-center">
                    {tournament?.tournamentType?.toLowerCase() ===
                    "standard" ? (
                      <WindowOutlinedIcon sx={{ fontSize: "1rem" }} />
                    ) : tournament?.tournamentType?.toLowerCase() ===
                      "rapid" ? (
                      <WatchLaterOutlinedIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <FlashOnOutlinedIcon sx={{ fontSize: "1rem" }} />
                    )}
                    <span className="ml-1">{tournament?.tournamentType}</span>
                  </span>
                  <span className="py-3 text-left  text-xs  text-gray-600">
                    {selectedStudent?.lichessPoints || "N/A"}
                  </span>
                  <span className="py-3 text-left  text-xs  text-gray-600 flex items-center">
                    <Medal size={15} />
                    <span className="ml-1">
                      {selectedStudent?.medalPoints || "N/A"}
                    </span>
                  </span>
                  <span className="py-3 text-left  text-xs  text-gray-600">
                    #{selectedStudent?.rank || "N/A"}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default StudentsLichessTournamentsList;
