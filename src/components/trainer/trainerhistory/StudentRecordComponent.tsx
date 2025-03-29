import Link from "next/link";
import React, { useEffect, useState } from "react";

const StudentRecordComponent = ({ studentRecords }: any) => {
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
  });

  // Calculate total, present, and absent students and update state
  useEffect(() => {
    const totalStudents = studentRecords.length;
    const presentStudents = studentRecords.filter(
      (student: any) => student.attendance.toLowerCase() == "present"
    ).length;
    const absentStudents = studentRecords.filter(
      (student: any) => student.attendance.toLowerCase() == "absent"
    ).length;

    setAttendanceStats({
      totalStudents,
      presentStudents,
      absentStudents,
    });
  }, [studentRecords]);
  return (
    <div className="">
      <div className="mt-2 mb-3 flex gap-4 text-sm">
        <p>
          Total Students{" "}
          <span className="bg-gray-500 py-1 px-2 rounded-md text-xs text-white font-bold">
            {attendanceStats.totalStudents}
          </span>
        </p>
        <p>
          Present{" "}
          <span className="bg-gray-500 py-1 px-2 rounded-md text-xs text-white font-bold">
            {attendanceStats.presentStudents}
          </span>
        </p>
        <p>
          Absent{" "}
          <span className="bg-gray-500 py-1 px-2 rounded-md text-xs text-white font-bold">
            {attendanceStats.absentStudents}
          </span>
        </p>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <div className="grid grid-cols-[60px,repeat(5,1fr)] text-xs bg-gray-200 font-bold">
          <span className="py-2 px-4 border-b text-left">SN</span>
          <span className="py-2 px-4 border-b text-left">Name</span>
          <span className="py-2 px-4 border-b text-left">Study Topics</span>
          <span className="py-2 px-4 border-b text-left">Completed Status</span>
          <span className="py-2 px-4 border-b text-left">Remark</span>
          <span className="py-2 px-4 border-b text-left">Attendance</span>
        </div>
        {studentRecords.map((student, index) => (
          <div
            key={"record" + student._id}
            className="grid grid-cols-[60px,repeat(5,1fr)] text-xs"
          >
            <span className="py-2 px-4 border-b break-words">{index + 1}</span>
            <Link
              href={`/student/${student?._id}`}
              target="_blank"
              className="py-2 px-4 border-b break-words transition-all ease duration-150 hover:underline hover:text-blue-500"
            >
              {student.name}
            </Link>
            <span className="py-2 px-4 border-b break-words">
              <ul>
                {student.studyTopics.map((topic, i) => (
                  <li key={"topic" + i}>{topic}</li>
                ))}
              </ul>
            </span>
            <span className="py-2 px-4 border-b break-words">
              {student.completedStatus ? "Completed" : "Not Completed"}
            </span>
            <span className="py-2 px-4 border-b break-words">
              {student.remark || "N/A"}
            </span>
            <span className="py-2 px-4 border-b break-words">
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
  );
};

export default StudentRecordComponent;
