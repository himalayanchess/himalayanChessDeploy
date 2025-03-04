import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import { Button } from "@mui/material";
import axios from "axios";
import { notify } from "@/helpers/notify";

const AddBatch = ({
  newBatchAdded,
  setnewBatchAdded,
  newCreatedBatch,
  setnewCreatedBatch,
  allProjects,
  handleClose,
  mode = "add",
  initialData,
  // boolean
  batchEdited,
  setbatchEdited,
  //object
  editedBatch,
  seteditedBatch,
}) => {
  const affiliatedOptions = ["HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues:
      mode === "add"
        ? {
            affiliatedTo: "HCA",
            batchName: "HCA_",
            projectId: "",
            projectName: "",
            completedStatus: "Ongoing",
            batchStartDate: "",
            batchEndDate: "",
          }
        : { ...initialData },
  });
  // on submit function
  async function onSubmit(data) {
    if (mode == "add") {
      const { data: resData } = await axios.post(
        "/api/batches/addNewBatch",
        data
      );
      if (resData.statusCode == 200) {
        setnewBatchAdded(true);
        setnewCreatedBatch(resData.savedNewBatch);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    } else if (mode == "edit") {
      const { data: resData } = await axios.post(
        "/api/batches/updateBatch",
        data
      );
      if (resData.statusCode == 200) {
        setbatchEdited(true);
        seteditedBatch(data);
        handleClose();
      }
      notify(resData.msg, resData.statusCode);
      return;
    }
  }
  return (
    <>
      <h1 className="w-max mr-auto text-2xl font-medium mb-2">
        {mode == "add" && "Create New Batch"}
        {mode == "edit" && `Update (${initialData?.batchName})`}
      </h1>
      {/* Form */}
      <form
        className="flex-1 grid grid-cols-2 auto-rows-min gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Batch Name */}
        <Controller
          name="affiliatedTo"
          control={control}
          rules={{
            required: "Affiliation is required",
          }}
          render={({ field }) => {
            return (
              <Dropdown
                label="Affiliated to"
                options={affiliatedOptions}
                selected={field.value}
                disabled={mode == "edit"}
                onChange={(value) => {
                  field.onChange(value);
                  setselectedAffiliatedTo(value);
                  reset((prev) => {
                    return {
                      ...prev,
                      batchName: value == "HCA" ? "HCA_" : "",
                      projectName: "",
                      projectId: "",
                    };
                  });
                }}
                error={errors.affiliatedTo}
                helperText={errors.affiliatedTo?.message}
                required={true}
                width="full"
              />
            );
          }}
        />{" "}
        {/* contract type */}
        <Controller
          name="batchName"
          control={control}
          rules={{
            required: "Batch name is required",
          }}
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={field.value || ""}
                label="Batch Name"
                type="text"
                required={true}
                error={errors?.batchName}
                helperText={errors?.batchName?.message}
              />
            );
          }}
        />
        {/* associated project */}
        {(selectedAffiliatedTo != "HCA" || initialData?.projectName) && (
          <div className="projectName col-span-2">
            <Controller
              name="projectName"
              control={control}
              rules={{
                required: "Project name is required",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Project name"
                  options={allProjects.map((project) => project.projectName)}
                  selected={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const selectedProject = allProjects.find(
                      (project) => project.projectName === value
                    );

                    setValue(
                      "projectDetails",
                      selectedProject?.projectDetails || {}
                    );
                  }}
                  error={errors.projectName}
                  helperText={errors.projectName?.message}
                  required={true}
                  width="full"
                />
              )}
            />
          </div>
        )}
        {/* Project start date */}
        <Controller
          name="batchStartDate"
          control={control}
          rules={{
            required: "Start date is required",
          }}
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={field.value || ""}
                label="Start Date"
                type="date"
                required={true}
                error={errors?.batchStartDate}
                helperText={errors?.batchStartDate?.message}
              />
            );
          }}
        />
        {/* Project start date  (optional)*/}
        <Controller
          name="batchEndDate"
          control={control}
          rules={
            {
              // required: "End date is required",
            }
          }
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={field.value || ""}
                label="End Date"
                type="date"
                error={errors?.batchEndDate}
                helperText={errors?.batchEndDate?.message}
              />
            );
          }}
        />
        {/* Complete Status */}
        <div className="projectName col-span-2">
          <Controller
            name="completedStatus"
            control={control}
            rules={{
              required: "Status is required",
            }}
            render={({ field }) => (
              <Dropdown
                label="Status"
                options={["Ongoing", "Completed"]}
                selected={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                error={errors.completeStatus}
                helperText={errors.completeStatus?.message}
                required={true}
                width="full"
              />
            )}
          />
        </div>
        {/* add or edit button */}
        <Button
          type="submit"
          variant="contained"
          color="info"
          size="large"
          className="col-span-2"
        >
          {mode == "add" ? "Submit" : "Edit"}
        </Button>
      </form>
    </>
  );
};

export default AddBatch;
