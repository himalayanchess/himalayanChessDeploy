import {
  AlignEndHorizontal,
  ArrowLeft,
  ArrowRight,
  Book,
  BookOpenCheck,
  Cake,
  CalendarClock,
  CalendarDays,
  CaptionsOff,
  ChartBarBig,
  CircleFadingArrowUp,
  CircleUser,
  Clock,
  Component,
  Crown,
  DollarSign,
  MapPinHouse,
  RotateCw,
  School,
  Sun,
  User,
  User2,
} from "lucide-react";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import hcalogo from "@/images/hca-transparent.png";

import Image from "next/image";
import {
  Avatar,
  Button,
  Skeleton,
  Box,
  Modal,
  Divider,
  Stack,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import ViewAllAssignedClasses from "@/components/dashboard/ViewAllAssignedClasses";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const data = [
  { name: "Present", value: 18, status: "Present" },
  { name: "Absent", value: 14, status: "Absent" },
  { name: "Leave", value: 12, status: "Leave" },
  { name: "Holiday", value: 9, status: "Holiday" },
];
const barColors: any = {
  Present: "#9ce09b",
  Absent: "#f07878",
  Leave: "#8492e0",
  Holiday: "#af7cde",
};

const TrainerDashboardComponent = () => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    session?.data?.user?.isGlobalAdmin;

  const today = dayjs().tz(timeZone);
  // state vars
  const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));
  const [formattedTime, setFormattedTime] = useState("");
  const [dashboardDataLoading, setdashboardDataLoading] = useState(true);
  const [upcomingTrainersClasses, setupcomingTrainersClasses] = useState([]);
  const [trainersAssignedSchools, settrainersAssignedSchools] = useState([]);
  const [todaysAssignedClasses, settodaysAssignedClasses] = useState([]);
  const [countData, setcountData] = useState({
    totalClasses: 0,
    classTaken: 0,
    pendingLeaveRequests: 0,
  });

  //modal states
  const [viewTodaysClassModalOpen, setviewTodaysClassModalOpen] =
    useState(false);
  const [currentUpcomingClassPage, setCurrentUpcomingClassPage] = useState(1);
  const [currentAssignedSchoolPage, setCurrentAssignedSchoolPage] = useState(1);
  const [upcomingTrainersClassesPerPage] = useState(4);
  const [trainersAssignedSchoolsPerPage] = useState(4);

  const handleUpcomingClassPageChange = (event: any, value: any) => {
    setCurrentUpcomingClassPage(value);
  };

  const handleAssignedSchoolsPageChange = (event: any, value: any) => {
    setCurrentAssignedSchoolPage(value);
  };

  //modal operations

  function handleviewTodaysClassModalOpen() {
    setviewTodaysClassModalOpen(true);
  }
  function handleviewTodaysClassModalClose() {
    setviewTodaysClassModalOpen(false);
  }

  const startDay = currentMonth.startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");

  const currentTime = dayjs().tz(timeZone);
  const currentHour = currentTime.hour();

  let greeting = "";
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const calendarDays = [];
  let day = startDay;

  while (day.isBefore(endDay, "day")) {
    for (let i = 0; i < 7; i++) {
      calendarDays.push(day);
      day = day.add(1, "day");
    }
  }

  const isSameDay = (d1: any, d2: any) =>
    d1.format("YYYY-MM-DD") === d2.format("YYYY-MM-DD");

  async function getDashboardData({ role, _id, branchName }: any) {
    try {
      const { data: resData } = await axios.post("/api/trainerdashboard", {
        trainerId: _id,
        branchName,
      });

      // todaysAssignedClasses
      console.log("trainers dashboard", resData);

      settodaysAssignedClasses(resData?.todaysTrainersAssignedClasses || []);
      setupcomingTrainersClasses(resData?.upcomingTrainersClasses || []);
      settrainersAssignedSchools(resData?.trainersAssignedSchools || []);

      // total classes and classes taken
      setcountData((prev: any) => {
        return {
          ...prev,
          totalClasses: resData?.totalClasses,
          classTaken: resData?.classesTaken,
          pendingLeaveRequests: resData?.pendingLeaveRequests,
        };
      });

      console.log("dash resData", resData);
    } catch (error: any) {
      console.log("Error in getDashboardData", error);
    } finally {
      setdashboardDataLoading(false);
    }
  }
  // current time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().tz("Asia/Kathmandu");
      const formatted = now.format("D MMM, YYYY, hh:mm:ss a"); // <-- lowercase `a` gives am/pm
      setFormattedTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // initial fetch of data
  useEffect(() => {
    if (session?.data?.user) {
      getDashboardData(session?.data?.user);
    }
  }, [session?.data?.user]);

  return (
    <div className="flex flex-col h-[91dvh]  py-5 px-9 overflow-x-hidden">
      <div className="main-container flex-1 h-full flex w-full ">
        {/* left side */}
        <div className="userdetails w-full h-full overflow-autorounded-md  mr-3 flex flex-col gap-3">
          {/* top part */}
          <div className="top-part w-full  flex-[0.5] grid grid-cols-3 gap-3">
            {/* consists of 3 cols, first,second col => colspan wht 2 rows, good morning and  users, third col => user attendance chart */}
            {/* wish */}
            <div className="wish col-span-2 flex flex-col gap-3 ">
              {/* morning/ afternoon  wish */}

              <div className="morning-afternoon-wish bg-white flex-1 py-3 px-7 rounded-md shadow-md flex items-center gap-12">
                {/* Logo */}
                <div className="logo shrink-0">
                  <Image
                    src={hcalogo}
                    alt="Himalayan Chess Academy"
                    className="w-36 "
                  />
                </div>

                {/* Wish details */}
                <div className="wish-details flex flex-col text-gray-700 justify-center gap-2">
                  <div className="flex flex-col   gap-1">
                    <div className="title flex text-2xl">
                      <p className="font-light mr-1">{greeting},</p>
                      <span className="font-semibold">
                        {session?.data?.user?.name || "User"}!
                      </span>
                    </div>
                    <p className="text-md text-gray-500 ">
                      from Himalayan Chess Academy,{" "}
                      {session?.data?.user?.branchName}
                    </p>
                  </div>

                  <div className="flex items-center text-xl text-gray-500 gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-600" />
                    {!formattedTime ? <p>Today</p> : formattedTime}
                  </div>
                </div>
              </div>
            </div>

            {/* upcomingClass table */}
            {dashboardDataLoading ? (
              <div className="upcomingClass-table bg-white rounded-lg shadow-md p-3 flex flex-col justify-between">
                <h1 className="flex items-center text-gray-500 mb-1">
                  <Skeleton variant="text" width="100px" height={20} />
                </h1>

                {/* Table Skeleton */}
                <div className="upcomingClassoverview-table rounded-md overflow-hidden w-full flex flex-col">
                  {/* Table rows */}
                  <div className="table-contents">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-1 border-b border-gray-200 items-center"
                      >
                        <Skeleton variant="text" width="100%" height={30} />
                        <Skeleton variant="text" width="100%" height={30} />
                        <Skeleton variant="text" width="100%" height={30} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Skeleton */}
                <Stack spacing={2} className="mt-3">
                  <Skeleton variant="text" width="100%" height={30} />
                </Stack>
              </div>
            ) : (
              <div className="upcomingClass-table bg-white rounded-lg shadow-md p-3 flex flex-col justify-between">
                <h1 className="flex items-center text-gray-500 mb-1">
                  <CalendarClock size={20} />
                  <span className="ml-1.5 font-bold">
                    Upcoming Classes ({upcomingTrainersClasses?.length})
                  </span>
                </h1>

                {/* upcomingclasses-table */}

                <div className="upcomingclasses-table rounded-md overflow-hidden w-full  flex flex-col">
                  {/* heading */}
                  <div className="table-headings px-2 mb-1 grid grid-cols-[repeat(3,1fr)] gap-1 w-full bg-gray-200">
                    <span className="py-2 col-span-1 text-left text-xs font-bold text-gray-600">
                      Batch Name
                    </span>
                    <span className="py-2 text-center text-xs font-bold text-gray-600">
                      Date
                    </span>
                    <span className="py-2 text-center text-xs font-bold text-gray-600">
                      Time
                    </span>
                  </div>

                  {/* upcomingClass list */}
                  <div className="table-contents overflow-y-auto h-full flex-1 grid grid-cols-1 grid-rows-4">
                    {upcomingTrainersClasses?.length === 0 ? (
                      <div className="flex-1 flex  text-gray-500 w-max mx-auto my-3">
                        <SearchOffIcon
                          className="mr-1"
                          sx={{ fontSize: "1.5rem" }}
                        />
                        <p className="text-md">No upcoming classes</p>
                      </div>
                    ) : (
                      upcomingTrainersClasses
                        .slice(
                          (currentUpcomingClassPage - 1) *
                            upcomingTrainersClassesPerPage,
                          currentUpcomingClassPage *
                            upcomingTrainersClassesPerPage
                        )
                        .map((upcomingClass: any, index: any) => {
                          return (
                            <div
                              key={upcomingClass?._id}
                              className="grid grid-cols-[repeat(3,1fr)] gap-1 px-2 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                            >
                              <span className="py-2 col-span-1 text-left text-xs font-medium text-gray-600">
                                {upcomingClass?.batchName || "N/A"}
                              </span>
                              <span className="py-2  text-center text-xs font-medium text-gray-600">
                                {upcomingClass?.utcDate
                                  ? dayjs(upcomingClass.utcDate)
                                      .tz("Asia/Kathmandu")
                                      .format("D MMM, YYYY")
                                  : "N/A"}{" "}
                              </span>
                              <span className="py-2 text-center text-xs font-medium text-gray-600">
                                {upcomingClass?.startTime &&
                                upcomingClass?.endTime
                                  ? `${dayjs(upcomingClass.startTime)
                                      .tz("Asia/Kathmandu")
                                      .format("h:mmA")} - ${dayjs(
                                      upcomingClass.endTime
                                    )
                                      .tz("Asia/Kathmandu")
                                      .format("h:mmA")}`
                                  : "N/A"}
                              </span>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* pagination */}
                <Stack spacing={2} className="mx-auto w-max mt-3">
                  <Pagination
                    size="small"
                    count={Math.ceil(
                      upcomingTrainersClasses?.length /
                        upcomingTrainersClassesPerPage
                    )} // Total pages
                    page={currentUpcomingClassPage} //allCoursesLoading Current page
                    onChange={handleUpcomingClassPageChange} // Handle page change
                    shape="rounded"
                  />
                </Stack>
              </div>
            )}
          </div>
          {/* bottom part */}
          <div className="bottom-part grid grid-cols-3 grid-rows-2 gap-3 flex-1 h-full ">
            <div className="todaysclasses-pendingleavereqeust row-span-2 grid grid-cols-1 grid-rows-2 gap-4">
              {/* todays trainers assigned classes */}
              <div className="detailcell  bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
                <div className="topic-button flex justify-between">
                  {/* topic */}
                  <p className="topic text-sm font-bold text-gray-500 flex items-center">
                    <BookOpenCheck size={18} />
                    <span className="ml-1">Todays classes</span>
                  </p>
                  {/* button */}
                  <Button
                    className="flex items-center "
                    onClick={handleviewTodaysClassModalOpen}
                  >
                    <span className="mr-1">View all</span>
                    {/* <ArrowRight size={15} /> */}
                  </Button>
                </div>
                {/* view todays class modal */}
                <ViewAllAssignedClasses
                  countData={countData}
                  handleClose={handleviewTodaysClassModalClose}
                  modalOpen={viewTodaysClassModalOpen}
                  todaysAssignedClasses={todaysAssignedClasses}
                />

                {/* content */}
                <div className="content grid grid-cols-2 flex-1  place-items-center">
                  {/* count */}
                  <div className="flex flex-col items-center">
                    <p className="count text-3xl font-bold text-gray-500">
                      {countData.totalClasses || 0}
                    </p>
                    <p className="text-sm text-gray-500">Assigned Classes</p>
                  </div>
                  {/* classes taken */}
                  <div className="flex flex-col items-center">
                    <p className="count text-3xl font-bold text-gray-500">
                      {countData.classTaken || 0}
                    </p>
                    <p className="text-sm text-gray-500">Classes Taken</p>
                  </div>
                </div>
              </div>

              {/* trainers pending leave requests */}
              <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
                <div className="topic-button flex justify-between">
                  {/* topic */}
                  <p className="topic text-sm font-bold text-gray-500 flex items-center">
                    <Clock size={18} />
                    <span className="ml-1">Pending Leave Requests</span>
                  </p>
                  {/* button */}
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/leaverequest`}
                  >
                    <Button className="flex items-center ">
                      <span className="mr-1">View all</span>
                      <ArrowRight size={15} />
                    </Button>
                  </Link>
                </div>
                {/* content */}
                <div className="content grid grid-cols-1 flex-1 place-items-center">
                  {/* count */}
                  <div className="flex flex-col items-center">
                    <p className="count text-3xl font-bold text-gray-500">
                      {" "}
                      {countData.pendingLeaveRequests || 0}
                    </p>
                    <p className="text-sm text-gray-500">Leave Requests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* assigned schools list */}
            <div className="assignedschoolsh-full row-span-2 col-span-2 grid grid-cols-1 grid-rows-2 gap-4">
              {/* assignedschools table */}
              <div className="assigned-schools row-span-2 h-full flex-1 overflow-y-auto bg-white px-3 py-2 rounded-lg shadow-md flex flex-col ">
                {/* assignedschools table */}
                {dashboardDataLoading ? (
                  <div className="assignedschools-table flex-1 bg-white rounded-lg   flex flex-col justify-between">
                    <h1 className="flex items-center text-gray-500 mb-1">
                      <Skeleton variant="text" width="200px" height={30} />
                    </h1>

                    {/* Table Skeleton */}
                    <div className="assignedschoolsoverview-table rounded-md overflow-hidden w-full flex flex-col">
                      {/* Table rows */}
                      <div className="table-contents">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 gap-1  items-center"
                          >
                            <Skeleton variant="text" width="100%" height={50} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination Skeleton */}
                    <Stack spacing={2} className="mt-3">
                      <Skeleton variant="text" width="100%" height={40} />
                    </Stack>
                  </div>
                ) : (
                  <div className="upcomingClass-table  overflow-y-auto bg-white rounded-lg flex-1 h-full flex flex-col ">
                    <h1 className="flex items-center text-gray-500 mb-1">
                      <School size={20} />
                      <span className="ml-1.5 font-bold">
                        Assigned Schools ({trainersAssignedSchools?.length || 0}
                        )
                      </span>
                    </h1>

                    {/* assignedschools-table */}

                    <div className="assignedschools-table rounded-md overflow-y-auto mt-2 border h-[270px] bg-white w-full  flex flex-col">
                      {/* heading */}
                      <div className="table-headings px-2 mb-1 grid grid-cols-[repeat(4,1fr)] gap-1 w-full bg-gray-200">
                        <span className="py-2 col-span-2 text-left text-xs font-bold text-gray-600">
                          School Name
                        </span>
                        <span className="py-2 text-left text-xs font-bold text-gray-600">
                          Days
                        </span>
                        <span className="py-2 text-left text-xs font-bold text-gray-600">
                          Time
                        </span>
                      </div>

                      {/* assinged schools list */}
                      <div className="table-contents overflow-y-auto">
                        {trainersAssignedSchools?.length === 0 ? (
                          <div className="flex items-center justify-center text-gray-500 h-full">
                            <SearchOffIcon
                              className="mr-1"
                              sx={{ fontSize: "1.5rem" }}
                            />
                            <p className="text-md">No assigned schools</p>
                          </div>
                        ) : (
                          trainersAssignedSchools
                            .slice(
                              (currentAssignedSchoolPage - 1) *
                                trainersAssignedSchoolsPerPage,
                              currentAssignedSchoolPage *
                                trainersAssignedSchoolsPerPage
                            )
                            .map((assignedSchool: any) => (
                              <div
                                key={assignedSchool?._id}
                                className="grid grid-cols-[repeat(4,1fr)] gap-1 px-2 border-b border-gray-200 items-start cursor-pointer transition-all ease duration-150 hover:bg-gray-100 py-1.5"
                              >
                                {/* School Name */}
                                <span className="col-span-2 text-left text-xs font-medium text-gray-600">
                                  {assignedSchool?.name || "N/A"}
                                </span>

                                {/* Days */}
                                <div className="flex flex-col gap-1">
                                  {assignedSchool?.timeSlots?.map(
                                    (slot: any, i: number) => (
                                      <span
                                        key={`day_${i}`}
                                        className="text-xs font-medium text-gray-600"
                                      >
                                        {slot.day}
                                      </span>
                                    )
                                  )}
                                </div>

                                {/* Time Slots */}
                                <div className="flex flex-col gap-1">
                                  {assignedSchool?.timeSlots?.map(
                                    (slot: any, i: number) => (
                                      <span
                                        key={`timeslot_${i}`}
                                        className="text-xs font-medium text-gray-600"
                                      >
                                        {`${slot?.fromTime} - ${slot?.toTime}`}
                                      </span>
                                    )
                                  ) || <span>N/A</span>}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* pagination */}
                    <Stack spacing={2} className="mx-auto w-max mt-3">
                      <Pagination
                        size="small"
                        count={Math.ceil(
                          trainersAssignedSchools?.length /
                            trainersAssignedSchoolsPerPage
                        )} // Total pages
                        page={currentAssignedSchoolPage}
                        onChange={handleAssignedSchoolsPageChange} // Handle page change
                        shape="rounded"
                      />
                    </Stack>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="userattendancechart w-[27%] p-4 bg-white rounded-md shadow-md h-full flex flex-col gap-4">
          {/* Top: User Info */}
          <div className="flex-1 flex flex-col justify-center items-center text-center p-2 rounded-md">
            <Avatar
              src={session?.data?.user?.imageUrl || undefined}
              sx={{ width: 200, height: 200 }}
            />
            <h2 className="mt-3 text-xl  flex items-center text-gray-700">
              <span className="font-medium">Hi,</span>
              <span className="ml-1 font-bold">
                {session?.data?.user?.name || "User"}
              </span>
            </h2>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              {session?.data?.user?.role?.toLowerCase() === "superadmin" && (
                <Crown size={14} />
              )}
              {session?.data?.user?.role?.toLowerCase() === "admin" && (
                <CircleUser size={14} />
              )}
              {session?.data?.user?.role?.toLowerCase() === "trainer" && (
                <User size={14} />
              )}
              <span className="mx-1">{session?.data?.user?.role}</span>
              {session?.data?.user?.isGlobalAdmin && <Crown size={14} />}
            </p>
          </div>

          {/* Bottom: Calendar */}
          <div className="flex flex-col p-2 rounded-md">
            {/* Header with Month and Controls */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {currentMonth.format("MMMM YYYY")}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(currentMonth.subtract(1, "month"))
                  }
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setCurrentMonth(today.startOf("month"))}>
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-xs text-center text-gray-500 font-medium mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 grid-rows-6 gap-1 text-sm text-center">
              {calendarDays.map((dayItem, index) => {
                const isToday = isSameDay(dayItem, today);
                const inCurrentMonth = dayItem.month() === currentMonth.month();

                return (
                  <div
                    key={index}
                    className={`
                    p-2 rounded-md  cursor-pointer
                    ${isToday ? "bg-blue-500 text-white font-bold" : ""}
                    ${
                      !inCurrentMonth
                        ? "text-gray-400 bg-gray-100 cursor-default"
                        : "text-gray-700"
                    }
                    hover:bg-blue-100 transition-all
                  `}
                  >
                    {dayItem.date()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardComponent;
