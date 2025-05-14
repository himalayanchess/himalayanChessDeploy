import React, { useEffect, useState } from "react";
import { CircleUser, Users } from "lucide-react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CircularProgress from "@mui/material/CircularProgress";

import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBatches,
  fetchAllProjects,
  getAllBranches,
} from "@/redux/allListSlice";
import Dropdown from "../Dropdown";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  setstudentAttendanceStatCount,
  setStudentsAttendanceUpdatedByData,
} from "@/redux/attendanceSlice";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const StudentsAttendanceList = () => {
  const affiliatedToOptions = ["All", "HCA", "School"];
  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();
  //   selector
  const { studentsAttendanceSelectedDay } = useSelector(
    (state: any) => state.attendanceReducer
  );
  const { allActiveBatches, allActiveBranchesList, allActiveProjects } =
    useSelector((state: any) => state.allListReducer);

  const [studentAttendanceRecordsLoading, setstudentAttendanceRecordsLoading] =
    useState(false);

  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedBatch, setselectedBatch] = useState("None");
  const [selectedProject, setselectedProject] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  const [
    filteredStudentAttendanceRecords,
    setfilteredStudentAttendanceRecords,
  ] = useState<any>(null);
  // batchlist
  const [filteredBatches, setfilteredBatches] = useState([]);

  // function getStudentsAttendanceRecords
  async function getStudentsAttendanceRecords() {
    setstudentAttendanceRecordsLoading(true);
    const { data: resData } = await axios.post(
      "/api/attendance/getStudentsAttendance",
      {
        selectedDay: studentsAttendanceSelectedDay,
        selectedBatch,
      }
    );

    if (resData?.statusCode === 200) {
      const studentRecords =
        resData?.studentsAttendanceRecord?.studentRecords || [];

      // Count present, absent, and total
      const statusCount = studentRecords.reduce(
        (acc: any, curr: { attendance: string }) => {
          acc[curr.attendance] = (acc[curr.attendance] || 0) + 1;
          acc.total += 1;
          return acc;
        },
        { present: 0, absent: 0, total: 0 }
      );

      const updatedByData = {
        userName: resData?.studentsAttendanceRecord?.trainerName,
        userRole: resData?.studentsAttendanceRecord?.trainerRole,
        updatedAt: resData?.studentsAttendanceRecord?.updatedAt,
      };

      dispatch(setStudentsAttendanceUpdatedByData(updatedByData));
      setfilteredStudentAttendanceRecords(studentRecords);
      dispatch(setstudentAttendanceStatCount(statusCount));
    } else {
      setfilteredStudentAttendanceRecords([]);
      dispatch(
        setstudentAttendanceStatCount({ present: 0, absent: 0, total: 0 })
      );
    }

    setstudentAttendanceRecordsLoading(false);
  }

  // if affiliated to changes then reset project dropdown
  useEffect(() => {
    // Check if the user is a superadmin or global admin
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // Only reset if it's a superadmin or global admin
    if (isSuperOrGlobalAdmin) {
      setselectedProject("All");
      setselectedBranch("All");
      setselectedBatch("None");
    }
  }, [selectedAffiliatedTo, session?.data?.user]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    let branchName = "All";
    let affiliatedTo = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
      affiliatedTo = "HCA";
    }
    setselectedBranch(branchName);
    setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  //   filter batch
  useEffect(() => {
    // filter batches
    let tempFilteredBatches =
      selectedAffiliatedTo.toLowerCase() == "all"
        ? allActiveBatches
        : allActiveBatches?.filter(
            (batch: any) =>
              batch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // filter by branch
    tempFilteredBatches =
      selectedBranch.toLowerCase() == "all"
        ? tempFilteredBatches
        : tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
          );

    // filter by project
    tempFilteredBatches =
      selectedProject.toLowerCase() == "all"
        ? tempFilteredBatches
        : tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.projectName?.toLowerCase() ==
              selectedProject?.toLowerCase()
          );

    //sort
    tempFilteredBatches = tempFilteredBatches
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // update states
    setfilteredBatches(tempFilteredBatches);
    // update redux state
    // dispatch(filterStudentsList(tempFilteredStudentsList));
  }, [allActiveBatches, selectedProject, selectedBranch, selectedAffiliatedTo]);

  // fetch attendance record filtering batch and date in databse
  useEffect(() => {
    if (
      studentsAttendanceSelectedDay &&
      selectedBatch &&
      selectedBatch.toLowerCase() !== "none"
    ) {
      getStudentsAttendanceRecords();
    } else {
      setfilteredStudentAttendanceRecords([]);
    }
  }, [studentsAttendanceSelectedDay, selectedBatch]);

  // intial data fetching
  useEffect(() => {
    dispatch(fetchAllBatches());
    dispatch(getAllBranches());
    dispatch(fetchAllProjects());
  }, []);

  return (
    <div className="flex flex-col h-full bg-white p-5 rounded-md shadow-md">
      {/* header */}
      <div className="header flex justify-between items-center">
        {/* title */}
        <p className="text-2xl flex items-center">
          <Users />
          <span className="ml-2">Students Attendance</span>
        </p>

        {/* right side */}
        <div className="flex items-center text-xl mt-2">
          {!studentsAttendanceSelectedDay ? (
            <span className="text-gray-500 text-sm">No record found</span>
          ) : (
            <>
              <span>
                {dayjs(studentsAttendanceSelectedDay)
                  .tz(timeZone)
                  .startOf("day")
                  .format("MMMM D, YYYY - dddd")}
              </span>
              <span className="ml-4">
                #Week{dayjs().tz(timeZone).startOf("day").week()}
              </span>
            </>
          )}
        </div>
      </div>
      {/* dropdowns */}
      <div className="student-header my-0 flex items-end justify-between">
        {/* dropdown */}
        <div className="dropdown w-full grid grid-cols-4 gap-4 items-end">
          <Dropdown
            label="Affiliated to"
            options={affiliatedToOptions}
            selected={selectedAffiliatedTo}
            onChange={setselectedAffiliatedTo}
            width="full"
            disabled={!isSuperOrGlobalAdmin}
          />

          {isSuperOrGlobalAdmin && (
            <Dropdown
              label="School"
              options={[
                "All",
                ...(allActiveProjects?.map((project: any) => project.name) ||
                  []),
              ]}
              selected={selectedProject}
              onChange={setselectedProject}
              width="full"
              disabled={
                selectedAffiliatedTo?.toLowerCase() != "school" ||
                !isSuperOrGlobalAdmin
              }
            />
          )}
          <Dropdown
            label="Branch"
            options={[
              "All",
              ...(allActiveBranchesList?.map(
                (branch: any) => branch.branchName
              ) || []),
            ]}
            selected={selectedBranch}
            onChange={setselectedBranch}
            disabled={
              selectedAffiliatedTo?.toLowerCase() != "hca" ||
              !isSuperOrGlobalAdmin
            }
            width="full"
          />
          <Dropdown
            label="Batch name"
            options={[
              "None",
              ...filteredBatches?.map((batch: any) => batch?.batchName),
            ]}
            selected={selectedBatch}
            onChange={setselectedBatch}
            width="full"
          />
        </div>
      </div>

      {/* student attendance list */}
      <div className="attendanceTable mt-2 rounded-md border h-full flex-1 overflow-y-auto">
        {/* Header */}
        <div className="py-2  grid grid-cols-[70px,repeat(3,1fr)] bg-gray-100 ">
          <span className="font-bold text-center text-sm">SN</span>
          <span className="font-bold text-sm">Name</span>
          <span className="font-bold text-sm">Completed Status</span>
          <span className="font-bold text-center  text-sm">Attendance</span>
        </div>

        {/* attendance data */}
        {/* attendance data */}
        <div className="mt-2">
          {studentAttendanceRecordsLoading ? (
            <div className="p-4 text-center text-gray-500 text-md flex items-center flex-col justify-center">
              <CircularProgress />
              <span>Loading attendance records...</span>
            </div>
          ) : !studentsAttendanceSelectedDay ||
            !selectedBatch ||
            !filteredStudentAttendanceRecords ||
            selectedBatch.toLowerCase() === "none" ? (
            <div className="p-4 text-center text-gray-500 text-md flex items-center justify-center">
              <BrowserNotSupportedIcon />
              <span className="ml-2">
                Please select a batch to view attendance records
              </span>
            </div>
          ) : filteredStudentAttendanceRecords?.length > 0 ? (
            filteredStudentAttendanceRecords?.map(
              (record: any, index: number) => (
                <div
                  key={record.id || index}
                  className="py-3 border-b grid grid-cols-[70px,repeat(3,1fr)] items-center transition-all ease duration-150 hover:bg-gray-100"
                >
                  <p className="text-center text-sm">{index + 1}</p>
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                      record._id
                    }`}
                    target="_blank"
                    className="text-left text-sm  underline hover:text-blue-500"
                  >
                    {record.name}
                  </Link>
                  <p className="text-left text-sm flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${
                        record.completedStatus ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {record.completedStatus ? "Completed" : "Incomplete"}
                  </p>
                  <p className=" text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-bold ${
                        record.attendance === "present"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    >
                      {record.attendance === "present" ? "Present" : "Absent"}
                    </span>
                  </p>
                </div>
              )
            )
          ) : (
            <div className="p-4 text-center text-gray-500 text-md flex items-center justify-center">
              <BrowserNotSupportedIcon />
              <span className="ml-2">
                No attendance records found for the selected batch
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendanceList;
