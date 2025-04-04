import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { Button } from "@mui/material";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const BasicProjectInformation = ({ projectRecord }: any) => {
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    if (projectRecord) {
      setloaded(true);
    }
  }, [projectRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="grid grid-cols-3 gap-4 overflow-y-auto">
      {/* Basic Project Information */}
      <div>
        <p className="font-bold text-xs text-gray-500">Project Name:</p>
        <p>{projectRecord?.name || "N/A"}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Contract Type:</p>
        <p>{projectRecord?.contractType || "N/A"}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Status:</p>
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
      <div>
        <p className="font-bold text-xs text-gray-500">Start Date:</p>
        <p>
          {projectRecord?.startDate
            ? dayjs(projectRecord.startDate).tz(timeZone).format("MMMM D, YYYY")
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">End Date:</p>
        <p>
          {projectRecord?.endDate
            ? dayjs(projectRecord.endDate).tz(timeZone).format("MMMM D, YYYY")
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Duration (weeks):</p>
        <p>{projectRecord?.duration || "N/A"}</p>
      </div>

      {/* Location Information */}
      <div className="">
        <p className="font-bold text-xs text-gray-500">Address:</p>
        <p>{projectRecord?.address || "N/A"}</p>
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Contract drive link:</p>
        {projectRecord?.contractDriveLink ? (
          <>
            <Link href={projectRecord?.contractDriveLink || ""} target="_blank">
              <Button variant="contained" color="info" size="small">
                View file
              </Button>
            </Link>
          </>
        ) : (
          <p>N/A</p>
        )}
      </div>
      <div>
        <p className="font-bold text-xs text-gray-500">Contract File Link:</p>
        {projectRecord?.contractPaper ? (
          <Link href={projectRecord?.contractPaper || ""} target="_blank">
            <Button variant="contained" color="info" size="small">
              View file
            </Button>
          </Link>
        ) : (
          <p>N/A</p>
        )}
      </div>

      {/* Primary Contact Information */}
      <div className="col-span-3 mt-4">
        <h3 className="font-bold text-sm text-gray-700 mb-2">
          Primary Contact
        </h3>
        <div className="grid grid-cols-3 gap-4 ">
          <div>
            <p className="font-bold text-xs text-gray-500">Name:</p>
            <p>{projectRecord?.primaryContact?.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Phone:</p>
            <p>{projectRecord?.primaryContact?.phone || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Email:</p>
            <p>{projectRecord?.primaryContact?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* map Location */}
      <div className="col-span-3">
        <h3 className="font-bold text-sm text-gray-700 mb-2">Map location</h3>
        {projectRecord?.mapLocation ? (
          <iframe
            src={projectRecord?.mapLocation}
            className="w-full"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <p>N/A</p>
        )}
      </div>
    </div>
  );
};

export default BasicProjectInformation;
