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

const HcaCircuitSeriesTournamenWinners = ({
  hcaCircuitSeriesTournamentRecord,
  participants,
}: any) => {
  const session = useSession();
  return (
    <div className="flex flex-col">
      <p className="text-gray-500 font-bold flex items-center">
        <Medal />
        <span className="ml-1">Participants List</span>
      </p>

      <div className="overflow-y-auto mt-3 h-max  border flex flex-col bg-white rounded-lg">
        {/* Table Headings */}
        <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(11,1fr)] gap-1 w-full bg-gray-200">
          <span className="py-3 text-center text-xs font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left col-span-2 text-xs font-bold text-gray-600">
            Participant Name
          </span>
          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Participant Type
          </span>
          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Rank
          </span>
          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Circuit Points
          </span>
          <span className="py-3 text-left text-xs  font-bold text-gray-600">
            Total Points
          </span>
          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Prize Title
          </span>
          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Prize Position
          </span>

          <span className="py-3 text-left text-xs font-bold text-gray-600">
            Performance URL
          </span>
          <span className="py-3 text-left col-span-2 text-xs font-bold text-gray-600">
            Description
          </span>
        </div>

        {/* participant List */}
        {participants?.length == 0 ? (
          <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No records found</p>
          </div>
        ) : (
          <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 ">
            {participants
              ?.filter((participant: any) => participant.activeStatus)
              ?.map((participant: any, index: any) => {
                const serialNumber = index + 1;
                return (
                  <div
                    key={`${participant?.studentName}_${index}`}
                    className="grid grid-cols-[50px,repeat(11,1fr)] gap-1 py-3 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-xs text-center font-medium text-gray-600">
                      {serialNumber}
                    </span>
                    {/* participantname */}
                    <Link
                      title="View"
                      href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                        participant?.studentId
                      }`}
                      className="text-left col-span-2 text-xs font-medium text-gray-600 hover:underline hover:text-blue-500"
                    >
                      {participant?.studentName}
                    </Link>
                    {/* fideId */}
                    <span className=" text-xs text-gray-700">
                      {participant?.participantType || "N/A"}
                    </span>
                    {/* rank */}
                    <span className=" text-xs text-gray-700">
                      #{participant?.rank || "N/A"}
                    </span>
                    {/* circuit points */}
                    {/* rank */}
                    <span className=" text-xs text-gray-700 flex items-center">
                      <Medal size={15} />
                      <span className="ml-1">
                        {participant?.circuitPoints || "N/A"}
                      </span>
                    </span>
                    {/* total points */}
                    <span className="text-xs text-gray-700 ">
                      <span className="ml-1">
                        {participant.totalPoints || "N/A"}
                      </span>
                    </span>
                    <span className="text-xs text-gray-700">
                      {participant.prize.otherTitle ||
                        participant.prize.title ||
                        "N/A"}
                    </span>
                    {/* position */}
                    <span className="  text-xs text-gray-700">
                      {participant?.prize?.position || "N/A"}
                    </span>

                    {/* performance url */}
                    {participant?.performanceUrl ? (
                      <Link
                        target="_blank"
                        title="View"
                        href={participant.performanceUrl}
                        className="text-left text-xs font-medium underline text-gray-600 flex items-center  hover:text-blue-500"
                      >
                        <SquareArrowOutUpRight size={15} />
                        <span className="ml-1">View URL</span>
                      </Link>
                    ) : (
                      <p className="text-left text-xs font-medium text-gray-400">
                        N/A
                      </p>
                    )}

                    <span className="  text-xs col-span-2 text-gray-700">
                      {participant?.description || "N/A"}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HcaCircuitSeriesTournamenWinners;
