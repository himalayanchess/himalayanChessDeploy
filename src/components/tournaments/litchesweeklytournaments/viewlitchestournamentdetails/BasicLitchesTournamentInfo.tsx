import {
  AlarmClockPlus,
  CircleUser,
  Clock,
  Earth,
  LayoutGrid,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  SquareCode,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const BasicLitchesTournamentInfo = ({ litchesTournamentRecord }: any) => {
  const session = useSession();
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };
  return (
    <div className=" grid grid-cols-2 auto-rows-max w-full gap-4">
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">Litches Tournament Name</p>
          <div className="flex items-center">
            {/* <School className="text-gray-500" /> */}
            <p className="font-bold text-2xl ml-1 ">
              {litchesTournamentRecord?.tournamentName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Held Time</p>
            <p className="font-medium text-md flex items-center">
              <Clock className="text-gray-500" />
              <span className="ml-1">
                {litchesTournamentRecord?.time
                  ? dayjs(litchesTournamentRecord.time)
                      .tz("Asia/Kathmandu")
                      .format("h:mm A")
                  : "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(litchesTournamentRecord?.date)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* address info */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">BranchName</p>
            <p className="font-medium text-md flex items-center">
              <MapPinHouse className="text-gray-500" />
              {litchesTournamentRecord?.branchName &&
              litchesTournamentRecord?.branchId ? (
                <Link
                  href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                    litchesTournamentRecord.branchId
                  }`}
                  className="ml-1 underline hover:text-blue-500"
                >
                  {litchesTournamentRecord.branchName}
                </Link>
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>
          <div className="flex justify-end items-center">
            <span
              className={` px-3 py-1 text-md font-semibold rounded-full flex items-center ${
                litchesTournamentRecord?.tag
                  ? "bg-green-100 text-green-800" // Light green background with dark green text
                  : "bg-gray-200 text-gray-800" // Light gray background with dark gray text
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
              {litchesTournamentRecord?.tag || "N/A"}
            </span>
          </div>
          {/* week */}
          <div className="">
            <p className="text-sm text-gray-500">Week Number</p>
            <p className="text-gray-500 text-md flex items-center text-lg font-bold">
              <span className="ml-1">
                #{litchesTournamentRecord?.weekNo || "N/A"}{" "}
              </span>
            </p>
          </div>
          {/* week */}
          <div className="">
            <p className="text-sm text-gray-500">Year</p>
            <p className="text-gray-500 text-md flex items-center text-lg font-bold">
              <span className="ml-1">
                {litchesTournamentRecord?.year || "N/A"}{" "}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Duration status info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">
          Tournament Information
        </h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Tournament type</p>
            <p
              className="font-bold text-gray-500 text-md flex items-center"
              text-lg
            >
              <LayoutGrid className="text-gray-500" />
              <span className="ml-1">
                {litchesTournamentRecord?.tournamentType || "N/A"}{" "}
              </span>
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Inital Time (minutes)</p>
            <p className="font-bold text-gray-500 text-md flex items-center text-lg ">
              <Clock className="text-gray-500" />
              <span className="ml-1">
                <span>
                  {litchesTournamentRecord?.clockTime?.initialTime
                    ? `${litchesTournamentRecord.clockTime.initialTime} mins`
                    : "N/A"}
                </span>{" "}
              </span>
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Increment (seconds)</p>
            <p className="font-bold text-gray-500 text-md flex items-center text-lg ">
              <AlarmClockPlus className="text-gray-500" />
              <span className="ml-1">
                <span>
                  {litchesTournamentRecord?.clockTime?.increment
                    ? `${litchesTournamentRecord.clockTime.increment} sec`
                    : "N/A"}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicLitchesTournamentInfo;
