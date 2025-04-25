import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { MapPinHouse } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const AttendanceChart = ({ allUsersLoading }: any) => {
  const dispatch = useDispatch<any>();
  const { attendanceChartData, attendanceUpdatedByData } = useSelector(
    (state: any) => state.attendanceReducer
  );

  const filteredChartData = attendanceChartData.filter(
    (item: any) =>
      item.name === "Present" ||
      item.name === "Absent" ||
      item.name === "Leave" ||
      item.name === "Holiday"
  );

  // Light colors for count boxes
  const customColors: any = {
    Present: "#d9ffdb",
    Absent: "#ffdede",
    Leave: "#f0f7ff",
    Holiday: "#f0deff",
  };

  // Darker shades for chart bars
  const barColors: any = {
    Present: "#9ce09b",
    Absent: "#f07878",
    Leave: "#8492e0",
    Holiday: "#af7cde",
  };

  return (
    <div className="flex flex-col w-[22%] h-full rounded-md">
      <div className="mb-2 py-2 px-5 h-3/4 flex flex-col bg-white rounded-md shadow-md">
        <p className="text-center text-xl font-bold mb-2">Attendance Summary</p>

        <div className="counts grid grid-cols-2 gap-2 mt-1 mb-0">
          {filteredChartData.map((data: any, index: any) => (
            <div
              key={index}
              className="total flex flex-col items-center p-2.5 rounded-md text-sm"
              style={{
                backgroundColor: customColors[data.name],
              }}
            >
              <p>{data.name}</p>
              <span className="text-lg font-bold">{data.value}</span>
            </div>
          ))}
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
          <div className="chartcontainer w-full flex-1 flex items-center justify-center ">
            <ResponsiveContainer width="90%" height="90%">
              <BarChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Attendance">
                  {filteredChartData.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Latest Update */}
      <div className="updatedBy bg-white py-4 px-8 flex-1 rounded-md shadow-md">
        <p className="text-center text-xl font-bold">Latest Update</p>
        <div>
          {attendanceUpdatedByData ? (
            <div className="mt-2">
              <p className="text-md">
                by:{" "}
                <span className="font-bold">
                  {attendanceUpdatedByData?.userName}
                </span>
              </p>
              <p className="branch my-1 flex items-center">
                <MapPinHouse className="text-gray-500" size={15} />
                <span className="ml-1 text-sm text-gray-500">
                  {attendanceUpdatedByData?.userBranch}
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
