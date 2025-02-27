import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import { Button, IconButton } from "@mui/material";
import Input from "../Input";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { notify } from "@/helpers/notify";

const AddCourse = ({
  mode = "add",
  initialData,
  handleClose,
  newCourseAdded,
  setnewCourseAdded,
  newCreatedCourse,
  setnewCreatedCourse,
  // boolean
  courseEdited,
  setcourseEdited,
  editedCourse,
  seteditedCourse,
}) => {
  const skillOptions = ["Beginner", "Intermediate", "Advanced"];
  const nextCourseOptions = ["Course1", "Course2", "Course3", "Course4"];
  const [syllabus, setSyllabus] = useState<any>([]);
  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues:
      mode === "add"
        ? {
            name: "",
            duration: 12,
            skillLevel: "Beginner",
            nextCourseName: "",

            // syllabus from state
            // syllabus: [{ chapterName: "", subchapters: [""] }], // Default syllabus structure
          }
        : { ...initialData },
  });
  console.log(syllabus);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    if (mode == "add") {
      const { data: resData } = await axios.post(
        "/api/courses/addNewCourse",
        data
      );
      if (resData.statusCode == 200) {
        setnewCourseAdded(true);
        // console.log(resData);

        setnewCreatedCourse(resData.savednewCourse);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    } else if (mode == "edit") {
      const { data: resData } = await axios.post(
        "/api/courses/updateCourse",
        data
      );
      if (resData.statusCode == 200) {
        setcourseEdited(true);
        seteditedCourse(data);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    }
  };

  return (
    <>
      <h1 className="w-max mr-auto text-2xl font-medium mb-2">
        {mode === "add" ? "Add Course" : `Update (${initialData.name})`}
      </h1>
      {/* Form */}
      <form
        className="flex-1 grid grid-cols-2 auto-rows-min gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Course Name */}
        <div className="col-span-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Course name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Course Name"
                error={errors.name}
                helperText={errors.name?.message}
                required
              />
            )}
          />
        </div>

        {/* Course Duration */}
        <Controller
          name="duration"
          control={control}
          rules={{ required: "Duration is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Duration (weeks)"
              error={errors.duration}
              helperText={errors.duration?.message}
              required
            />
          )}
        />

        {/* Skill Level Dropdown */}
        <Controller
          name="skillLevel"
          control={control}
          rules={{ required: "Skill level is required" }}
          render={({ field }) => (
            <Dropdown
              label="Skill Level"
              options={skillOptions}
              selected={field.value}
              onChange={(value) => field.onChange(value)}
              error={errors.skillLevel}
              helperText={errors.skillLevel?.message}
              required
              width="full"
            />
          )}
        />

        {/* Next Course Dropdown */}
        <div className="col-span-2">
          <Controller
            name="nextCourseName"
            control={control}
            rules={{ required: "Next course is required" }}
            render={({ field }) => (
              <Dropdown
                label="Next Course"
                options={nextCourseOptions}
                selected={field.value}
                onChange={(value) => field.onChange(value)}
                error={errors.nextCourseName}
                helperText={errors.nextCourseName?.message}
                required
                width="full"
              />
            )}
          />
        </div>

        {/* Syllabus: Chapters and Subchapters */}

        {/* Submit Button */}
        {mode == "add" && (
          <Button
            type="submit"
            className="col-span-2"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        )}
        {mode == "edit" && (
          <Button
            type="submit"
            className="col-span-2"
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        )}
      </form>
    </>
  );
};

export default AddCourse;
