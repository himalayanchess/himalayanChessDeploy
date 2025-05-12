import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Medal, SquareArrowOutUpRight } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LichessTournamentWinners = ({
  lichessTournamentRecord,
  winnersList,
}: any) => {
  const session = useSession();
  return (
    <div className="flex flex-col">
      <p className="text-gray-500 font-bold flex items-center">
        <Medal />
        <span className="ml-1">Lichess Winners List</span>
      </p>

      <div className="overflow-y-auto mt-3 h-max  border flex flex-col bg-white rounded-lg">
        {/* Table Headings */}
        <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(9,1fr)] gap-1 w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Winner Name
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            FIDE ID
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Rank
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Medal Points
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Lichess Points
          </span>
          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Lichess Username
          </span>

          <span className="py-3 text-left text-sm  font-bold text-gray-600">
            Lichess URL
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Performance URL
          </span>
        </div>

        {/* winner List */}
        {winnersList?.length == 0 ? (
          <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No records found</p>
          </div>
        ) : (
          <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 ">
            {winnersList
              ?.filter((winner: any) => winner.activeStatus)
              ?.map((winner: any, index: any) => {
                const serialNumber = index + 1;
                return (
                  <div
                    key={`${winner?.studentName}_${index}`}
                    className="grid grid-cols-[50px,repeat(9,1fr)] gap-1 py-3 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-sm text-center font-medium text-gray-600">
                      {serialNumber}
                    </span>
                    {/* winnername */}
                    <Link
                      title="View"
                      href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                        winner?.studentId
                      }`}
                      className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                    >
                      {winner?.studentName}
                    </Link>
                    {/* Fide id */}
                    <span className=" text-sm text-gray-700">
                      {winner?.fideId || "N/A"}
                    </span>
                    {/* rank */}
                    <span className=" text-sm text-gray-700">
                      #{winner?.rank || "N/A"}
                    </span>
                    {/* medal points */}
                    <span className="text-sm text-gray-700 flex items-center">
                      <Medal size={15} />
                      <span className="ml-1">
                        {winner.medalPoints || "N/A"}
                      </span>
                    </span>
                    <span className="text-sm text-gray-700">
                      {winner.lichessPoints || "N/A"}
                    </span>
                    {/* lichess username */}
                    <span className="  text-sm text-gray-700">
                      {winner.lichessUsername || "N/A"}
                    </span>

                    {/* lichess url */}
                    {winner?.lichessUrl ? (
                      <Link
                        target="_blank"
                        title="View"
                        href={winner.lichessUrl}
                        className="text-left text-sm font-medium underline text-gray-600 flex items-center  hover:text-blue-500"
                      >
                        <SquareArrowOutUpRight size={15} />
                        <span className="ml-1">View URL</span>
                      </Link>
                    ) : (
                      <p className="text-left text-sm font-medium text-gray-400">
                        N/A
                      </p>
                    )}

                    {/* performance url */}
                    {winner?.performanceUrl ? (
                      <Link
                        target="_blank"
                        title="View"
                        href={winner.performanceUrl}
                        className="text-left text-sm font-medium underline text-gray-600 flex items-center  hover:text-blue-500"
                      >
                        <SquareArrowOutUpRight size={15} />
                        <span className="ml-1">View URL</span>
                      </Link>
                    ) : (
                      <p className="text-left text-sm font-medium text-gray-400">
                        N/A
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LichessTournamentWinners;
