import {
  CircleUser,
  Earth,
  Mail,
  MapPin,
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

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const BasicBranchInfo = ({ branchRecord }: any) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };
  return (
    <div className=" grid grid-cols-2 auto-rows-max w-full gap-4">
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="">
          <p className="text-sm text-gray-500">Branch Name</p>
          <div className="flex items-center">
            {/* <School className="text-gray-500" /> */}
            <p className="font-bold text-2xl ml-1 ">
              {branchRecord?.branchName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Branch Code</p>
            <p className="font-medium text-md flex items-center">
              <SquareCode className="text-gray-500" />
              <span className="ml-1">{branchRecord?.branchCode}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Established Date</p>
            <p className="font-medium text-md flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(branchRecord?.establishedDate)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* address info */}
      <div className="bg-gray-50 rounded-xl  p-4 ">
        <div className="grid grid-cols-2 mt-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-medium text-md flex items-center">
              <Earth className="text-gray-500" />
              <span className="ml-1">{branchRecord?.country} </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Main Branch</p>
            <p className="font-medium text-md flex items-center">
              <Star className="text-gray-500" />
              <span className="ml-1">
                {branchRecord?.isMainBranch ? "Yes" : "No"}
              </span>
            </p>
          </div>
          {/* address */}
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-md flex items-center">
              <MapPin className="text-gray-500" />
              <span className="ml-1">{branchRecord?.address} </span>
            </p>
          </div>
        </div>
      </div>

      {/* Duration status info */}
      <div className="bg-gray-50 rounded-xl  col-span-2 p-4 ">
        <h1 className="text-sm font-bold text-gray-500">Contact Information</h1>
        <div className="grid grid-cols-3 mt-2 gap-2">
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-md flex items-center">
              <CircleUser className="text-gray-500" />
              <span className="ml-1">
                {branchRecord?.contactName || "N/A"}{" "}
              </span>
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-md flex items-center">
              <Phone className="text-gray-500" />
              <span className="ml-1">
                {branchRecord?.contactPhone || "N/A"}{" "}
              </span>
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-md flex items-center">
              <Mail className="text-gray-500" />
              <span className="ml-1">
                {branchRecord?.contactEmail || "N/A"}{" "}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* maplocation */}
      <div className="maplocation col-span-2">
        <h1 className="text-sm font-bold text-gray-500 mb-2">Map Location</h1>
        {branchRecord?.mapLocation ? (
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
              src={branchRecord.mapLocation}
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

export default BasicBranchInfo;
