import React, { useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Modal } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Dropdown from "../Dropdown";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Input";
import axios from "axios";
import { notify } from "@/helpers/notify";
import {
  removeActiveAssignedClass,
  updateActiveAssignedClass,
} from "@/redux/assignedClassesSlice";
import { trainerRoleOptions } from "@/options/projectOptions";
import { presentStatusOptions } from "@/options/activitiyRecordOptions";

dayjs.extend(weekOfYear);

const ViewAssignedClass = ({ assignedClass, handleClose }) => {
  const dis = useDispatch();
  // redux states
  const { allTrainerList, status } = useSelector(
    (state) => state.allListReducer
  );

  const [affiliatedTo, setaffiliatedTo] = useState(
    assignedClass?.affiliatedTo?.toLowerCase() == "hca" ? "HCA" : "School"
  );
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);

  //handleDeleteModalOpen
  function handleDeleteModalOpen() {
    setdeleteModalOpen(true);
  }

  //handleDeleteModalClose
  function handleDeleteModalClose() {
    setdeleteModalOpen(false);
  }

  console.log(assignedClass);
  //   react hook from
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
      trainerName: assignedClass?.trainerName,
      trainerId: assignedClass?.trainerId,
      userPresentStatus: assignedClass?.userPresentStatus,
    },
  });

  // handleAssignedClassDelete
  async function handleAssignedClassDelete() {
    try {
      const { data: resData } = await axios.post(
        "/api/classes/deleteClass",
        assignedClass
      );
      if (resData.statusCode == 200) {
        handleClose();
        dis(removeActiveAssignedClass(assignedClass));
      }
      notify(resData.msg, resData.statusCode);
    } catch (error) {
      console.log("Error in view assigned class (deleteClass route)");
    }
  }

  //onSubmit
  async function onSubmit(data) {
    try {
      const { data: resData } = await axios.post("/api/classes/updateClass", {
        ...assignedClass,
        ...data,
      });
      if (resData?.statusCode == 200) {
        handleClose();
        dis(updateActiveAssignedClass(resData?.updatedClass));
      }
      notify(resData?.msg, resData?.statusCode);
    } catch (error) {
      console.log("Error in ViewAssignedClass component (editclass)", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-lg font-bold">{assignedClass?.batchName}</h1>
      <div className="projectbutton-submit flex justify-between">
        <p className="mb-2">
          {dayjs(assignedClass?.date).format("MMMM D, YYYY, dddd")}
          <span className="ml-4">#Week{dayjs(assignedClass?.date).week()}</span>
        </p>
        {/* submit buttons */}
        <div className="submit-buttons flex gap-4">
          {/* delete */}
          <Button
            variant="outlined"
            color="error"
            disabled={assignedClass?.recordUpdatedByTrainer}
            onClick={handleDeleteModalOpen}
          >
            <DeleteIcon />
            <span className="ml-1">Delete</span>
          </Button>
          {/* delete Modal */}
          <Modal
            open={deleteModalOpen} // Ensure modal is only open for the selected class
            onClose={handleDeleteModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] max-h-[90%] p-6 overflow-y-auto flex flex-col items-center bg-white rounded-xl shadow-lg">
              <h1 className="text-xl font-bold">Confirm Delete?</h1>
              <p className="text-sm mb-3">Are you sure you want to delete</p>
              <p className="text-md ">{assignedClass?.batchName}</p>
              <div className="buttons flex gap-3 mt-4">
                <Button variant="outlined" onClick={handleDeleteModalClose}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleAssignedClassDelete}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>
          {/* edit */}
          <Button
            disabled={assignedClass?.recordUpdatedByTrainer}
            type="submit"
            variant="contained"
          >
            <EditIcon />
            <span className="ml-1">Update</span>
          </Button>
        </div>
      </div>
      <div className=" flex flex-col gap-2 ">
        {/* project-buttons */}
        <div className="project-buttons flex gap-2 items-center mb-2">
          <Button
            variant={affiliatedTo === "HCA" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("HCA")}
            disabled
          >
            HCA
          </Button>
          <Button
            variant={affiliatedTo === "School" ? "contained" : "outlined"}
            color="success"
            disableElevation
            onClick={() => handleContractTypeChange("School")}
            disabled
          >
            School
          </Button>

          {assignedClass?.isPlayDay && (
            <p className="bg-yellow-100 border-2 border-yellow-200 text-sm py-2 px-4 rounded-md">
              Play day
            </p>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
          {!assignedClass?.isPlayDay && (
            <div className="col-span-2 ">
              <Input
                label="Course"
                value={assignedClass?.courseName || ""}
                onChange={() => {}}
                disabled
              />
            </div>
          )}
          <div className="col-span-2 mb-2 grid grid-cols-2 gap-3">
            <Input
              label="Project"
              value={assignedClass?.projectName || "HCA"}
              onChange={() => {}}
              disabled
            />
            <Input
              label="Trainer role"
              value={assignedClass?.trainerRole || "N/A"}
              onChange={() => {}}
              disabled
            />
          </div>
          {/* start time */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              disabled
              value={
                assignedClass?.startTime
                  ? dayjs(assignedClass?.startTime)
                  : null
              } // Convert endTime to dayjs if not null
              slotProps={{
                textField: {
                  size: "small", // Decreases input size
                  sx: { fontSize: "0.8rem", width: "full" }, // Adjust width & font size
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  height: "35px",
                },
              }}
            />
          </LocalizationProvider>
          {/* end time */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="End Time"
              disabled
              value={
                assignedClass?.endTime ? dayjs(assignedClass?.endTime) : null
              } // Convert endTime to dayjs if not null
              slotProps={{
                textField: {
                  size: "small", // Decreases input size
                  sx: { fontSize: "0.8rem", width: "full" }, // Adjust width & font size
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  height: "35px",
                },
              }}
            />
          </LocalizationProvider>
          {/* Trainer Name */}
          <Controller
            name="trainerName"
            control={control}
            rules={{ required: "Trainer is required" }}
            render={({ field }) => (
              <Dropdown
                label="Trainer name"
                options={allTrainerList.map((trainer) => trainer.name)}
                selected={field.value}
                disabled={assignedClass?.recordUpdatedByTrainer}
                onChange={(value) => {
                  field.onChange(value);
                  const selectedTrainer = allTrainerList.find(
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

          {/* trainer present status */}
          {assignedClass?.holidayStatus ? (
            <Input
              label="Attendance"
              value={assignedClass?.userPresentStatus}
              onChange={() => {}}
              disabled
              required={true}
            />
          ) : (
            <Controller
              name="userPresentStatus"
              control={control}
              rules={{ required: "Attendance is required" }}
              render={({ field }) => (
                <Dropdown
                  label="Attendance"
                  options={presentStatusOptions}
                  selected={field.value}
                  disabled={assignedClass?.recordUpdatedByTrainer}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  error={errors.userPresentStatus}
                  helperText={errors.userPresentStatus?.message}
                  width="full"
                  required
                />
              )}
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default ViewAssignedClass;
