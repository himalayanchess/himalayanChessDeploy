import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BatchStudentList from "../BatchStudentList";
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

const BatchStudentsInfo = ({ batchRecord, allActiveStudentsList }: any) => {
  const [selectedStudentStatus, setselectedStudentStatus] = useState("all");
  const [filteredStudentList, setfilteredStudentList] = useState([]);
  const [studentCount, setstudentCount] = useState<any>([]);

  const barChartColors: { [key: string]: string } = {
    Total: "#afbffa", // Light blue
    Active: "#9cffbb", // Light green
    Completed: "#fce38a", // Light yellow
  };

  const countDisplayColors: { [key: string]: string } = {
    Total: "#dce3fd",
    Active: "#d4fbe4",
    Completed: "#fdf3c4",
  };

  useEffect(() => {
    let tempFilteredStudents = [];

    const totalFilteredStudents = allActiveStudentsList.filter((student: any) =>
      student.batches.some((batch: any) => batch.batchId === batchRecord?._id)
    );

    console.log(totalFilteredStudents);
    const activeStudents = totalFilteredStudents.filter((student: any) =>
      student.batches.some(
        (batch: any) => !batch.endDate && batch.batchId === batchRecord?._id
      )
    );

    const completedStudents = totalFilteredStudents.filter((student: any) =>
      student.batches.some(
        (batch: any) => batch.endDate && batch.batchId === batchRecord?._id
      )
    );

    const totalStudents = totalFilteredStudents?.length ?? 0;
    const active = activeStudents?.length ?? 0;
    const completed = completedStudents?.length ?? 0;

    const studentChartData = [
      {
        name: "Total",
        value: totalStudents,
        color: barChartColors["Total"],
      },
      {
        name: "Active",
        value: active,
        color: barChartColors["Active"],
      },
      {
        name: "Completed",
        value: completed,
        color: barChartColors["Completed"],
      },
    ];

    setstudentCount(studentChartData);

    if (selectedStudentStatus.toLowerCase() === "all") {
      tempFilteredStudents = totalFilteredStudents;
    } else if (selectedStudentStatus.toLowerCase() === "active") {
      tempFilteredStudents = activeStudents;
    } else if (selectedStudentStatus.toLowerCase() === "completed") {
      tempFilteredStudents = completedStudents;
    }

    setfilteredStudentList(tempFilteredStudents);
  }, [allActiveStudentsList, selectedStudentStatus, batchRecord]);

  return (
    <div className="w-full flex gap-5">
      <div className="students-list flex-1 col-span-3">
        <h1 className="font-bold text-gray-500">Students</h1>

        <div className="buttons mt-1 flex gap-2 items-end">
          <Button
            variant={selectedStudentStatus === "all" ? "contained" : "outlined"}
            onClick={() => setselectedStudentStatus("all")}
            size="small"
          >
            All
          </Button>
          <Button
            variant={
              selectedStudentStatus === "active" ? "contained" : "outlined"
            }
            onClick={() => setselectedStudentStatus("active")}
            size="small"
          >
            Active
          </Button>
          <Button
            variant={
              selectedStudentStatus === "completed" ? "contained" : "outlined"
            }
            onClick={() => setselectedStudentStatus("completed")}
            size="small"
          >
            Completed
          </Button>
          <p className="text-sm">
            Showing {filteredStudentList?.length} records
          </p>
        </div>

        <BatchStudentList
          studentList={filteredStudentList}
          batchId={batchRecord?._id}
        />
      </div>

      <div className="charcontainer w-[20%]">
        <h1 className="text-center mb-1">Student Count</h1>

        {/* Chart */}
        <ResponsiveContainer width="90%" height={220}>
          <BarChart data={studentCount}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" name="Students">
              {studentCount.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Count Display */}
        <div className="counts grid grid-cols-2 gap-2 mt-1 mb-0">
          {studentCount.map((data: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center p-2.5 rounded-md text-sm"
              style={{
                backgroundColor: countDisplayColors[data.name] || "#e0e0e0",
              }}
            >
              <p>{data.name}</p>
              <span className="text-lg font-bold">{data.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchStudentsInfo;
