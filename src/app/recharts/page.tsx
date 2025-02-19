"use client";
import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Sample data (this would usually come from your database)
const sampleData = [
  {
    date: "2025-01-05",
    teacherId: "T1",
    studentRecords: [
      {
        stdName: "Alice",
        feedback: "Excellent",
        status: "absent",
        lessonsTaught: ["Introduction to React", "State Management in React"],
      },
      {
        stdName: "Bob",
        feedback: "Needs improvement",
        status: "absent",
        lessonsTaught: ["Introduction to JavaScript"],
      },
      {
        stdName: "Charlie",
        feedback: "Very good",
        status: "present",
        lessonsTaught: ["React Lifecycle Methods", "State and Props in React"],
      },
    ],
  },
  {
    date: "2025-01-06",
    teacherId: "T2",
    studentRecords: [
      {
        stdName: "Alice",
        feedback: "Great performance",
        status: "present",
        lessonsTaught: ["JavaScript Basics", "Array Methods in JS"],
      },
      {
        stdName: "Bob",
        feedback: "Absent",
        status: "absent",
        lessonsTaught: ["ES6 Features"],
      },
      {
        stdName: "Charlie",
        feedback: "Very good",
        status: "present",
        lessonsTaught: ["JavaScript Functions", "Event Handling in JS"],
      },
    ],
  },
  // Add more sample data here for other dates
];

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date()); // Tracks the selected date for the chart
  const [selectedLesson, setSelectedLesson] = useState(""); // To store the lesson taught for the selected date
  const [selectedFeedback, setSelectedFeedback] = useState([]); // Store feedback of students for the selected date

  useEffect(() => {
    // Calculate the days in the selected month
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
  }, [selectedMonth]);

  // Handle selecting a date from the table
  const handleDateClick = (date) => {
    setSelectedDate(date); // Update the selected date
    const selectedAttendance = attendanceData.find(
      (attendance) =>
        format(new Date(attendance.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );

    // Set the lesson and feedback for the selected date
    if (selectedAttendance) {
      setSelectedLesson(selectedAttendance.studentRecords[0]?.lessonsTaught);
      setSelectedFeedback(selectedAttendance.studentRecords || []);
    } else {
      setSelectedFeedback([]); // Clear feedback if no data exists
    }
  };

  // Create a list of students' names and their attendance per day
  const students = ["Alice", "Bob", "Charlie"]; // Add other student names here

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });

  // Find attendance for the selected date
  const selectedDateAttendance = attendanceData.find(
    (attendance) =>
      format(new Date(attendance.date), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd")
  );

  // Prepare the attendance data for the bar chart (for the selected date)
  const attendanceBarChartData = selectedDateAttendance
    ? [
        {
          date: format(new Date(selectedDate), "dd MMM"),
          present: selectedDateAttendance.studentRecords.filter(
            (record) => record.status === "present"
          ).length,
          absent: selectedDateAttendance.studentRecords.filter(
            (record) => record.status === "absent"
          ).length,
        },
      ]
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Student Attendance Overview
      </h2>

      {/* Month Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Month
        </label>
        <input
          type="month"
          value={format(selectedMonth, "yyyy-MM")}
          onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      {/* Attendance Bar Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">
          Attendance Bar Chart for {format(selectedDate, "dd MMM")}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceBarChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#82ca9d" name="Present">
              <LabelList dataKey="present" position="top" />
            </Bar>
            <Bar dataKey="absent" fill="#ff7f7f" name="Absent">
              <LabelList dataKey="absent" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Table */}
      <div className="mb-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-3">Attendance Table</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left sticky left-0 bg-white z-10">
                Student Name
              </th>
              {daysInMonth.map((day, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-center"
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{format(day, "eee")}</span>
                    <span
                      className={`${
                        isToday(day) ? "bg-yellow-200" : ""
                      } p-1 rounded-full ${
                        selectedDate.getTime() === day.getTime()
                          ? "bg-blue-300"
                          : ""
                      }`}
                    >
                      {format(day, "dd")}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const attendanceForStudent = daysInMonth.map((day, idx) => {
                const attendanceRecord = attendanceData.find(
                  (attendance) =>
                    format(new Date(attendance.date), "yyyy-MM-dd") ===
                    format(day, "yyyy-MM-dd")
                );

                const studentRecord = attendanceRecord?.studentRecords.find(
                  (record) => record.stdName === student
                );

                return (
                  <td key={idx} className="px-4 py-2 text-center">
                    {studentRecord ? (
                      studentRecord.status === "present" ? (
                        <span className="text-green-500">✔</span>
                      ) : (
                        <span className="text-red-500">✘</span>
                      )
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                );
              });

              return (
                <tr key={student} className="hover:bg-gray-100">
                  <td className="px-4 py-2 sticky left-0 bg-white z-10">
                    {student}
                  </td>
                  {attendanceForStudent}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Feedback & Lessons */}
      <div className="mb-6">
        {selectedFeedback.length > 0 ? (
          <div>
            <h4 className="text-xl font-semibold mb-3">Feedback and Lessons</h4>
            <div className="space-y-4">
              {selectedFeedback.map((record) => (
                <div
                  key={record.stdName}
                  className="bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <h5 className="font-semibold">{record.stdName}</h5>
                  <p>
                    {record.status === "absent" ? "Absent" : record.feedback}
                  </p>
                  <h6 className="mt-2 font-semibold">Lessons Taught:</h6>
                  <ul className="list-disc ml-6">
                    {record.lessonsTaught.length > 0 ? (
                      record.lessonsTaught.map((lesson, idx) => (
                        <li key={idx}>{lesson}</li>
                      ))
                    ) : (
                      <li>No lessons taught on this day</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No data available for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
