"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";

const Select = dynamic(() => import("react-select"), { ssr: false });

const lessonOptions = [
  { value: "lesson1", label: "Lesson 1" },
  { value: "lesson2", label: "Lesson 2" },
  { value: "lesson3", label: "Lesson 3" },
];

// Dummy student data (Replace with actual database data)
const studentsData = [
  { id: "S1", name: "Alice" },
  { id: "S2", name: "Bob" },
  { id: "S3", name: "Charlie" },
];

const AttendancePage = () => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [students, setStudents] = useState<any>([]);
  const [lessonToday, setLessonToday] = useState(lessonOptions[0]); // Default to first lesson

  useEffect(() => {
    // Initialize students with default lesson for today (assigned to all students)
    setStudents(
      studentsData.map((s) => ({
        ...s,
        status: "absent",
        feedback: "",
        updated: false, // Track if attendance is updated
        lessons: [{ lesson: lessonToday.value, date: date }], // Default lesson with today's date
      }))
    );
  }, [lessonToday, date]);

  // Handle Attendance Status Change
  const handleAttendanceChange = (studentId, selectedOption) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? { ...s, status: selectedOption.value, updated: false }
          : s
      )
    );
  };

  // Handle Feedback Change
  const handleFeedbackChange = (studentId, feedback) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId ? { ...s, feedback, updated: false } : s
      )
    );
  };

  // Update Individual Student Attendance
  const handleUpdateStudent = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId ? { ...s, updated: true } : s
      )
    );

    console.log(
      `Updated Student: ${studentId}`,
      students.find((s) => s.id === studentId)
    );
  };

  // Add Extra Lesson for Student
  const handleAddLesson = (studentId) => {
    const newLesson = { lesson: "", date: "" }; // Extra lesson with no lesson selected yet
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId ? { ...s, lessons: [...s.lessons, newLesson] } : s
      )
    );
  };

  // Remove Extra Lesson for Student
  const handleRemoveLesson = (studentId, index) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? { ...s, lessons: s.lessons.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  // Handle Extra Lesson Change (Lesson & Date)
  const handleLessonChange = (studentId, index, selectedOption) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? {
              ...s,
              lessons: s.lessons.map((lesson, i) =>
                i === index
                  ? { ...lesson, lesson: selectedOption.value }
                  : lesson
              ),
            }
          : s
      )
    );
  };

  const handleDateChange = (studentId, index, selectedDate) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? {
              ...s,
              lessons: s.lessons.map((lesson, i) =>
                i === index ? { ...lesson, date: selectedDate } : lesson
              ),
            }
          : s
      )
    );
  };

  // Check if all students are updated
  const allUpdated = students.every((s) => s.updated);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Record Attendance</h2>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          className="mt-1 p-2 w-full border rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Lesson Selector for Teacher */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Lesson Taught Today
        </label>
        <Select
          options={lessonOptions}
          value={lessonToday}
          onChange={(selectedOption) => setLessonToday(selectedOption)}
          className="w-full"
        />
      </div>

      {/* Status Message */}
      <div className="mb-4">
        {allUpdated ? (
          <span className="text-green-600 font-semibold">
            All records updated
          </span>
        ) : (
          <span className="text-yellow-600 font-semibold">
            Some records are not updated
          </span>
        )}
      </div>

      {/* Students List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Students List</h3>
        {students.map((student) => (
          <div
            key={student.id}
            className="p-3 border rounded-md flex flex-col sm:flex-row justify-between items-center gap-3 mb-2"
          >
            {/* Student Name */}
            <p className="font-medium w-1/4">{student.name}</p>

            {/* Attendance Dropdown */}
            <Select
              options={[
                { value: "present", label: "Present" },
                { value: "absent", label: "Absent" },
              ]}
              value={{ value: student.status, label: student.status }}
              onChange={(selectedOption) =>
                handleAttendanceChange(student.id, selectedOption)
              }
              className="w-full sm:w-1/4"
            />

            {/* Feedback Input */}
            <input
              type="text"
              placeholder="Feedback"
              className="p-2 border rounded-md w-full sm:w-1/3"
              value={student.feedback}
              onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
            />

            {/* Lessons */}
            <div className="w-full sm:w-1/3 flex flex-col gap-2">
              <div>
                <p className="font-medium">Lesson Today</p>
                <Select
                  options={lessonOptions}
                  value={lessonOptions.find(
                    (opt) => opt.value === student.lessons[0].lesson
                  )}
                  onChange={(selectedOption) =>
                    handleLessonChange(student.id, 0, selectedOption)
                  }
                />
                <input
                  type="date"
                  value={student.lessons[0].date}
                  onChange={(e) =>
                    handleDateChange(student.id, 0, e.target.value)
                  }
                  className="p-2 border rounded-md mt-2"
                />
              </div>

              {student.lessons.slice(1).map((lesson, index) => (
                <div
                  key={`${student.id}-extra-lesson-${index}`}
                  className="flex gap-2"
                >
                  <Select
                    options={lessonOptions}
                    value={lessonOptions.find(
                      (opt) => opt.value === lesson.lesson
                    )}
                    onChange={(selectedOption) =>
                      handleLessonChange(student.id, index + 1, selectedOption)
                    }
                    className="w-full"
                  />
                  <input
                    type="date"
                    value={lesson.date}
                    onChange={(e) =>
                      handleDateChange(student.id, index + 1, e.target.value)
                    }
                    className="p-2 border rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveLesson(student.id, index + 1)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => handleAddLesson(student.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2"
              >
                Add Extra Lesson
              </button>
            </div>

            {/* Update Button */}
            <button
              onClick={() => handleUpdateStudent(student.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Update Attendance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePage;
