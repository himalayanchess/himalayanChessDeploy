import React, { useEffect, useState } from "react";
import Link from "next/link";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BatchStudentList = ({ studentList, batchId }: any) => {
  const [loaded, setloaded] = useState(false);
  const session = useSession();

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="overflow-x-auto mt-4 border rounded-md">
      <div className="grid grid-cols-[60px,repeat(5,1fr)] text-sm bg-gray-200 font-bold">
        <span className="py-2  border-b text-center">SN</span>
        <span className="py-2  border-b text-left">Name</span>
        <span className="py-2  border-b text-left">DOB</span>
        <span className="py-2  border-b text-left">Gender</span>
        <span className="py-2  border-b text-left">Start Date</span>
        <span className="py-2  border-b text-left">End Date</span>
      </div>

      {/* no students */}
      {studentList?.length == 0 ? (
        <p className="w-full py-4 flex items-center justify-center">
          <BrowserNotSupportedIcon />
          <span className="ml-2">No students found</span>
        </p>
      ) : (
        studentList?.map((student: any, index: number) => (
          <div
            key={"record" + student?._id}
            className="grid grid-cols-[60px,repeat(5,1fr)] text-sm"
          >
            <span className="py-2 text-center border-b break-words">
              {index + 1}
            </span>
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                student?._id
              }`}
              // target="_blank"
              className="py-2  border-b break-words transition-all ease duration-150 hover:underline hover:text-blue-500"
            >
              {student?.name}
            </Link>
            <span className="py-2  border-b break-words">
              {student?.dob
                ? dayjs(student?.dob).tz(timeZone).format("YYYY-MM-D")
                : "N/A"}
            </span>
            <span className="py-2  border-b break-words">
              {student?.gender || "N/A"}
            </span>
            <span className="py-2  border-b break-words">
              {student?.batches?.find(
                (batch: any) => batch?.batchId === batchId
              )?.startDate
                ? dayjs(
                    student?.batches.find(
                      (batch: any) => batch?.batchId === batchId
                    ).startDate
                  )
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </span>{" "}
            <span className="py-2  border-b break-words">
              {student?.batches?.find(
                (batch: any) => batch?.batchId === batchId
              )?.endDate
                ? dayjs(
                    student?.batches.find(
                      (batch: any) => batch?.batchId === batchId
                    ).endDate
                  )
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default BatchStudentList;
