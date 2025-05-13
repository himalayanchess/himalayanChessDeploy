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
  Users,
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
const BasicHcaCircuitTournamentInfo = ({ hcaCircuitTournamentRecord }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const formatDate = (date: string) => {
    return date ? dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd") : "N/A";
  };
  return (
    <div className=" grid grid-cols-2 auto-rows-max w-full gap-4">
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">HCA Circuit Tournament Name</p>
          <div className="flex items-center">
            {/* <School className="text-gray-500" /> */}
            <p className="font-bold text-2xl ml-1 ">
              {hcaCircuitTournamentRecord?.tournamentName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(hcaCircuitTournamentRecord?.startDate)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(hcaCircuitTournamentRecord?.endDate)}
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
              {hcaCircuitTournamentRecord?.branchName &&
              hcaCircuitTournamentRecord?.branchId ? (
                isSuperOrGlobalAdmin ? (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      hcaCircuitTournamentRecord.branchId
                    }`}
                    className="ml-1 underline hover:text-blue-500"
                  >
                    {hcaCircuitTournamentRecord.branchName}
                  </Link>
                ) : (
                  <span className="ml-1">
                    {hcaCircuitTournamentRecord.branchName}
                  </span>
                )
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>
          <div className="flex justify-end items-center">
            <span
              className={` px-3 py-1 text-md font-semibold rounded-full flex items-center ${
                hcaCircuitTournamentRecord?.tag
                  ? "bg-green-100 text-green-800" // Light green background with dark green text
                  : "bg-gray-200 text-gray-800" // Light gray background with dark gray text
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
              {hcaCircuitTournamentRecord?.tag?.toLowerCase() == "hcacircuit"
                ? "HCA Circuit"
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicHcaCircuitTournamentInfo;
