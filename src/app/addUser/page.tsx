"use client";
import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
const Select = dynamic(() => import("react-select"), { ssr: false });

const UserForm = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    title: "None",
    dob: "",
    trainerTitle: "None",
    gender: "None",
    rating: "",
    joinedDate: "",
    status: "Ongoing",
    email: "",
    password: "",
    phone: "",
    role: "Student",
    skillLevel: "None",
    fideId: "",
    guardianInfo: { name: "", relationship: "Father", phone: "", email: "" },
    emergencyContactName: "",
    emergencyContact: "",
    enrolledCourses: [],
  });

  const roleOptions = [
    { value: "Student", label: "Student" },
    { value: "Trainer", label: "Trainer" },
    { value: "Admin", label: "Admin" },
    { value: "Superadmin", label: "Superadmin" },
  ];

  const skillLevelOptions = [
    { value: "None", label: "None" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const titleOptions = [
    { value: "None", label: "None" },
    { value: "CM", label: "CM" },
    { value: "RM", label: "RM" },
    { value: "NI", label: "NI" },
    { value: "FI", label: "FI" },
    { value: "WGM", label: "WGM" },
    { value: "IM", label: "IM" },
    { value: "GM", label: "GM" },
  ];
  const trainerTitles = [
    { value: "None", label: "None" },
    { value: "NI", label: "NI" },
    { value: "FI", label: "FI" },
    { value: "WGM", label: "WGM" },
    { value: "IM", label: "IM" },
    { value: "GM", label: "GM" },
  ];

  const genderOptions = [
    { value: "None", label: "None" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const coursesList = [
    { value: "Math 101", label: "Math 101" },
    { value: "Physics 201", label: "Physics 201" },
    { value: "Chemistry 301", label: "Chemistry 301" },
    { value: "Biology 401", label: "Biology 401" },
  ];

  function resetForm() {}

  const addCourse = () => {
    setFormData({
      ...formData,
      enrolledCourses: [
        ...formData.enrolledCourses,
        { course: "", status: "Ongoing" },
      ],
    });
  };

  const handleCourseSelectChange = (selectedOption: any, index: number) => {
    const newCourses = [...formData.enrolledCourses];
    newCourses[index].course = selectedOption?.value;
    setFormData({ ...formData, enrolledCourses: newCourses });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const removeCourse = (index: any) => {
    const newCourses = [...formData.enrolledCourses];
    newCourses.splice(index, 1);
    setFormData({ ...formData, enrolledCourses: newCourses });
  };
  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log(formData);
    const { data: resData } = await axios.post(
      "api/users/addNewUser",
      formData
    );
    console.log(resData);
  }
  return (
    <div className="w-1/2 mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* <Sidebar /> */}
      <h2 className="text-xl font-semibold mb-4">User Registration</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        {/* Role */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Role</label>
          <Select
            name="role"
            value={{ label: formData.role, value: formData.role }}
            onChange={(selected: any) => {
              //reset form
              if (formData.role !== selected.value) {
                setFormData({
                  name: "",
                  title: "None",
                  dob: "",
                  trainerTitle: "None",
                  gender: "None",
                  rating: "",
                  joinedDate: "",
                  status: "Ongoing",
                  email: "",
                  password: "",
                  phone: "",
                  role: selected.value,
                  skillLevel: "Beginner",
                  fideId: "",
                  guardianInfo: {
                    name: "",
                    relationship: "Father",
                    phone: "",
                    email: "",
                  },
                  emergencyContactName: "",
                  emergencyContact: "",
                  enrolledCourses: [],
                });
              }
            }}
            options={roleOptions}
            className="w-full"
          />
        </div>
        {/* Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* dob */}
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Select
            name="title"
            value={{ label: formData.title, value: formData.title }}
            onChange={(selected: any) =>
              setFormData({ ...formData, title: selected.value })
            }
            options={titleOptions}
            className="w-full"
          />
        </div>
        {/* gender */}
        <div className="w-full">
          <label className="block text-sm font-medium">Gender</label>
          <Select
            name="gender"
            value={{ label: formData.gender, value: formData.gender }}
            onChange={(selected: any) =>
              setFormData({ ...formData, gender: selected.value })
            }
            options={genderOptions}
            className="w-full"
          />
          {/* <Select
            name="gender"
            options={genderOptions}
            value={{ label: formData.gender, value: formData.title }}
            onChange={handleChange}
          /> */}
        </div>
        {/* Rating & Joined Date */}
        <div>
          <label className="block text-sm font-medium">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Joined Date</label>
          <input
            type="date"
            name="joinedDate"
            value={formData.joinedDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email & password */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* skill level for students */}
        {formData.role == "Student" && (
          <div className="col-span-2">
            <label className="block text-sm font-medium">Skill Level</label>
            <Select
              name="skillLevel"
              value={{ label: formData.skillLevel, value: formData.skillLevel }}
              onChange={(selected: any) => {
                setFormData({ ...formData, skillLevel: selected.value });
              }}
              options={skillLevelOptions}
              className="w-full"
            />
          </div>
        )}
        {/* FIDE ID (hidden for admin and superadmin) */}
        {formData.role !== "admin" && formData.role !== "superadmin" && (
          <div>
            <label className="block text-sm font-medium">FIDE ID</label>
            <input
              type="number"
              name="fideId"
              value={formData.fideId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Status</label>
          <Select
            name="status"
            value={{
              label: formData.status,
              value: formData.status,
            }}
            onChange={(selected: any) =>
              setFormData({ ...formData, status: selected.value })
            }
            options={[
              { value: "Ongoing", label: "Ongoing" },
              { value: "Left", label: "Left" },
            ]}
            className="w-full"
          />
        </div>

        {/* Trainer Title (only for trainers) */}
        {formData.role === "Trainer" && (
          <div>
            <label className="block text-sm font-medium">Trainer Title</label>
            <Select
              name="trainerTitle"
              value={{
                label: formData.trainerTitle,
                value: formData.trainerTitle,
              }}
              onChange={(selected: any) =>
                setFormData({ ...formData, trainerTitle: selected.value })
              }
              options={trainerTitles}
              className="w-full"
            />
          </div>
        )}

        {/* Conditional Fields for Student Role */}
        {formData.role === "Student" && (
          <>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold">Guardian Information</h3>
            </div>
            <div>
              <label className="block text-sm font-medium">Guardian Name</label>
              <input
                type="text"
                name="guardianInfo.name"
                value={formData.guardianInfo.name}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guardianInfo: {
                      ...formData.guardianInfo,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Relationship</label>
              <Select
                name="guardianInfo.relationship"
                value={{
                  label: formData.guardianInfo.relationship,
                  value: formData.guardianInfo.relationship,
                }}
                onChange={(selected: any) =>
                  setFormData({
                    ...formData,
                    guardianInfo: {
                      ...formData.guardianInfo,
                      relationship: selected.value,
                    },
                  })
                }
                options={[
                  { value: "Father", label: "Father" },
                  { value: "Mother", label: "Mother" },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Guardian Phone
              </label>
              <input
                type="number"
                name="guardianInfo.phone"
                value={formData.guardianInfo.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guardianInfo: {
                      ...formData.guardianInfo,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Guardian Email
              </label>
              <input
                type="email"
                name="guardianInfo.email"
                value={formData.guardianInfo.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guardianInfo: {
                      ...formData.guardianInfo,
                      email: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* Contacts */}
        <div>
          <label className="block text-sm font-medium">
            Emergency Contact Name
          </label>
          <input
            type="tel"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Emergency Contact</label>
          <input
            type="number"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Enrolled Courses */}
        {formData.role === "Student" && (
          <>
            {/* Enrolled Courses */}
            {formData.role === "Student" && (
              <>
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold">Enrolled Courses</h3>
                  <button
                    type="button"
                    onClick={addCourse}
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                  >
                    Add Course
                  </button>
                </div>
                {formData.enrolledCourses.map((course: any, index: any) => (
                  <div key={index} className="col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Course
                        </label>
                        <Select
                          name="course"
                          value={
                            course.course
                              ? { label: course.course, value: course.course }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleCourseSelectChange(selectedOption, index)
                          }
                          options={coursesList}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">
                          Course Status
                        </label>
                        <div className="flex items-center">
                          <Select
                            name="status"
                            value={{
                              label: course.status,
                              value: course.status,
                            }}
                            onChange={(selected: any) => {
                              const newCourses = [...formData.enrolledCourses];
                              newCourses[index].status = selected.value;
                              setFormData({
                                ...formData,
                                enrolledCourses: newCourses,
                              });
                            }}
                            options={[
                              { value: "Ongoing", label: "Ongoing" },
                              { value: "Completed", label: "Completed" },
                            ]}
                            className="w-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeCourse(index)}
                            className="text-red-500 mx-4 text-2xl"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
