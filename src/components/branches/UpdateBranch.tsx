import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../Input";
import Dropdown from "../Dropdown";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Modal,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { notify } from "@/helpers/notify";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Edit } from "lucide-react";
import Link from "next/link";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const UpdateBranch = ({ branchRecord }: any) => {
  const session = useSession();
  const router = useRouter();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [updateBranchLoading, setUpdateBranchLoading] = useState(false);
  const [isMainBranch, setIsMainBranch] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<any>({
    defaultValues: {
      branchName: "",
      branchCode: "",
      address: "",
      country: "Nepal",
      establishedDate: "",
      isMainBranch: false,
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  const handleconfirmModalOpen = () => setConfirmModalOpen(true);
  const handleconfirmModalClose = () => setConfirmModalOpen(false);

  // on submit
  const onSubmit = async (data: any) => {
    setUpdateBranchLoading(true);
    const { data: resData } = await axios.post("/api/branches/updateBranch", {
      ...data,
      isMainBranch,
    });
    if (resData.statusCode === 200) {
      notify(resData.msg, resData.statusCode);
      setConfirmModalOpen(false);
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/branches`);
      }, 50);
      setUpdateBranchLoading(false);
      return;
    }
    setUpdateBranchLoading(false);
    notify(resData.msg, resData.statusCode);
  };

  // Populate data when editing
  useEffect(() => {
    if (branchRecord) {
      reset(branchRecord);
      setIsMainBranch(branchRecord.isMainBranch || false);
      setLoaded(true);
    }
  }, [branchRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
      <div className="header  w-full flex items-end justify-between">
        <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
          <Edit />
          <span className="ml-2">Update Branch</span>
        </h1>
        <Link href={`/${session?.data?.user?.role?.toLowerCase()}/branches`}>
          <Button className="homebutton" color="inherit" sx={{ color: "gray" }}>
            <HomeOutlinedIcon />
            <span className="ml-1">Home</span>
          </Button>
        </Link>
      </div>

      <Divider sx={{ margin: "0.7rem 0" }} />

      <form
        className="updateBranchForm form-fields mt-4 grid grid-cols-2 gap-7 w-full h-fit"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen();
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Branch Name */}
        <Controller
          name="branchName"
          control={control}
          rules={{ required: "Branch name is required" }}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input
                {...field}
                label="Branch Name"
                type="text"
                required
                error={errors.branchName}
                helperText={errors.branchName?.message}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isMainBranch}
                    onChange={(e) => setIsMainBranch(e.target.checked)}
                  />
                }
                label="This is the main HCA branch"
              />
            </div>
          )}
        />

        {/* Branch Code */}
        <Controller
          name="branchCode"
          control={control}
          rules={{ required: "Branch code is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Branch Code"
              type="text"
              required
              error={errors.branchCode}
              helperText={errors.branchCode?.message}
            />
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Address"
              type="text"
              required
              error={errors.address}
              helperText={errors.address?.message}
            />
          )}
        />

        {/* Country */}
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <Dropdown
              label="Country"
              options={["Nepal", "India", "Others"]}
              selected={field.value}
              onChange={field.onChange}
              error={errors.country}
              helperText={errors.country?.message}
              required
              width="full"
            />
          )}
        />

        {/* Established Date */}
        <Controller
          name="establishedDate"
          control={control}
          rules={{ required: "Established date is required" }}
          render={({ field }) => (
            <Input
              {...field}
              value={
                field.value
                  ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                  : ""
              }
              label="Established Date"
              type="date"
              required
              error={errors?.establishedDate}
              helperText={errors?.establishedDate?.message}
            />
          )}
        />

        {/* Contact Name */}
        <Controller
          name="contactName"
          control={control}
          rules={{ required: "Contact name is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Contact Name"
              required
              error={errors.contactName}
              helperText={errors.contactName?.message}
            />
          )}
        />

        {/* Contact Phone */}
        <Controller
          name="contactPhone"
          control={control}
          rules={{
            required: "Contact phone is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Phone number must be 10 digits",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Contact Phone"
              type="number"
              required
              error={errors.contactPhone}
              helperText={errors.contactPhone?.message}
            />
          )}
        />

        {/* Contact Email */}
        <Controller
          name="contactEmail"
          control={control}
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Contact Email"
              error={errors.contactEmail}
              helperText={errors.contactEmail?.message}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          onClick={handleconfirmModalOpen}
          variant="contained"
          color="info"
          size="large"
          className="col-span-2 w-max"
        >
          Submit
        </Button>

        {/* Hidden Submit Button */}
        <button type="submit" id="hiddenSubmit" hidden></button>

        {/* Confirm Modal */}
        <Modal
          open={confirmModalOpen}
          onClose={handleconfirmModalClose}
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] p-6 bg-white rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
            <p className="mb-6 text-gray-600">
              You want to update this branch.
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outlined" onClick={handleconfirmModalClose}>
                Cancel
              </Button>
              {updateBranchLoading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  variant="contained"
                  color="info"
                >
                  Updating...
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
                  Update Branch
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default UpdateBranch;
