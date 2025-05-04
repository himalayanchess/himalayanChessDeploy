import {
  AlignEndHorizontal,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Cake,
  CalendarDays,
  ChartBarBig,
  CircleUser,
  DollarSign,
  MapPinHouse,
  RotateCw,
  School,
  Sun,
  User,
  User2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

import React, { useState } from "react";
import dayjs from "dayjs";
import hcalogo from "@/images/hca-transparent.png";

import Image from "next/image";
import { Avatar, Button } from "@mui/material";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
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

const DashboardComponent = () => {
  const today = dayjs().tz(timeZone);
  const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));

  const startDay = currentMonth.startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");

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

  return (
    <div className="flex flex-col h-[91dvh]  py-5 px-14 overflow-x-hidden">
      <div className="main-container flex-1 h-full flex w-full ">
        {/* left side */}
        <div className="userdetails w-full h-full overflow-autorounded-md  mr-4 flex flex-col gap-3">
          {/* top part */}
          <div className="top-part w-full  flex-[0.5] grid grid-cols-3 gap-3">
            {/* consists of 3 cols, first,second col => colspan wht 2 rows, good morning and birthday users, third col => user attendance chart */}
            {/* wish-birthday */}
            <div className="wish-birthday col-span-2 flex flex-col gap-3 ">
              {/* morning/ afternoon  wish */}

              <div className="morning-afternoon-wish bg-white flex-[0.5] py-3 px-7 rounded-md shadow-md flex items-center gap-6">
                {/* Logo */}
                <div className="logo shrink-0">
                  <Image
                    src={hcalogo}
                    alt="Himalayan Chess Academy"
                    className="w-16 "
                  />
                </div>

                {/* Wish details */}
                <div className="wish-details flex flex-col text-gray-700 justify-center gap-2">
                  <div className="flex flex-col   gap-1">
                    <div className="title flex text-2xl">
                      <p className="font-light mr-1">Welcome back,</p>
                      <span className="font-semibold">Cyrus Maharjan!</span>
                    </div>
                    <p className="text-md text-gray-500 ">
                      from Himalayan Chess Academy
                    </p>
                  </div>

                  <div className="flex items-center text-xl text-gray-500 gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-600" />
                    {dayjs().format("D MMM, YYYY")}
                  </div>
                </div>
              </div>

              {/* this weeks birthdays */}
              <div className="morning-afternoon-wish bg-white rounded-lg  shadow-md p-3 flex-[0.5] flex flex-col justify-start gap-3">
                {/* title-button */}
                <div className="title-button flex justify-between">
                  <div className="title font-bold text-gray-500 flex items-center">
                    <Cake />
                    <span className="ml-2">Birthdays this week</span>
                  </div>
                  {/* see more button */}
                  <Button size="small" variant="text">
                    View All
                  </Button>
                </div>
                {/* birthday-users-list */}
                <div className="birthday-users-list grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }, (_, i) => i).map(
                    (bithdayuser: any) => {
                      return (
                        <div
                          key={bithdayuser + 1}
                          className="birthday-user bg-gray-100 rounded-lg p-2 flex"
                        >
                          <Avatar
                            sx={{
                              height: "1.4rem",
                              width: "1.4rem",
                              fontSize: "0.7rem",
                            }}
                          >
                            C
                          </Avatar>
                          <div className="icon-name flex flex-col">
                            <span className="ml-1 text-sm font-bold text-gray-500">
                              Cyrus Maharjan
                            </span>
                            <span className="ml-1 text-xs text-gray-500">
                              Trainer
                            </span>
                            <span className="ml-1 text-xs text-gray-500 flex items-center">
                              <CalendarDays size={15} />
                              <span className="ml-1">25 Apr, 2025</span>
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* attendance chart */}
            <div className="attendance-chart flex-1 bg-white rounded-lg shadow-md p-3 flex flex-col justify-between">
              <h1 className="flex items-center text-gray-500 mb-1">
                <AlignEndHorizontal />
                <span className="ml-1 font-bold">
                  Your Attendance Overview for This Month
                </span>
              </h1>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" barSize={40}>
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[entry.status] || "#ccc"} // fallback color if status not found
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* bottom part */}
          <div className="bottom-part grid grid-cols-3 grid-rows-2 gap-3 flex-1 h-full ">
            {/* stat individual records */}
            {/* todays assigned classes */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-between">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center">
                  <BookOpenCheck size={18} />
                  <span className="ml-1">Todays classes</span>
                </p>
                {/* button */}
                <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1  place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Assigned Classes</p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Classes Taken</p>
                </div>
              </div>
            </div>

            {/* Students */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-between">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center">
                  <User size={18} />
                  <span className="ml-1">Students</span>
                </p>
                {/* button */}
                <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1 place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">HCA Affiliated</p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">School Affiliated</p>
                </div>
              </div>
            </div>

            {/* Users */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-between">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center">
                  <CircleUser size={18} />
                  <span className="ml-1">Users</span>
                </p>
                {/* button */}
                <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1 place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Trainers</p>
                </div>
              </div>
            </div>

            {/* payment */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-between">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center">
                  <DollarSign size={18} />
                  <span className="ml-1">Payment</span>
                </p>
                {/* button */}
                <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1 place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500">Partial</p>
                </div>
              </div>
            </div>

            {/* school and courses */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-start">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center py-2">
                  <School size={18} />
                  <span className="ml-1">Schools & Courses</span>
                </p>
                {/* button */}
                {/* <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button> */}
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1 place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500 underline">
                    Affiliated Schools
                  </p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500 underline">Courses</p>
                </div>
              </div>
            </div>

            {/* Branches and Study Materials */}
            <div className="detailcell bg-white px-3 py-2 rounded-lg shadow-md flex flex-col justify-between">
              <div className="topic-button flex justify-start">
                {/* topic */}
                <p className="topic text-sm font-bold text-gray-500 flex items-center py-2">
                  <MapPinHouse size={18} />
                  <span className="ml-1">Branches & Study Materials</span>
                </p>
                {/* button */}
                {/* <Button className="flex items-center ">
                  <span className="mr-1">View all</span>
                  <ArrowRight size={15} />
                </Button> */}
              </div>
              {/* content */}
              <div className="content grid grid-cols-2 flex-1 place-items-center">
                {/* count */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500 underline">Branches</p>
                </div>
                {/* classes taken */}
                <div className="flex flex-col items-center">
                  <p className="count text-3xl font-bold text-gray-500">10 </p>
                  <p className="text-sm text-gray-500 underline">
                    Study Materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="userattendancechart w-[35%] p-4 bg-white rounded-md shadow-md h-full flex flex-col gap-4">
          {/* Top: User Info */}
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 rounded-md">
            <Avatar sx={{ width: 130, height: 130 }} />
            <h2 className="mt-3 text-xl  flex items-center text-gray-700">
              <span className="font-medium">Hi,</span>
              <span className="ml-1 font-bold">Cyrus Maharjan</span>
            </h2>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <User2 size={18} />
              <span className="ml-1">Superadmin</span>
            </p>
          </div>

          {/* Bottom: Calendar */}
          <div className="flex flex-col p-4 rounded-md">
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
                  p-2 rounded-md 
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

export default DashboardComponent;
