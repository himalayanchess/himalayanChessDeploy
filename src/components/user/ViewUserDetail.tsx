import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewUserDetail = ({ userRecord }: any) => {
  console.log(userRecord);

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7 ">
      <div className="header flex items-end justify-between  ">
        <h1 className="text-2xl font-bold">Activity Record Detail</h1>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="space-y-4 h-full mt-4 flex flex-col  overflow-y-auto">
        <div className="grid grid-cols-3 gap-5 overflow-y-auto">
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
              {dayjs(userRecord?.joinedDate)
                .tz(timeZone)
                .format("MMMM D, YYYY")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Role:</p>
            <p>{userRecord?.role}</p>
          </div>
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
          <div>
            <p className="font-bold text-xs text-gray-500">
              Emergency Contact:
            </p>
            <p>{userRecord?.emergencyContactName}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">FIDE ID:</p>
            <p>{userRecord?.fideId || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Gender:</p>
            <p>{userRecord?.gender}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Rating:</p>
            <p>{userRecord?.rating}</p>
          </div>
          {/* cv if trainer */}
          {userRecord?.role?.toLowerCase() == "trainer" && (
            <div>
              <p className="font-bold text-xs text-gray-500">Trainers CV:</p>
              <Link href={userRecord?.trainerCvUrl} target="_blank">
                <Button variant="contained">View CV</Button>
              </Link>
            </div>
          )}
          add required fields and stat analysis
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetail;
