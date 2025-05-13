import React, { useMemo, useState } from "react";
import { Stack, Pagination, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DownloadIcon from "@mui/icons-material/Download";
import { exportLichessLeaderboardToExcel } from "@/helpers/exportToExcel/exportLichessLeaderboardToExcel";
import CircularProgress from "@mui/material/CircularProgress";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Medal, Trophy } from "lucide-react";
import { LeaderboardOutlined } from "@mui/icons-material";

const HcaCircuitTournamentLeaderboard: React.FC<any> = ({
  hcaCircuitTournamentRecord,
  leaderboard,
  loading,
}) => {
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const lichessTournamentsPerPage = 7;

  // 📌 Pagination logic
  const startItem = (currentPage - 1) * lichessTournamentsPerPage + 1;
  const endItem = Math.min(
    currentPage * lichessTournamentsPerPage,
    leaderboard?.length
  );
  const showingText = `Showing ${startItem}-${endItem} of ${leaderboard?.length}`;

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  if (loading)
    return (
      <div className="bg-white rounded-md  flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
        <CircularProgress />
        <span className="mt-2">Loading record...</span>
      </div>
    );

  return (
    <div className=" flex-1 h-full  flex flex-col bg-white rounded-lg">
      <div className="leaderboard-header flex flex-col mb-1 ">
        <span className="flex items-center text-gray-500">
          <LeaderboardOutlined />
          <span className="ml-1 text-xl ">
            {hcaCircuitTournamentRecord?.tournamentName} Leaderboard
          </span>
        </span>
        {/* showing text */}
        <span className="text-sm text-gray-600 ">{showingText}</span>
      </div>

      {/* table */}
      <div className="overflow-y-auto h-full flex-1 border flex flex-col bg-white rounded-lg">
        {/* heading */}
        <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(6,1fr)] gap-1 w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            Rank
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Student Name
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            FIDE ID
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Branch
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Tournaments Played
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Circuit Points
          </span>
        </div>

        {leaderboard?.length === 0 && !loading && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No leaderboard record</p>
          </div>
        )}
        {/* leaderboard list */}
        <div className="table-contents overflow-y-auto h-full flex-1 grid grid-cols-1 grid-rows-7">
          {leaderboard
            .slice(
              (currentPage - 1) * lichessTournamentsPerPage,
              currentPage * lichessTournamentsPerPage
            )
            ?.map((student: any, index: any) => (
              <div
                key={student?.studentId}
                className="grid grid-cols-[70px,repeat(6,1fr)] gap-1 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="py-3 text-center  text-sm  text-gray-600">
                  #{index + 1}
                </span>
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                    student?.studentId
                  }`}
                  className="py-3 text-left col-span-2 text-sm  text-gray-600  hover:text-blue-500 hover:underline"
                >
                  {student.studentName || "N/A"}
                </Link>
                <span className="py-3 text-left  text-sm  text-gray-600">
                  {student.fideId || "N/A"}
                </span>
                <span className="py-3 text-left  text-sm  text-gray-600">
                  {student.branchName || "N/A"}
                </span>
                <span className="py-3 text-left  text-sm  text-gray-600">
                  {student.tournamentCount || "N/A"}
                </span>
                <span className="py-3 text-left  text-sm  text-gray-600 flex items-center">
                  <Medal size={16} />
                  <span className="ml-1">{student.circuitPoints || "N/A"}</span>
                </span>
              </div>
            ))}
        </div>
      </div>
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(leaderboard.length / lichessTournamentsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default HcaCircuitTournamentLeaderboard;
