import { notify } from "@/index";
import axios from "axios";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AddUser = ({
  newUserAdded,
  setnewUserAdded,
  newCreatedUser,
  setnewCreatedUser,
  handleClose,
}) => {
  const [selectedRole, setselectedRole] = useState("Student");
  // react hook form
  const { register, handleSubmit, control, formState, reset, trigger, watch } =
    useForm<any>({
      defaultValues: {
        role: "Student",
        name: "",
        dob: "",
        address: "",
        joinedDate: "",
        phone: "",
        email: "",
        password: "",
        status: "",
        title: "None",
        rating: "",
        skillLevel: "",
        fideId: "",
        trainerTitle: "None",
        guardianInfo: { name: "", phone: "", email: "" },
        enrolledCourses: [],
        emergencyContact: "",
        emergencyContactName: "",
      },
    });
  const { errors } = formState;
  console.log(errors);
  const onSubmit = async (data) => {
    console.log("Form Submitted Successfully:", data);
    const { data: resData } = await axios.post("/api/users/addNewUser", data);
    if (resData.statusCode == 200) {
      setnewUserAdded(true);
      setnewCreatedUser(resData.savedNewUser);
      handleClose();
    }
    console.log(resData);
    notify(resData.msg, resData.statusCode);
  };

  //options
  const titleOptions = ["None", "CM", "RM", "GM", "IM"];
  const roleOptions = ["Student", "Trainer", "Admin", "Superadmin"];
  const statusOptions = ["Ongoing", "Left"];
  const skillOptions = ["Beginner", "Intermediate", "Advanced"];
  const trainerTileOptions = ["None", "NI", "FI", "GM"];
  // form data
  const [formData, setFormData] = useState<any>({
    name: "",
    title: "None",
    dob: "",
    trainerTitle: "None",
    address: "",
    gender: "Male",
    rating: "",
    joinedDate: "",
    status: "Ongoing",
    email: "",
    password: "",
    phone: "",
    role: "Student",
    skillLevel: "Beginner",
    fideId: "",
    guardianInfo: { name: "", phone: "", email: "" },
    emergencyContactName: "",
    emergencyContact: "",
    enrolledCourses: [],
  });

  // Handle enrolledCourses dynamically
  const { fields, append, remove } = useFieldArray({
    control,
    name: "enrolledCourses",
  });

  // Function to add a new course
  const addCourse = () => {
    append({ course: "", status: "Ongoing" });
  };
  // Watch enrolledCourses for validation
  const enrolledCourses = watch("enrolledCourses");

  // Function to check for duplicate courses
  const isDuplicateCourse = (course: string) => {
    return enrolledCourses.filter((c) => c.course === course).length > 1;
  };

  const coursesList = [
    { value: "React Basics", label: "React Basics" },
    { value: "Advanced JavaScript", label: "Advanced JavaScript" },
    { value: "Data Structures", label: "Data Structures" },
  ];

  // handle dropdowwn change
  const handleDropdownChange = (name: string) => (value: string) => {
    if (name == "role") {
      setFormData({
        name: "",
        title: "None",
        dob: "",
        trainerTitle: "None",
        gender: "Male",
        address: "",
        rating: "",
        joinedDate: "",
        status: "Ongoing",
        email: "",
        password: "",
        phone: "",
        role: value,
        skillLevel: "Beginner",
        fideId: "",
        guardianInfo: {
          name: "",
          phone: "",
          email: "",
        },
        emergencyContactName: "",
        emergencyContact: "",
        enrolledCourses: [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value, // Update the specific field in formData
      });
    }
  };
  return (
    <>
      {/* heading */}
      <h1 className="w-max mr-auto text-2xl font-medium mb-2">
        Create New User
      </h1>
      {/* form */}
      <form
        className="flex-1 grid grid-cols-2 auto-rows-min grid-auto-flow-dense gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* basic info */}
        <div className="basic-info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Basic Info (Changing role with reset all fields.)
          </p>

          <div className="basic-info-fields grid grid-cols-2  gap-4">
            {/* role */}
            <Controller
              name="role"
              control={control}
              rules={{
                required: "Role is required",
              }}
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Role"
                    options={roleOptions}
                    selected={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setselectedRole(value);
                      reset((prevValues) => ({
                        ...prevValues,
                        role: value,
                        emergencyContact: "",
                        emergencyContactName: "",
                        enrolledCourses: [],
                      }));
                    }}
                    error={errors.role}
                    helperText={errors.role?.message}
                    required={true}
                    width="full"
                  />
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
          </div>
        </div>
        {/* Information */}
        <div className="info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Info
          </p>
          <div className="basic-info-fields grid grid-cols-2  gap-4">
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

            {/* phone */}
            <Controller
              name="phone"
              control={control}
              rules={{
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
                  required={false}
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
                  placeholder="Enter your email"
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
              name="status"
              control={control}
              rules={{
                required: "Status is required",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Status"
                  options={statusOptions}
                  selected={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  required={true}
                  error={errors.status}
                  helperText={errors.status?.message}
                  width="full"
                />
              )}
            />
          </div>
        </div>
        {/* Chess Information */}
        <div className="info">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Chess
          </p>

          <div className="basic-info-fields grid grid-cols-2  gap-4">
            {/* title */}
            {selectedRole == "Student" && (
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                }}
                render={({ field }) => {
                  return (
                    <Dropdown
                      label="Title"
                      options={titleOptions}
                      selected={field.value}
                      onChange={(value) => {
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
            )}
            {/* trainer title (no validation) */}
            {selectedRole == "Trainer" && (
              <Controller
                name="trainerTitle"
                control={control}
                rules={
                  {
                    //  required: "Trainer title is required",
                  }
                }
                render={({ field }) => {
                  return (
                    <Dropdown
                      label="Trainer title"
                      options={trainerTileOptions}
                      selected={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={errors.trainerTitle}
                      helperText={errors.trainerTitle?.message}
                      // required={true}
                    />
                  );
                }}
              />
            )}
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

            {/* skill level (only for student) (no validation) */}
            {selectedRole == "Student" && (
              <Controller
                name="skillLevel"
                control={control}
                rules={
                  {
                    // required: "Skill level is required",
                  }
                }
                render={({ field }) => {
                  return (
                    <Dropdown
                      label="Skill Level"
                      options={skillOptions}
                      selected={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={errors.skillLevel}
                      width="full"
                      helperText={errors.skillLevel?.message}
                      required={true}
                    />
                  );
                }}
              />
            )}
          </div>
        </div>
        {/* Guardian info */}
        {selectedRole == "Student" && (
          <div className="contact">
            <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
              Guardian info
            </p>
            <div className="basic-info-fields grid grid-cols-2  gap-4">
              {/* Guardian Name */}
              <Controller
                name="guardianInfo.name"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                    message: "Invalid guardian full name",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian Full Name"
                    type="text"
                    error={errors?.guardianInfo?.name}
                    helperText={errors?.guardianInfo?.name?.message}
                  />
                )}
              />
              {/* guardian phone */}
              <Controller
                name="guardianInfo.phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone no",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian Phone no"
                    type="number"
                    error={errors?.guardianInfo?.phone}
                    helperText={errors?.guardianInfo?.phone?.message}
                  />
                )}
              />
              {/* guardian email */}
              <Controller
                name="guardianInfo.email"
                control={control}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian email"
                    type="text"
                    error={errors?.guardianInfo?.email}
                    helperText={errors?.guardianInfo?.email?.message}
                  />
                )}
              />
            </div>
          </div>
        )}
        {/* emergencyContactName */}
        <div className="emergencyContactName col-span-2">
          <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
            Emergency contact
          </p>

          <div className="emergency-info-fields grid grid-cols-2  gap-4">
            {/* emergency contact name */}
            <Controller
              name="emergencyContactName"
              control={control}
              rules={{
                required: "Emergency contact required",
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
              name="emergencyContact"
              control={control}
              rules={{
                required: "Emergency contact required",
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
                  error={errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                  required={true}
                />
              )}
            />
          </div>
        </div>
        {/* enrolled courses */}
        {selectedRole === "Student" && (
          <div className="enrolledcourses col-span-2">
            <div className="flex">
              <h3 className="text-lg text-gray-500 font-semibold mr-2">
                Enrolled Courses
              </h3>
              <div title="Add user" onClick={addCourse}>
                <AddIcon
                  className="bg-gray-400 p-1 text-white rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </div>
            </div>

            {fields.length === 0 && (
              <p className="text-gray-500">No courses yet.</p>
            )}

            {fields.map((course, index) => (
              <div key={course.id} className="col-span-2 mb-2">
                <div className="grid grid-cols-3 items-end place-items-start gap-4">
                  {/* Course Selection */}
                  <Controller
                    name={`enrolledCourses.${index}.course`}
                    control={control}
                    rules={{
                      required: "Course is required",
                      validate: (value) =>
                        (value && !isDuplicateCourse(value, index)) ||
                        "Duplicate course selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Course"
                        options={coursesList.map((c) => c.value)}
                        selected={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                        }}
                        width="full"
                        error={!!errors?.enrolledCourses?.[index]?.course}
                      />
                    )}
                  />

                  {/* Course Status Selection */}
                  <Controller
                    name={`enrolledCourses.${index}.status`}
                    control={control}
                    rules={{
                      required: enrolledCourses[index]?.course
                        ? "Status is required"
                        : false,
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Status"
                        options={["Ongoing", "Completed"]}
                        selected={field.value}
                        onChange={field.onChange}
                        width="full"
                        error={!!errors?.enrolledCourses?.[index]?.status}
                      />
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 mx-4 text-2xl"
                  >
                    <DeleteIcon sx={{ fontSize: "2.1rem" }} />
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
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="info"
          size="large"
          className="col-span-2"
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default AddUser;
