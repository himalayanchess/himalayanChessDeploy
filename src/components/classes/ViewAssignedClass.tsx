import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Divider, Modal } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LoadingButton } from "@mui/lab";

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
import { Check, Component, X } from "lucide-react";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);

const timeZone = "Asia/Kathmandu";

const ViewAssignedClass = ({ assignedClass, handleClose }: any) => {
  const dis = useDispatch();
  // redux states
  const { allTrainerList, status } = useSelector(
    (state: any) => state.allListReducer
  );

  const [affiliatedTo, setaffiliatedTo] = useState<any>(
    assignedClass?.affiliatedTo?.toLowerCase() == "hca" ? "HCA" : "School"
  );
  const [updateClassLoading, setupdateClassLoading] = useState(false);
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);
  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

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
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<any>({
    defaultValues: {
      // pass date = selectedDate from state variable to server side
      startTime: assignedClass?.startTime
        ? dayjs(assignedClass?.startTime).tz(timeZone).toISOString()
        : null,
      endTime: assignedClass?.endTime
        ? dayjs(assignedClass?.endTime).tz(timeZone).toISOString()
        : null,
      trainerRole: assignedClass?.trainerRole,
      trainerName: assignedClass?.trainerName,
      trainerId: assignedClass?.trainerId,
      userPresentStatus: assignedClass?.userPresentStatus,
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
  async function onSubmit(data: any) {
    try {
      setupdateClassLoading(true);
      const { data: resData } = await axios.post("/api/classes/updateClass", {
        recordId: assignedClass?._id,
        ...data,
      });
      if (resData?.statusCode == 200) {
        handleClose();
        dis(updateActiveAssignedClass(resData?.updatedClass));
      }
      notify(resData?.msg, resData?.statusCode);
    } catch (error) {
      console.log("Error in ViewAssignedClass component (editclass)", error);
    } finally {
      setupdateClassLoading(false);
    }
  }

  return (
    <form
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleconfirmModalOpen(); // Open modal instead of submitting form
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="batchname-submit flex justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Component />
          <span className="ml-2">{assignedClass?.batchName}</span>
        </h1>

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

          {/* update button */}
          <Button
            onClick={handleconfirmModalOpen}
            variant="contained"
            disabled={assignedClass?.recordUpdatedByTrainer}
            className="mt-2"
          >
            <EditIcon />
            <span className="ml-1">Update</span>
          </Button>
          {/* Hidden Submit Button (Inside Form) */}
          <button type="submit" id="hiddenSubmit1" hidden></button>

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
                You want to update this class.
              </p>
              <div className="buttons flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleconfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {updateClassLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updateClassLoading}
                    loadingPosition="start"
                    variant="contained"
                    className="mt-7"
                  >
                    <span className="">Updating class</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      console.log("clicked");

                      document.getElementById("hiddenSubmit1")?.click();

                      if (!isValid) {
                        handleconfirmModalClose();
                      }
                    }}
                  >
                    <EditIcon />
                    <span className="ml-1">Update</span>
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </div>

      {/* divider */}
      <Divider sx={{ margin: "0.8rem 0" }} />

      <div className="projectbutton-submit flex justify-between">
        <p className="mb-2 text-lg">
          {dayjs(assignedClass?.date).format("MMMM D, YYYY, dddd")}
          <span className="ml-4">#Week{dayjs(assignedClass?.date).week()}</span>
        </p>
      </div>
      <div className=" flex flex-col gap-2 ">
        {/* project-buttons */}
        <div className="project-buttons flex gap-2 items-center mb-2">
          <Button
            variant={affiliatedTo === "HCA" ? "contained" : "outlined"}
            color="success"
            disableElevation
            // onClick={() => handleContractTypeChange("HCA")}
            disabled
          >
            HCA
          </Button>
          <Button
            variant={affiliatedTo === "School" ? "contained" : "outlined"}
            color="success"
            disableElevation
            // onClick={() => handleContractTypeChange("School")}
            disabled
          >
            School
          </Button>

          {assignedClass?.isPlayDay && (
            <p className="bg-yellow-100 border-2 border-yellow-200 text-sm py-2 px-4 rounded-md">
              Play day
            </p>
          )}

          <Button variant="contained" className=" text-gray-700 ml-2" disabled>
            {assignedClass?.classStudyMaterials?.length || 0}
            <span className="ml-1"></span>
            Study Materials
          </Button>

          <p className="text-gray-500">
            Current class number:{" "}
            <span className="font-bold">
              {assignedClass?.currentClassNumber || "N/A"}
            </span>
          </p>
        </div>

        {/* updated-branch */}
        <div className="updated-branch ">
          {assignedClass?.recordUpdatedByTrainer ? (
            <p className="text-sm flex items-center text-green-600">
              <Check size={15} />
              <span className="ml-1">Record updated by trainer</span>
            </p>
          ) : (
            <p className="text-sm flex items-center text-gray-600">
              <X size={15} />
              <span className="ml-1">Not updated by trainer</span>
            </p>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
          {!assignedClass?.isPlayDay && (
            <div className="col-span-2 mb-2">
              <Input
                label="Course"
                value={assignedClass?.courseName || ""}
                onChange={() => {}}
                disabled
              />
            </div>
          )}

          <div className="time  flex justify-between items-end">
            {/* start time */}
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
                        helperText: errors?.startTime?.message as string,
                        size: "small",
                        sx: { fontSize: "0.8rem", width: "150px" },
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

            {/* end time */}
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
                        helperText: errors?.endTime?.message as string,
                        size: "small",
                        sx: { fontSize: "0.8rem", width: "150px" },
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

          {/* branch */}
          <Input
            label="Branch"
            value={assignedClass?.branchName || ""}
            onChange={() => {}}
            disabled
          />
          <div className="col-span-2 mb-2 grid grid-cols-2 gap-3">
            <Input
              label="Project"
              value={assignedClass?.projectName || "HCA"}
              onChange={() => {}}
              disabled
            />
            <Controller
              name="trainerRole"
              control={control}
              rules={{ required: "Trainer role is required" }}
              render={({ field }) => (
                <Dropdown
                  label="Trainer Role"
                  options={["Primary", "Substitute"]}
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  error={errors?.trainerRole}
                  helperText={errors?.trainerRole?.message}
                  width="full"
                  required
                />
              )}
            />
          </div>

          {/* Trainer Name */}
          <Controller
            name="trainerName"
            control={control}
            rules={{ required: "Trainer is required" }}
            render={({ field }) => (
              <Dropdown
                label="Trainer name"
                options={allTrainerList.map((trainer: any) => trainer.name)}
                selected={field.value}
                disabled={assignedClass?.recordUpdatedByTrainer}
                onChange={(value: any) => {
                  field.onChange(value);
                  const selectedTrainer: any = allTrainerList.find(
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
                  onChange={(value: any) => {
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
