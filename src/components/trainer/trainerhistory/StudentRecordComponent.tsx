import { Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

const StudentRecordComponent = ({ studentRecords }: any) => {
  const session = useSession();

  const [attendanceStats, setAttendanceStats] = useState<any>({
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
  });

  const [attendanceData, setAttendanceData] = useState<any>([]);

  useEffect(() => {
    const totalStudents = studentRecords.length;
    const presentStudents = studentRecords.filter(
      (student: any) => student.attendance.toLowerCase() === "present"
    ).length;
    const absentStudents = studentRecords.filter(
      (student: any) => student.attendance.toLowerCase() === "absent"
    ).length;

    setAttendanceStats({
      totalStudents,
      presentStudents,
      absentStudents,
    });

    setAttendanceData([
      {
        name: "Total",
        value: totalStudents,
        color: "#afbffa", // Light blue
      },
      {
        name: "Present",
        value: presentStudents,
        color: "#9cffbb", // Light green
      },
      {
        name: "Absent",
        value: absentStudents,
        color: "#ff9ca1", // Light red
      },
    ]);
  }, [studentRecords]);

  return (
    <div className="flex flex-col   lg:flex-row gap-2">
      {/* Left: Table */}
      <div className="flex-1 border-r pr-4">
        <div className="overflow-x-auto border rounded-md">
          <div className="grid grid-cols-[60px,repeat(5,1fr)] py-1 text-sm bg-gray-200 text-gray-500 font-bold">
            <span className="py-2 px-4  text-left">SN</span>
            <span className="py-2 px-4  text-left">Name</span>
            <span className="py-2 px-4  text-left">Study Topics</span>
            <span className="py-2 px-4  text-left">Completed Status</span>
            <span className="py-2 px-4  text-left">Remark</span>
            <span className="py-2 px-4  text-left">Attendance</span>
          </div>
          {studentRecords.map((student: any, index: any) => (
            <div
              key={"record" + student._id}
              className="grid grid-cols-[60px,repeat(5,1fr)] py-1 border-b text-xs"
            >
              <span className="py-2 px-4  break-words">{index + 1}</span>
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                  student?._id
                }`}
                target="_blank"
                className={`py-2 px-4  break-words transition-all ease duration-150 hover:underline hover:text-blue-500 ${
                  session?.data?.user?.role?.toLowerCase() === "trainer" &&
                  "pointer-events-none"
                }`}
              >
                {student.name}
              </Link>
              <span className="py-2 px-4  break-words">
                <ul>
                  {student.studyTopics.map((topic: any, i: any) => (
                    <li key={"topic" + i}>{topic}</li>
                  ))}
                </ul>
              </span>
              <span className="py-2 px-4  break-words">
                {student.completedStatus ? "Completed" : "Not Completed"}
              </span>
              <span className="py-2 px-4  break-words">
                {student.remark || "N/A"}
              </span>
              <span className="py-2 px-4  break-words">
                <span
                  className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                    student?.attendance?.toLowerCase() === "present"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                >
                  {student.attendance}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Graph */}
      <div className="right-container  w-[20%]">
        <div className="w-full h-[200px]">
          <h1 className="text-center font-bold text-lg mb-2">
            Attendance Chart
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              {/* <YAxis allowDecimals={false} /> */}
              <Tooltip />
              <Bar dataKey="value" name="Attendance" barSize={50}>
                {attendanceData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="counts grid  w-full px-4 grid-cols-2 gap-3 mt-10 mb-3">
          {/* Present */}
          <div className="total flex flex-col items-center bg-[#d9ffdb] p-1.5 rounded-md text-sm">
            <p>Present</p>
            <span className="text-[1.1rem] font-bold">
              {attendanceData.find((item: any) => item.name === "Present")
                ?.value || 0}
            </span>
          </div>

          {/* Absent */}
          <div className="total flex flex-col items-center bg-[#ffdede] p-1.5 rounded-md text-sm">
            <p>Absent</p>
            <span className="text-[1.1rem] font-bold">
              {attendanceData.find((item: any) => item.name === "Absent")
                ?.value || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRecordComponent;
