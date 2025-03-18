import React, { useEffect, useState } from "react";
import { Button, Modal, TextareaAutosize } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Dropdown from "@/components/Dropdown";
import { notify } from "@/helpers/notify";
import axios from "axios";
import {
  updateAttendanceStudentRecordsList,
  updateTodaysClassRecord,
} from "@/redux/trainerSlice";
import { useDispatch } from "react-redux";

const StudentActivity = ({
  selectedStudentList,
  selectedTodaysClass,
  setapplyToAllClicked,
  applyToAllClicked,
  applyTopic,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  // state variable
  const [attendanceChanged, setattendanceChanged] = useState(false);
  const [studyTopicModalOpen, setstudyTopicModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(""); // Track selected dropdown option

  // handlestudyTopicModalOpen
  function handlestudyTopicModalOpen(studentId) {
    setSelectedStudentId(studentId);
    setstudyTopicModalOpen(true);
  }
  // handlestudyTopicModalClose
  function handlestudyTopicModalClose() {
    setstudyTopicModalOpen(false);
  }

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      students: [],
    },
  });
  const students = watch("students");
  // console.log(students);

  // update redux state for evry attendance change for analysis
  useEffect(() => {
    // console.log("studentsattencande cnahgedddddd", students);
    if (students) {
      const tempStudents = JSON.stringify(students);

      dispatch(
        updateAttendanceStudentRecordsList({
          attendanceStudents: JSON.parse(tempStudents),
        })
      );
    }
  }, [attendanceChanged, selectedTodaysClass, students]);

  useEffect(() => {
    let updatedStudents = [];

    if (
      selectedTodaysClass?.studentRecords &&
      selectedTodaysClass.studentRecords.length > 0
    ) {
      console.log("Using selectedTodaysClass.studentRecords");
      updatedStudents = selectedTodaysClass.studentRecords.map((student) => ({
        _id: student._id,
        name: student.name,
        studyTopics: student.studyTopics || [],
        completedStatus: student.completedStatus ?? false,
        attendance: student.attendance || "absent",
        remark: student.remark || "",
      }));
    } else if (selectedStudentList) {
      console.log("Using selectedStudentList");
      updatedStudents = selectedStudentList.map((student) => ({
        _id: student._id,
        name: student.name,
        studyTopics: student.studyTopics || [],
        completedStatus: false,
        attendance: student.attendance ?? "absent",
        remark: student.remark ?? "",
      }));
    }

    setValue("students", updatedStudents);
  }, [selectedTodaysClass, selectedStudentList, setValue]);

  // Effect to handle applying the topic to all students
  useEffect(() => {
    if (applyToAllClicked && applyTopic) {
      const updatedStudents = students.map((student) => {
        // Check if the topic already exists in the student's studyTopics
        if (!student.studyTopics.includes(applyTopic)) {
          return {
            ...student,
            studyTopics: [...student.studyTopics, applyTopic], // Add the new topic
          };
        }
        return student; // Return the student unchanged if the topic already exists
      });

      // Update the form values with the new studyTopics
      setValue("students", updatedStudents);

      // Reset the applyToAllClicked flag
      setapplyToAllClicked(false);
    }
  }, [applyToAllClicked, applyTopic, students, setValue, setapplyToAllClicked]);

  // Function to add study topic
  const handleAddStudyTopic = () => {
    console.log("submit:", selectedTopic);
    if (!selectedTopic || !selectedTopic.trim()) {
      notify("Select study topic", 204);
      return;
    }

    // Find the selected student
    const selectedStudent = students.find((s) => s._id === selectedStudentId);

    if (!selectedStudent) {
      notify("Student not found", 400);
      return;
    }

    // Check if the topic already exists in the student's studyTopics array
    if (selectedStudent.studyTopics.includes(selectedTopic)) {
      notify("This topic is already added", 204);
      return;
    }

    // Update students array
    const updatedStudents = students.map((s) =>
      s._id === selectedStudentId
        ? { ...s, studyTopics: [...s.studyTopics, selectedTopic] }
        : s
    );

    setValue("students", updatedStudents);
    notify("Topic added", 200);
    setSelectedTopic("");
    setstudyTopicModalOpen(false); // Close modal after adding
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log(data); // This will contain all student records
      const { data: resData } = await axios.post(
        "/api/classes/updateStudentRecords",
        {
          activityRecordId: selectedTodaysClass?._id,
          studentRecords: data.students,
        }
      );

      if (resData?.statusCode == 200) {
        dispatch(updateTodaysClassRecord(resData.updatedActivityRecord));
      }
      notify(resData.msg, resData.statusCode);
    } catch (error) {
      console.log("studentactivity.tsx updatestudentsrecord", error);
    }
  };

  return (
    <form className="overflow-x-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="min-w-full flex flex-col gap-2">
        {/* Header row */}
        <div className="text-sm w-full grid grid-cols-[60px,repeat(6,1fr)] items-center border-b">
          <div className="w-12 px-2 py-2 text-left">SN</div>
          <div className="px-2 py-2 text-left">Name</div>
          <div className="px-2 py-2 text-left col-span-2">Study Topic</div>
          <div className="px-2 py-2 text-center">Completed Status</div>
          <div className="px-2 py-2 text-center">Remark</div>
          <div className="px-2 py-2 text-center">Attendance</div>
        </div>

        {/* Body content */}
        <div className="studentlist-container max-h-[370px] overflow-y-auto">
          {students?.length === 0 ? (
            <div className="text-sm grid grid-cols-6">
              <div className="col-span-4 text-center px-4 py-2">
                No students
              </div>
            </div>
          ) : (
            students?.map((student, i) => (
              <div
                key={"student" + student?._id}
                className="text-sm grid grid-cols-[60px,repeat(6,1fr)] items-center border-b hover:bg-gray-50"
              >
                <div className="w-12 px-2 py-2">{i + 1}</div>
                <div className="px-2 py-2 flex flex-wrap">{student?.name}</div>

                {/* Study Topics */}
                <div className="px-2 py-2 col-span-2 flex  items-start  flex-wrap gap-2">
                  {student.studyTopics?.map((topic, index) => (
                    <span
                      key={"topic" + index}
                      className="text-black border text-xs shadow-sm outline-none w-max h-max py-1 px-2 rounded-full flex items-center gap-1"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => {
                          // Remove the topic from the student's studyTopics
                          const updatedStudents = students.map((s) => {
                            if (s._id === student._id) {
                              return {
                                ...s,
                                studyTopics: s.studyTopics.filter(
                                  (_, i) => i !== index
                                ),
                              };
                            }
                            return s;
                          });
                          setValue("students", updatedStudents);
                        }}
                        className="text-red-500"
                      >
                        <CloseIcon
                          className=" border border-gray-400 text-black rounded-full p-0.5 ml-1s"
                          sx={{ fontSize: "0.9rem" }}
                        />
                      </button>
                    </span>
                  ))}
                  {/* add study topic */}
                  <div
                    title="Add study topic"
                    className="border text-black py-1 pl-1 pr-3 outline-none text-md cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-600 hover:text-white transition-all duration-150"
                    onClick={() => handlestudyTopicModalOpen(student?._id)}
                  >
                    <AddIcon sx={{ fontSize: "0.9rem" }} />
                    <span className="ml-1 text-xs">Add</span>
                  </div>

                  <Modal
                    open={studyTopicModalOpen}
                    onClose={handlestudyTopicModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="flex items-center justify-center"
                    BackdropProps={{
                      style: { backgroundColor: "rgba(0,0,0,0.3)" },
                    }}
                  >
                    <div className="bg-white p-4 rounded shadow-lg w-96">
                      <h2 className="text-xl font-bold mb-2">
                        Add additional topic
                      </h2>

                      <Dropdown
                        options={[
                          "Advanced Java",
                          "REST Api framework",
                          "Advanced Beginner 4",
                        ]}
                        label="Study topic"
                        selected={selectedTopic}
                        width="full"
                        onChange={(value) => setSelectedTopic(value)}
                      />

                      <div className="buttons flex justify-end gap-3 mt-5">
                        <Button
                          className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                          onClick={handlestudyTopicModalClose}
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={handleAddStudyTopic}
                          variant="contained"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>

                {/* Completed Status */}
                <div className="px-2 py-2 text-center ">
                  <Controller
                    name={`students[${i}].completedStatus`}
                    control={control}
                    defaultValue={students[i]?.completedStatus ?? false} // Ensure it reflects the form data
                    render={({ field }) => (
                      <input
                        title="Assignment complete status"
                        type="checkbox"
                        {...field}
                        checked={field.value}
                        className="scale-125 cursor-pointer"
                      />
                    )}
                  />
                </div>

                {/* Remark Textbox */}
                <div className="px-2 py-2 text-center">
                  <Controller
                    name={`students[${i}].remark`}
                    control={control}
                    render={({ field }) => (
                      <TextareaAutosize
                        {...field}
                        title="Remark"
                        placeholder="Add remark"
                        className="border border-gray-400 rounded-md text-xs w-full px-2 py-1"
                      />
                    )}
                  />
                </div>

                {/* Attendance Toggle Button */}
                <div className="px-2 py-2 text-center">
                  <Controller
                    name={`students[${i}].attendance`}
                    control={control}
                    render={({ field }) => (
                      <Button
                        {...field}
                        title="Attendance"
                        variant="contained"
                        size="small"
                        color={field.value === "present" ? "success" : "error"}
                        onClick={() => {
                          const newAttendance =
                            field.value === "present" ? "absent" : "present";
                          field.onChange(newAttendance); // Update the form value
                          setattendanceChanged((prev) => !prev);
                        }}
                      >
                        {field.value === "present" ? "Present" : "Absent"}
                      </Button>
                    )}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Update button */}
        {students?.length > 0 && selectedTodaysClass && (
          <div className="update-record-button mt-4 mb-2">
            <Button type="submit" variant="contained" color="primary">
              Update record
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default StudentActivity;
