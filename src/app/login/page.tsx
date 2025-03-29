"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@mui/material";
import InputWithIcon from "@/components/InputWithIcon";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { getSession, signIn } from "next-auth/react";
import { notify } from "@/index";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const { data: resData } = await axios.post("/api/users/login", data);

    notify(resData?.msg, resData?.statusCode);
    if (resData.statusCode == 200) {
      const signInResData = await signIn("credentials", {
        redirect: false,
        email: data?.email,
        password: data?.password,
      });
    }
    const session = await getSession();
    // console.log(session?.user);
    setLoading(false);

    setTimeout(() => {
      let redirectRoute = "/";
      switch (session?.user?.role) {
        case "Superadmin":
          redirectRoute = "/superadmin/dashboard";
          break;
        case "Admin":
          redirectRoute = "/admin/dashboard";
          break;
        case "Trainer":
          redirectRoute = "/trainer/dashboard";
          break;
        case "Student":
          redirectRoute = "/student/dashboard";
          break;
        default:
          break;
      }
      console.log(redirectRoute);

      router.push(redirectRoute);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-white w-screen">
      <div className="form-container w-full  lg:w-[35%] flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-[70%]">
          <div className="mb-7">
            <img
              className="h-[100px] md:h-[150px] mx-auto mb-3"
              src="https://himalayanchess.com/wp-content/uploads/2024/10/hca-logo.webp"
              alt="HCA Logo"
            />
            <h2 className="text-md font-light text-center">Welcome to</h2>
            <h2 className="text-xl font-bold text-gray-700 text-center">
              Himalayan Chess Academy
            </h2>
          </div>

          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => (
              <InputWithIcon
                {...field}
                Icon={PersonIcon}
                placeholder="Email"
                error={errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password Input */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <InputWithIcon
                {...field}
                Icon={LockIcon}
                placeholder="Password"
                type="password"
                error={errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          {/* forgot password */}
          <div className="forgot-password w-full mb-4 flex justify-end">
            <Link href={`/forgotpassword`} className="text-sm">
              <span className="underline text-blue-600">Forgot password?</span>
            </Link>
          </div>

          {loading ? (
            <LoadingButton
              size="large"
              loading={loading}
              loadingPosition="start"
              variant="contained"
              className="mt-7 w-full"
            >
              <span>Logging in</span>
            </LoadingButton>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="info"
              size="medium"
              className="w-full"
            >
              <span className="">Login</span>
            </Button>
          )}
        </form>
      </div>

      {/* Image Section (Hidden on Small Screens) */}
      <div className="image hidden md:block md:w-[65%]">
        <img
          className="h-[50vh] md:h-full object-cover"
          src="https://image.lexica.art/full_jpg/81fd517e-baa0-47f4-ba66-8a25fc56813e"
          alt=""
        />
      </div>
    </div>
  );
};

export default page;
