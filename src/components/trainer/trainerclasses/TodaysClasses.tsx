import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";

import { useDispatch, useSelector } from "react-redux";
import { selectTodaysClass } from "@/redux/trainerSlice";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Label,
} from "recharts";

const TodaysClasses = ({
  trainersTodaysClasses,
  loadingTodaysClasses,
  selectedTodaysClass,
}: any) => {
  //selector
  const { attendanceStudentRecordsList, status, error } = useSelector(
    (state: any) => state.trainerReducer
  );

  // dispatch
  const dis = useDispatch<any>();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const totalStudents = attendanceStudentRecordsList.length;
    const presentCount = attendanceStudentRecordsList.filter(
      (student: any) => student.attendance === "present"
    ).length;
    const absentCount = attendanceStudentRecordsList.filter(
      (student: any) => student.attendance === "absent"
    ).length;
    const data = [
      { name: "Total", count: totalStudents },
      { name: "Present", count: presentCount },
      { name: "Absent", count: absentCount },
    ];
    setData(data);
  }, [attendanceStudentRecordsList]);

  function handleSelectTodaysClass(todaysClass: any) {
    dis(selectTodaysClass(todaysClass));
  }

  return (
    <div className="classes-analysis-container h-full flex flex-col overflow-hidden">
      {/* Today's Classes */}
      <div className="flex-[0.5] overflow-y-auto bg-white pt-3 pb-4 px-6 rounded-md shadow-md flex flex-col overflow-hidden">
        <h1 className="text-lg font-bold pb-1 bg-white sticky top-0">
          Todays Classes{" "}
          <span className="bg-gray-500 text-white px-2 py-1 ml-1 rounded-md">
            {trainersTodaysClasses?.length}
          </span>
        </h1>

        {loadingTodaysClasses ? (
          <div className="flex justify-center items-center flex-1">
            <CircularProgress sx={{ fontSize: ".8rem", color: "gray" }} />
          </div>
        ) : (
          <div className="assigned-classes-list mt-2 flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pb-4">
            {trainersTodaysClasses?.length === 0 ? (
              <p className="flex items-center">
                <BrowserNotSupportedIcon />
                <span className="ml-2">No assigned Classes</span>
              </p>
            ) : (
              trainersTodaysClasses?.map((todaysClass: any) => (
                <div
                  key={todaysClass?._id}
                  onClick={() => handleSelectTodaysClass(todaysClass)}
                >
                  <div
                    className={`py-2 px-3 ${
                      todaysClass?.isPlayDay
                        ? "bg-yellow-100" // If isPlayDay, set background to yellow
                        : todaysClass?.affiliatedTo?.toLowerCase() === "hca"
                        ? "bg-blue-100" // If affiliated to HCA, set background to blue
                        : "bg-gray-100" // Default background color
                    } shadow-sm rounded-md cursor-pointer ${
                      selectedTodaysClass?._id === todaysClass?._id
                        ? "border-2 border-blue-400" // If selected, add blue border
                        : ""
                    } hover:opacity-80`}
                  >
                    <p className="text-sm">{todaysClass?.batchName}</p>

                    <div className="trainer-attendance flex justify-between items-center">
                      <div className="trainer flex items-center">
                        <AccountCircleIcon
                          sx={{ fontSize: "1rem", color: "gray" }}
                        />
                        <span className="ml-1 text-xs text-gray-500">
                          {todaysClass?.trainerName}
                        </span>
                      </div>
                      <p
                        className={`text-xs px-2 rounded-full py-0.5 w-max ${
                          todaysClass?.recordUpdatedByTrainer
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {todaysClass?.recordUpdatedByTrainer
                          ? "Updated"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Analysis Section */}
      <div
        className="flex-[0.5] flex  flex-col items-center justify-center bg-white mt-3 rounded-md shadow-md"
        style={{ height: "300px" }}
      >
        <h1 className="mb-4 text-lg font-bold">Attendance</h1>
        <ResponsiveContainer width="75%" height="75%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="name" />
            {/* <YAxis /> */}
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#F38C79" barSize={40}>
              <Label position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TodaysClasses;
