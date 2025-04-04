import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { Box, Button, Divider, Modal } from "@mui/material";
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
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTrainers } from "@/redux/allListSlice";
const AddProject = () => {
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { allActiveTrainerList } = useSelector(
    (state: any) => state.allListReducer
  );
  // state vars
  const [addProjectLoading, setaddProjectLoading] = useState(false);
  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

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

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // modal close
  function handleUpdateContratPaperModalClose() {
    setupdateContractPaperModalOpen(false);
  }
  function handleUpdateContratPaperModalOpen() {
    setupdateContractPaperModalOpen(true);
  }

  // console.log("inside add user", mode, initialData);
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
      // contractPaper in onSubmit function
      contractDriveLink: "",
      assignedTrainers: [
        {
          trainerId: "",
          trainerName: "",
          startDate: "",
          endDate: "",
          trainerRole: "",
        },
      ],
      timeSlots: [{ day: "", fromTime: "", toTime: "" }],
    },
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

  // handle file remove (add)
  const handleFileRemove = (e: any) => {
    setcontractFile(null);
    setContractFileName("Not Selected");
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
    appendAssignedTrainer({
      trainerId: "",
      trainerName: "",
      startDate: "",
      endDate: "",
      trainerRole: "",
    });
  };

  // Watch enrolledCourses for validation
  const assignedTrainers = watch("assignedTrainers");
  // Function to check for duplicate trainer
  const isDuplicateTrainer = (trainerName: string) => {
    return (
      assignedTrainers.filter((t) => t.trainerName === trainerName).length > 1
    );
  };

  //onsubmit
  async function onSubmit(data: any) {
    // to create a proper folder name in cloudinary
    // first create a neww project to get projectname

    setaddProjectLoading(true);
    const { data: resData } = await axios.post("/api/projects/addNewProject", {
      ...data,
    });
    if (resData.statusCode == 200) {
      let tempsavednewProject = resData.savednewProject;
      // after successfull addition of project, upload file to cloudinary
      let contractPaper = "";
      // if (!contractFile) {
      //   notify("Contract paper required", 204);
      //   return;
      // }
      // if file set
      if (contractFile) {
        const formData = new FormData();
        formData.append("file", contractFile);
        const folderName = `contractpapers/${resData?.savednewProject?.name}`;
        formData.append("folderName", folderName);

        const { data: uploadresData } = await axios.post(
          "/api/fileupload/uploadfile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // cloudinary error
        if (uploadresData.error) {
          notify("Error uploading file", 204);
        }
        // cloudinary success
        else {
          contractPaper = uploadresData.res.secure_url;
          tempsavednewProject = { ...tempsavednewProject, contractPaper };
          // update the project that is just created
          const { data: updateProjectResData } = await axios.post(
            "/api/projects/updateProject",
            tempsavednewProject
          );
          console.log(
            "Project updated (just created) by adding contractpaper url "
          );
        }
      }
      handleconfirmModalClose();
    }
    notify(resData.msg, resData.statusCode);
    setaddProjectLoading(false);

    return;
  }

  // fetch initial data
  useEffect(() => {
    dispatch(fetchAllTrainers());
  }, []);
  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      <h1 className="w-max mr-auto text-2xl font-bold">Add Project</h1>
      <Divider sx={{ margin: ".7rem 0   " }} />
      {/* form-fields */}
      <form
        className="addprojectform form-fields flex-1 h-full overflow-y-auto grid grid-cols-2 gap-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* first grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Project Name */}
          <div className="col-span-1">
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
          <div className="col-span-1">
            <Controller
              name="name"
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
        </div>

        {/* second grid */}
        <div className="grid grid-cols-2 gap-3">
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
                selected={field.value || ""}
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
        </div>

        {/* third grid */}
        <div className="grid grid-cols-2 gap-3">
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
          <div className="col-span-2">
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
          </div>
        </div>

        {/* fourth grid */}
        <div className="grid grid-cols-2  gap-3">
          <h1 className="h1 col-span-2 text-lg font-bold">Location Details</h1>
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
        </div>

        {/* fifth grid */}
        <div className="grid grid-cols-2  gap-3">
          <h1 className="h1 col-span-2 text-lg font-bold">Contract Info</h1>
          {/* contract paper (driveLink) */}
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
        </div>
        {/* add contract file  (5th grid 2nd col)*/}
        <div className="pdf-file h-full w-full  col-span-1 flex flex-col items-start justify-end ">
          <p className="text-sm">Choose PDF file</p>
          <div className=" flex items-center">
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
            <div key={trainer.id} className="col-span-2 mb-3">
              <div className={`grid grid-cols-4 gap-4 items-start`}>
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
                      options={allActiveTrainerList.map((c) => c.name)}
                      selected={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        const selectedTrainer = allActiveTrainerList.find(
                          (trainer: any) => trainer.name === value
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
                        errors?.assignedTrainers?.[index]?.trainerName?.message
                      }
                    />
                  )}
                />

                {/* Trainer start date */}
                <Controller
                  name={`assignedTrainers.${index}.startDate`}
                  control={control}
                  rules={{
                    required: "Start date is required",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      label="Start Date"
                      type="date"
                      required
                      error={errors?.assignedTrainers?.[index]?.startDate}
                      helperText={
                        errors?.assignedTrainers?.[index]?.startDate?.message
                      }
                    />
                  )}
                />

                {/* Trainer end date */}
                <Controller
                  name={`assignedTrainers.${index}.endDate`}
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
                      label="End Date"
                      type="date"
                      error={errors?.assignedTrainers?.[index]?.endDate}
                      helperText={
                        errors?.assignedTrainers?.[index]?.endDate?.message
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
                      selected={field.value || ""}
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

                <div
                  className={`delete-button h-full flex 
                ${
                  !errors?.assignedTrainers?.[index]?.trainerName &&
                  !errors?.assignedTrainers?.[index]?.trainerRole
                    ? " items-end "
                    : " items-center "
                }
                `}
                >
                  <Button
                    color="error"
                    onClick={() => removeAssignedTrainer(index)}
                    className="h-max w-max"
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {/* add trainer */}
          <Button
            title="Add Trainer"
            className="cursor-pointer my-3"
            variant="outlined"
            onClick={addAssignedTrainer}
          >
            <AddIcon style={{ fontSize: "1.1rem" }} />
            <span className="ml-1 ">Add trainer</span>
          </Button>
        </div>
        {/* time slot */}
        <div className="timeslots col-span-2 ">
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
          <div key={timeSlot.id} className="col-span-2 ">
            <div className={`grid grid-cols-4 gap-4 items-start`}>
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
                    selected={field.value || ""}
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
                    selected={field.value || ""}
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
              <div
                className={`delete-button h-full flex 
                ${
                  !errors?.timeSlots?.[index]?.day &&
                  !errors?.timeSlots?.[index]?.fromTime &&
                  !errors?.timeSlots?.[index]?.toTime
                    ? " items-end "
                    : " items-center "
                }
                `}
              >
                <Button
                  onClick={() => removeTimeSlot(index)}
                  color="error"
                  className="h-max w-max"
                >
                  <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                  <span className="text-xs ml-1">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {/* add time slot button */}
        <Button
          title="Add Trainer"
          className="cursor-pointer my-3 w-max"
          variant="outlined"
          onClick={addTimeSlot}
        >
          <AddIcon style={{ fontSize: "1.1rem" }} />
          <span className="ml-1">Add time slot</span>
        </Button>

        {/* submit button */}
        <Button
          variant="contained"
          onClick={handleconfirmModalOpen}
          color="info"
          size="large"
          className="col-span-2 w-max"
        >
          Submit
        </Button>
        {/* Hidden Submit Button (Inside Form) */}
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
            <p className="mb-6 text-gray-600">You want to add new project.</p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleconfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {addProjectLoading ? (
                <LoadingButton
                  size="large"
                  loading={addProjectLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Adding project</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    document.getElementById("hiddenSubmit").click();

                    if (!isValid) {
                      handleconfirmModalClose();
                    }
                  }}
                >
                  Add project
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default AddProject;
