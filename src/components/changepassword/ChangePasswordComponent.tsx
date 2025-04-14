"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import changepasswordImage from "@/images/changepassword.png";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { notify } from "@/helpers/notify";

export default function ChangePasswordComponent() {
  // Separate states for each password field visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  // session
  const session = useSession();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const { data: resData } = await axios.post("/api/changepassword", {
        ...data,
        userId: session?.data?.user?._id,
      });
      if (resData?.statusCode == 200) {
        notify(resData?.msg, resData?.statusCode);
        reset();
        setconfirmModalOpen(false);
        return;
      }
      notify(resData?.msg, resData?.statusCode);
    } catch (error) {
      console.log("Error in change password onsubmit function", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-md shadow-md p-4">
      <div className="w-[350px] flex flex-col items-center p-6 ">
        <Image
          src={changepasswordImage}
          alt="Change Password"
          className="w-[100px]"
          priority
        />
        <h2 className="text-2xl mt-2 font-semibold text-center text-gray-800">
          Change Password
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setconfirmModalOpen(true); // Open modal instead of submitting form
            }
          }}
          className="w-full mt-4 space-y-4"
        >
          {/* Current Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-1">
              Current Password
            </label>
            <Controller
              name="currentPassword"
              control={control}
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^.{8,}$/,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg   pr-10"
                />
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
            {errors.currentPassword && (
              <p className="text-red-600 text-xs">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-1">
              New Password
            </label>
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^.{8,}$/,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg   pr-10"
                />
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
            {errors.newPassword && (
              <p className="text-red-600 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-1">
              Confirm New Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              }}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value || ""}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg   pr-10"
                />
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setconfirmModalOpen(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Change Password
          </Button>
          {/* Hidden Submit Button (Inside Form) */}
          <button type="submit" id="hiddenSubmit" hidden></button>

          <Modal
            open={confirmModalOpen}
            onClose={() => {
              setconfirmModalOpen(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] py-7 text-center rounded-lg bg-white">
              <>
                <p className="poppins font-bold text-2xl ">Are you sure?</p>
                <p className="text-sm poppins mt-2 mb-7 text-gray-500">
                  You want to change your password
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => {
                      setconfirmModalOpen(false);
                    }}
                    sx={{ marginLeft: ".5rem", paddingInline: "1.5rem" }}
                  >
                    {/* <ClearOutlinedIcon /> */}
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={() => {
                      document.getElementById("hiddenSubmit")?.click();

                      if (!isValid) {
                        setconfirmModalOpen(false);
                      }
                    }}
                    sx={{ marginRight: ".5rem", paddingInline: "1.5rem" }}
                  >
                    Change Password
                  </Button>
                </div>
              </>
            </Box>
          </Modal>
        </form>
      </div>
    </div>
  );
}
