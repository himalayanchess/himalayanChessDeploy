import {
  AlarmClockPlus,
  CircleUser,
  Clock,
  Earth,
  GitFork,
  LayoutGrid,
  Mail,
  MapPin,
  MapPinHouse,
  Phone,
  Replace,
  SquareArrowOutUpRight,
  SquareCode,
  Star,
  User,
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
const BasicTournamentOrganizedByHcaInfo = ({
  tournamentOrganizedByHcaRecord,
}: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, ddd");
  };
  return (
    <div className=" grid grid-cols-2 auto-rows-max w-full gap-4">
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">
            Tournament Organized By HCA Name
          </p>
          <div className="flex items-center">
            {/* <School className="text-gray-500" /> */}
            <p className="font-bold text-2xl ml-1 ">
              {tournamentOrganizedByHcaRecord?.tournamentName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.startDate
                  ? formatDate(tournamentOrganizedByHcaRecord.startDate)
                  : "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.endDate
                  ? formatDate(tournamentOrganizedByHcaRecord.endDate)
                  : "N/A"}{" "}
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
              {tournamentOrganizedByHcaRecord?.branchName &&
              tournamentOrganizedByHcaRecord?.branchId ? (
                isSuperOrGlobalAdmin ? (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      tournamentOrganizedByHcaRecord.branchId
                    }`}
                    className="ml-1 underline hover:text-blue-500"
                  >
                    {tournamentOrganizedByHcaRecord.branchName}
                  </Link>
                ) : (
                  <span className="ml-1">
                    {tournamentOrganizedByHcaRecord.branchName}
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
                tournamentOrganizedByHcaRecord?.tag
                  ? "bg-green-100 text-green-800" // Light green background with dark green text
                  : "bg-gray-200 text-gray-800" // Light gray background with dark gray text
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
              {tournamentOrganizedByHcaRecord?.tag?.toLowerCase() ==
              "tournamentsorganizedbyhca"
                ? "Organized by HCA"
                : "N/A"}
            </span>
          </div>
          {/* week */}
          <div className="">
            <p className="text-sm text-gray-500">Tournament URL</p>
            <p className="text-gray-500 text-md flex items-center text-md font-medium">
              {tournamentOrganizedByHcaRecord?.tournamenturl ? (
                <div className="flex items-center">
                  <SquareArrowOutUpRight size={18} />
                  <Link
                    href={tournamentOrganizedByHcaRecord.tournamenturl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 underline text-blue-600 hover:text-blue-800"
                  >
                    View Link
                  </Link>
                </div>
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Rated info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">Rated Information</h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          {/* is rated */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Is it rated tournament?</p>
            <p className="font-bold text-gray-500 text-md flex items-center">
              <Star className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.isRated ? "Yes" : "No"}
              </span>
            </p>
          </div>

          {/* fide url */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">FIDE URL</p>
            <p className="font-medium text-gray-500 text-md flex items-center">
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.fideUrl ? (
                  <Link
                    href={tournamentOrganizedByHcaRecord.fideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" underline flex items-center hover:text-blue-500"
                  >
                    <SquareArrowOutUpRight size={17} />
                    <span className="ml-1">View Link</span>
                  </Link>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </div>

          {/* chess results url */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Chess Results URL</p>
            <p className="font-medium text-gray-500 text-md flex items-center">
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.chessResultsUrl ? (
                  <Link
                    href={tournamentOrganizedByHcaRecord.chessResultsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" underline flex items-center hover:text-blue-500"
                  >
                    <SquareArrowOutUpRight size={17} />
                    <span className="ml-1">View Link</span>
                  </Link>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Chief Arbiter info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">
          Chief Arbiter Information
        </h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          {/* chief arbiter name */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Chief Arbiter Name</p>
            <p className="font-bold text-gray-500 text-md flex items-center">
              <User className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.chiefArbiter
                  ?.chiefArbiterName || "N/A"}{" "}
              </span>
            </p>
          </div>

          {/* chief arbiter phone */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Chief Arbiter Phone</p>
            <p className="font-bold text-gray-500 text-md flex items-center">
              <Phone className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.chiefArbiter
                  ?.chiefArbiterPhone || "N/A"}{" "}
              </span>
            </p>
          </div>

          {/* chief arbiter email */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Chief Arbiter Email</p>
            <p className="font-bold text-gray-500 text-md flex items-center">
              <Mail className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.chiefArbiter
                  ?.chiefArbiterEmail || "N/A"}{" "}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tournament info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">
          Tournament Information
        </h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Tournament type</p>
            <p className="font-bold text-gray-500 text-md flex items-center">
              <LayoutGrid className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.tournamentType || "N/A"}{" "}
              </span>
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Inital Time (minutes)</p>
            <p className="font-bold text-gray-500 text-md flex items-center text-lg ">
              <Clock className="text-gray-500" />
              <span className="ml-1">
                <span>
                  {tournamentOrganizedByHcaRecord?.clockTime?.initialTime
                    ? `${tournamentOrganizedByHcaRecord.clockTime.initialTime} mins`
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
                  {tournamentOrganizedByHcaRecord?.clockTime?.increment
                    ? `${tournamentOrganizedByHcaRecord.clockTime.increment} sec`
                    : "N/A"}
                </span>
              </span>
            </p>
          </div>
          {/* total participants */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Total Participants</p>
            <p className="font-bold text-gray-500 text-md flex items-center text-lg ">
              <Users className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.totalParticipants || 0}
              </span>
            </p>
          </div>

          {/* total rounds */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Total Rounds</p>
            <p className="font-bold text-gray-500 text-md flex items-center text-lg ">
              <GitFork className="text-gray-500" />
              <span className="ml-1">
                {tournamentOrganizedByHcaRecord?.totalRounds || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicTournamentOrganizedByHcaInfo;
