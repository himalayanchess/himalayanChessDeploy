import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import DownloadIcon from "@mui/icons-material/Download";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import {
  Mail,
  CircleArrowRight,
  Book,
  BookCopy,
  MapPinHouse,
  SquareCode,
  Earth,
  Star,
  MapPin,
  CircleUser,
  Phone,
  Edit,
} from "lucide-react";

import Link from "next/link";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewBranch = ({ branchRecord }: any) => {
  // console.log(branchRecord);
  const session = useSession();
  const [loaded, setLoaded] = useState(false);

  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY, dddd");
  };

  useEffect(() => {
    if (branchRecord) {
      setLoaded(true);
    }
  }, [branchRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <MapPinHouse />
          <span className="ml-2 mr-3">Branch Details</span>
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/branches/updatebranch/${
              branchRecord?._id
            }`}
            className="mr-3"
          >
            <Button variant="text" size="small">
              <Edit />
              <span className="ml-1">Edit</span>
            </Button>
          </Link>
        </h1>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/branches`}>
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="grid grid-cols-2 auto-rows-max w-full gap-4">
        {/* Basic Branch Information */}
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
          <h1 className="text-sm font-bold text-gray-500">
            Contact Information
          </h1>
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
      </div>
    </div>
  );
};

export default ViewBranch;
