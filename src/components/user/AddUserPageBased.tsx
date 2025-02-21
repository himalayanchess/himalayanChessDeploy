"use client";
import React, { useState } from "react";

const AddUser = () => {
  const [step, setStep] = useState(0); // Step 0 for role selection
  const [role, setRole] = useState(""); // Track the role
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    address: "",
    school: "",
    grade: "",
    subject: "",
    experience: "",
  });

  // Handles form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles role selection
  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(1); // Move to the first step after selecting a role
  };

  // Navigate between steps
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-lg mx-auto p-5 border rounded-lg shadow-md">
      {/* Role Selection Step */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select User Role</h2>
          <button
            onClick={() => handleRoleSelect("student")}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Student
          </button>
          <button
            onClick={() => handleRoleSelect("teacher")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Teacher
          </button>
        </div>
      )}

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 1: Basic Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Contact Information */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Step 2: Contact Information
          </h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Role-Specific Details */}
      {step === 3 && role === "student" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 3: Academic Details</h2>
          <input
            type="text"
            name="school"
            placeholder="School Name"
            value={formData.school}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <input
            type="text"
            name="grade"
            placeholder="Grade/Class"
            value={formData.grade}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </div>
      )}

      {step === 3 && role === "teacher" && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Step 3: Teaching Information
          </h2>
          <input
            type="text"
            name="subject"
            placeholder="Subject Specialization"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <input
            type="text"
            name="experience"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-2 border mb-3"
          />
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
