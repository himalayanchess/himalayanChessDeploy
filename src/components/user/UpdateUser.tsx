import { generateRandomPassword, notify } from "@/index";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { useRouter } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Modal,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getAllBranches } from "@/redux/allListSlice";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const UpdateUser = ({ userRecord }: any) => {
  const router = useRouter();
  const session = useSession();
  console.log("update ", userRecord);

  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  //options
  const titleOptions = [
    "None",
    // Grandmaster titles
    "GM",
    "IM",
    "FM",
    "CM",

    // Women-specific titles
    "WGM",
    "WIM",
    "WFM",
    "WCM",

    // Arbiters
    "IA",
    "FA",

    // Trainers
    "FST",
    "FT",
    "FI",
    "NI",
    "DI",
  ];
  const roleOptions = ["Trainer", "Admin", "Superadmin"];
  const genderOptions = ["Male", "Female", "Others"];
  const completedStatusOptions = ["Ongoing", "Left"];

  // state vars
  const [loaded, setLoaded] = useState(false);
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [addUserLoading, setupdateUserLoading] = useState(false);
  const [cvFile, setcvFile] = useState<File | any>(null);
  const [isGlobalAdmin, setisGlobalAdmin] = useState(false);
  const [selectedRole, setselectedRole] = useState("");

  // reset password
  const [randomPassword, setRandomPassword] = useState("");
  const [resetPasswordModalOpen, setresetPasswordModalOpen] = useState(false);
  const [updateCVModalOpen, setupdateCVModalOpen] = useState(false);
  const [updateCvLoading, setupdateCvLoading] = useState(false);
  // reset modal open
  function handleresetPaswordModalOpen() {
    const generatedRandomPassword = generateRandomPassword(12);
    setRandomPassword(generatedRandomPassword);
    setresetPasswordModalOpen(true);
  }
  // reset modal close
  function handleresetPaswordModalClose() {
    setresetPasswordModalOpen(false);
  }

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // handleupdateCVModalOpen
  function handleupdateCVModalOpen() {
    setupdateCVModalOpen(true);
  }
  // handleupdateCVModalClose
  function handleupdateCVModalClose() {
    setcvFile(null);
    setupdateCVModalOpen(false);
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setcvFile(file);
    }
  };

  // react hook form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState,
    reset,
    trigger,
    watch,
  } = useForm<any>({
    defaultValues: {
      role: "",
      name: "",
      dob: "",
      address: "",
      gender: "",
      branchId: "",
      branchName: "",

      joinedDate: "",
      endDate: "",
      phone: "",
      email: "",
      password: "",
      completedStatus: "",
      isActive: "",

      title: "None",
      fideId: 0,
      rating: 0,

      emergencyContactName: "",
      emergencyContactNo: "",
      //isGlobalAdmin from state var
    },
  });

  const { errors, isValid } = formState;
  console.log(errors);
  const onSubmit = async (data: any) => {
    console.log("Form Submitted Successfully:", data);
    setupdateUserLoading(true);
    // add mode api call
    const { data: resData } = await axios.post("/api/users/updateUser", {
      ...data,
      isGlobalAdmin,
    });

    if (resData.statusCode == 200) {
      notify(resData.msg, resData.statusCode);
      handleconfirmModalClose();
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/users`);
      }, 50);
      setupdateUserLoading(false);
      return;
    }
    setupdateUserLoading(false);
    notify(resData.msg, resData.statusCode);
    return;
  };

  async function handleResetPassword(userId: any) {
    if (randomPassword) {
      // reset password api
      const { data: resData } = await axios.post("/api/users/resetPassword", {
        userId,
        randomPassword,
      });
      notify(resData.msg, resData.statusCode);
      handleresetPaswordModalClose();
    }
  }

  async function handleCVUpdate() {
    if (!cvFile) {
      notify("CV file required", 204);
      return;
    }

    setupdateCvLoading(true);
    let trainerCvUrl = "";

    const formData = new FormData();
    formData.append("file", cvFile);
    const folderName = `cv/${userRecord?.branchName}/${userRecord?.name}`;
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
      trainerCvUrl = uploadresData.res.secure_url;
      const { data: updateTrainersCvResData } = await axios.post(
        "/api/trainer/updateTrainersCV",
        {
          ...userRecord,
          trainerCvUrl,
        }
      );

      if (updateTrainersCvResData) {
        // handleupdateCVModalClose();
        notify(
          updateTrainersCvResData?.msg,
          updateTrainersCvResData?.statusCode
        );
        setupdateCvLoading(false);
        window.location.reload();
        return;
      }
      setupdateCvLoading(false);

      notify(updateTrainersCvResData?.msg, updateTrainersCvResData?.statusCode);
      return;
    }
  }

  //   update from state
  useEffect(() => {
    if (userRecord) {
      reset({
        ...userRecord,
        isActive: userRecord?.isActive ? "Active" : "Inactive",
      });
      setselectedRole(userRecord?.role);
      setisGlobalAdmin(userRecord?.isGlobalAdmin);
      setLoaded(true);
    }
  }, [userRecord, reset]);

  // fetch inital data
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);

  if (!loaded)
    return (
      <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md "></div>
    );

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      {/* heading */}
      {/* heading */}
      <div className="header flex items-end justify-between">
        <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
          <Edit />
          <span className="ml-2">Update user</span>
        </h1>
        {/* home button */}
        <div className="buttons flex gap-4">
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/users`}>
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>
        </div>
      </div>
      <Divider sx={{ margin: "1rem 0   " }} />

      {/* form */}
      <form
        className="addstudentform form-fields flex-1 h-full overflow-y-auto grid grid-cols-2 gap-5"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* basic info */}
        <div className="basic-info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Basic Info
          </p>

          <div className="basic-info-fields grid grid-cols-2  gap-3">
            {/* role */}
            <Controller
              name="role"
              control={control}
              rules={{
                required: "Role is required",
              }}
              render={({ field }) => {
                return (
                  <div className="flex flex-col">
                    <Dropdown
                      label="Role"
                      options={roleOptions}
                      selected={field.value || ""}
                      disabled={true}
                      onChange={(value: any) => {
                        field.onChange(value);
                        // reset((prevValues) => ({
                        //   ...prevValues,
                        //   // reset fields here
                        // }));
                      }}
                      error={errors.role}
                      helperText={errors.role?.message}
                      required={true}
                      width="full"
                    />
                    {selectedRole?.toLowerCase() === "admin" && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isGlobalAdmin}
                            onChange={(e: any) =>
                              setisGlobalAdmin(e.target.checked)
                            }
                          />
                        }
                        label="User is Global Admin"
                      />
                    )}
                  </div>
                );
              }}
            />
            {/* full name */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                  message: "Invalid Full Name",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Full Name"
                  type="text"
                  placeholder="Full Name"
                  required={true}
                  error={errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            {/* dob */}
            <Controller
              name="dob"
              control={control}
              rules={{
                required: "Dob is required",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={
                    field.value
                      ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                      : ""
                  }
                  type="date"
                  label="Date of Birth"
                  error={errors.dob}
                  helperText={errors.dob?.message}
                  required={true}
                />
              )}
            />
            {/* address */}
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
                  type="text"
                  label="Address"
                  error={errors.address}
                  helperText={errors.address?.message}
                  required={true}
                />
              )}
            />
            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              rules={{
                required: "Gender is required",
              }}
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Gender"
                    options={genderOptions}
                    selected={field.value || ""}
                    onChange={(value: any) => {
                      field.onChange(value);
                    }}
                    error={errors.gender}
                    helperText={errors.gender?.message}
                    required={true}
                    width="full"
                  />
                );
              }}
            />

            {/* Branch */}
            <Controller
              name="branchName"
              control={control}
              rules={{
                required: "Branch is required",
              }}
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Branch"
                    options={allActiveBranchesList?.map(
                      (branch: any) => branch.branchName
                    )}
                    selected={field.value}
                    onChange={(value: any) => {
                      field.onChange(value);
                      const selectedBranch: any = allActiveBranchesList.find(
                        (branch: any) => branch.branchName == value
                      );

                      setValue("branchId", selectedBranch?._id || "");
                    }}
                    error={errors.branchName}
                    helperText={errors.branchName?.message}
                    required={true}
                    width="full"
                  />
                );
              }}
            />

            {/* upload cv for trainer */}
            {userRecord?.role?.toLowerCase() == "trainer" && (
              <div className="upload-cv flex gap-2 flex-col items-center">
                {userRecord?.trainerCvUrl ? (
                  <p className="text-xs font-bold text-green-500">
                    CV already uploaded
                  </p>
                ) : (
                  <p className="text-xs font-bold text-red-500">CV not found</p>
                )}
                <Button variant="contained" onClick={handleupdateCVModalOpen}>
                  <CloudUploadIcon />
                  <span className="ml-2">Update CV</span>
                </Button>

                {/* update cv modal  */}
                <Modal
                  open={updateCVModalOpen}
                  onClose={handleupdateCVModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="flex items-center justify-center"
                >
                  <Box className="w-[400px] h-max p-6  flex flex-col items-start bg-white rounded-xl shadow-lg">
                    <p className="font-semibold mb-4 text-xl">Update CV</p>

                    <input
                      accept="application/pdf,image/*" // allow pdf and image
                      onChange={handleFileChange}
                      type="file"
                      id="contractInput"
                      name="contractInput"
                    />

                    <div className="buttons flex gap-4 mt-4">
                      <Button
                        variant="outlined"
                        onClick={handleupdateCVModalClose}
                        className="text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      {updateCvLoading ? (
                        <LoadingButton
                          size="large"
                          loading={updateCvLoading}
                          loadingPosition="start"
                          variant="contained"
                          className="mt-7"
                        >
                          <span className="">Updating CV</span>
                        </LoadingButton>
                      ) : (
                        <Button variant="contained" onClick={handleCVUpdate}>
                          Update CV
                        </Button>
                      )}
                    </div>
                  </Box>
                </Modal>
              </div>
            )}
          </div>
        </div>
        {/* Information */}
        <div className="info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Info
          </p>
          <div className="basic-info-fields grid grid-cols-2  gap-3">
            {/* joinedDate */}
            <Controller
              name="joinedDate"
              control={control}
              rules={{
                required: "Joined Date is required",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  label="Joined Date"
                  value={
                    field.value
                      ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                      : ""
                  }
                  required={true}
                  error={errors.joinedDate}
                  helperText={errors.joinedDate?.message}
                />
              )}
            />
            {/* endDate */}
            <Controller
              name="endDate"
              control={control}
              rules={{}}
              render={({ field }) => (
                <Input
                  {...field}
                  value={
                    field.value
                      ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                      : ""
                  }
                  type="date"
                  label="End Date"
                  error={errors.endDate}
                  helperText={errors.endDate?.message}
                />
              )}
            />

            {/* phone */}
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Phone no required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid Phone no.",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  type="number"
                  label="Phone"
                  error={errors.phone}
                  helperText={errors.phone?.message}
                  required={true}
                />
              )}
            />

            {/* Email */}

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  required={true}
                  error={errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* password */}
            <div className="">
              <Button
                onClick={handleresetPaswordModalOpen}
                variant="contained"
                className="h-full w-full"
              >
                Reset Password
              </Button>
              <Modal
                open={resetPasswordModalOpen}
                onClose={handleresetPaswordModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
                BackdropProps={{
                  style: {
                    backgroundColor: "rgba(0,0,0,0.4)", // Make the backdrop transparent
                  },
                }}
              >
                <div className="w-[400px] py-4 text-center rounded-lg bg-white">
                  <LockResetIcon
                    sx={{ fontSize: "3rem" }}
                    className="text-red-600"
                  />
                  <h1 className="text-md font-bold">Reset password?</h1>
                  <p className="mb-2 text-sm text-gray-500">
                    Your new password is:
                  </p>
                  <div className="password-div  w-[65%] mx-auto">
                    <Input
                      type="text"
                      readOnly={true}
                      value={randomPassword}
                      onChange={setRandomPassword}
                      extraClasses="text-center"
                    />
                  </div>
                  <Button
                    onClick={handleresetPaswordModalClose}
                    variant="outlined"
                    sx={{ margin: "1rem 0.5rem 0 0" }}
                    type="submit"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleResetPassword(userRecord._id)}
                    variant="contained"
                    color="error"
                    sx={{ margin: "1rem 0 0 .5rem" }}
                    type="submit"
                  >
                    Confirm Reset
                  </Button>
                </div>
              </Modal>
            </div>

            {/* Status (ongoing,left) */}
            <Controller
              name="completedStatus"
              control={control}
              rules={{
                required: "Status is required",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Status"
                  options={completedStatusOptions}
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  required={true}
                  error={errors.completedStatus}
                  helperText={errors.completedStatus?.message}
                  width="full"
                />
              )}
            />

            {/* active status to block login */}
            <Controller
              name="isActive"
              control={control}
              rules={{
                required: "Status is required",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Active Status"
                  options={["Active", "Inactive"]}
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  required={true}
                  error={errors.isActive}
                  helperText={errors.isActive?.message}
                  width="full"
                />
              )}
            />

            {/* reset password (edit mode) */}
            {/* {mode == "edit" && (
              <>
                <Button
                  onClick={handleresetPaswordModalOpen}
                  variant="contained"
                >
                  Reset Password
                </Button>
                <Modal
                  open={resetPasswordModalOpen}
                  onClose={handleresetPaswordModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="flex items-center justify-center"
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0,0,0,0.4)", // Make the backdrop transparent
                    },
                  }}
                >
                  <div className="w-[400px] py-4 text-center rounded-lg bg-white">
                    <LockResetIcon
                      sx={{ fontSize: "3rem" }}
                      className="text-red-600"
                    />
                    <h1 className="text-md font-bold">Reset password?</h1>
                    <p className="mb-2 text-sm text-gray-500">
                      Your new password is:
                    </p>
                    <div className="password-div  w-[65%] mx-auto">
                      <Input
                        type="text"
                        readOnly={true}
                        value={randomPassword}
                        onChange={setRandomPassword}
                        extraClasses="text-center"
                      />
                    </div>
                    <Button
                      onClick={handleresetPaswordModalClose}
                      variant="outlined"
                      sx={{ margin: "1rem 0.5rem 0 0" }}
                      type="submit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleResetPassword(initialData._id)}
                      variant="contained"
                      color="error"
                      sx={{ margin: "1rem 0 0 .5rem" }}
                      type="submit"
                    >
                      Confirm Reset
                    </Button>
                  </div>
                </Modal>
              </>
            )} */}
          </div>
        </div>
        {/* Chess Information */}
        <div className="info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Chess
          </p>

          <div className="basic-info-fields grid grid-cols-2  gap-3">
            {/* title */}

            <Controller
              name="title"
              control={control}
              rules={{}}
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Title"
                    options={titleOptions}
                    selected={field.value || ""}
                    onChange={(value: any) => {
                      field.onChange(value);
                    }}
                    error={errors.title}
                    helperText={errors.title?.message}
                    // required={true}
                    width="full"
                  />
                );
              }}
            />

            {/* Fide Id (no validation)*/}
            <Controller
              name="fideId"
              control={control}
              rules={
                {
                  // required: "fide id is required",
                }
              }
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    value={field.value || 0}
                    label="FIDE ID"
                    type="number"
                    error={errors.fideId}
                    helperText={errors.fideId?.message}
                  />
                );
              }}
            />
            {/* rating (no validation) */}
            <Controller
              name="rating"
              control={control}
              rules={
                {
                  // required: "Skill level is required",
                }
              }
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    value={field.value || 0}
                    label="Rating"
                    type="number"
                    error={errors.rating}
                    helperText={errors.rating?.message}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* emergencyContactName */}
        <div className="emergencyContactName ">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Emergency contact
          </p>

          <div className="emergency-info-fields grid grid-cols-2  gap-3">
            {/* emergency contact name */}
            <Controller
              name="emergencyContactName"
              control={control}
              rules={{
                required: "Emergency contact name required",
                pattern: {
                  value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                  message: "Invalid full name",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  type="text"
                  label="Emergency Contact Full Name"
                  error={errors.emergencyContactName}
                  helperText={errors.emergencyContactName?.message}
                  required={true}
                />
              )}
            />
            {/* emergencyContact */}
            <Controller
              name="emergencyContactNo"
              control={control}
              rules={{
                required: "Emergency contact no. required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid contact no",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  type="number"
                  label="Emergency Contact no"
                  error={errors.emergencyContactNo}
                  helperText={errors.emergencyContactNo?.message}
                  required={true}
                />
              )}
            />
          </div>
        </div>

        {/* add  button */}
        <Button
          onClick={handleconfirmModalOpen}
          variant="contained"
          color="info"
          className="w-max h-max "
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
            <p className="mb-6 text-gray-600">You want to add update user.</p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleconfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {addUserLoading ? (
                <LoadingButton
                  size="large"
                  loading={addUserLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Updating user</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    document.getElementById("hiddenSubmit")?.click();

                    if (!isValid) {
                      handleconfirmModalClose();
                    }
                  }}
                >
                  Update user
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default UpdateUser;
