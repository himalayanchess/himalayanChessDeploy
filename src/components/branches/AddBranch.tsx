import React, { useState } from "react";
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
import { MapPinHouse } from "lucide-react";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AddBranch = () => {
  const router = useRouter();
  const session = useSession();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [addBranchLoading, setAddBranchLoading] = useState(false);
  const [isMainBranch, setIsMainBranch] = useState(false); // ✅ new state

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<any>({
    defaultValues: {
      branchName: "",
      branchCode: "",
      address: "",
      country: "Nepal",
      establishedDate: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      mapLocation: "",
      activeStatus: true,
    },
  });

  function handleConfirmModalOpen() {
    setConfirmModalOpen(true);
  }

  function handleConfirmModalClose() {
    setConfirmModalOpen(false);
  }

  async function onSubmit(data: any) {
    setAddBranchLoading(true);

    const payload = {
      ...data,
      isMainBranch,
    };

    const { data: resData } = await axios.post(
      "/api/branches/addNewBranch",
      payload
    );

    if (resData.statusCode === 200) {
      notify(resData.msg, resData.statusCode);
      handleConfirmModalClose();
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/branches`);
      }, 50);
      // reset();
      // setIsMainBranch(false); // ✅ reset checkbox
      setAddBranchLoading(false);
      return;
    }

    notify(resData.msg, resData.statusCode);
    setAddBranchLoading(false);
  }

  return (
    <div className="flex flex-col w-full h-full bg-white px-7 py-5 rounded-md shadow-md">
      <div className="heading flex items-center gap-4">
        <div className="header  w-full flex items-end justify-between">
          <h1 className="text-2xl font-bold mr-auto flex items-center">
            <MapPinHouse />
            <span className="ml-2">Create New Branch</span>
          </h1>
          {/* home */}
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/branches`}>
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

      <Divider sx={{ margin: "0.7rem 0" }} />

      <form
        className="form-fields flex-1 h-full  overflow-y-auto grid grid-cols-2 gap-3"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleConfirmModalOpen();
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Branch Info */}
        <Controller
          name="branchName"
          control={control}
          rules={{ required: "Branch name is required" }}
          render={({ field }) => (
            <div className="flex flex-col">
              <Input
                {...field}
                label="Branch Name"
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

        <Controller
          name="branchCode"
          control={control}
          rules={{ required: "Branch code is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Branch Code"
              required
              error={errors.branchCode}
              helperText={errors.branchCode?.message}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Address"
              required
              error={errors.address}
              helperText={errors.address?.message}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Country"
              error={!!errors.country}
              helperText={errors.country?.message}
            />
          )}
        />

        <Controller
          name="establishedDate"
          control={control}
          rules={{ required: "Established date is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Established Date"
              type="date"
              error={!!errors.establishedDate}
              helperText={errors.establishedDate?.message}
            />
          )}
        />

        <Controller
          name="mapLocation"
          control={control}
          // rules={{ required: "Address is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Map Location"
              error={errors.mapLocation}
              helperText={errors.mapLocation?.message}
            />
          )}
        />

        {/* contact details */}
        <div className="contact-details col-span-2 grid grid-cols-2 gap-3">
          <h1 className="font-bold  col-span-2">Contact Information</h1>
          <Controller
            name="contactName"
            control={control}
            rules={{ required: "Contact name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Contact Name"
                required
                error={!!errors.contactName}
                helperText={errors.contactName?.message}
              />
            )}
          />

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
                error={!!errors.contactPhone}
                helperText={errors.contactPhone?.message}
              />
            )}
          />

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
                error={!!errors.contactEmail}
                helperText={errors.contactEmail?.message}
              />
            )}
          />
        </div>

        <Button
          onClick={handleConfirmModalOpen}
          variant="contained"
          color="info"
          className="col-span-2 w-max h-max"
        >
          Submit
        </Button>

        <button type="submit" hidden id="hiddenSubmit"></button>

        {/* Modal */}
        <Modal
          open={confirmModalOpen}
          onClose={handleConfirmModalClose}
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] p-6 bg-white rounded-xl shadow-xl flex flex-col items-center">
            <p className="text-2xl font-semibold mb-4">Are you sure?</p>
            <p className="mb-6 text-gray-600">You want to add a new branch.</p>
            <div className="flex gap-5">
              <Button onClick={handleConfirmModalClose} variant="outlined">
                Cancel
              </Button>
              {addBranchLoading ? (
                <LoadingButton
                  size="large"
                  loading={addBranchLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7 w-full"
                >
                  Adding branch...
                </LoadingButton>
              ) : (
                <Button
                  onClick={() => {
                    document.getElementById("hiddenSubmit")?.click();
                    if (!isValid) handleConfirmModalClose();
                  }}
                  variant="contained"
                  color="info"
                >
                  Add Branch
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default AddBranch;
