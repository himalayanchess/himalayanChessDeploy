import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { Button } from "@mui/material";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  TimerReset,
  Component,
  School,
  Crown,
  BookOpenText,
  CalendarArrowUp,
  CalendarArrowDown,
} from "lucide-react";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const BasicProjectInformation = ({ projectRecord }: any) => {
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [loaded, setloaded] = useState(false);
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };

  useEffect(() => {
    if (projectRecord) {
      setloaded(true);
    }
  }, [projectRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
      {/* Basic Project Information */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">Project Name</p>
          <div className="flex items-center">
            <School className="text-gray-500" />
            <p className="font-bold text-2xl ml-1 ">{projectRecord?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(projectRecord?.startDate)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {projectRecord?.endDate
                  ? formatDate(projectRecord.endDate)
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Duration status info */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium text-md flex items-center">
              <TimerReset className="text-gray-500" />
              <span className="ml-1">{projectRecord?.duration} weeks</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                projectRecord?.completedStatus === "Ongoing"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
            >
              {projectRecord?.completedStatus || "N/A"}
            </p>
          </div>
          {/* address */}
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-md flex items-center">
              <LocationOnIcon className="text-gray-500" />
              <span className="ml-1">{projectRecord?.address} </span>
            </p>
          </div>
        </div>
      </div>

      {/* Duration status info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">
          Contract Information
        </h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Contract Type</p>
            <p className="font-medium text-md flex items-center">
              {/* <TimerReset className="text-gray-500" /> */}
              <span className="ml-1">{projectRecord?.contractType} </span>
            </p>
          </div>

          {/* contract drive link */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Contract Drive Link</p>
            <p className="font-medium text-md flex items-center">
              <OpenInNewIcon className="text-gray-500" />
              {projectRecord?.contractDriveLink ? (
                <Link
                  href={projectRecord.contractDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline text-blue-600 hover:text-blue-800"
                >
                  {projectRecord.contractDriveLink}
                </Link>
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>

          {/* contract file */}
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Contract Drive Link</p>
            <p className="font-medium text-md flex items-center">
              <DescriptionOutlinedIcon className="text-gray-500" />
              {projectRecord?.contractPaper ? (
                <Link
                  href={projectRecord.contractPaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline  hover:text-blue-500"
                >
                  Contract File
                </Link>
              ) : (
                <span className="ml-1">N/A</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Contact info */}
      <div className="bg-gray-50 rounded-xl col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">
          Primary Contact Information
        </h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          {/* full name */}
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-md flex items-center">
              <PersonOutlineOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {projectRecord?.primaryContact?.name || "N/A"}
              </span>
            </p>
          </div>

          {/* phone */}
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-md flex items-center">
              <LocalPhoneOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {projectRecord?.primaryContact?.phone || "N/A"}
              </span>
            </p>
          </div>

          {/* email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-md flex items-center">
              <EmailOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {projectRecord?.primaryContact?.phone || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* map Location */}
      <div className="col-span-2">
        <h3 className="font-bold text-sm text-gray-700 mb-2">Map location</h3>
        {projectRecord?.mapLocation ? (
          <div className="relative">
            {/* Loading overlay */}
            <div
              className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${
                isMapLoaded ? "hidden" : "block"
              }`}
            >
              <div className="animate-pulse flex flex-col items-center">
                <CircularProgress />
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>

            {/* Map iframe */}
            <iframe
              src={projectRecord.mapLocation}
              className="w-full"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              style={{ visibility: isMapLoaded ? "visible" : "hidden" }}
            ></iframe>
          </div>
        ) : (
          <p>N/A</p>
        )}
      </div>
    </div>
  );
};

export default BasicProjectInformation;
