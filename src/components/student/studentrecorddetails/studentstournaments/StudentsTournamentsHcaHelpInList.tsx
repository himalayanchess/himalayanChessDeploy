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
import { BadgePlus } from "lucide-react";
import { exportStudentsTournamentsHcaHelpInToExcel } from "@/helpers/exportToExcel/studenttournaments/exportStudentsTournamentsHcaHelpInToExcel";

dayjs.extend(utc);
dayjs.extend(timezone);
let timeZone = "Asia/Kathmandu";

const StudentsTournamentsHcaHelpInList = ({
  studentId,
  studentName,
  tournamentList,
  loading,
}: any) => {
  const session = useSession();
  //export to excel
  const exportToExcel = () => {
    exportStudentsTournamentsHcaHelpInToExcel(
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
            Start Date
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Type
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Prize Title
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Prize Position
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
                dayjs.tz(b.startDate, timeZone).valueOf() -
                dayjs.tz(a.startDate, timeZone).valueOf()
            )
            ?.map((tournament: any, index: any) => {
              // selectedStudent
              const selectedStudent: any = tournament?.participants?.find(
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
                    href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/tournamentshcahelpin/${
                      tournament?._id
                    }`}
                    className="py-3 text-left col-span-2 text-xs  text-gray-600  hover:text-blue-500 hover:underline"
                  >
                    {tournament.tournamentName || "N/A"}
                  </Link>
                  {/* startDate */}
                  <span className="  text-xs text-gray-700">
                    {tournament?.startDate
                      ? dayjs(tournament?.startDate)
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

                  <span className="py-3 text-left text-xs text-gray-600 flex items-center gap-1">
                    {selectedStudent?.prize?.otherTitle ? (
                      <>
                        <BadgePlus size={17} className="" />
                        {selectedStudent.prize.otherTitle}
                      </>
                    ) : (
                      selectedStudent?.prize?.title || "N/A"
                    )}
                  </span>
                  <span className="py-3 text-left  text-xs  text-gray-600">
                    {selectedStudent?.prize?.position || "N/A"}
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

export default StudentsTournamentsHcaHelpInList;
