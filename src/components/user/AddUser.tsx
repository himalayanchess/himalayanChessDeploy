import { notify } from "@/index";
import axios from "axios";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AddUser = () => {
  // react hook form
  const { register, handleSubmit, control, formState, watch } = useForm<any>({
    defaultValues: {
      _name: "",
      get name() {
        return this._name;
      },
      set name(value) {
        this._name = value;
      },
      email: "",
      role: "",
    },
  });
  const { errors } = formState;
  console.log(errors);
  const onSubmit = async (data) => {
    console.log("Form Submitted Successfully:", data);
    const { data: resData } = await axios.post("/api/users/addNewUser", data);
    console.log(resData);
    notify(resData.msg, resData.statusCode);
  };

  //options
  const options = ["Student", "Trainer", "Admin", "Superadmin"];
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

  const coursesList = [
    { value: "React Basics", label: "React Basics" },
    { value: "Advanced JavaScript", label: "Advanced JavaScript" },
    { value: "Data Structures", label: "Data Structures" },
  ];
  const addCourse = () => {
    setFormData({
      ...formData,
      enrolledCourses: [
        ...formData.enrolledCourses,
        { course: "", status: "Ongoing" },
      ],
    });
  };
  const removeCourse = (index: any) => {
    const newCourses = [...formData.enrolledCourses];
    newCourses.splice(index, 1);
    setFormData({ ...formData, enrolledCourses: newCourses });
  };
  const handleCourseSelectChange = (value: string, index: number) => {
    setFormData((prevData) => {
      const updatedCourses = [...prevData.enrolledCourses];
      updatedCourses[index] = { ...updatedCourses[index], course: value };
      return { ...prevData, enrolledCourses: updatedCourses };
    });
  };

  const handleCourseStatusChange = (value: string, index: number) => {
    setFormData((prevData) => {
      const updatedCourses = [...prevData.enrolledCourses];
      updatedCourses[index] = { ...updatedCourses[index], status: value };
      return { ...prevData, enrolledCourses: updatedCourses };
    });
  };

  //handle change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith("guardianInfo.")) {
      const field = name.split(".")[1];

      setFormData({
        ...formData,
        guardianInfo: {
          ...formData.guardianInfo,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
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
                    options={options}
                    selected={field.value}
                    onChange={(value) => field.onChange(value)}
                    error={errors.role}
                    helperText={errors.role?.message}
                    width="full"
                  />
                );
              }}
            />
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
                  error={errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              label="Date of Birth"
            />
            <Dropdown
              label="Gender"
              options={["Male", "Female"]}
              selected={formData.gender}
              onChange={handleDropdownChange("gender")}
              width="full"
            />
            {/* address */}
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              label="Address  "
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
            <Input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              label="Joined Date"
            />
            {/* phone */}
            <Input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              label="Phone"
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
                  error={errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            {/* password */}
            <Input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
            />
            {/* Status (ongoing,left) */}
            <Dropdown
              label="Status"
              options={["Ongoing", "Left"]}
              selected={formData.status}
              onChange={handleDropdownChange("status")}
              width="full"
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
            <Dropdown
              label="Title"
              options={["None", "CM", "RM", "GM", "IM"]}
              selected={formData.title}
              onChange={handleDropdownChange("title")}
              width="full"
            />
            {/* rating */}
            <Input
              label="Rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
            {/* skill level (only for student) */}
            {formData.role == "Student" && (
              <Dropdown
                label="Skill level"
                options={["Beginner", "Intermediate", "Advanced"]}
                selected={formData.skillLevel}
                onChange={handleDropdownChange("skillLevel")}
                width="full"
              />
            )}
            {/* Fide Id */}
            <Input
              type="number"
              name="fideId"
              value={formData.fideId}
              onChange={handleChange}
              label="FIDE ID"
            />
            {/* trainer title */}
            {formData.role == "Trainer" && (
              <Dropdown
                label="Trainer Title"
                options={["None", "NI", "FI", "GM"]}
                selected={formData.trainerTitle}
                onChange={handleDropdownChange("trainerTitle")}
                width="full"
              />
            )}
          </div>
        </div>
        {/* Guardian info */}
        {formData.role == "Student" && (
          <div className="contact">
            <p className="bg-gray-400 text-white w-max text-xs p-1 px-2 mb-2 rounded-full font-bold">
              Guardian info
            </p>
            <div className="basic-info-fields grid grid-cols-2  gap-4">
              {/* Guardian Name */}
              <Input
                type="text"
                name="guardianInfo.name"
                value={formData.guardianInfo.name}
                onChange={handleChange}
                label="Guardian Name"
              />
              {/* guardian phone */}
              <Input
                type="text"
                name="guardianInfo.phone"
                value={formData.guardianInfo.phone}
                onChange={handleChange}
                label="Guardian Phone"
              />
              {/* guardian email */}
              <Input
                type="text"
                name="guardianInfo.email"
                value={formData.guardianInfo.email}
                onChange={handleChange}
                label="Guardian Email"
              />
            </div>
          </div>
        )}
        {formData.role == "Student" && (
          <div className="enrolledcourses col-span-2">
            <div className="flex">
              <h3 className="text-lg text-gray-500 font-semibold mr-2">
                Enrolled Courses
              </h3>
              <button title="Add user" onClick={addCourse}>
                <AddIcon
                  className="bg-gray-400 p-1 text-white rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </button>
            </div>

            {formData.enrolledCourses.length == 0 && (
              <p className="text-gray-500">No courses yet.</p>
            )}

            {formData.enrolledCourses.map((course: any, index: number) => (
              <div key={index} className="col-span-2 mb-2">
                <div className="grid grid-cols-3 items-end place-items-start gap-4">
                  {/* Course Selection */}

                  <Dropdown
                    label="Course"
                    options={coursesList.map((c) => c.value)}
                    selected={course.course}
                    onChange={(value) => handleCourseSelectChange(value, index)}
                    width="full"
                  />

                  {/* Course Status Selection */}

                  <Dropdown
                    label="Status"
                    options={["Ongoing", "Completed"]}
                    selected={course.status}
                    onChange={(value) => handleCourseStatusChange(value, index)}
                    width="full"
                  />
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="text-red-500 mx-4 text-2xl"
                  >
                    <DeleteIcon sx={{ fontSize: "2.1rem" }} />
                  </button>
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
