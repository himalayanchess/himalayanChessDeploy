import React, { useEffect, useState } from "react";
import {
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  Modal,
  Box,
} from "@mui/material";
import { School, BookOpenCheck, Users } from "lucide-react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import axios from "axios";
import Input from "../Input";
import { useForm, Controller } from "react-hook-form";
import Dropdown from "../Dropdown";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import { addActiveAssignedClass } from "@/redux/assignedClassesSlice";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  fetchAllBatches,
  fetchAllTrainers,
  getAllStudents,
} from "@/redux/allListSlice";
import { useSession } from "next-auth/react";
import { LoadingButton } from "@mui/lab";

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ManageClass = ({ selectedDate }: any) => {
  // console.log("selectedDate in manage class", selectedDate);

  const dis = useDispatch<any>();
  const session = useSession();
  // use selectors
  const { allActiveStudentsList, allActiveBatches } = useSelector(
    (state: any) => state.allListReducer
  );
  //state vars

  const [affiliatedTo, setaffiliatedTo] = useState("HCA");
  const [holidayStatus, setholidayStatus] = useState(false);
  const [isPlayDay, setisPlayDay] = useState(false);
  const [trainersList, setTrainersList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatchStudents, setselectedBatchStudents] = useState<any>([]);
  const [batchId, setBatchId] = useState("");
  const [projectId, setprojectId] = useState("");
  const [assignClassLoading, setassignClassLoading] = useState(false);
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  const selectedDateUTC = dayjs(selectedDate).startOf("day");
  const todayUTC = dayjs().startOf("day");
  const isPastDate = selectedDateUTC.isBefore(todayUTC, "day");

  // modal operation
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }

  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      // pass date = selectedDate from state variable to server side
      trainerName: "",
      trainerId: "",
      courseName: "",
      courseId: "",
      projectName: "",
      projectId: "",
      batchName: "",
      batchId: "",
      startTime: "",
      endTime: "",
      trainerRole: "Primary",
      // isPlayDay from state variable
      // holiday status from state variable

      holidayDescription: "",
      userPresentStatus: "absent",
    },
  });
  // time order validation
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  // Validation for startTime should be before endTime
  const validateTimeOrder = () => {
    if (startTime && endTime && dayjs(startTime).isAfter(dayjs(endTime))) {
      return "Invalid time slot";
    }
    return true;
  };

  const handleContractTypeChange = (contract: any) => {
    setaffiliatedTo(contract);
  };

  // form submit function (assign class)
  const onSubmit = async (data: any) => {
    try {
      setassignClassLoading(true);
      const { data: resData } = await axios.post("/api/classes/assignClass", {
        ...data,
        // date = selected date to get weekStartDate , weekEndDate, weekNumber in server side (assignClass route)
        date: selectedDate,
        holidayStatus,
        affiliatedTo,
        isPlayDay,
        userPresentStatus: holidayStatus ? "holiday" : "absent",
        assignedById: session?.data?.user?._id,
        assignedByName: session?.data?.user?.name,
      });
      if (resData.statusCode === 200) {
        handleconfirmModalClose();
        // Notify success
        notify(resData.msg, resData.statusCode);

        // Dispatch the action to update Redux state
        dis(addActiveAssignedClass(resData.savedNewAssignClass));
      } else {
        notify(resData.msg, resData.statusCode);
      }
    } catch (error) {
      console.log("Internal error in manageclass (assignclassroute)");
    } finally {
      setassignClassLoading(false);
    }
  };

  // Reset form when affiliatedTo changes
  useEffect(() => {
    reset({
      trainerName: "",
      trainerId: "",
      courseName: "",
      courseId: "",
      projectName: affiliatedTo.toLowerCase() === "school" ? "" : "",
      projectId: affiliatedTo.toLowerCase() === "school" ? "" : "",
      batchName: isPlayDay ? "All HCA Batches" : "",
      batchId: "",
      startTime: "",
      endTime: "",
      // holiday status from state variable
      holidayDescription: "",
      userPresentStatus: "absent",
    });
    setBatchId(""); // Reset batchId state
    setprojectId(""); // Reset projectId state
  }, [affiliatedTo, holidayStatus, isPlayDay, reset]);

  // fitler selected batch students
  useEffect(() => {
    if (isPlayDay) {
      // Filter all HCA students in active, non-ended batches
      const hcaStudents = allActiveStudentsList.filter(
        (student: any) =>
          student.affiliatedTo?.toLowerCase() === "hca" &&
          student.batches.some(
            (batch: any) => batch.activeStatus && !batch.endDate
          )
      );

      // Optional: remove duplicate students if needed (based on _id)
      const uniqueStudents = Array.from(
        new Map(hcaStudents.map((s: any) => [s._id, s])).values()
      );

      console.log("Playday HCA students:", uniqueStudents);
      setselectedBatchStudents(uniqueStudents);
    } else if (batchId !== "") {
      const tempAllStudents = allActiveStudentsList.filter((student: any) =>
        student.batches.some(
          (batch: any) =>
            batch.batchId == batchId && batch.activeStatus && !batch.endDate
        )
      );
      console.log("Batch-specific students:", tempAllStudents);
      setselectedBatchStudents(tempAllStudents);
    } else {
      setselectedBatchStudents([]);
    }
  }, [isPlayDay, batchId, allActiveStudentsList]);

  // Filter batches based on affiliatedTo and projectId
  useEffect(() => {
    let tempFilteredBatches;
    if (affiliatedTo.toLowerCase() === "hca") {
      tempFilteredBatches = allActiveBatches.filter(
        (batch: any) => batch?.affiliatedTo.toLowerCase() === "hca"
      );
    } else if (affiliatedTo.toLowerCase() === "school") {
      tempFilteredBatches = allActiveBatches.filter(
        (batch: any) => batch?.affiliatedTo.toLowerCase() === "school"
      );
      if (projectId !== "") {
        tempFilteredBatches = tempFilteredBatches.filter(
          (batch: any) => batch?.projectId === projectId
        );
      }
    }

    setFilteredBatches(tempFilteredBatches || []);
  }, [affiliatedTo, allActiveBatches, projectId]);

  const getInitialData = async () => {
    try {
      const { data: trainersResData } = await axios.get(
        "/api/users/getTrainersList"
      );
      setTrainersList(trainersResData.trainersList);

      const { data: courseResData } = await axios.get(
        "/api/courses/getAllCourses"
      );
      setCourseList(courseResData.allCourses);

      const { data: projectResData } = await axios.get(
        "/api/projects/getAllProjects"
      );
      setProjectList(projectResData.allProjects);
    } catch (error) {
      console.log("Error in ManageClass component", error);
    }
  };

  // initial data
  useEffect(() => {
    getInitialData();
    dis(fetchAllTrainers());
    dis(getAllStudents());
    dis(fetchAllBatches());
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleconfirmModalOpen(); // Open modal instead of submitting form
        }
      }}
      className="bg-white px-4 rounded-lg"
    >
      {/* Project Selection */}
      <div className="header flex justify-between items-center">
        <h1 className="text-lg  font-bold flex items-center">
          <BookOpenCheck />
          <span className="ml-2">Assign Class for {affiliatedTo}</span>
        </h1>
        {/* <Button type="submit" variant="contained" disabled={isPastDate}> */}

        <Button
          onClick={handleconfirmModalOpen}
          variant="contained"
          disabled={isPastDate}
        >
          <AssignmentTurnedInIcon />
          <span className="ml-2">Assign</span>
        </Button>
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
              You want to assign class to trainer.
            </p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleconfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>

              {assignClassLoading ? (
                <LoadingButton
                  size="large"
                  loading={assignClassLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Assigning</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    document.getElementById("hiddenSubmit")?.click();
                  }}
                >
                  Assign Class
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </div>
      <p className="mb-2">
        {dayjs().tz(timeZone).startOf("day").format("MMMM D, YYYY - dddd")}
        <span className="ml-4">
          #Week{dayjs().tz(timeZone).startOf("day").week()}
        </span>
      </p>
      <div className=" flex justify-between gap-2 mb-2">
        <div className="buttons flex gap-2 items-center">
          <Button
            variant={affiliatedTo === "HCA" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("HCA")}
          >
            <SchoolOutlinedIcon />
            <span className="ml-2">HCA</span>
          </Button>
          <Button
            variant={affiliatedTo === "School" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("School")}
          >
            <School />
            <span className="ml-2">School</span>
          </Button>
        </div>
        {/* holiday status container */}
        <div className="holiday-container">
          <FormControlLabel
            control={
              <Radio
                checked={!isPlayDay && !holidayStatus} // Workday is selected when both are false
                onChange={() => {
                  // Deselect both holiday and play day for work day
                  setisPlayDay(false);
                  setholidayStatus(false);
                }}
                color="default"
              />
            }
            label="Workday"
          />
          <FormControlLabel
            control={
              <Radio
                checked={isPlayDay}
                onChange={() => {
                  // Select play day, deselect holiday
                  setisPlayDay(true);
                  setholidayStatus(false);
                }}
                color="default"
              />
            }
            label="Playday"
          />
          <FormControlLabel
            control={
              <Radio
                checked={holidayStatus}
                onChange={() => {
                  // Select holiday, deselect play day
                  setholidayStatus(true);
                  setisPlayDay(false);
                }}
                color="default"
              />
            }
            label="Holiday"
          />
        </div>
      </div>
      {/* holiday description if (holiday) */}
      {holidayStatus && (
        // holiday description
        <Controller
          name="holidayDescription"
          control={control}
          rules={{
            required: "Description is required",
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Holiday description"
              error={errors.holidayDescription}
              helperText={errors.holidayDescription?.message}
              required={true}
            />
          )}
        />
      )}

      {/*  start time end time (if not holiday) */}
      {!holidayStatus && (
        /* time slots */
        <div className="timeSlots flex gap-2 mb-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="startTime"
              control={control}
              rules={{
                required: "Start time is required",
                validate: validateTimeOrder,
              }}
              render={({ field }) => (
                <TimePicker
                  label="Start Time"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.toISOString() : null);
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors.startTime,
                      helperText: errors.startTime?.message,
                      size: "small", // Decreases input size
                      sx: { fontSize: "0.8rem", width: "150px" }, // Adjust width & font size
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "0.8rem",
                      height: "35px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
          {/*  end time */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="endTime"
              control={control}
              rules={{
                required: "End time is required",
                validate: validateTimeOrder,
              }}
              render={({ field }) => (
                <TimePicker
                  label="End Time"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => {
                    field.onChange(newValue ? newValue.toISOString() : null);
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors.endTime,
                      helperText: errors.endTime?.message,
                      size: "small", // Decreases input size
                      sx: { fontSize: "0.8rem", width: "150px" }, // Adjust width & font size
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "0.8rem",
                      height: "35px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
      )}
      {/* time selection */}

      {/* playday and all batch students includes message */}
      {isPlayDay && (
        <div className="message bg-yellow-100 rounded-md p-2 my-3 border-2 border-yellow-200 text-sm">
          <p>
            Please select the <b>&quot;Playday&quot;</b> option only on the
            designated day, i.e.
            <b> Sunday</b>.
          </p>
          <p>
            This option applies to students from <b>all HCA batches</b> and
            should be used accordingly.
          </p>
        </div>
      )}
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
        {/* Project Name (only shown for School) */}
        {affiliatedTo?.toLowerCase() === "school" && (
          <Controller
            name="projectName"
            control={control}
            rules={{ required: "Project is required" }}
            render={({ field }) => (
              <Dropdown
                label="Project name"
                options={projectList.map((project: any) => project.name)}
                selected={field.value}
                onChange={(value: any) => {
                  field.onChange(value);
                  const selectedProject: any = projectList.find(
                    (project: any) => project.name === value
                  );
                  setValue("projectId", selectedProject?._id || "");
                  setprojectId(selectedProject?._id);
                  setValue("batchName", "");
                  setValue("batchId", "");
                }}
                error={errors.projectName}
                helperText={errors.projectName?.message}
                width="full"
                required
              />
            )}
          />
        )}

        {/* Batch Name */}
        {!isPlayDay && (
          <Controller
            name="batchName"
            control={control}
            rules={{ required: "Batch is required" }}
            render={({ field }) => (
              <Dropdown
                label="Batch"
                options={filteredBatches.map((batch: any) => batch.batchName)}
                selected={field.value}
                onChange={(value: any) => {
                  field.onChange(value);
                  const selectedBatch: any = filteredBatches.find(
                    (batch: any) => batch.batchName === value
                  );
                  setValue("batchId", selectedBatch?._id || "");
                  setBatchId(selectedBatch?._id);
                }}
                error={errors.batchName}
                helperText={errors.batchName?.message}
                width="full"
                required
              />
            )}
          />
        )}

        {/* Course Name */}
        {!isPlayDay && (
          <Controller
            name="courseName"
            control={control}
            rules={{ required: "Course is required" }}
            render={({ field }) => (
              <Dropdown
                label="Course name"
                options={courseList.map((course: any) => course.name)}
                selected={field.value}
                onChange={(value: any) => {
                  field.onChange(value);
                  const selectedCourse: any = courseList.find(
                    (course: any) => course.name === value
                  );
                  setValue("courseId", selectedCourse?._id || "");
                }}
                error={errors.courseName}
                helperText={errors.courseName?.message}
                width="full"
                required
              />
            )}
          />
        )}

        {/* Trainer Name */}
        <Controller
          name="trainerName"
          control={control}
          rules={{ required: "Trainer is required" }}
          render={({ field }) => (
            <Dropdown
              label="Trainer name"
              options={trainersList.map((trainer: any) => trainer.name)}
              selected={field.value}
              onChange={(value: any) => {
                field.onChange(value);
                const selectedTrainer: any = trainersList.find(
                  (trainer: any) => trainer.name === value
                );
                setValue("trainerId", selectedTrainer?._id || "");
              }}
              error={errors.trainerName}
              helperText={errors.trainerName?.message}
              width="full"
              required
            />
          )}
        />

        {/* trainer role */}
        <Controller
          name="trainerRole"
          control={control}
          rules={{ required: "Trainer role is required" }}
          render={({ field }) => (
            <Dropdown
              label="Trainer Role"
              options={["Primary", "Substitute"]}
              selected={field.value}
              onChange={(value: any) => {
                field.onChange(value);
              }}
              error={errors.trainerRole}
              helperText={errors.trainerRole?.message}
              width="full"
              required
            />
          )}
        />
      </div>
      <Divider sx={{ margin: "1rem 0" }} />
      {/* Students List */}
      <div className="flex-1">
        <h1 className="text-lg font-bold mb-2 flex items-center">
          <Users />
          <span className="ml-2 text-lg">Students</span>
        </h1>
        {selectedBatchStudents.length === 0 ? (
          <p>No Students</p>
        ) : (
          <div className="flex-1 h-[220px] flex flex-col rounded-md overflow-y-auto border">
            {/* heading */}
            <div className="heading grid grid-cols-[70px,repeat(4,1fr)] bg-gray-200 text-sm">
              <span className="py-2 text-center font-bold">SN</span>
              <span className="py-2 col-span-2 font-bold">Name</span>
              <span className="py-2  col-span-2 font-bold">Gender</span>
            </div>
            {/* students list */}

            {selectedBatchStudents.map((student: any, i: any) => (
              <div
                key={`${student?.name}${i}`}
                className="heading grid grid-cols-[70px,repeat(4,1fr)] border-b text-sm"
              >
                <span className="py-2 text-center ">{i + 1}</span>
                <span className="py-2  col-span-2">{student?.name}</span>
                <span className="py-2   col-span-2">
                  {student?.gender}
                </span>{" "}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default ManageClass;
