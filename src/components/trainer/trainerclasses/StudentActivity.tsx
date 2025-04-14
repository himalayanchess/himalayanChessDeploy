import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { Box, Button, Modal, TextareaAutosize } from "@mui/material";
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
import { LoadingButton } from "@mui/lab";

const StudentActivity = ({
  selectedStudentList,
  selectedTodaysClass,
  setapplyToAllClicked,
  applyToAllClicked,
  applyTopic,
  selectedCourseLessons,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  // state variable
  const [attendanceChanged, setattendanceChanged] = useState(false);
  const [studyTopicModalOpen, setstudyTopicModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(""); // Track selected dropdown option
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [updateRecordsLoading, setupdateRecordsLoading] = useState(false);

  // handlestudyTopicModalOpen
  function handlestudyTopicModalOpen(studentId: any) {
    setSelectedStudentId(studentId);
    setstudyTopicModalOpen(true);
  }
  // handlestudyTopicModalClose
  function handlestudyTopicModalClose() {
    setstudyTopicModalOpen(false);
  }

  // modal operation
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }

  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<any>({
    defaultValues: {
      students: [],
      mainStudyTopic: "",
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

  // In your StudentActivity component
  const [isLoadingClass, setIsLoadingClass] = useState(false);

  useEffect(() => {
    if (!selectedTodaysClass) return;

    setIsLoadingClass(true);

    const defaultFormValues = {
      students: [],
      mainStudyTopic: "",
    };

    if (selectedTodaysClass?.studentRecords?.length > 0) {
      defaultFormValues.students = selectedTodaysClass.studentRecords.map(
        (student: any) => ({
          _id: student._id,
          name: student.name,
          studyTopics: student.studyTopics || [],
          completedStatus: student.completedStatus || false,
          attendance: student.attendance || "absent",
          remark: student.remark || "",
        })
      );
      defaultFormValues.mainStudyTopic =
        selectedTodaysClass.mainStudyTopic || "";
    } else {
      defaultFormValues.students = selectedStudentList.map((student: any) => ({
        _id: student._id,
        name: student.name,
        studyTopics: [],
        completedStatus: false,
        attendance: "absent",
        remark: "",
      }));
    }

    // Use setTimeout to ensure state is fully updated
    const timer = setTimeout(() => {
      reset(defaultFormValues, {
        keepDefaultValues: false,
        keepDirty: false,
      });
      setIsLoadingClass(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedTodaysClass?._id, JSON.stringify(selectedStudentList)]);

  // Effect to handle applying the topic to all students
  useEffect(() => {
    if (applyToAllClicked && applyTopic) {
      const updatedStudents = students.map((student: any) => {
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
    const selectedStudent = students.find(
      (s: any) => s._id === selectedStudentId
    );

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
    const updatedStudents = students.map((s: any) =>
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
  const onSubmit = async (data: any) => {
    try {
      console.log(data); // This will contain all student records
      setupdateRecordsLoading(true);
      const { data: resData } = await axios.post(
        "/api/classes/updateStudentRecords",
        {
          activityRecordId: selectedTodaysClass?._id,
          studentRecords: data.students,
          mainStudyTopic: data.mainStudyTopic,
        }
      );

      if (resData?.statusCode == 200) {
        handleconfirmModalClose();
        dispatch(updateTodaysClassRecord(resData.updatedActivityRecord));
      }
      notify(resData.msg, resData.statusCode);
    } catch (error) {
      console.log("studentactivity.tsx updatestudentsrecord", error);
    } finally {
      setupdateRecordsLoading(false);
    }
  };

  // Add loading indicator to your form
  if (isLoadingClass) {
    return (
      <div className="bg-white rounded-md  flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
        <CircularProgress />
        <span className="mt-2">Loading record...</span>
      </div>
    );
  }

  return (
    <>
      <form
        className="overflow-x-auto rounded-md "
        onSubmit={handleSubmit(onSubmit)}
        key={selectedTodaysClass?._id || "new-class"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
      >
        {/* mainstudytopic-assigneduser */}
        <div className="mainstudytopic-assigneduser flex justify-between items-center">
          <div className="mainStudyTopic mb-3 ">
            <Controller
              name="mainStudyTopic" // Name of the field
              control={control}
              rules={{ required: "Main study topic is required" }} // Validation rule
              render={({ field }) => (
                <Dropdown
                  options={selectedCourseLessons || []}
                  selected={field.value || ""}
                  label="Main study topic"
                  // disabled={}
                  onChange={(value: any) => field.onChange(value)}
                  error={!!errors.mainStudyTopic} // Pass error state
                  helperText={errors.mainStudyTopic?.message} // Error message
                />
              )}
            />
          </div>

          <p className="text-sm">
            <span className="font-bold mr-2">Assigned by:</span>
            {selectedTodaysClass?.assignedByName}
          </p>
        </div>
        <div className="min-w-full flex flex-col gap-2">
          {/* Header row */}
          <div className="text-sm w-full bg-gray-200 grid grid-cols-[60px,repeat(6,1fr)] items-center border-b">
            <div className="py-3 text-center font-bold text-gray-600">SN</div>
            <div className="py-3 text-left font-bold text-gray-600 ">Name</div>
            <div className="py-3 text-left  font-bold text-gray-600 col-span-2">
              Study Topic
            </div>
            <div className="py-3 text-center font-bold text-gray-600 ">
              Completed Status
            </div>
            <div className="py-3 text-center font-bold text-gray-600 ">
              Remark
            </div>
            <div className="py-3 text-center font-bold text-gray-600 ">
              Attendance
            </div>
          </div>

          {/* Body content */}

          <div className="studentlist-container max-h-[370px] overflow-y-auto">
            {students?.length === 0 && selectedTodaysClass ? (
              <div className="text-sm grid grid-cols-6">
                <div className="col-span-7 text-center px-4 py-2">
                  No Students.
                </div>
              </div>
            ) : (
              students?.map((student: any, i: any) => (
                <div
                  key={"student" + student?._id}
                  className="text-sm grid grid-cols-[60px,repeat(6,1fr)] items-center border-b hover:bg-gray-50"
                >
                  <div className=" text-center py-2">{i + 1}</div>
                  <div className=" py-2 flex flex-wrap">{student?.name}</div>

                  {/* Study Topics */}
                  <div className=" py-2 col-span-2 flex  items-start  flex-wrap gap-2">
                    {student?.studyTopics?.map((topic: any, index: any) => (
                      <span
                        key={"topic" + index}
                        className="text-black border text-xs shadow-sm outline-none w-max h-max py-1 px-1.5  rounded-full flex items-center gap-1"
                      >
                        {topic}
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            // Remove the topic from the student's studyTopics
                            const updatedStudents: any = students.map(
                              (s: any) => {
                                if (s._id === student._id) {
                                  return {
                                    ...s,
                                    studyTopics: s.studyTopics.filter(
                                      (_: any, i: any) => i !== index
                                    ),
                                  };
                                }
                                return s;
                              }
                            );
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
                          onChange={(value: any) => setSelectedTopic(value)}
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
                  <div className=" py-2 text-center ">
                    <Controller
                      name={`students[${i}].completedStatus`}
                      control={control}
                      render={({ field }) => (
                        <input
                          title="Assignment complete status"
                          type="checkbox"
                          {...field}
                          checked={field.value || false}
                          className="scale-125 cursor-pointer"
                        />
                      )}
                    />
                  </div>

                  {/* Remark Textbox */}
                  <div className=" py-2 text-center">
                    <Controller
                      name={`students[${i}].remark`}
                      control={control}
                      render={({ field }) => (
                        <TextareaAutosize
                          {...field}
                          title="Remark"
                          placeholder="Add remark"
                          className="border border-gray-400 rounded-md text-xs w-full  py-1 px-2"
                        />
                      )}
                    />
                  </div>

                  {/* Attendance Toggle Button */}
                  <div className=" py-2 text-center">
                    <Controller
                      name={`students[${i}].attendance`}
                      control={control}
                      render={({ field }) => (
                        <Button
                          {...field}
                          title="Attendance"
                          variant="contained"
                          size="small"
                          color={
                            field.value === "present" ? "success" : "error"
                          }
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
              <Button
                onClick={handleconfirmModalOpen}
                variant="contained"
                color="primary"
              >
                Update Records
              </Button>
            </div>
          )}

          {/* Hidden Submit Button */}
          <button type="submit" id="hiddenSubmit" hidden></button>

          {/* confirm modal */}
          <Modal
            open={confirmModalOpen}
            onClose={handleconfirmModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-6 text-gray-600">
                You want update student activity records.
              </p>
              <div className="buttons flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleconfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>

                {updateRecordsLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updateRecordsLoading}
                    loadingPosition="start"
                    variant="contained"
                    className="mt-7"
                  >
                    <span className="">Updating</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    disabled={!isValid}
                    onClick={() => {
                      document.getElementById("hiddenSubmit")?.click();
                    }}
                  >
                    Update Records
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </form>
    </>
  );
};

export default StudentActivity;
