"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Input from "../Input";
import { useSession } from "next-auth/react";
import { fetchAllProjects } from "@/redux/allListSlice";
import UserAttendanceChart from "../student/UserAttendanceChart";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewUserDetail = ({ userRecord, loading }: any) => {
  const dispatch = useDispatch<any>();
  const session = useSession();
  // use selector
  const { allActiveTrainersActivityRecords } = useSelector(
    (state: any) => state.trainerHistoryReducer
  );
  const { allActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );

  console.log("all activeprojects ", allActiveProjects);

  // state vars
  const [trainerProjects, setTrainerProjects] = useState([]);
  const [dailyAttendance, setDailyAttendance] = useState<any>([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [attendanceData, setAttendanceData] = useState<any>([]);
  const [loaded, setLoaded] = useState(false);

  // loaded
  useEffect(() => {
    if (userRecord) {
      setLoaded(true);
    }
  }, [userRecord]);

  // Filter activity records based on the selected month and trainerId
  const filterAttendanceByMonth = () => {
    // Ensure selectedMonth is in "YYYY-MM" format
    const selectedMonthFormatted = dayjs(selectedMonth).format("YYYY-MM");

    // Object to store daily attendance with unique dates
    const dailyAttendanceMap: Record<string, string> = {};

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHoliday = 0;

    allActiveTrainersActivityRecords.forEach((record: any) => {
      const recordDate = dayjs(record.utcDate)
        .tz("Asia/Kathmandu")
        .format("YYYY-MM-DD");

      // Ensure the record belongs to the selected month and trainer
      if (
        dayjs(recordDate).format("YYYY-MM") === selectedMonthFormatted &&
        record.trainerId === userRecord._id
      ) {
        // If any record for this date has "present", set the day's status to "present"
        if (record.userPresentStatus === "present") {
          dailyAttendanceMap[recordDate] = "present";
        } else {
          // Only set "absent" or "holiday" if the day is not already marked "present"
          if (!dailyAttendanceMap[recordDate]) {
            dailyAttendanceMap[recordDate] = record.userPresentStatus;
          }
        }
      }
    });

    // Convert the object into an array and calculate totals
    const finalAttendance = Object.entries(dailyAttendanceMap).map(
      ([date, status]) => {
        if (status === "present") totalPresent += 1;
        if (status === "absent") totalAbsent += 1;
        if (status === "holiday") totalHoliday += 1;
        return { date, status };
      }
    );

    // Update attendance chart data and daily attendance table
    setAttendanceData([
      { name: "Total", value: finalAttendance.length },
      { name: "Present", value: totalPresent },
      { name: "Absent", value: totalAbsent },
      { name: "Holiday", value: totalHoliday },
    ]);

    setDailyAttendance(finalAttendance);
  };

  // Generate the calendar grid for the selected month
  const generateCalendar = () => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const firstDayOfMonth = dayjs(selectedMonth).startOf("month").day(); // Get the first day of the month (0=Sunday, 1=Monday, etc.)

    const calendarGrid = [];
    let week = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null); // Empty cell for padding
    }

    // Fill in the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = dayjs(`${selectedMonth}-${i}`).format("YYYY-MM-DD");

      const attendanceStatus = dailyAttendance.find(
        (entry: any) => entry.date === currentDate
      )?.status;

      week.push({ date: currentDate, status: attendanceStatus });

      // If the week is full (7 days), push it to the calendar grid and start a new week
      if (week.length === 7) {
        calendarGrid.push(week);
        week = [];
      }
    }

    // If there are any remaining days in the last week, push them to the calendar grid
    if (week.length > 0) {
      calendarGrid.push(week);
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendar();

  //  filtering when selected month changes
  useEffect(() => {
    if (allActiveTrainersActivityRecords.length > 0) {
      // filterAttendanceByMonth();
    }
  }, [selectedMonth, allActiveTrainersActivityRecords]);

  // filter projects assigned to this trainer
  useEffect(() => {
    if (
      allActiveProjects &&
      userRecord &&
      userRecord?.role?.toLowerCase() === "trainer"
    ) {
      // Filter projects where this trainer is assigned
      const filteredProjects = allActiveProjects
        .filter((project: any) =>
          project.assignedTrainers.some(
            (trainer: any) => trainer.trainerId === userRecord?._id
          )
        )
        .map((project: any) => {
          // Find the matched trainer
          const matchedTrainer = project.assignedTrainers.find(
            (trainer: any) => trainer.trainerId === userRecord?._id
          );

          return {
            projectId: project._id,
            projectName: project.name,
            trainerRole: matchedTrainer?.trainerRole || "N/A", // Handle cases where trainerRole might be missing
          };
        });

      setTrainerProjects(filteredProjects);
    }
  }, [allActiveProjects, userRecord]);

  // get initial all trainer activity records and projectlist (active)
  useEffect(() => {
    if (userRecord) {
      dispatch(fetchAllTrainersActivityRecords({ trainerId: userRecord?._id }));
      dispatch(fetchAllProjects());
    }
  }, [userRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="  flex-1 h-full flex w-full  ">
      {loaded && loading ? (
        <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
          <CircularProgress />
          <span className="mt-2">Loading user details ...</span>
        </div>
      ) : (
        <div className="userdetails w-full h-full overflow-auto bg-white rounded-md shadow-md mr-4 px-10 py-4">
          <div className="header flex items-end justify-between  ">
            <h1 className="text-2xl font-bold">User Record Detail</h1>
          </div>

          {/* divider */}
          <Divider style={{ margin: ".4rem 0" }} />

          <div className=" h-full flex  overflow-y-auto">
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
                <p className="font-bold text-xs text-gray-500">
                  Date of Birth:
                </p>
                <p>
                  {dayjs(userRecord?.dob).tz(timeZone).format("MMMM D, YYYY")}
                </p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Joined Date:</p>
                <p>
                  {userRecord?.joinedDate
                    ? dayjs(userRecord?.joinedDate)
                        .tz(timeZone)
                        .format("MMMM D, YYYY")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">End Date:</p>
                <p>
                  {userRecord?.endDate
                    ? dayjs(userRecord?.endDate)
                        .tz(timeZone)
                        .format("MMMM D, YYYY")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">Role:</p>
                <p>{userRecord?.role}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Emergency Contact:
                </p>
                <p>{userRecord?.emergencyContactName}</p>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Emergency Contact no:
                </p>
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
                  <p className="font-bold text-xs text-gray-500">
                    Trainers CV:
                  </p>
                  <Link
                    href={userRecord?.trainerCvUrl}
                    target="_blank"
                    title="View CV"
                  >
                    <Button variant="outlined">View CV</Button>
                  </Link>
                </div>
              )}
              {/* active status */}
              <div>
                <p className="font-bold text-xs text-gray-500">
                  Active Status:
                </p>
                <p
                  className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                    userRecord?.activeStatus ? "bg-green-400" : "bg-red-400"
                  }`}
                >
                  {userRecord?.activeStatus ? "Active" : "Inactive"}
                </p>
              </div>
              {/* Assigned Projects */}
              {userRecord?.role?.toLowerCase() == "trainer" && (
                <div className="col-span-3">
                  <p className="font-bold text-xs text-gray-500">
                    Assigned Projects
                  </p>
                  {trainerProjects?.length == 0 ? (
                    <p>No assigned projects</p>
                  ) : (
                    <div className="assignedprojects mt-2 grid grid-cols-3 gap-5">
                      {trainerProjects?.map((trainerProject: any) => {
                        return (
                          <Link
                            href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                              trainerProject?.projectId
                            }`}
                            key={trainerProject?.projectId}
                            className="trainer-project border bg-blue-50 p-3 rounded-md transition-all ease duration-150 hover:bg-blue-100"
                          >
                            <p className="text-md hover:underline hover:text-blue-600">
                              {trainerProject?.projectName}
                            </p>
                            <p className="text-xs">
                              Role: {trainerProject?.trainerRole}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="attendance-container w-[25%] mr-7 flex flex-col gap-2">
              <div className="month-selector my-2">
                <Input
                  label="Month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e: any) => setSelectedMonth(e.target.value)}
                />
              </div>

              <h1 className="text-center">Monthly Attendance Calendar</h1>

              <div className="flex justify-center">
                <div className="w-[300px] border p-2 bg-white shadow-md rounded-lg">
                  <div className="grid grid-cols-7 gap-0.5 text-center text-gray-700 font-medium text-xs">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div key={day} className="p-1 border-b">
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-0.5 text-center mt-1">
                    {calendarGrid.map((week, weekIndex) => (
                      <React.Fragment key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            title={`${day?.status?.toLowerCase()}`}
                            className={`aspect-square flex items-center justify-center text-xs rounded-md ${
                              day
                                ? day.status === "present"
                                  ? "bg-green-200 text-green-700"
                                  : day.status === "absent"
                                  ? "bg-red-200 text-red-700"
                                  : "hover:bg-gray-100"
                                : "opacity-50"
                            } ${
                              day?.date ===
                              new Date().toISOString().slice(0, 10)
                                ? "border border-blue-500"
                                : ""
                            }`}
                          >
                            {day ? day.date.slice(-2) : ""}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <h1 className="mt-3 text-center">Monthly Attendance Chart</h1>

              <div className="">
                {/* Attendance Chart */}
                {attendanceData.length > 0 && (
                  <div className="pr-3">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }} // Reduce font size
                        />
                        <YAxis
                          tick={{ fontSize: 12 }} // Reduce font size
                        />
                        <Tooltip contentStyle={{ fontSize: 12 }} /> // Reduce
                        tooltip font size
                        <Legend wrapperStyle={{ fontSize: 12 }} /> // Reduce
                        legend font size
                        <Bar dataKey="value" fill="#F38C79" barSize={35} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* user attendance chart */}
      <div className="userattendancechart w-[35%] h-full flex flex-col justify-between ">
        <UserAttendanceChart />
      </div>
    </div>
  );
};

export default ViewUserDetail;
