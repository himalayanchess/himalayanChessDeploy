import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import BackupIcon from "@mui/icons-material/Backup";

import { Box, Button, Divider, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { notify } from "@/helpers/notify";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  projectCompletedStatusOptions,
  timeOptions,
  trainerRoleOptions,
} from "@/options/projectOptions";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrainers } from "@/redux/allListSlice";
import Link from "next/link";

dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const dayOptions = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const UpdateProject = ({ projectRecord }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { allActiveTrainerList } = useSelector(
    (state: any) => state.allListReducer
  );

  // state vars
  // (to prevent multiple upload of pdf when update, update contractPaper from update contractPaper modal)
  const [updatedcontractFile, setupdatedcontractFile] = useState<File | any>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [updateProjectLoading, setUpdateProjectLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmTrainerDeleteModalOpen, setConfirmTrainerDeleteModalOpen] =
    useState(false);
  const [confirmTimeSlotDeleteModalOpen, setConfirmTimeSlotDeleteModalOpen] =
    useState(false);
  const [updateContractPaperModalOpen, setupdateContractPaperModalOpen] =
    useState<Boolean | null>();
  const [updatedcontractFileName, setupdatedcontractFileName] =
    useState("Not Selected");
  const [selectedDeleteTrainerIndex, setSelectedDeleteTrainerIndex] =
    useState("");
  const [selectedDeleteTimeSlotIndex, setSelectedDeleteTimeSlotIndex] =
    useState("");

  // Modal handlers
  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);

  const handleConfirmTrainerDeleteModalOpen = (trainerIndex: any) => {
    setSelectedDeleteTrainerIndex(trainerIndex);
    setConfirmTrainerDeleteModalOpen(true);
  };
  const handleConfirmTrainerDeleteModalClose = () =>
    setConfirmTrainerDeleteModalOpen(false);

  const handleConfirmTimeSlotDeleteModalOpen = (timeSlotIndex: any) => {
    setSelectedDeleteTimeSlotIndex(timeSlotIndex);
    setConfirmTimeSlotDeleteModalOpen(true);
  };
  const handleConfirmTimeSlotDeleteModalClose = () =>
    setConfirmTimeSlotDeleteModalOpen(false);

  function handleUpdateContratPaperModalClose() {
    setupdateContractPaperModalOpen(false);
    handleUpdateFileRemove();
  }
  function handleUpdateContratPaperModalOpen() {
    setupdateContractPaperModalOpen(true);
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      contractType: "School",
      name: "",
      primaryContact: { name: "", email: "", phone: "" },
      startDate: "",
      endDate: "",
      duration: 12,
      completedStatus: "Ongoing",
      address: "",
      mapLocation: "",
      contractDriveLink: "",
      assignedTrainers: [{ trainerId: "", trainerName: "", trainerRole: "" }],
      timeSlots: [{ day: "", fromTime: "", toTime: "" }],
    },
  });

  const {
    fields: trainerFields,
    append: appendTrainer,
    remove: removeTrainer,
  } = useFieldArray({
    control,
    name: "assignedTrainers",
  });

  const {
    fields: timeSlotFields,
    append: appendTimeSlot,
    remove: removeTimeSlot,
  } = useFieldArray({
    control,
    name: "timeSlots",
  });

  const assignedTrainers = watch("assignedTrainers");
  const timeSlots = watch("timeSlots");

  const isDuplicateTrainer = (trainerName: string, currentIndex: number) => {
    return (
      assignedTrainers.filter(
        (t, idx) => t.trainerName === trainerName && idx !== currentIndex
      ).length > 0
    );
  };

  const isDuplicateTimeSlot = (day: string, currentIndex: number) => {
    return (
      timeSlots.filter((t, idx) => t.day === day && idx !== currentIndex)
        .length > 0
    );
  };

  const addTrainer = () => {
    appendTrainer({
      trainerId: "",
      trainerName: "",
      trainerRole: "",
    });
  };

  const addTimeSlot = () => {
    appendTimeSlot({
      day: "",
      fromTime: "",
      toTime: "",
    });
  };

  // handle update file change
  const handleUpadteFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setupdatedcontractFile(file);
      setupdatedcontractFileName(file.name);
    }
  };
  // handle file remove (edit)
  const handleUpdateFileRemove = () => {
    setupdatedcontractFile(null);
    setupdatedcontractFileName("Not Selected");
  };

  // handle update pdf function
  async function handleUpdatePdf() {
    let updatedContractPaper = "";
    if (!updatedcontractFile) {
      notify("Update pdf file empty", 204);
      return;
    } else {
      const formData = new FormData();
      formData.append("file", updatedcontractFile);

      const folderName = `contractpapers/${projectRecord?.name}`;
      formData.append("folderName", folderName);

      const { data: resData } = await axios.post(
        "/api/fileupload/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // cloudinary error
      if (resData.error) {
        notify("Error uploading file", 204);
        return;
      }
      // cloudinary success
      else {
        updatedContractPaper = resData.res.secure_url;
        // update contractPaper to updatedContractpaper
        const { data: upadteContractPaperResData } = await axios.post(
          "/api/projects/updateContractPaper",
          {
            projectId: projectRecord?._id,
            updatedContractPaper,
          }
        );
        if (upadteContractPaperResData.statusCode == 200) {
          window.location.reload();
          // handleUpdateContratPaperModalClose();
          // handleUpdateFileRemove();
        }
        notify(
          upadteContractPaperResData.msg,
          upadteContractPaperResData.statusCode
        );
        return;
      }
    }
  }

  // submit function
  const onSubmit = async (data) => {
    try {
      setUpdateProjectLoading(true);
      const { data: resData } = await axios.post(
        "/api/projects/updateProject",
        data
      );

      if (resData.statusCode == 200) {
        setConfirmModalOpen(false);
      }
      setUpdateProjectLoading(false);
      notify(resData.msg, resData.statusCode);
    } catch (error) {
      console.log("error in updateProject component (onSubmit)", error);
      setUpdateProjectLoading(false);
    }
  };

  useEffect(() => {
    if (projectRecord) {
      reset({
        ...projectRecord,
        assignedTrainers: projectRecord.assignedTrainers || [],
        timeSlots: projectRecord.timeSlots || [],
      });
      setLoaded(true);
    }
  }, [projectRecord, reset]);

  // fetch initial data
  useEffect(() => {
    dispatch(fetchAllTrainers());
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
      <div className="heading">
        <h1 className="text-2xl font-bold">Update Project</h1>
      </div>
      <Divider sx={{ margin: ".7rem 0" }} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setConfirmModalOpen(true); // Open modal instead of submitting form
          }
        }}
        className="updateprojectform form-fields flex-1 h-full overflow-y-auto grid grid-cols-2 gap-5"
      >
        {/* first grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Contract Type */}
          <Controller
            name="contractType"
            control={control}
            rules={{ required: "Contract type is required" }}
            render={({ field }) => (
              <Dropdown
                label="Contract Type"
                options={["School"]}
                selected={field.value || ""}
                onChange={field.onChange}
                width="full"
                disabled
                error={errors.contractType}
                helperText={errors.contractType?.message}
                required
              />
            )}
          />

          {/* Project Name */}
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Project Name"
                type="text"
                required
                error={errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </div>

        {/* second grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <Controller
            name="startDate"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Start Date"
                type="date"
                required
                value={
                  field.value
                    ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                    : ""
                }
                error={errors.startDate}
                helperText={errors.startDate?.message}
              />
            )}
          />

          {/* End Date */}
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="End Date"
                type="date"
                value={
                  field.value
                    ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                    : ""
                }
                error={errors.endDate}
                helperText={errors.endDate?.message}
              />
            )}
          />

          {/* Duration (months) */}
          <Controller
            name="duration"
            control={control}
            rules={{
              required: "Duration is required",
              min: { value: 1, message: "Minimum duration is 1 month" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Duration (months)"
                type="number"
                required
                error={errors.duration}
                helperText={errors.duration?.message}
              />
            )}
          />

          {/* Status */}
          <Controller
            name="completedStatus"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Dropdown
                label="Status"
                options={projectCompletedStatusOptions}
                selected={field.value || ""}
                onChange={field.onChange}
                width="full"
                error={errors.completedStatus}
                helperText={errors.completedStatus?.message}
                required
              />
            )}
          />
        </div>

        {/* third grid */}
        <div className="grid grid-cols-2 gap-3">
          <h3 className="h1 col-span-2 text-lg font-bold"> Primary Contact</h3>
          {/* Contact Name */}
          <Controller
            name="primaryContact.name"
            control={control}
            rules={{ required: "Contact name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Name"
                type="text"
                required
                error={errors.primaryContact?.name}
                helperText={errors.primaryContact?.name?.message}
              />
            )}
          />

          {/* Contact Phone */}
          <Controller
            name="primaryContact.phone"
            control={control}
            rules={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Phone"
                type="number"
                error={errors.primaryContact?.phone}
                helperText={errors.primaryContact?.phone?.message}
              />
            )}
          />

          {/* Contact Email */}
          <div className="col-span-2">
            <Controller
              name="primaryContact.email"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Email"
                  type="email"
                  error={errors.primaryContact?.email}
                  helperText={errors.primaryContact?.email?.message}
                />
              )}
            />
          </div>
        </div>

        {/* fourth grid */}
        <div className="grid grid-cols-2 gap-3">
          <h1 className="h1 col-span-2 text-lg font-bold">Location Details</h1>
          {/* address */}
          <div className="col-span-2">
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Address"
                  type="text"
                  required
                  error={errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </div>

          {/* Map Location */}
          <div className="col-span-2">
            <Controller
              name="mapLocation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Map Location Co-ordinates"
                  type="text"
                  error={errors.mapLocation}
                  helperText={errors.mapLocation?.message}
                />
              )}
            />
          </div>
        </div>
        {/* Address Information */}
        <div className="address-info col-span-2 grid grid-cols-2 gap-5">
          <h3 className="h1 col-span-2 text-lg font-bold"> Contract info</h3>

          {/* Contract Drive Link */}
          <Controller
            name="contractDriveLink"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Contract Drive Link"
                type="text"
                error={errors.contractDriveLink}
                helperText={errors.contractDriveLink?.message}
              />
            )}
          />

          {/* update contract file */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {projectRecord?.contractPaper ? (
              <p className="text-sm font-bold text-green-500 mb-1">
                Contract paper already incuded (
                {
                  <Link
                    href={projectRecord?.contractPaper}
                    className="underline text-blue-500"
                    target="_blank"
                  >
                    View file
                  </Link>
                }
                ).
              </p>
            ) : (
              <p className="text-sm font-bold text-red-500 mb-1">
                No contract file found.
              </p>
            )}
            <div
              className="update-button bg-blue-500 w-max rounded-md text-white py-2 px-3 cursor-pointer hover:bg-green-600"
              onClick={handleUpdateContratPaperModalOpen}
            >
              <BackupIcon sx={{ fontSize: "1.8rem" }} />
              <span className="text-sm ml-2 font-bold">Update PDF file</span>
            </div>
            <Modal
              onClose={handleUpdateContratPaperModalClose}
              open={updateContractPaperModalOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
              BackdropProps={{
                style: {
                  backgroundColor: "rgba(0,0,0,0.5)", // Make the backdrop transparent
                },
              }}
            >
              <Box className="w-[30%] h-max p-4 overflow-y-auto  bg-white rounded-xl shadow-lg">
                {/* <ViewProject project={selectedViewProject} /> */}
                <h1 className="text-xl mb-6 font-bold text-center ">
                  Update PDF file
                </h1>
                <div className="flex items-center justify-center ">
                  <label
                    htmlFor="contractInput"
                    className="flex items-center cursor-pointer mt-1 w-max p-1 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600"
                  >
                    <DriveFolderUploadIcon sx={{ fontSize: "2rem" }} />
                    <span className="ml-2">Select</span>
                  </label>
                  <input
                    accept="application/pdf,image/*" // allow pdf and image
                    onChange={handleUpadteFileChange}
                    type="file"
                    id="contractInput"
                    name="contractInput"
                    className="hidden"
                  />
                  {/* file name */}
                  <p className="mx-4">{updatedcontractFileName}</p>
                  {/* delete */}
                  {updatedcontractFile && (
                    <div
                      onClick={handleUpdateFileRemove}
                      className="cursor-pointer hover:bg-red-50 rounded-md p-2"
                    >
                      <DeleteIcon className="text-red-500" />
                      {/* <span className="ml-1 text-xs text-red-600">Remove</span> */}
                    </div>
                  )}
                </div>
                {/* update pdf button */}
                <div
                  onClick={handleUpdatePdf}
                  className="update-button mt-7 rounded-md bg-green-500 text-white font-bold flex items-center justify-center p-2 cursor-pointer hover:bg-green-600 "
                >
                  Update PDF
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        {/* Assigned Trainers */}
        <div className="trainers col-span-2">
          <div className="flex items-center">
            <h3 className="text-lg text-gray-500 font-semibold mr-2">
              Assigned Trainers
            </h3>
          </div>
          {trainerFields.length === 0 ? (
            <p className="text-gray-500 mb-2">No trainers assigned yet.</p>
          ) : (
            trainerFields.map((trainer, index) => (
              <div key={trainer.id} className="col-span-2 mb-2">
                <div className="grid grid-cols-3 items-center place-items-start gap-4">
                  {/* Trainer Name */}
                  <Controller
                    name={`assignedTrainers.${index}.trainerName`}
                    control={control}
                    rules={{
                      required: "Trainer name is required",
                      validate: (value) =>
                        (value && !isDuplicateTrainer(value, index)) ||
                        "Duplicate trainer selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Trainer name"
                        options={allActiveTrainerList.map((c) => c.name)}
                        selected={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedTrainer = allActiveTrainerList.find(
                            (trainer) => trainer.name === value
                          );
                          if (selectedTrainer) {
                            setValue(
                              `assignedTrainers.${index}.trainerId`,
                              selectedTrainer._id
                            );
                          }
                        }}
                        width="full"
                        error={errors?.assignedTrainers?.[index]?.trainerName}
                        helperText={
                          errors?.assignedTrainers?.[index]?.trainerName
                            ?.message
                        }
                      />
                    )}
                  />

                  {/* Trainer Role */}
                  <Controller
                    name={`assignedTrainers.${index}.trainerRole`}
                    control={control}
                    rules={{ required: "Trainer role is required" }}
                    render={({ field }) => (
                      <Dropdown
                        label="Role"
                        options={trainerRoleOptions}
                        selected={field.value || ""}
                        onChange={field.onChange}
                        width="full"
                        error={errors?.assignedTrainers?.[index]?.trainerRole}
                        helperText={
                          errors?.assignedTrainers?.[index]?.trainerRole
                            ?.message
                        }
                        required
                      />
                    )}
                  />

                  <Button
                    onClick={() => handleConfirmTrainerDeleteModalOpen(index)}
                    className="text-red-500"
                    color="error"
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    <span className="text-sm">Delete</span>
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button
            title="Add Trainer"
            variant="outlined"
            onClick={addTrainer}
            className="mt-2"
          >
            <AddIcon />
            <span>Add Trainer</span>
          </Button>
        </div>

        {/* Time Slots */}
        <div className="time-slots col-span-2">
          <div className="flex items-center">
            <h3 className="text-lg text-gray-500 font-semibold mr-2">
              Time Slots
            </h3>
          </div>
          {timeSlotFields.length === 0 ? (
            <p className="text-gray-500 mb-2">No time slots added yet.</p>
          ) : (
            timeSlotFields.map((timeSlot, index) => (
              <div key={timeSlot.id} className="col-span-2 mb-2">
                <div className="grid grid-cols-4 items-center place-items-start gap-4">
                  {/* Day */}
                  <Controller
                    name={`timeSlots.${index}.day`}
                    control={control}
                    rules={{
                      required: "Day is required",
                      validate: (value) =>
                        (value && !isDuplicateTimeSlot(value, index)) ||
                        "Duplicate day selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Day"
                        options={dayOptions}
                        selected={field.value || ""}
                        onChange={field.onChange}
                        width="full"
                        error={errors?.timeSlots?.[index]?.day}
                        helperText={errors?.timeSlots?.[index]?.day?.message}
                        required
                      />
                    )}
                  />

                  {/* From Time */}
                  <Controller
                    name={`timeSlots.${index}.fromTime`}
                    control={control}
                    rules={{
                      required: "Time is required",
                      // validate: (value) =>
                      //   (value && !isDuplicateTrainer(value, index)) ||
                      //   "Duplicate trainer selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="From"
                        options={timeOptions}
                        selected={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        width="full"
                        error={errors?.timeSlots?.[index]?.fromTime}
                        helperText={
                          errors?.timeSlots?.[index]?.fromTime?.message
                        }
                      />
                    )}
                  />

                  {/* To Time */}
                  <Controller
                    name={`timeSlots.${index}.toTime`}
                    control={control}
                    rules={{
                      required: "Time is required",
                      // validate: (value) =>
                      //   (value && !isDuplicateTrainer(value, index)) ||
                      //   "Duplicate trainer selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="To"
                        options={timeOptions}
                        selected={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                          // trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                        }}
                        width="full"
                        error={errors?.timeSlots?.[index]?.toTime}
                        helperText={errors?.timeSlots?.[index]?.toTime?.message}
                      />
                    )}
                  />

                  <Button
                    onClick={() => handleConfirmTimeSlotDeleteModalOpen(index)}
                    className="text-red-500"
                    color="error"
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    <span className="text-sm">Delete</span>
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button
            title="Add Time Slot"
            variant="outlined"
            onClick={addTimeSlot}
            className="mt-2"
          >
            <AddIcon />
            <span>Add Time Slot</span>
          </Button>
        </div>

        {/* Confirmation Modals */}
        {/* Trainer Delete Modal */}
        <Modal
          open={confirmTrainerDeleteModalOpen}
          onClose={handleConfirmTrainerDeleteModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
            <p className="mb-6 text-gray-600">
              You want to remove this trainer.
            </p>
            <div className="buttons flex gap-4">
              <Button
                variant="outlined"
                onClick={handleConfirmTrainerDeleteModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  removeTrainer(Number(selectedDeleteTrainerIndex));
                  notify("Trainer removed", 200);
                  handleConfirmTrainerDeleteModalClose();
                }}
              >
                Remove
              </Button>
            </div>
          </Box>
        </Modal>

        {/* Time Slot Delete Modal */}
        <Modal
          open={confirmTimeSlotDeleteModalOpen}
          onClose={handleConfirmTimeSlotDeleteModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
            <p className="mb-6 text-gray-600">
              You want to remove this time slot.
            </p>
            <div className="buttons flex gap-4">
              <Button
                variant="outlined"
                onClick={handleConfirmTimeSlotDeleteModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  removeTimeSlot(Number(selectedDeleteTimeSlotIndex));
                  notify("Time slot removed", 200);
                  handleConfirmTimeSlotDeleteModalClose();
                }}
              >
                Remove
              </Button>
            </div>
          </Box>
        </Modal>

        {/* Update Button */}
        <div className="button mt-3 col-span-2">
          <Button
            onClick={handleConfirmModalOpen}
            variant="contained"
            className=""
          >
            Update Project
          </Button>
          <button type="submit" id="hiddenSubmit" hidden></button>

          {/* Confirmation Modal */}
          <Modal
            open={confirmModalOpen}
            onClose={handleConfirmModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-6 text-gray-600">
                You want to update this project.
              </p>
              <div className="buttons flex gap-4">
                <Button
                  variant="outlined"
                  onClick={handleConfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {updateProjectLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updateProjectLoading}
                    loadingPosition="start"
                    variant="contained"
                  >
                    <span>Updating project</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      document.getElementById("hiddenSubmit").click();
                      if (!isValid) {
                        handleConfirmModalClose();
                      }
                    }}
                  >
                    Update Project
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </form>
    </div>
  );
};

export default UpdateProject;
