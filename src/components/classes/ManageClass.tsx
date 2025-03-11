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
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
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
import { useDispatch } from "react-redux";
import { addActiveAssignedClass } from "@/redux/assignedClassesSlice";
import utc from "dayjs/plugin/utc";
import { fetchAllTrainers } from "@/redux/allListSlice";

dayjs.extend(weekOfYear);
dayjs.extend(utc);

const ManageClass = ({ selectedDate }) => {
  console.log("selectedDate", selectedDate);

  const dis = useDispatch<any>();
  const [affiliatedTo, setaffiliatedTo] = useState("HCA");
  const [holidayStatus, setholidayStatus] = useState(false);
  const [trainersList, setTrainersList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [allBatchList, setallBatchList] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [allStudents, setallStudents] = useState([]);
  const [selectedBatchStudents, setselectedBatchStudents] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [projectId, setprojectId] = useState("");

  const selectedDateUTC = dayjs(selectedDate).startOf("day");
  const todayUTC = dayjs().startOf("day");
  const isPastDate = selectedDateUTC.isBefore(todayUTC, "day");

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
      // holiday status from state variable

      holidayDescription: "",
      trainerPresentStatus: "absent",
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

  const handleContractTypeChange = (contract) => {
    setaffiliatedTo(contract);
  };

  // form submit function (assign class)
  const onSubmit = async (data) => {
    try {
      const { data: resData } = await axios.post("/api/classes/assignClass", {
        ...data,
        // date = selected date to get weekStartDate , weekEndDate, weekNumber in server side (assignClass route)
        date: selectedDate,
        holidayStatus,
        affiliatedTo,
        trainerPresentStatus: holidayStatus ? "holiday" : "absent",
      });
      if (resData.statusCode === 200) {
        // Notify success
        notify(resData.msg, resData.statusCode);

        // Dispatch the action to update Redux state
        dis(addActiveAssignedClass(resData.savedNewAssignClass));
      } else {
        notify(resData.msg, resData.statusCode);
      }
    } catch (error) {
      console.log("Internal error in manageclass (assignclassroute)");
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
      batchName: "",
      batchId: "",
      startTime: "",
      endTime: "",
      // holiday status from state variable
      holidayDescription: "",
      trainerPresentStatus: "absent",
    });
    setBatchId(""); // Reset batchId state
    setprojectId(""); // Reset projectId state
  }, [affiliatedTo, holidayStatus, reset]);

  useEffect(() => {
    if (batchId !== "") {
      const tempAllStudents = allStudents.filter((student) =>
        student.batches.some(
          (batch) =>
            batch.batchId == batchId &&
            batch.activeStatus && // Ensure batch is active
            !batch.endDate // Exclude completed batches
        )
      );
      setselectedBatchStudents(tempAllStudents);
    } else {
      setselectedBatchStudents([]); // Clear students if no batchId is selected
    }
  }, [batchId, allStudents]);

  // Filter batches based on affiliatedTo
  useEffect(() => {
    console.log(projectId);

    let tempFilteredBatches;
    if (affiliatedTo.toLowerCase() === "hca") {
      tempFilteredBatches = allBatchList.filter(
        (batch) => batch?.affiliatedTo.toLowerCase() === "hca"
      );
    } else if (affiliatedTo.toLowerCase() === "school") {
      tempFilteredBatches = allBatchList.filter(
        (batch) => batch?.affiliatedTo.toLowerCase() === "school"
      );
      if (projectId !== "") {
        tempFilteredBatches = tempFilteredBatches.filter(
          (batch) => batch?.projectId === projectId
        );
      }
    }
    console.log(tempFilteredBatches);

    setFilteredBatches(tempFilteredBatches || []);
  }, [affiliatedTo, allBatchList, projectId]);

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

      const { data: batchResData } = await axios.get(
        "/api/batches/getAllBatches"
      );

      let tempAllBatches = batchResData.allBatches.filter(
        (batch) => batch.activeStatus == true
      );
      setallBatchList(tempAllBatches);

      const { data: allStudentsResData } = await axios.get(
        "/api/students/getAllStudents"
      );
      const tempAllStudents = [
        ...allStudentsResData.allHcaAffiliatedStudents,
        ...allStudentsResData.allNonAffiliatedStudents,
      ];
      setallStudents(tempAllStudents);
    } catch (error) {
      console.log("Error in ManageClass component", error);
    }
  };

  // initial data
  useEffect(() => {
    getInitialData();
    dis(fetchAllTrainers());
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-4 rounded-lg"
    >
      {/* Project Selection */}
      <div className="header flex justify-between items-center">
        <h1 className="text-lg  font-bold ">Assign Class for {affiliatedTo}</h1>
        {/* <Button type="submit" variant="contained" disabled={isPastDate}> */}
        <Button type="submit" variant="contained">
          Assign
        </Button>
      </div>
      <p className="mb-2">
        {dayjs(selectedDate).format("MMMM D, YYYY, dddd")}
        <span className="ml-4">#Week{dayjs(selectedDate).week()}</span>
      </p>
      <div className=" flex justify-between gap-2 mb-2">
        <div className="buttons flex gap-2 items-center">
          <Button
            variant={affiliatedTo === "HCA" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("HCA")}
          >
            HCA
          </Button>
          <Button
            variant={affiliatedTo === "School" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("School")}
          >
            School
          </Button>
        </div>
        {/* holiday status container */}
        <div className="holiday-container">
          <FormControlLabel
            control={
              <Radio
                checked={!holidayStatus} // Holiday is selected when holidayStatus is true
                onChange={() => {
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
                checked={holidayStatus} // Holiday is selected when holidayStatus is true
                onChange={() => {
                  setholidayStatus(true);
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
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
        {/* Project Name (only shown for School) */}
        {affiliatedTo === "School" && (
          <Controller
            name="projectName"
            control={control}
            rules={{ required: "Project is required" }}
            render={({ field }) => (
              <Dropdown
                label="Project name"
                options={projectList.map((project) => project.name)}
                selected={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  const selectedProject = projectList.find(
                    (project) => project.name === value
                  );
                  setValue("projectId", selectedProject?._id || "");
                  setprojectId(selectedProject?._id);
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
        <Controller
          name="batchName"
          control={control}
          rules={{ required: "Batch is required" }}
          render={({ field }) => (
            <Dropdown
              label="Batch"
              options={filteredBatches.map((batch) => batch.batchName)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedBatch = filteredBatches.find(
                  (batch) => batch.batchName === value
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

        {/* Course Name */}
        <Controller
          name="courseName"
          control={control}
          rules={{ required: "Course is required" }}
          render={({ field }) => (
            <Dropdown
              label="Course name"
              options={courseList.map((course) => course.name)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedCourse = courseList.find(
                  (course) => course.name === value
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

        {/* Trainer Name */}
        <Controller
          name="trainerName"
          control={control}
          rules={{ required: "Trainer is required" }}
          render={({ field }) => (
            <Dropdown
              label="Trainer name"
              options={trainersList.map((trainer) => trainer.name)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedTrainer = trainersList.find(
                  (trainer) => trainer.name === value
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
      </div>
      <Divider sx={{ margin: "1rem 0" }} />
      {/* Students List */}
      <div>
        <h1 className="text-lg font-bold mb-2">Students</h1>
        {selectedBatchStudents.length === 0 ? (
          <p>No Students</p>
        ) : (
          <div className="flex gap-4">
            {selectedBatchStudents.map((student, i) => (
              <p
                key={i}
                className="border px-4 rounded-full text-sm shadow-md py-1"
              >
                {student.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default ManageClass;
