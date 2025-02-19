"use client";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data (this would usually come from your database)
const sampleData = [
  {
    date: "2025-02-05",
    teacherId: "T1",
    studentRecords: [
      { stdName: "Alice", status: "absent" },
      { stdName: "Bob", status: "absent" },
      { stdName: "Charlie", status: "present" },
    ],
  },
  {
    date: "2025-02-06",
    teacherId: "T2",
    studentRecords: [
      { stdName: "Alice", status: "present" },
      { stdName: "Bob", status: "absent" },
      { stdName: "Charlie", status: "present" },
    ],
  },
  {
    date: "2025-02-07",
    teacherId: "T1",
    studentRecords: [
      { stdName: "Alice", status: "present" },
      { stdName: "Bob", status: "present" },
      { stdName: "Charlie", status: "absent" },
    ],
  },
  // More data for February
];

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("Alice"); // Default student is Alice
  const [presentCount, setPresentCount] = useState(0);
  const [filteredDays, setFilteredDays] = useState([]); // Store filtered days for the graph
  const students = ["Alice", "Bob", "Charlie"]; // Add other student names here
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
  });

  useEffect(() => {
    const selectedMonth = new Date("2025-02-01"); // Fixed to February 2025
    const startOfSelectedMonth = startOfMonth(selectedMonth);
    const endOfSelectedMonth = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({
      start: startOfSelectedMonth,
      end: endOfSelectedMonth,
    });

    // Filter the data for the selected month
    const filteredData = sampleData.filter((attendance) =>
      daysInMonth.some(
        (day) =>
          format(new Date(attendance.date), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      )
    );
    setAttendanceData(filteredData);

    // Get the filtered days based on the attendance data
    const filteredDaysSet = new Set(
      filteredData.map((attendance) => attendance.date)
    );
    setFilteredDays(Array.from(filteredDaysSet)); // Store the unique filtered days

    calculatePresentPercentage(filteredData, Array.from(filteredDaysSet));
  }, [selectedStudent]);

  const calculatePresentPercentage = (filteredData, filteredDays) => {
    let presentDays = 0;

    // Calculate present days for the selected student
    filteredDays.forEach((day) => {
      const selectedAttendance = filteredData.find(
        (attendance) =>
          format(new Date(attendance.date), "yyyy-MM-dd") ===
          format(new Date(day), "yyyy-MM-dd")
      );

      if (selectedAttendance) {
        const studentRecord = selectedAttendance.studentRecords.find(
          (record) => record.stdName === selectedStudent
        );

        if (studentRecord && studentRecord.status === "present") {
          presentDays += 1;
        }
      }
    });

    const absentDays = filteredDays.length - presentDays;
    setPresentCount(presentDays);
    setAttendanceSummary({ present: presentDays, absent: absentDays });
  };

  // Handle selecting a student
  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  // Prepare data for Pie Chart using filtered days
  const pieData = [
    { name: "Present", value: attendanceSummary.present },
    { name: "Absent", value: attendanceSummary.absent },
  ];

  // Prepare all days of the month, including dates that may not be present in the data
  const allDays = eachDayOfInterval({
    start: startOfMonth(new Date("2025-02-01")),
    end: endOfMonth(new Date("2025-02-01")),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {selectedStudent}'s Attendance Overview for February
      </h2>

      {/* Student Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={handleStudentChange}
          className="mt-1 p-2 w-full border rounded-md"
        >
          {students.map((student) => (
            <option key={student} value={student}>
              {student}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">
          Monthly Attendance Summary
        </h3>
        <p className="text-lg">All Days in February: {allDays.length}</p>
        <p className="text-lg">
          Filtered Days with Attendance Records: {filteredDays.length}
        </p>
        <p className="text-lg">
          Present Days: {presentCount} (
          {((presentCount / filteredDays.length) * 100).toFixed(2)}%)
        </p>
      </div>

      {/* Recharts Pie Chart for Attendance Visualization */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Attendance Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              <Cell name="Present" fill="#4CAF50" />
              <Cell name="Absent" fill="#FF5733" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table (Horizontal Format) */}
      <div className="mb-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-3">Attendance Table</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-center">Student</th>
              {allDays.map((day, index) => (
                <th key={index} className="px-4 py-2 text-center">
                  {format(new Date(day), "EEE dd")}{" "}
                  {/* Display day and zero-padded date */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-medium text-center">
                {selectedStudent}
              </td>
              {allDays.map((day, index) => {
                const attendanceRecord = attendanceData.find(
                  (attendance) =>
                    format(new Date(attendance.date), "yyyy-MM-dd") ===
                    format(new Date(day), "yyyy-MM-dd")
                );
                const studentRecord = attendanceRecord
                  ? attendanceRecord.studentRecords.find(
                      (record) => record.stdName === selectedStudent
                    )
                  : null;
                return (
                  <td key={index} className="px-4 py-2 text-center">
                    {studentRecord
                      ? studentRecord.status === "present"
                        ? "✔"
                        : "✘"
                      : "-"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
