import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Dropdown from "../Dropdown";

const ManageClass = () => {
  const [selectedContractType, setSelectedContractType] = useState("HCA");
  const [trainersList, setTrainersList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      trainerName: "",
      trainerId: "",
      courseName: "",
      courseId: "",
      projectName: "",
      projectId: "",
    },
  });

  const handleContractTypeChange = (contract) => {
    setSelectedContractType(contract);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const getInitialData = async () => {
    try {
      const { data: trainersResData } = await axios.get(
        "/api/users/getTrainersList"
      );
      setTrainersList(trainersResData.trainersList);

      const { data: courseResData } = await axios.get(
        "/api/courses/getAllCourses"
      );
      setCourseList(courseResData.allCourses);

      const { data: projectResData } = await axios.get(
        "/api/projects/getAllProjects"
      );
      const filteredNonAcademyProjects = projectResData.allProjects.filter(
        (project) => project?.contractType?.toLowerCase() !== "academy"
      );
      setProjectList(filteredNonAcademyProjects);
    } catch (error) {
      console.log("Error in ManageClass component", error);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-4 rounded-lg"
    >
      {/* Project Selection */}
      <h1 className="text-lg font-bold mb-2">
        Assign Class for {selectedContractType}
      </h1>
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedContractType === "HCA" ? "contained" : "outlined"}
          color="success"
          disableElevation
          onClick={() => handleContractTypeChange("HCA")}
        >
          HCA
        </Button>
        <Button
          variant={selectedContractType === "School" ? "contained" : "outlined"}
          color="success"
          disableElevation
          onClick={() => handleContractTypeChange("School")}
        >
          School
        </Button>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* batch name */}
        <Controller
          name="batchName"
          control={control}
          rules={{ required: "Batch is required" }}
          render={({ field }) => (
            <Dropdown
              label="Batch"
              options={trainersList.map((trainer) => trainer.name)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedTrainer = trainersList.find(
                  (trainer) => trainer.name === value
                );
                setValue("trainerId", selectedTrainer?._id || "");
              }}
              error={errors.trainerName}
              helperText={errors.trainerName?.message}
              width="full"
              required
            />
          )}
        />
        {/* trainer name */}
        <Controller
          name="trainerName"
          control={control}
          rules={{ required: "Trainer is required" }}
          render={({ field }) => (
            <Dropdown
              label="Trainer name"
              options={trainersList.map((trainer) => trainer.name)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedTrainer = trainersList.find(
                  (trainer) => trainer.name === value
                );
                setValue("trainerId", selectedTrainer?._id || "");
              }}
              error={errors.trainerName}
              helperText={errors.trainerName?.message}
              width="full"
              required
            />
          )}
        />

        <Controller
          name="courseName"
          control={control}
          rules={{ required: "Course is required" }}
          render={({ field }) => (
            <Dropdown
              label="Course name"
              options={courseList.map((course) => course.name)}
              selected={field.value}
              onChange={(value) => {
                field.onChange(value);
                const selectedCourse = courseList.find(
                  (course) => course.name === value
                );
                setValue("courseId", selectedCourse?._id || "");
              }}
              error={errors.courseName}
              helperText={errors.courseName?.message}
              width="full"
              required
            />
          )}
        />

        {selectedContractType === "School" && (
          <div className="col-span-2">
            <Controller
              name="projectName"
              control={control}
              rules={{ required: "Project is required" }}
              render={({ field }) => (
                <Dropdown
                  label="Project name"
                  options={projectList.map((project) => project.name)}
                  selected={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const selectedProject = projectList.find(
                      (project) => project.name === value
                    );
                    setValue("projectId", selectedProject?._id || "");
                  }}
                  error={errors.projectName}
                  helperText={errors.projectName?.message}
                  required
                />
              )}
            />
          </div>
        )}
      </div>

      <Divider sx={{ margin: "1rem 0" }} />

      {/* Students List */}
      <div>
        <h1 className="text-lg font-bold mb-2">Students</h1>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-sm">
              Student {i + 1}
            </p>
          ))}
        </div>
      </div>
    </form>
  );
};

export default ManageClass;
