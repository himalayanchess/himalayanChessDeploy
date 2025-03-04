import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { Box, Button, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import BackupIcon from "@mui/icons-material/Backup";
import DeleteIcon from "@mui/icons-material/Delete";
// import options for dropdown
import {
  dayOptions,
  contractTypeOptions,
  timeOptions,
  trainerRoleOptions,
  projectCompletedStatusOptions,
} from "@/options/projectOptions";
import axios from "axios";
import { notify } from "@/helpers/notify";
const AddProject = ({
  newProjectAdded,
  setnewProjectAdded,
  newCreatedProject,
  setnewCreatedProject,
  handleClose,
  mode,
  initialData,
  trainersList,
  //boolean
  projectEdited,
  setProjectEdited,
  // object
  editedProject,
  seteditedProject,
}) => {
  // add contract file
  const [contractFile, setcontractFile] = useState<File | any>(null);
  const [contractFileName, setContractFileName] = useState("Not Selected");
  // (to prevent multiple upload of pdf when update, update contractPaper from update contractPaper modal)
  const [updatedcontractFile, setupdatedcontractFile] = useState<File | any>(
    null
  );
  const [updatedcontractFileName, setupdatedcontractFileName] =
    useState("Not Selected");

  // update contract paper modal
  const [updateContractPaperModalOpen, setupdateContractPaperModalOpen] =
    useState<Boolean | null>();
  // modal close
  function handleUpdateContratPaperModalClose() {
    setupdateContractPaperModalOpen(false);
  }
  function handleUpdateContratPaperModalOpen() {
    setupdateContractPaperModalOpen(true);
  }
  // update contract file
  const [selectedContractType, setselectedContractType] = useState(
    mode == "add" ? "Academy" : initialData?.contractType
  );
  // console.log("inside add user", mode, initialData);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues:
      mode === "add"
        ? {
            contractType: "School",
            projectName: "",
            primaryContact: { name: "", email: "", phone: "" },
            startDate: "",
            endDate: "",
            duration: 12,
            completedStatus: "Ongoing",
            address: "",
            mapLocation: "",
            // contractPaper in onSubmit function
            contractDriveLink: "",
            assignedTrainers: [
              { trainerId: "", trainerName: "", trainerRole: "" },
            ],
            timeSlots: [{ day: "", fromTime: "", toTime: "" }],
          }
        : { ...initialData },
  });
  // array time slots
  const {
    fields: timeSlotsField,
    append: appendTimeSlot,
    remove: removeTimeSlot,
  } = useFieldArray({
    control,
    name: "timeSlots",
  });
  // Function to add a new timeslot
  const addTimeSlot = () => {
    appendTimeSlot({ day: "", fromTime: "", toTime: "" });
  };
  // handle file change (add)
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setcontractFile(file);
      setContractFileName(file.name);
    }
  };
  // handle update file change
  const handleUpadteFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setupdatedcontractFile(file);
      setupdatedcontractFileName(file.name);
    }
  };
  // handle file remove (add)
  const handleFileRemove = (e: any) => {
    setcontractFile(null);
    setContractFileName("Not Selected");
  };
  // handle file remove (edit)
  const handleUpdateFileRemove = (e: any) => {
    setupdatedcontractFile(null);
    setupdatedcontractFileName("Not Selected");
  };
  // array assined trainers
  const {
    fields: assignedTrainerField,
    append: appendAssignedTrainer,
    remove: removeAssignedTrainer,
  } = useFieldArray({
    control,
    name: "assignedTrainers",
  });
  // Function to add a new course
  const addAssignedTrainer = () => {
    appendAssignedTrainer({ trainerId: "", trainerName: "", trainerRole: "" });
  };

  // Watch enrolledCourses for validation
  const assignedTrainers = watch("assignedTrainers");
  // Function to check for duplicate trainer
  const isDuplicateTrainer = (trainerName: string) => {
    return (
      assignedTrainers.filter((t) => t.trainerName === trainerName).length > 1
    );
  };
  // handle update pdf function
  async function handleUpdatePdf() {
    let updatedContractPaper = "";
    if (!updatedcontractFile) {
      notify("Update pdf file empty", 204);
      return;
    }
    if (updatedcontractFile) {
      const formData = new FormData();
      formData.append("file", updatedcontractFile);
      const { data: resData } = await axios.post(
        "/api/projects/contractUpload",
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
      }
      // cloudinary success
      else {
        updatedContractPaper = resData.res.secure_url;
      }
    }
    // update contractPaper to updatedContractpaper
    const { data: resData } = await axios.post(
      "/api/projects/updateContractPaper",
      {
        initialData,
        updatedContractPaper,
      }
    );
    if (resData.statusCode == 200) {
      setProjectEdited(true);
      seteditedProject({ ...initialData, contractPaper: updatedContractPaper });
      handleClose();
      handleUpdateContratPaperModalClose();
    }
    notify(resData.msg, resData.statusCode);
    return;
  }
  //onsubmit
  async function onSubmit(data) {
    if (mode == "add") {
      // first upload file in cloudinary
      let contractPaper = "";
      if (!contractFile) {
        notify("Contract paper required", 204);
        return;
      }
      // if file set
      if (contractFile) {
        const formData = new FormData();
        formData.append("file", contractFile);
        const { data: resData } = await axios.post(
          "/api/projects/contractUpload",
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
        }
        // cloudinary success
        else {
          contractPaper = resData.res.secure_url;
        }
      }

      const { data: resData } = await axios.post(
        "/api/projects/addNewProject",
        {
          ...data,
          contractPaper,
        }
      );
      if (resData.statusCode == 200) {
        setnewProjectAdded(true);
        setnewCreatedProject(resData.savednewProject);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    } else if (mode == "edit") {
      const { data: resData } = await axios.post(
        "/api/projects/updateProject",
        data
      );
      if (resData.statusCode == 200) {
        setProjectEdited(true);
        seteditedProject(data);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    }
  }

  return (
    <>
      <h1 className="w-max mr-auto text-2xl font-medium mb-2">
        {mode === "add" ? "Add Project" : `Update (${initialData?.name})`}
      </h1>
      {/* Form */}
      <form
        className="flex-1 grid grid-cols-2 auto-rows-min gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Project Name */}
        <div className="col-span-2">
          {/* contract type */}
          <Controller
            name="contractType"
            control={control}
            rules={{
              required: "Contract Type is required",
            }}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Contract type"
                  type="text"
                  disabled
                  error={errors?.contractType}
                  helperText={errors?.contractType?.message}
                />
              );
            }}
          />
        </div>

        {/* Project name */}
        <div className="col-span-2">
          <Controller
            name="projectName"
            control={control}
            rules={{
              required: "Project name is required",
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Project Name"
                type="text"
                error={errors?.name}
                helperText={errors?.name?.message}
                required={true}
              />
            )}
          />
        </div>
        {/* primary contact */}
        <div className="h1 col-span-2 text-lg font-bold">Primary Contact</div>
        {/* contact name */}
        <Controller
          name="primaryContact.name"
          control={control}
          rules={{
            required: "Full name is required",
            pattern: {
              value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
              message: "Invalid full name",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="Contact Name"
              type="text"
              error={errors?.primaryContact?.name}
              helperText={errors?.primaryContact?.name?.message}
              required={true}
            />
          )}
        />
        {/* contact phone */}
        <Controller
          name="primaryContact.phone"
          control={control}
          rules={{
            required: "Phone is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone no",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="Phone"
              type="number"
              error={errors?.primaryContact?.phone}
              helperText={errors?.primaryContact?.phone?.message}
              required={true}
            />
          )}
        />
        {/* contact email */}
        <Controller
          name="primaryContact.email"
          control={control}
          rules={{
            // required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="Email"
              type="text"
              error={errors?.primaryContact?.email}
              helperText={errors?.primaryContact?.email?.message}
            />
          )}
        />

        {/* project info */}
        <div className="h1 col-span-2 text-lg font-bold">Project Info</div>
        {/* start date */}
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: "Start date is required",
          }}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="Start date"
              type="date"
              error={errors?.startDate}
              helperText={errors?.startDate?.message}
              required={true}
            />
          )}
        />
        {/* end date */}
        <Controller
          name="endDate"
          control={control}
          rules={
            {
              // required: "End date is required",
            }
          }
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="End date"
              type="date"
              error={errors?.endDate}
              helperText={errors?.endDate?.message}
            />
          )}
        />
        {/* duration */}
        <Controller
          name="duration"
          control={control}
          rules={{
            required: "Duration is required",
          }}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              label="Duration (weeks)"
              type="number"
              error={errors?.duration}
              helperText={errors?.duration?.message}
            />
          )}
        />
        {/* Completed status */}
        <Controller
          name="completedStatus"
          control={control}
          rules={{
            required: "Status is required",
          }}
          render={({ field }) => (
            <Dropdown
              label="Status"
              options={projectCompletedStatusOptions}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
              }}
              error={errors.completedStatus}
              helperText={errors.completedStatus?.message}
              required={true}
              width="full"
            />
          )}
        />

        <div className="h1 col-span-2 text-lg font-bold">Location Details</div>
        {/* address */}
        <div className="col-span-2">
          <Controller
            name="address"
            control={control}
            rules={{
              required: "Address is required",
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Address"
                type="text"
                error={errors?.address}
                helperText={errors?.address?.message}
                required={true}
              />
            )}
          />
        </div>
        {/* location */}
        <div className="col-span-2">
          <Controller
            name="mapLocation"
            control={control}
            rules={
              {
                // required: "Location is required",
              }
            }
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Map Location Co-ordinates"
                type="text"
                error={errors?.mapLocation}
                helperText={errors?.mapLocation?.message}
              />
            )}
          />
        </div>

        {/* contract paper (pdf) (optional)*/}
        <div className="h1 col-span-2 text-lg font-bold">Contract Info</div>

        {/* add contract paper (add) */}
        {mode == "add" && (
          <div className="pdf-file col-span-2">
            <p>Choose PDF file * (for now)</p>
            <div className="flex items-center  ">
              <label
                htmlFor="contractInput"
                className="flex items-center cursor-pointer mt-1 w-max p-1 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600"
              >
                <DriveFolderUploadIcon sx={{ fontSize: "2rem" }} />
                <span className="ml-2">Select</span>
              </label>
              <input
                accept="application/pdf,image/*" // allow pdf and image
                onChange={handleFileChange}
                type="file"
                id="contractInput"
                name="contractInput"
                className="hidden"
              />
              {/* file name */}
              <p className="mx-4">{contractFileName}</p>
              {/* delete */}
              {contractFile && (
                <div
                  onClick={handleFileRemove}
                  className="cursor-pointer hover:bg-red-50 rounded-md p-2"
                >
                  <DeleteIcon className="text-red-500" />
                  <span className="ml-1 text-xs text-red-600">Remove</span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* update contract paper (edit) */}
        {mode == "edit" && (
          <div className="col-span-2">
            {initialData?.contractPaper ? (
              <p className="text-sm font-bold text-green-500 mb-1">
                Contract paper already incuded.
              </p>
            ) : (
              <p className="text-sm font-bold text-red-500 mb-1">
                No contract file found.
              </p>
            )}
            <div
              className="update-button bg-green-500 w-max rounded-md text-white py-2 px-3 cursor-pointer hover:bg-green-600"
              onClick={handleUpdateContratPaperModalOpen}
            >
              <BackupIcon sx={{ fontSize: "1.8rem" }} />
              <span className="text-sm ml-2 font-bold">Update PDF file</span>
            </div>
            <Modal
              open={updateContractPaperModalOpen}
              onClose={handleUpdateContratPaperModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
              BackdropProps={{
                style: {
                  backgroundColor: "rgba(0,0,0,0.3)", // Make the backdrop transparent
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
        )}
        {/* contract paper (driveLink) (optional) */}
        <div className="driveLink col-span-2">
          <Controller
            name="contractDriveLink"
            control={control}
            rules={
              {
                // required: "Contract paper is required",
              }
            }
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Contract Drive Link"
                type="text"
                error={errors?.contractDriveLink}
                helperText={errors?.contractDriveLink?.message}
              />
            )}
          />
        </div>

        {/* assigned trainer */}
        <div className="enrolledcourses col-span-2">
          <div className="flex items-center">
            <h3 className="text-lg text-gray-500 font-semibold mr-2">
              Assigned Trainers
            </h3>
          </div>

          {assignedTrainerField.length === 0 && (
            <p className="text-gray-500">No Trainers yet.</p>
          )}

          {assignedTrainerField.map((trainer, index) => (
            <div key={trainer.id} className="col-span-2 mb-2">
              <div className="grid grid-cols-3  gap-4">
                {/* trainer Selection */}
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
                      options={trainersList.map((c) => c.name)}
                      selected={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                        const selectedTrainer = trainersList.find(
                          (trainer) => trainer.name === value
                        );
                        if (selectedTrainer) {
                          // Update the trainerId in the form when the trainer name is selected
                          setValue(
                            `assignedTrainers.${index}.trainerId`,
                            selectedTrainer._id
                          );
                        }
                      }}
                      width="full"
                      error={errors?.assignedTrainers?.[index]?.trainerName}
                      helperText={
                        errors?.assignedTrainers?.[index]?.trainerName?.message
                      }
                    />
                  )}
                />
                {/* trainer role Selection */}
                <Controller
                  name={`assignedTrainers.${index}.trainerRole`}
                  control={control}
                  rules={{
                    required: "Trainer role is required",
                    // validate: (value) =>
                    //   (value && !isDuplicateCourse(value, index)) ||
                    //   "Duplicate course selected",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Role"
                      options={trainerRoleOptions}
                      selected={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // should be same as above
                        setValue(
                          `assignedTrainers.${index}.trainerRole`,
                          value
                        );
                        // trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                      }}
                      width="full"
                      error={errors?.assignedTrainers?.[index]?.trainerRole}
                      helperText={
                        errors?.assignedTrainers?.[index]?.trainerRole?.message
                      }
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => removeAssignedTrainer(index)}
                  className="text-red-500 mx-4 text-2xl mt-auto mr-auto"
                >
                  <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
              {/* Ensure consistent height for error messages */}
              <div className="grid grid-cols-2 gap-4 min-h-[20px]">
                <p className="text-red-500 text-sm">
                  {errors?.enrolledCourses?.[index]?.course?.message}
                </p>
                <p className="text-red-500 text-sm">
                  {errors?.enrolledCourses?.[index]?.status?.message}
                </p>
              </div>
            </div>
          ))}
          {/* add trainer */}
          <div
            title="Add Trainer"
            className="cursor-pointer my-3"
            onClick={addAssignedTrainer}
          >
            <AddIcon
              className="bg-gray-400 p-0.5 text-white rounded-full"
              style={{ fontSize: "1.5rem" }}
            />
            <span className="ml-2 text-gray-500">Add trainer</span>
          </div>
        </div>
        {/* time slot */}
        <div className="timeslots col-span-2">
          <div className="flex items-center">
            <h3 className="text-lg text-gray-500 font-semibold mr-2">
              Time Slots
            </h3>
          </div>
          {timeSlotsField.length === 0 && (
            <p className="text-gray-500">No time slots yet.</p>
          )}
        </div>
        {/* time slots */}
        {timeSlotsField.map((timeSlot, index) => (
          <div key={timeSlot.id} className="col-span-2 mb-2">
            <div className="grid grid-cols-4 items-start gap-3">
              {/* day selection */}
              <Controller
                name={`timeSlots.${index}.day`}
                control={control}
                rules={{
                  required: "Day is required",
                  // validate: (value) =>
                  //   (value && !isDuplicateTrainer(value, index)) ||
                  //   "Duplicate trainer selected",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Day"
                    options={dayOptions}
                    selected={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                    }}
                    width="full"
                    error={errors?.timeSlots?.[index]?.day}
                    helperText={errors?.timeSlots?.[index]?.day?.message}
                  />
                )}
              />
              {/* from time selection */}
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
                    selected={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                    }}
                    width="full"
                    error={errors?.timeSlots?.[index]?.fromTime}
                    helperText={errors?.timeSlots?.[index]?.fromTime?.message}
                  />
                )}
              />
              {/* to time selection */}
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
                    selected={field.value}
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
              <button
                type="button"
                onClick={() => removeTimeSlot(index)}
                className="text-red-500 mx-4  h-full flex items-end"
              >
                <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                <span className="text-xs ml-1">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {/* add time slot button */}
        <div
          title="Add Time Slot"
          className="cursor-pointer my-3"
          onClick={addTimeSlot}
        >
          <AddIcon
            className="bg-gray-400 p-0.5 text-white rounded-full"
            style={{ fontSize: "1.5rem" }}
          />
          <span className="ml-2 text-gray-500">Add time slot</span>
        </div>
        {/* add or edit button */}
        {mode == "add" && (
          <Button
            type="submit"
            variant="contained"
            color="info"
            size="large"
            className="col-span-2"
          >
            Submit
          </Button>
        )}
        {mode == "edit" && (
          <Button
            type="submit"
            variant="contained"
            color="info"
            size="large"
            className="col-span-2"
          >
            Edit
          </Button>
        )}
      </form>
    </>
  );
};

export default AddProject;
