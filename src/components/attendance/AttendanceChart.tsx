import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AttendanceChart = ({ allUsersLoading }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { attendanceChartData, attendanceUpdatedByData } = useSelector(
    (state: any) => state.attendanceReducer
  );

  return (
    <div className=" flex flex-col w-[25%]  h-full rounded-md ">
      <div className="mb-2 py-2 px-5 h-3/4 flex flex-col bg-white rounded-md shadow-md">
        <p className="text-center text-xl font-bold mb-2">Attendance Summary</p>

        <div className="counts grid grid-cols-2 gap-3 mt-1 mb-3">
          {/* present */}
          <div className="total flex flex-col items-center bg-[#d9ffdb] p-2.5 rounded-md text-sm">
            <p>Present</p>
            <span className="text-lg font-bold">
              {attendanceChartData[0]?.present}
            </span>
          </div>
          {/* present */}
          <div className="total flex flex-col items-center bg-[#ffdede] p-2.5 rounded-md text-sm">
            <p>Absent</p>
            <span className="text-lg font-bold">
              {attendanceChartData[0]?.absent}
            </span>
          </div>
          {/* leave */}
          <div className="total flex flex-col items-center bg-[#f0f7ff] py-1.5 rounded-md text-sm">
            <p>Leave</p>
            <span className="text-lg font-bold">
              {attendanceChartData[0]?.leave}
            </span>
          </div>
          {/* holiday */}
          <div className="total flex flex-col items-center bg-[#f0deff] p-2.5 rounded-md text-sm">
            <p>Holiday</p>
            <span className="text-lg font-bold">
              {attendanceChartData[0]?.holiday}
            </span>
          </div>
        </div>

        {allUsersLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
            <Typography ml={2}>Loading attendance...</Typography>
          </Box>
        ) : (
          <div className="chartcontainer w-full flex-1 flex items-center justify-center pr-5">
            <ResponsiveContainer width="100%" height="95%">
              <BarChart
                data={attendanceChartData}
                barGap={10} // Sets gap between bars
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {/* <Legend
                  wrapperStyle={{ fontSize: "12px" }} // Set font size of the legend text
                /> */}
                {/* <Bar dataKey="total" fill="#EF9651" name="Total" barSize={35} /> */}
                <Bar
                  dataKey="present"
                  fill="#4CAF50"
                  name="Present"
                  barSize={40}
                />
                <Bar
                  dataKey="absent"
                  fill="#d32f2f"
                  name="Absent"
                  barSize={40}
                />
                <Bar dataKey="leave" fill="#2196F3" name="Leave" barSize={40} />
                <Bar
                  dataKey="holiday"
                  fill="#9C27B0"
                  name="Holiday"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* updated by  */}
      <div className="updatedBy bg-white py-4 px-8 flex-1 rounded-md shadow-md">
        <p className="text-center text-xl font-bold">Latest Update</p>
        <div>
          {attendanceUpdatedByData ? (
            <div className="mt-4">
              <p className="text-md">
                by: {"  "}
                <span className="font-bold">
                  {attendanceUpdatedByData?.userName}
                </span>
              </p>
              <div className="flex">
                <span className="bg-gray-500 text-white w-max px-2 py-1 text-xs font-bold rounded-full">
                  {attendanceUpdatedByData?.userRole}
                </span>
                <p className="text-sm ml-2">
                  at{" "}
                  {dayjs(attendanceUpdatedByData?.updatedAt)
                    .tz(timeZone)
                    .format("h:mm A")}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center mt-2">No attendance record today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
