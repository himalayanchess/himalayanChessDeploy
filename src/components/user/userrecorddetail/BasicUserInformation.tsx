import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicUserInformation = ({ userRecord }: any) => {
  return (
    <div className="flex-1 mt-3  mr-7 grid grid-cols-3 gap-5 overflow-y-auto h-max">
      <div>
        <p className="font-bold text-xs text-gray-500">Name:</p>
        <p>{userRecord?.name}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Email:</p>
        <p>{userRecord?.email}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Phone:</p>
        <p>{userRecord?.phone}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Gender:</p>
        <p>{userRecord?.gender}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Address:</p>
        <p>{userRecord?.address}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Date of Birth:</p>
        <p>{dayjs(userRecord?.dob).tz(timeZone).format("MMMM D, YYYY")}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Joined Date:</p>
        <p>
          {userRecord?.joinedDate
            ? dayjs(userRecord?.joinedDate).tz(timeZone).format("MMMM D, YYYY")
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">End Date:</p>
        <p>
          {userRecord?.endDate
            ? dayjs(userRecord?.endDate).tz(timeZone).format("MMMM D, YYYY")
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Role:</p>
        <p>{userRecord?.role}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Emergency Contact:</p>
        <p>{userRecord?.emergencyContactName}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Emergency Contact no:</p>
        <p>{userRecord?.emergencyContactNo}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Title:</p>
        <p>{userRecord?.title || "N/A"}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">FIDE ID:</p>
        <p>{userRecord?.fideId || "N/A"}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Rating:</p>
        <p>{userRecord?.rating}</p>
      </div>
      {/* cv if trainer */}
      {userRecord?.role?.toLowerCase() == "trainer" && (
        <div>
          <p className="font-bold text-xs text-gray-500">Trainers CV:</p>
          <Link href={userRecord?.trainerCvUrl} target="_blank" title="View CV">
            <Button variant="outlined">View CV</Button>
          </Link>
        </div>
      )}
      {/* active status */}
      <div>
        <p className="font-bold text-xs text-gray-500">Active Status:</p>
        <p
          className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
            userRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {userRecord?.activeStatus ? "Active" : "Inactive"}
        </p>
      </div>
    </div>
  );
};

export default BasicUserInformation;
