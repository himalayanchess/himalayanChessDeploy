import React, { useMemo, useState } from "react";
import { Stack, Pagination, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DownloadIcon from "@mui/icons-material/Download";
import { exportLichessLeaderboardToExcel } from "@/helpers/exportToExcel/exportLichessLeaderboardToExcel";
import CircularProgress from "@mui/material/CircularProgress";

import Link from "next/link";
import { useSession } from "next-auth/react";

const LichessLeaderboardComponent: React.FC<any> = ({
  allFilteredActiveLichessTournamentsList,
  allLichessTournamentsLoading,
  selectedMonth,
  useAdvancedDate,
  startDate,
  endDate,
}) => {
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const lichessTournamentsPerPage = 7;

  // 📌 Calculate leaderboard
  const leaderboard = useMemo(() => {
    const medalMap = new Map<
      string,
      {
        studentName: string;
        studentId: string;
        lichessUsername: string;
        lichessPoints: number | any;
        branchName: string;
        lichessUrl: string;
        medalPoints: number;
      }
    >();

    allFilteredActiveLichessTournamentsList.forEach((tournament: any) => {
      tournament.lichessWeeklyWinners
        ?.filter((winner: any) => winner?.activeStatus)
        ?.forEach((winner: any) => {
          const key = winner.studentId || winner.lichessUsername;
          const existing = medalMap.get(key);

          if (existing) {
            existing.medalPoints += winner.medalPoints;
          } else {
            medalMap.set(key, {
              studentName: winner.studentName,
              studentId: winner.studentId,
              lichessUsername: winner.lichessUsername,
              lichessPoints: winner.lichessPoints,
              branchName: tournament.branchName,
              lichessUrl: winner.lichessUrl,
              medalPoints: winner.medalPoints,
            });
          }
        });
    });

    return Array.from(medalMap.values()).sort(
      (a, b) => b.medalPoints - a.medalPoints
    );
  }, [allFilteredActiveLichessTournamentsList]);

  //   const showingText = `Showing ${startItem}-${endItem} of ${leaderboard?.length}`;

  // 📌 Pagination logic
  const startItem = (currentPage - 1) * lichessTournamentsPerPage + 1;
  const endItem = Math.min(
    currentPage * lichessTournamentsPerPage,
    leaderboard.length
  );
  const showingText = `Showing ${startItem}-${endItem} of ${leaderboard?.length}`;

  //export to excel
  const exportToExcel = () => {
    exportLichessLeaderboardToExcel(leaderboard, {
      useAdvancedDate,
      selectedMonth,
      startDate,
      endDate,
    });
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  if (allLichessTournamentsLoading)
    return (
      <div className="bg-white rounded-md  flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
        <CircularProgress />
        <span className="mt-2">Loading record...</span>
      </div>
    );

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
            disabled={leaderboard?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-y-auto h-full flex-1 border flex flex-col bg-white rounded-lg">
        {/* heading */}
        <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] gap-1 w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            Rank
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Student Name
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Branch
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Lichess Points
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Medal Points
          </span>
        </div>

        {leaderboard?.length === 0 && !allLichessTournamentsLoading && (
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
                className="grid grid-cols-[70px,repeat(5,1fr)] gap-1 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
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
                  {student.branchName || "N/A"}
                </span>
                <span className="py-3 text-left  text-sm  text-gray-600">
                  {student.lichessPoints || "N/A"}
                </span>
                <span className="py-3 text-left  text-sm  text-gray-600">
                  {student.medalPoints || "N/A"}
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

export default LichessLeaderboardComponent;
