import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BranchBatchList = ({ batchList }: any) => {
  const session = useSession();
  return (
    <div className="overflow-y-auto mt-3 h-max  border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(7,1fr)] gap-1 w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Batch Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Total no. of Classes
        </span>
        <span className="py-3 text-left text-sm  font-bold text-gray-600">
          Total Classes Taken
        </span>

        <span className="py-3 text-left text-sm col-span-2 font-bold text-gray-600">
          Current Course
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Start Date
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          End Date
        </span>
      </div>

      {/* batch List */}
      {batchList?.length == 0 ? (
        <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No records found</p>
        </div>
      ) : (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 ">
          {batchList.map((batch: any, index: any) => {
            const serialNumber = index + 1;
            return (
              <div
                key={batch?._id}
                className="grid grid-cols-[50px,repeat(7,1fr)] gap-1 py-3 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="text-sm text-center font-medium text-gray-600">
                  {serialNumber}
                </span>
                {/* batchname */}
                <Link
                  title="View"
                  href={`/${session?.data?.user?.role?.toLowerCase()}/batches/${
                    batch?._id
                  }`}
                  className="text-left text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                >
                  {batch?.batchName}
                </Link>
                {/* totalNoOfClasses */}
                <span className=" text-sm text-gray-700">
                  {batch?.totalNoOfClasses || "N/A"}
                </span>
                {/* totalClassesTaken */}
                <span className="text-sm text-gray-700">
                  {batch.totalClassesTaken || "N/A"}
                </span>
                {/* currentCourseName */}
                <span className=" col-span-2 text-sm text-gray-700">
                  {batch.currentCourseName || "N/A"}
                </span>

                {/* startDate */}
                <span className="text-sm text-gray-700">
                  {batch.batchStartDate
                    ? dayjs
                        .utc(batch.batchStartDate)
                        .tz(timeZone)
                        .format("DD MMM, YYYY")
                    : "N/A"}
                </span>
                {/* end Date */}
                <span className="text-sm text-gray-700">
                  {batch.batchEndDate
                    ? dayjs
                        .utc(batch.batchEndDate)
                        .tz(timeZone)
                        .format("DD MMM, YYYY")
                    : "N/A"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BranchBatchList;
