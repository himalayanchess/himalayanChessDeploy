"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Don't forget to import the CSS for date picker

const Select = dynamic(() => import("react-select"), { ssr: false });

const ProjectForm = () => {
  const [trainersList, settrainersList] = useState([]);
  const [projectData, setProjectData] = useState({
    name: "",
    primaryContact: {
      name: "",
      email: "",
      phone: "",
    },
    contractType: "Academy",
    contractTo: "",
    assignedTrainers: [],
    contractPaper: "",
    timeSlots: [],
    location: "",
    joinedDate: "",
  });

  const timeSlots = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
  ];

  const contractTypes = [
    { value: "Academy", label: "Academy" },
    { value: "School", label: "School" },
    { value: "Others", label: "Others" },
  ];

  const handleTrainerChange = (selectedOption, index) => {
    const updatedTrainers = [...projectData.assignedTrainers];
    updatedTrainers[index] = {
      ...updatedTrainers[index],
      trainerId: selectedOption.value,
      trainerName: selectedOption.label,
    };
    setProjectData({ ...projectData, assignedTrainers: updatedTrainers });
  };

  const handleRoleChange = (role, index) => {
    const updatedTrainers = [...projectData.assignedTrainers];
    updatedTrainers[index] = {
      ...updatedTrainers[index],
      role,
    };
    setProjectData({ ...projectData, assignedTrainers: updatedTrainers });
  };

  const handleTimeSlotChange = (selectedOption, index) => {
    const updatedTimeSlots = [...projectData.timeSlots];
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      day: selectedOption.value,
    };
    setProjectData({ ...projectData, timeSlots: updatedTimeSlots });
  };

  const handleRemoveTrainer = (index) => {
    const updatedTrainers = [...projectData.assignedTrainers];
    updatedTrainers.splice(index, 1);
    setProjectData({ ...projectData, assignedTrainers: updatedTrainers });
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimeSlots = [...projectData.timeSlots];
    updatedTimeSlots.splice(index, 1);
    setProjectData({ ...projectData, timeSlots: updatedTimeSlots });
  };

  const handleContractTypeChange = (selectedOption) => {
    setProjectData({
      ...projectData,
      contractType: selectedOption.value,
      contractTo: selectedOption.value === "Academy" ? "Himalayan Academy" : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(projectData);

      const { data: resData } = await axios.post(
        "/api/projects/addNewProject",
        projectData
      );
      console.log(resData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // get trainers list
  async function getTrainersList() {
    const { data: resData } = await axios.get("api/users/getTrainersList");
    console.log(resData);
    settrainersList(() => {
      let tempArray = [];
      resData.trainersList.map((trainer: any) => {
        tempArray.push({ label: trainer.name, value: trainer._id });
      });
      console.log(tempArray);

      return tempArray;
    });
  }
  useEffect(() => {
    getTrainersList();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Create New Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Project Name</label>
          <input
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
          />
        </div>

        {/* Primary Contact */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Primary Contact Details</label>
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={projectData.primaryContact.name}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  primaryContact: {
                    ...projectData.primaryContact,
                    name: e.target.value,
                  },
                })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={projectData.primaryContact.email}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  primaryContact: {
                    ...projectData.primaryContact,
                    email: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={projectData.primaryContact.phone}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  primaryContact: {
                    ...projectData.primaryContact,
                    phone: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        {/* Contract Type */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Contract Type</label>
          <Select
            options={contractTypes}
            onChange={handleContractTypeChange}
            defaultValue={contractTypes[0]}
          />
        </div>

        {/* Contract To Field for School or Others */}
        {(projectData.contractType === "School" ||
          projectData.contractType === "Others") && (
          <div className="flex flex-col">
            <label className="text-lg font-medium">Contract To</label>
            <input
              type="text"
              value={projectData.contractTo}
              onChange={(e) =>
                setProjectData({ ...projectData, contractTo: e.target.value })
              }
              className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Joined Date */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Joined Date</label>
          <input
            type="date"
            name="date"
            onChange={(e) => {
              setProjectData({ ...projectData, joinedDate: e.target.value });
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* contract paper */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Contract Paper</label>
          <input
            type="text"
            name="contractPaper"
            onChange={(e) => {
              setProjectData({ ...projectData, contractPaper: e.target.value });
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* location */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Location</label>
          <input
            type="text"
            name="location"
            onChange={(e) => {
              setProjectData({ ...projectData, location: e.target.value });
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Assigned Trainers */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Assigned Trainers</label>
          {projectData.assignedTrainers.map((trainer, index) => (
            <div key={index} className="space-x-4 flex items-center mt-3">
              <Select
                options={trainersList}
                onChange={(selectedOption) =>
                  handleTrainerChange(selectedOption, index)
                }
                placeholder="Select Trainer"
                className="flex-1"
              />
              <Select
                options={[
                  { value: "Primary", label: "Primary" },
                  { value: "Substitute", label: "Substitute" },
                ]}
                onChange={(selectedOption) =>
                  handleRoleChange(selectedOption.value, index)
                }
                placeholder="Select Role"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveTrainer(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setProjectData({
                ...projectData,
                assignedTrainers: [
                  ...projectData.assignedTrainers,
                  { trainerName: "None", role: "None", trainerId: "" },
                ],
              });
            }}
            className="mt-4 text-blue-500"
          >
            Add Trainer
          </button>
        </div>

        {/* Time Slots */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Time Slots</label>
          {projectData.timeSlots.map((timeSlot, index) => (
            <div key={index} className="space-x-4 flex items-center mt-3">
              <Select
                options={timeSlots}
                onChange={(selectedOption) =>
                  handleTimeSlotChange(selectedOption, index)
                }
                placeholder="Select Day"
                className="flex-1"
              />
              <input
                type="text"
                value={timeSlot.time}
                onChange={(e) => {
                  const updatedTimeSlots = [...projectData.timeSlots];
                  updatedTimeSlots[index].time = e.target.value;
                  setProjectData({
                    ...projectData,
                    timeSlots: updatedTimeSlots,
                  });
                }}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => handleRemoveTimeSlot(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setProjectData({
                ...projectData,
                timeSlots: [...projectData.timeSlots, { day: "", time: "" }],
              });
            }}
            className="mt-4 text-blue-500"
          >
            Add Time Slot
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
