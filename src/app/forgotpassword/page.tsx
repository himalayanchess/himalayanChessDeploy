"use client";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { Button } from "@mui/material";
import { notify } from "@/helpers/notify";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [nextOneLoading, setnextOneLoading] = useState(false);
  const [nextTwoLoading, setnextTwoLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes countdown
  const [otpExpired, setOtpExpired] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    clearErrors,
  } = useForm<any>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    let countdown: any;

    // Start countdown when OTP is sent
    if (step === 2 && !otpExpired) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setOtpExpired(true); // OTP has expired
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown); // Clear the interval on cleanup
  }, [step, otpExpired]);

  const handleNextStep = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (step === 1) {
      if (!emailPattern.test(email)) {
        notify("Invalid email", 204);
        return;
      }
      setnextOneLoading(true);
      const { data: resData } = await axios.post(
        "/api/users/findUserAndSendOtp",
        { email }
      );
      if (resData?.statusCode === 200) {
        setnextOneLoading(false);
        setStep(2);
        setTimer(120); // Reset timer when OTP is sent
        setOtpExpired(false); // Reset OTP expired flag
        return;
      }
      setnextOneLoading(false);
      notify(resData?.msg, resData?.statusCode);
    } else if (step === 2) {
      setnextTwoLoading(true);
      const { data: resData } = await axios.post("/api/users/verifyotp", {
        email,
        otp: otp.join(""),
      });
      if (resData?.statusCode === 200) {
        setnextTwoLoading(false);
        setStep(3);
        return;
      }
      setnextTwoLoading(false);
      notify(resData?.msg, resData?.statusCode);
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setOtp(Array(6).fill("")); // Reset OTP fields
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleOtpChange = (e: any, index: any) => {
    const value = e.target.value;
    if (!/^\d$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: any, index: any) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const { data: resData } = await axios.post(
        "/api/users/findUserAndSendOtp",
        { email }
      );
      if (resData?.statusCode == 200) {
        notify("New OTP sent to email", 200);
        setTimer(120);
        setOtpExpired(false);
        return;
      }
      notify(resData?.msg, resData?.statusCode);
      return;
    } catch (error) {
      console.log("Error in handleResendOtp function");
    }
  };

  const onSubmitPassword = async (data: any) => {
    // check if password match
    if (data.newPassword !== data.confirmPassword) {
      notify("Password do not match", 204);
      return;
    }

    try {
      const { data: resData } = await axios.post(
        "/api/users/forgotpasswordreset",
        {
          email,
          newPassword: data.newPassword,
        }
      );
      if (resData?.statusCode === 200) {
        notify(resData?.msg, resData?.statusCode);
        setStep(4);
        return;
      } else {
        notify(resData?.msg, resData?.statusCode);
      }
    } catch (error) {
      console.error(error);
      notify("Failed to reset password", 500);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <Link
          href={`/login`}
          className="backtologin w-max flex items-center justify-center mb-4 underline text-blue-500"
        >
          <ArrowBackIcon sx={{ fontSize: "1.2rem" }} />
          <span className="ml-2">Back to login</span>
        </Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>

        {step === 1 && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Enter your email address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter your email"
            />
            {nextOneLoading ? (
              <LoadingButton
                size="large"
                loading={nextOneLoading}
                loadingPosition="start"
                variant="contained"
                className="mt-7 w-full"
              >
                <span>Processing</span>
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={!email}
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Get OTP
              </Button>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter the 6-digit OTP sent to your email:
            </label>
            <div className="flex space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="number"
                  value={digit}
                  autoComplete="off"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md"
                  id={`otp-input-${index}`}
                />
              ))}
            </div>
            {otpExpired ? (
              <p className="text-red-600 text-sm mb-4">
                OTP has expired. Please request a new one.
              </p>
            ) : (
              <p className="text-sm mb-4">
                OTP expires in {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? `0${timer % 60}` : timer % 60} minutes
              </p>
            )}
            <p
              onClick={handleResendOtp}
              className="text-blue-500 w-max text-sm mb-4 block cursor-pointer hover:underline"
            >
              Resend OTP
            </p>
            <div className="buttons flex flex-col gap-3 mt-6">
              {nextTwoLoading ? (
                <LoadingButton
                  size="large"
                  loading={nextTwoLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7 w-full"
                >
                  <span>Processing</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={otp.join("").length !== 6 || otpExpired}
                  className="w-full bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit
                </Button>
              )}
              <Button
                variant="contained"
                color="warning"
                onClick={handleBackStep}
                className="w-full bg-gray-300 text-gray-800 p-2 rounded-md mt-4"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id=""
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    {...register("newPassword", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message:
                          "Password should be at least 8 characters long",
                      },
                    })}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: "1.3rem" }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: "1.3rem" }} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-600 text-xs mb-4">
                    {errors.newPassword.message as string}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: "1.3rem" }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: "1.3rem" }} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mb-4">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-center text-xl font-semibold text-green-600">
              Password Reset Successful!
            </h3>
            <p className="text-center text-sm mt-4">
              Your password has been reset successfully. You can now login with
              your new password.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block w-full text-center text-blue-500"
            >
              <Button variant="contained">Go to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
