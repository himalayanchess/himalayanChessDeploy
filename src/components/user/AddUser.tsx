import { generateRandomPassword, notify } from "@/index";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Modal,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches } from "@/redux/allListSlice";
import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AddUser = () => {
  const session = useSession();
  const router = useRouter();
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
  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  // state vars
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [addUserLoading, setaddUserLoading] = useState(false);
  const [isGlobalAdmin, setisGlobalAdmin] = useState(false);
  const [selectedRole, setselectedRole] = useState("");

  // reset password
  const [randomPassword, setRandomPassword] = useState("");
  const generatedRandomPassword = generateRandomPassword(12);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // react hook form
  const {
    register,
    handleSubmit,
    control,
    formState,
    setValue,
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

      title: "None",
      fideId: 0,
      rating: 0,

      emergencyContactName: "",
      emergencyContactNo: "",
      // isGlobalAdmin from state var
    },
  });

  const { errors, isValid } = formState;

  const onSubmit = async (data: any) => {
    // add mode api call
    setaddUserLoading(true);
    const { data: resData } = await axios.post("/api/users/addNewUser", {
      ...data,
      isGlobalAdmin,
    });
    if (resData.statusCode == 200) {
      notify(resData.msg, resData.statusCode);
      handleconfirmModalClose();
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/users`);
      }, 50);
      setaddUserLoading(false);
      return;
    }
    setaddUserLoading(false);
    notify(resData.msg, resData.statusCode);
    return;
  };

  // fetch inital data
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      {/* heading */}
      <div className="header flex items-end justify-between">
        <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
          <CircleUser />
          <span className="ml-2">Create new user</span>
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
                      onChange={(value: any) => {
                        field.onChange(value);
                        setselectedRole(value);
                        if (value?.toLowerCase() !== "admin") {
                          setisGlobalAdmin(false);
                        }
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
                    selected={field.value || ""}
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
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^.{8,}$/,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  type="password"
                  placeholder="Password"
                  required={true}
                  error={errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            {/* Status (ongoing,left) */}
            <Controller
              name="completedStatus"
              control={control}
              rules={{
                required: "Status is required",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Completed Status"
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
            <p className="mb-6 text-gray-600">You want to add new student.</p>
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
                  <span className="">Adding user</span>
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
                  Add user
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default AddUser;
