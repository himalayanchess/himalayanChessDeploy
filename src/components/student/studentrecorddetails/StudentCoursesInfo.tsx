import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";

dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const StudentCoursesInfo = ({ studentRecord }: any) => {
  const session = useSession();

  const [loaded, setloaded] = useState(false);
  const [studentEnrolledCourses, setstudentEnrolledCourses] = useState([]);
  const [selectedEnrolledCourseStatus, setselectedEnrolledCourseStatus] =
    useState("All");
  // fitler student batches
  // fitler student enrolled courses
  useEffect(() => {
    if (studentRecord?.enrolledCourses) {
      // only active enrolled courses (not deleted)
      let tempStudentEnrolledCourses = studentRecord?.enrolledCourses?.filter(
        (course: any) => course?.activeStatus
      );

      if (selectedEnrolledCourseStatus?.toLowerCase() == "active") {
        tempStudentEnrolledCourses = tempStudentEnrolledCourses.filter(
          (course: any) => !course?.endDate
        );
      } else if (selectedEnrolledCourseStatus?.toLowerCase() == "completed") {
        tempStudentEnrolledCourses = tempStudentEnrolledCourses.filter(
          (course: any) => course?.endDate
        );
      }

      setstudentEnrolledCourses(tempStudentEnrolledCourses);
    }
  }, [studentRecord, selectedEnrolledCourseStatus]);

  useEffect(() => {
    if (studentRecord) {
      setloaded(true);
    }
  }, [studentRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="flex-1  overflow-y-auto h-max">
      <h2 className="text-md font-bold text-gray-500 mb-1">Enrolled Courses</h2>
      {/* buttons */}
      <div className="buttons  flex gap-4 items-end">
        <Button
          size="small"
          variant={`${
            selectedEnrolledCourseStatus?.toLowerCase() == "all"
              ? "contained"
              : "outlined"
          }`}
          onClick={() => setselectedEnrolledCourseStatus("all")}
        >
          All
        </Button>
        <Button
          size="small"
          variant={`${
            selectedEnrolledCourseStatus?.toLowerCase() == "active"
              ? "contained"
              : "outlined"
          }`}
          onClick={() => setselectedEnrolledCourseStatus("active")}
        >
          Active
        </Button>
        <Button
          size="small"
          variant={`${
            selectedEnrolledCourseStatus?.toLowerCase() == "completed"
              ? "contained"
              : "outlined"
          }`}
          onClick={() => setselectedEnrolledCourseStatus("completed")}
        >
          Completed
        </Button>

        <span className="text-sm">
          Showing {studentEnrolledCourses?.length} of{" "}
          {studentRecord?.enrolledCourses?.length}
        </span>
      </div>

      {/* batch container */}
      <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
        {/* Table Headings */}
        <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Batch Name
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Start Date
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            End Date
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Status
          </span>
        </div>

        {/* No batch Found */}
        {studentEnrolledCourses.length === 0 && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No batches Found</p>
          </div>
        )}

        {/* batch list */}
        <div className="table-contents flex-1 grid grid-cols-1 ">
          {studentEnrolledCourses?.map((course: any, index: any) => {
            return (
              <div
                key={course?.courseId}
                className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-3 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="text-sm text-center font-medium text-gray-600">
                  {index + 1}
                </span>
                <Link
                  title="View"
                  href={`/${session?.data?.user?.role?.toLowerCase()}/courses/${
                    course?.courseId
                  }`}
                  className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                >
                  {course?.course || "N/A "}
                </Link>
                <span className="text-sm text-gray-700">
                  {course?.startDate
                    ? dayjs(course?.startDate)
                        .tz(timeZone)
                        .format("MMMM D, YYYY")
                    : "N/A"}
                </span>
                <span className="text-sm text-gray-700">
                  {course?.endDate
                    ? dayjs(course?.endDate).tz(timeZone).format("MMMM D, YYYY")
                    : "N/A"}{" "}
                </span>
                <span className="text-sm text-gray-500">
                  {course?.endDate ? "Completed" : "Ongoing"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesInfo;
