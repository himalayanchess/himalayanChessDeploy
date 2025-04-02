import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import StudentAttendance from "./StudentAttendance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewStudent = ({ studentRecord }: any) => {
  const session = useSession();

  const [studentBatches, setstudentBatches] = useState([]);
  const [studentEnrolledCourses, setstudentEnrolledCourses] = useState([]);
  const [selectedBatchStatus, setselectedBatchStatus] = useState("All");
  const [selectedEnrolledCourseStatus, setselectedEnrolledCourseStatus] =
    useState("All");

  // fitler student batches
  useEffect(() => {
    if (studentRecord?.batches) {
      // only active batches (not deleted)
      let tempStudentBatches = studentRecord?.batches?.filter(
        (batch: any) => batch?.activeStatus
      );

      if (selectedBatchStatus?.toLowerCase() == "active") {
        tempStudentBatches = tempStudentBatches.filter(
          (batch: any) => !batch?.endDate
        );
      } else if (selectedBatchStatus?.toLowerCase() == "completed") {
        tempStudentBatches = tempStudentBatches.filter(
          (batch: any) => batch?.endDate
        );
      }

      setstudentBatches(tempStudentBatches);
    }
  }, [studentRecord, selectedBatchStatus]);

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

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl ">Student Detail</h1>
      </div>
      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className=" h-full flex  overflow-y-auto">
        <div className="flex-1 mt-3  mr-7 grid grid-cols-3 gap-5 overflow-y-auto h-max">
          <div>
            <p className="font-bold text-xs text-gray-500">Name:</p>
            <p>{studentRecord?.name}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Affiliated To:</p>
            <p>{studentRecord?.affiliatedTo}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Date of Birth:</p>
            <p>
              {dayjs(studentRecord?.dob).tz(timeZone).format("MMMM D, YYYY")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Gender:</p>
            <p>{studentRecord?.gender}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Joined Date:</p>
            <p>
              {studentRecord?.joinedDate
                ? dayjs(studentRecord?.joinedDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">End Date:</p>
            <p>
              {studentRecord?.endDate
                ? dayjs(studentRecord?.endDate)
                    .tz(timeZone)
                    .format("MMMM D, YYYY")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Phone:</p>
            <p>{studentRecord?.phone}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Address:</p>
            <p>{studentRecord?.address}</p>
          </div>

          {/* emergency contact */}
          <div className="emergencycontact col-span-3">
            <p className="font-bold mb-2">Emergency Details</p>
            <div className="details grid grid-cols-3">
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Emergency Contact:
                </p>
                <p>{studentRecord?.emergencyContactName}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Emergency Contact:
                </p>
                <p>{studentRecord?.emergencyContactNo}</p>
              </div>
            </div>
          </div>

          {/* chess info */}
          <div className="chessinfo col-span-3">
            <p className="font-bold mb-2">Guardian Information</p>
            <div className="details grid grid-cols-3">
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Guardian name:
                </p>
                <p>{studentRecord?.guardianInfo?.name || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Guardian phone:
                </p>
                <p>{studentRecord?.guardianInfo?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Guardian email:
                </p>
                <p>{studentRecord?.guardianInfo?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Guardian info */}
          <div className="chessinfo col-span-3">
            <p className="font-bold mb-2">Chess Information</p>
            <div className="details grid grid-cols-3">
              <div>
                <p className="font-bold text-xs text-gray-500">Title:</p>
                <p>{studentRecord?.title || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">FIDE ID:</p>
                <p>{studentRecord?.fideId || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Rating:</p>
                <p>{studentRecord?.rating}</p>
              </div>
            </div>
          </div>

          {/* cv if trainer */}
          {studentRecord?.role?.toLowerCase() == "trainer" && (
            <div>
              <p className="font-bold text-xs text-gray-500">Trainers CV:</p>
              <Link
                href={studentRecord?.trainerCvUrl}
                target="_blank"
                title="View CV"
              >
                <Button variant="outlined">View CV</Button>
              </Link>
            </div>
          )}

          {/* active status */}
          <div>
            <p className="font-bold text-xs text-gray-500">Active Status:</p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                studentRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {studentRecord?.activeStatus ? "Active" : "Inactive"}
            </p>
          </div>

          {/* Batches */}
          <div className="col-span-3">
            <p className="font-bold mb-2">Batches</p>

            {/* batches toggle button */}
            <div className="buttons mt-2 flex gap-4">
              <Button
                variant={`${
                  selectedBatchStatus?.toLowerCase() == "all"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedBatchStatus("all")}
              >
                All
              </Button>
              <Button
                variant={`${
                  selectedBatchStatus?.toLowerCase() == "active"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedBatchStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={`${
                  selectedBatchStatus?.toLowerCase() == "completed"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedBatchStatus("completed")}
              >
                Completed
              </Button>

              <span className="px-3 text-white flex items-center justify-center bg-gray-400 rounded-md">
                {studentBatches?.length} of {studentRecord?.batches?.length}
              </span>
            </div>

            {/* batchlist */}

            {studentBatches?.length === 0 ? (
              <p>No Batches</p>
            ) : (
              <div className="assignedprojects mt-2 grid grid-cols-3 gap-5">
                {studentBatches?.map((batch: any) => {
                  return (
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                        batch?.batchId
                      }`}
                      key={batch?.batchId}
                      className="trainer-project border bg-blue-50 p-3 rounded-md transition-all ease duration-150 hover:bg-blue-100"
                    >
                      <p className="text-md hover:underline hover:text-blue-600">
                        {batch?.batchName}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-bold mr-2">Start Date:</span>

                        {batch?.startDate
                          ? dayjs(batch.startDate)
                              .tz(timeZone)
                              .format("D MMMM, YYYY")
                          : "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold mr-2">End Date:</span>
                        {batch?.endDate
                          ? dayjs(batch.endDate)
                              .tz(timeZone)
                              .format("D MMMM, YYYY")
                          : "N/A"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enrolled courses */}
          <div className="col-span-3">
            <p className="font-bold mb-2">Enrolled Courses</p>

            {/* batches toggle button */}
            <div className="buttons mt-2 flex gap-4">
              <Button
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
                variant={`${
                  selectedEnrolledCourseStatus?.toLowerCase() == "completed"
                    ? "contained"
                    : "outlined"
                }`}
                onClick={() => setselectedEnrolledCourseStatus("completed")}
              >
                Completed
              </Button>

              <span className="px-3 text-white flex items-center justify-center bg-gray-400 rounded-md">
                {studentEnrolledCourses?.length} of{" "}
                {studentRecord?.enrolledCourses?.length}
              </span>
            </div>

            {/* batchlist */}

            {studentEnrolledCourses?.length === 0 ? (
              <p>No Batches</p>
            ) : (
              <div className="assignedprojects mt-2 grid grid-cols-3 gap-5">
                {studentEnrolledCourses?.map((course: any) => {
                  return (
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                        course?.courseId
                      }`}
                      key={course?.courseId}
                      className="trainer-project border bg-blue-50 p-3 rounded-md transition-all ease duration-150 hover:bg-blue-100"
                    >
                      <p className="text-md hover:underline hover:text-blue-600">
                        {course?.course}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-bold mr-2">Start Date:</span>

                        {course?.startDate
                          ? dayjs(course.startDate)
                              .tz(timeZone)
                              .format("D MMMM, YYYY")
                          : "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold mr-2">End Date:</span>
                        {course?.endDate
                          ? dayjs(course.endDate)
                              .tz(timeZone)
                              .format("D MMMM, YYYY")
                          : "N/A"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* attendance */}
        <div className="attendance-container w-[25%] mr-7 flex flex-col gap-2">
          <StudentAttendance studentRecord={studentRecord} />
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
