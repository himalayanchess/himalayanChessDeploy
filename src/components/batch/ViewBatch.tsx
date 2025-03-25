import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewBatch = ({ batchRecord }: any) => {
  console.log(batchRecord);

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold">Batch Details</h1>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="space-y-4 h-full mt-4 flex flex-col overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {/* Basic Batch Information */}
          <div>
            <p className="font-bold text-xs text-gray-500">Batch Name:</p>
            <p>{batchRecord?.batchName || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Affiliated To:</p>
            <p>{batchRecord?.affiliatedTo || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                batchRecord?.completedStatus === "Ongoing"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
            >
              {batchRecord?.completedStatus || "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Start Date:</p>
            <p>
              {batchRecord?.batchStartDate
                ? dayjs(batchRecord.batchStartDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">End Date:</p>
            <p>
              {batchRecord?.batchEndDate
                ? dayjs(batchRecord.batchEndDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Active Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                batchRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {batchRecord?.activeStatus ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Project Information */}
          <div className="col-span-3 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Associated Project
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-bold text-xs text-gray-500">Project ID:</p>
                <p>{batchRecord?.projectId || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Project Name:</p>
                <p>{batchRecord?.projectName || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="col-span-3 mt-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-bold text-xs text-gray-500">Created At:</p>
                <p>
                  {batchRecord?.createdAt
                    ? dayjs(batchRecord.createdAt)
                        .tz(timeZone)
                        .format("MMMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Updated At:</p>
                <p>
                  {batchRecord?.updatedAt
                    ? dayjs(batchRecord.updatedAt)
                        .tz(timeZone)
                        .format("MMMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBatch;
