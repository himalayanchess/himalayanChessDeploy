import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import { Box, Button, Divider, Modal } from "@mui/material";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects, getAllBranches } from "@/redux/allListSlice";
import { LoadingButton } from "@mui/lab";
import { Component } from "lucide-react";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AddBatch = () => {
  const router = useRouter();
  const session = useSession();
  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const { allActiveProjects, allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const affiliatedOptions = ["HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const [addBatchLoading, setaddBatchLoading] = useState(false);

  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<any>({
    defaultValues: {
      affiliatedTo: "HCA",
      batchName: "HCA_",
      projectId: "",
      projectName: "",
      completedStatus: "Ongoing",
      batchStartDate: "",
      batchEndDate: "",
      branchId: "",
      branchName: "",
    },
  });
  // on submit function
  async function onSubmit(data: any) {
    setaddBatchLoading(true);
    const { data: resData } = await axios.post(
      "/api/batches/addNewBatch",
      data
    );
    if (resData.statusCode == 200) {
      notify(resData.msg, resData.statusCode);
      handleconfirmModalClose();
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/batches`);
      }, 50);
      setaddBatchLoading(false);
      return;
    }
    setaddBatchLoading(false);
    notify(resData.msg, resData.statusCode);
    return;
  }

  // fetch initial data
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      <div className="heading flex items-center gap-4">
        <div className="header  w-full flex items-end justify-between">
          <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
            <Component />
            <span className="ml-2">Create New Batch</span>
          </h1>
          {/* home */}
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/batches`}>
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

      {/* divider */}
      <Divider sx={{ margin: "0.7rem 0" }} />

      {/* Form */}
      <form
        className="addbatchform form-fields mt-4 grid grid-cols-2 gap-7 w-full h-fit"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* first rows */}
        <div className="first col-span-2 grid grid-cols-2 gap-4">
          {/* affiliated to */}
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
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                    setselectedAffiliatedTo(value);

                    reset((prev: any) => {
                      if (value === "HCA") {
                        // Don't change branchName and branchId if "HCA" is selected
                        return {
                          ...prev,
                          batchName: value === "HCA" ? "HCA_" : "",
                          projectName: "",
                          projectId: "",
                          branchName: prev.branchName,
                          branchId: prev.branchId,
                        };
                      } else {
                        // Reset branchName and branchId when not "HCA"
                        return {
                          ...prev,
                          batchName: value === "HCA" ? "HCA_" : "",
                          projectName: "",
                          projectId: "",
                          branchName: value ? "" : prev.branchName,
                          branchId: value ? "" : prev.branchId,
                        };
                      }
                    });
                  }}
                  error={errors.affiliatedTo}
                  helperText={errors.affiliatedTo?.message}
                  required={true}
                  width="full"
                />
              );
            }}
          />

          {/* batch name */}
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
        </div>

        {/* second row */}
        {/* associated project */}
        {selectedAffiliatedTo.toLowerCase() != "hca" && (
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
                  options={allActiveProjects.map(
                    (project: any) => project.name
                  )}
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                    const selectedProject: any = allActiveProjects.find(
                      (project: any) => project.name == value
                    );
                    console.log(selectedProject);

                    setValue("projectId", selectedProject?._id);
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

        {/* third row */}
        <div className="third col-span-2 grid grid-cols-2 gap-4">
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
        </div>

        {/* fourth row */}
        {/* branch */}
        {selectedAffiliatedTo?.toLowerCase() == "hca" && (
          <div className="branch col-span-1">
            <Controller
              name="branchName"
              control={control}
              rules={{
                required: "Branch is required",
              }}
              render={({ field }) => (
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
              )}
            />
          </div>
        )}
        {/* Complete Status */}
        <div className="completeStatus col-span-1">
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
                selected={field.value || ""}
                onChange={(value: any) => {
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
          onClick={handleconfirmModalOpen}
          variant="contained"
          color="info"
          size="large"
          className="col-span-2 w-max"
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
            <p className="mb-6 text-gray-600">You want to add new batch.</p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleconfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {addBatchLoading ? (
                <LoadingButton
                  size="large"
                  loading={addBatchLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Adding batch</span>
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
                  Add batch
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default AddBatch;
