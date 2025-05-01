import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, Button, Divider, Modal, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import PaidIcon from "@mui/icons-material/Paid";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { LoadingButton } from "@mui/lab";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import {
  AttachMoney,
  Payments,
  CalendarMonth,
  DoneAll,
  HourglassBottom,
  QueryBuilder,
} from "@mui/icons-material";
import {
  Book,
  CircleDollarSign,
  DollarSign,
  File,
  FileSpreadsheet,
  FileText,
  Receipt,
  TriangleAlert,
} from "lucide-react";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import {
  fetchAllProjects,
  getAllBranches,
  getAllStudents,
  getAllUsers,
} from "@/redux/allListSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const UpdatePayment = ({ paymentRecord }: any) => {
  const router = useRouter();
  const session = useSession();
  const dispatch = useDispatch<any>();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  //   console.log("updatePayment", paymentRecord);

  // selectors
  const {
    allActiveProjects,
    allActiveBranchesList,
    allActiveUsersList,
    allActiveHcaStudentsList,
  } = useSelector((state: any) => state.allListReducer);

  const paymentPurposeOptions = [
    "Student Fee",
    "Rating Fee",
    "Trainer Fee",
    "Salaries",
    "Arbiter Fee",
    "Chess Equipment Fee",
    "Transportation Fee",
    "Miscellaneous",
    "NCF Registration Fee",
    "Event Registration Fee",
    "Arbiter Fees",
    "Rating Fees",
    "Taxes",
    "Fooding",
    "Stationery Items",
    "Transportation",
    "Mobile Recharges",
    "Electricity",
    "Maintenance",
  ];
  const eWalletsInNepalOptions = [
    "eSewa",
    "IME Pay",
    "Khalti",
    "Prabhu Pay",
    "Fone Pay",
    "Moru",
    "CellPay",
    "ConnectIPS",
    "Hamro Pay",
  ];

  // State variables
  const [recipientIsHcaUser, setrecipientIsHcaUser] = useState(false);
  const [selectedPaymentSource, setselectedPaymentSource] = useState("");
  const [selectedPaymentPurpose, setselectedPaymentPurpose] = useState("");
  const [updatePaymentLoading, setUpdatePaymentLoading] = useState(false);
  const [updatePaymentFileLoading, setUpdatePaymentFileLoading] =
    useState(false);
  const [deletePaymentFileLoading, setdeletePaymentFileLoading] =
    useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otherPaymentSource, setotherPaymentSource] = useState(false);
  const [otherPaymentPurpose, setotherPaymentPurpose] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("Incoming");
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [
    confirmDeletePaymentFileModalOpen,
    setConfirmDeletePaymentFileModalOpen,
  ] = useState(false);

  const [selectedDeleteInstallmentIndex, setselectedDeleteInstallmentIndex] =
    useState<any>("");
  const [selectedDeletePaymentFileName, setselectedDeletePaymentFileName] =
    useState<any>(null);

  const [fileName, setfileName] = useState("");
  const [selectedDeleteInstallmentAmount, setselectedDeleteInstallmentAmount] =
    useState<any>(0);
  const [loaded, setLoaded] = useState(false);

  // Modal operation
  const handleConfirmDeleteModalOpen = (index: number, amount: any) => {
    setselectedDeleteInstallmentIndex(index);
    setselectedDeleteInstallmentAmount(amount);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDeleteModalClose = () => {
    setConfirmDeleteModalOpen(false);
  };

  // Modal operation
  const handleconfirmDeletePaymentFileModalOpen = (paymentFileName: any) => {
    setselectedDeletePaymentFileName(paymentFileName);
    setConfirmDeletePaymentFileModalOpen(true);
  };

  const handleconfirmDeletePaymentFileModalClose = () => {
    setselectedDeletePaymentFileName(null);
    setConfirmDeletePaymentFileModalOpen(false);
  };

  // Payment type options
  const paymentTypeOptions = ["Incoming", "Outgoing"];
  const paymentMethodOptions = ["Cash", "Online", "Bank"];
  const paymentStatusOptions = ["Pending", "Paid"];

  const defaultValues = {
    paymentType: "Incoming",
    prePaymentTitle: "",
    issuedDate: "",
    prePaymentDescription: "",
    paymentPurpose: "",
    otherPaymentPurpose: false,
    paymentSource: "",
    branchName: "",
    branchId: "",
    otherPaymentSource: false,
    paymentSourceInfo: {
      senderName: "",
      phone: "",
      email: "",
      bankName: "",
      bankAccountNumber: "",
      ewalletName: "",
      ewalletNumber: "",
    },
    projectName: "",
    projectId: "",
    studentName: "",
    studentId: "",
    recipient: {
      userName: "",
      userId: "",
      name: "",
      phone: "",
      email: "",
      bankName: "",
      bankAccountNumber: "",
      ewalletName: "",
      ewalletNumber: "",
    },
    totalAmount: 0,
    installments: [
      { amount: 0, paidDate: "", paymentMethod: "", paymentTitle: "" },
    ],
    paymentFiles: [],
    paymentStatus: "Pending",
    activeStatus: true,
  };
  // Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<any>({
    defaultValues,
  });

  // payment fields
  const paymentFiles = watch("paymentFiles");

  const {
    fields: installmentFields,
    append: appendInstallment,
    remove: removeInstallment,
  } = useFieldArray({
    control,
    name: "installments",
  });

  // Handle file upload modal
  const handleFileUploadModalOpen = () => setFileUploadModalOpen(true);
  const handleFileUploadModalClose = () => {
    setPaymentFile(null);
    setFileUploadModalOpen(false);
    setfileName("");
  };

  // Handle confirm modal
  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);

  // Handle payment file change
  const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentFile(file);
  };

  //handleDeletePaymentFile
  async function handleDeletePaymentFile() {
    try {
      if (selectedDeletePaymentFileName.trim() == "") {
        notify("Payment file name  is required", 204);
        return;
      }
      setdeletePaymentFileLoading(true);
      const { data: resData } = await axios.post(
        "/api/payments/deletePaymentFile",
        {
          paymentFileName: selectedDeletePaymentFileName,
        }
      );
      if (resData?.statusCode == 200) {
        notify(resData?.msg, resData?.statusCode);
        //update state
        const updatedFiles = paymentFiles?.filter(
          (file: any) =>
            file.activeStatus &&
            file.fileName?.toLowerCase() !==
              selectedDeletePaymentFileName.toLowerCase()
        );

        if (updatedFiles) {
          setValue("paymentFiles", updatedFiles);
        }
        handleconfirmDeletePaymentFileModalClose();
        return;
      }
      notify(resData?.msg, resData?.statusCode);
      return;
      // else

      console.log("res dta deletePaymentFile", resData);
    } catch (error: any) {
      console.log("error in handleDeletePaymentFile ", error);
    } finally {
      setdeletePaymentFileLoading(false);
    }
  }

  function handleRecipientIsHcaUser(e: any) {
    const checked = e.target.checked;
    setrecipientIsHcaUser(checked);

    reset((prevValues: any) => ({
      ...prevValues,
      recipient: {
        userName: "",
        userId: "",
        name: "",
        phone: "",
        email: "",
        bankName: "",
        bankAccountNumber: "",
        ewalletName: "",
        ewalletNumber: "",
      },
    }));
  }

  // Update payment by file
  const handleUpdatePaymentByFile = async () => {
    try {
      setUpdatePaymentFileLoading(true);
      if (fileName.trim() == "") {
        notify("File name  is required", 204);
        return;
      }
      if (!paymentFile) {
        notify("File is required", 204);
        return;
      }

      // check payment file name
      const { data: checkPaymentFileNameResData } = await axios.post(
        "/api/payments/checkPaymentFileName",
        {
          fileName,
        }
      );
      if (checkPaymentFileNameResData?.statusCode == 204) {
        notify(
          checkPaymentFileNameResData?.msg,
          checkPaymentFileNameResData.statusCode
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", paymentFile);
      const folderName = `paymentFile/${fileName}`;
      formData.append("folderName", folderName);
      // ["profileImage","studyMaterials","otherFiles"]
      let fileUrl = "";

      formData.append("cloudinaryFileType", "otherFiles");

      const { data: resData } = await axios.post(
        "/api/fileupload/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // cloudinary error
      if (resData.error) {
        notify("Error uploading file", 204);
        setUpdatePaymentFileLoading(false);
        return;
      }

      // cloudinary success
      else {
        fileUrl = resData.res.secure_url;
        const fileExtension = paymentFile?.name
          ?.split(".")
          ?.pop()
          ?.toLowerCase();
        const tempPaymentFile = {
          fileName,
          fileUrl,
          fileType: paymentFile?.type.startsWith("image/")
            ? "image"
            : paymentFile?.type === "application/pdf"
            ? "pdf"
            : fileExtension === "pgn"
            ? "pgn"
            : "others",
          // uploaded at from server
          uploadedByName: session?.data?.user?.name,
          uploadedById: session?.data?.user?._id,
          activeStatus: true,
        };
        const { data: addNewPaymentFileResData } = await axios.post(
          "/api/payments/addNewPaymentFile",
          {
            paymentRecordId: paymentRecord?._id,
            ...tempPaymentFile,
          }
        );

        if (addNewPaymentFileResData?.statusCode == 200) {
          notify(
            addNewPaymentFileResData?.msg,
            addNewPaymentFileResData?.statusCode
          );

          // update watch("paymentFileds") to update list in ui
          const latestFile =
            addNewPaymentFileResData?.updatedPayment?.paymentFiles?.at(-1);
          if (latestFile) {
            setValue("paymentFiles", [...paymentFiles, latestFile]);
          }
          // update redux state after adding new study material
          // dispatch(
          //   addNewStudyMaterial(addNewPaymentFileResData?.newStudyMaterial)
          // );
          handleFileUploadModalClose();
          setUpdatePaymentFileLoading(false);

          return;
        }
        setUpdatePaymentFileLoading(false);

        notify(
          addNewPaymentFileResData?.msg,
          addNewPaymentFileResData?.statusCode
        );
        return;
      }
    } catch (error) {
      notify("Invalid data inside JSON file", 204);
      console.error("Error in handleUpdatePaymentByFile", error);
    } finally {
      setUpdatePaymentFileLoading(false);
    }
  };

  // console.log("watch paymetfiles", paymentFiles);

  // On submit function
  const onSubmit = async (data: any) => {
    setUpdatePaymentLoading(true);
    try {
      console.log(
        "submit payment",
        JSON.stringify({
          ...data,
          otherPaymentPurpose,
          otherPaymentSource,
          updatedBy: session?.data?.user,
          paymentId: paymentRecord._id,
        })
      );

      const { data: resData } = await axios.put("/api/payments/updatePayment", {
        ...data,
        otherPaymentPurpose,
        otherPaymentSource,
        updatedBy: session?.data?.user,
        paymentId: paymentRecord._id,
      });
      if (resData.statusCode === 200) {
        notify(resData.msg, resData.statusCode);
        handleConfirmModalClose();
        setTimeout(() => {
          router.push(`/${session?.data?.user?.role?.toLowerCase()}/payments`);
        }, 50);
      } else {
        notify(resData.msg, resData.statusCode);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      notify("Failed to update payment", 500);
    } finally {
      setUpdatePaymentLoading(false);
    }
  };

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    if (!isSuperOrGlobalAdmin) {
      setValue("branchName", user?.branchName);
      setValue("branchId", user?.branchId);
    }
  }, [session?.data?.user]);

  // clear paymentSource when otherPaymentSourceChanges
  useEffect(() => {
    setValue("paymentSource", "");
  }, [otherPaymentSource]);

  // clear paymentPurpose when otherpaymentPurposeChanges
  useEffect(() => {
    setValue("paymentPurpose", "");
  }, [otherPaymentPurpose]);

  // get initial data
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllStudents());
    dispatch(getAllUsers());
    dispatch(getAllBranches());
  }, []);

  // Load payment record data
  useEffect(() => {
    if (paymentRecord) {
      reset({
        ...paymentRecord,
        issuedDate: paymentRecord.issuedDate
          ? dayjs(paymentRecord.issuedDate).tz(timeZone).format("YYYY-MM-DD")
          : "",
        installments: paymentRecord.installments
          ?.filter((installment: any) => installment?.activeStatus)
          ?.map((inst: any) => ({
            ...inst,
            paidDate: inst.paidDate
              ? dayjs(inst.paidDate).tz(timeZone).format("YYYY-MM-DD")
              : "",
          })),
      });

      setSelectedPaymentType(paymentRecord.paymentType);
      setselectedPaymentSource(paymentRecord.paymentSource);
      setselectedPaymentPurpose(paymentRecord.paymentPurpose);
      setrecipientIsHcaUser(!!paymentRecord.recipient?.userId);
      setotherPaymentSource(paymentRecord.otherPaymentSource);
      setotherPaymentPurpose(paymentRecord.otherPaymentPurpose);
      // const [otherPaymentSource, setotherPaymentSource] = useState(false);
      // const [otherPaymentPurpose, setotherPaymentPurpose] = useState(false);

      setLoaded(true);
    }
  }, [paymentRecord, reset]);

  if (!loaded)
    return (
      <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md"></div>
    );
  return (
    <div className="flex gap-4 w-full h-full">
      {/* addpayment */}
      <div className="flex-[0.75] flex w-full flex-col h-full overflow-hidden bg-white px-5 py-5 rounded-md shadow-md">
        <div className="heading flex items-center gap-4">
          <div className="header w-full flex items-end justify-between">
            <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
              <CircleDollarSign />
              <span className="ml-2">Update Payment</span>
            </h1>
            <div className="buttons flex gap-4">
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/payments`}
              >
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
        </div>

        <Divider sx={{ margin: "0.7rem 0" }} />

        <form
          className="addpaymentform form-fields h-fit overflow-y-auto grid grid-cols-2 gap-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleConfirmModalOpen();
            }
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="w-full col-span-2 flex items-start bg-yellow-100 p-2">
            <TriangleAlert className="text-yellow-600" />
            <span className="ml-1 font-medium text-gray-600 ">
              <span className="text-yellow-600">Important: </span> Uploading a
              file will just upload the file and not update any other fields.
            </span>
          </p>
          <h1 className="col-span-2 font-bold text-gray-500 flex items-center">
            <Receipt />
            <span className="ml-1">Pre payment information</span>
          </h1>
          {/* Payment Type */}
          <div className="first grid grid-cols-2 gap-4">
            <Controller
              name="paymentType"
              control={control}
              rules={{ required: "Payment type is required" }}
              render={({ field }) => (
                <Dropdown
                  label="Payment Type"
                  options={paymentTypeOptions}
                  selected={field.value || ""}
                  disabled
                  onChange={(value: any) => {
                    field.onChange(value);
                    setSelectedPaymentType(value);
                    setselectedPaymentSource("");
                    setselectedPaymentPurpose("");
                    setotherPaymentPurpose(false);
                    setotherPaymentSource(false);

                    const updatedValues = {
                      ...defaultValues, // reset everything
                      paymentType: value,
                      paymentSource:
                        value?.toLowerCase() === "outgoing" ? "HCA" : "",
                    };

                    if (!isSuperOrGlobalAdmin) {
                      // preserve current branch fields if not super/global admin
                      const currentValues = getValues();
                      updatedValues.branchName = currentValues.branchName;
                      updatedValues.branchId = currentValues.branchId;
                    }

                    reset(updatedValues);
                  }}
                  error={errors.paymentType}
                  helperText={errors.paymentType?.message}
                  required
                  width="full"
                />
              )}
            />
            <Controller
              name="issuedDate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Issued date is required",
                },
              }}
              render={({ field }) => (
                <Input
                  label="Issued Date"
                  type="date"
                  value={field.value || ""}
                  disabled
                  onChange={field.onChange}
                  error={errors.issuedDate}
                  helperText={errors.issuedDate?.message}
                />
              )}
            />
          </div>
          {/* Pre Payment Title */}
          <Controller
            name="prePaymentTitle"
            control={control}
            rules={{ required: "Pre payment title is required" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                label="Pre Payment Title"
                type="text"
                required
                error={errors.prePaymentTitle}
                helperText={errors.prePaymentTitle?.message}
              />
            )}
          />

          {/* Total Amount */}
          <Controller
            name="totalAmount"
            control={control}
            rules={{
              required: "Amount is required",
              min: { value: 1, message: "Amount must be positive" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                disabled
                label="Amount (Rs.)"
                type="number"
                required
                error={errors.totalAmount}
                helperText={errors.totalAmount?.message}
              />
            )}
          />

          {/* Payment Status */}
          {/* <Controller
            name="paymentStatus"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Dropdown
                label="Payment Status"
                options={paymentStatusOptions}
                selected={field.value || ""}
                onChange={field.onChange}
                error={errors.paymentStatus}
                helperText={errors.paymentStatus?.message}
                required
                disabled
                width="full"
              />
            )}
          /> */}

          {/* Branch */}
          <Controller
            name="branchName"
            control={control}
            rules={{ required: "Branch is required" }}
            render={({ field }) => (
              <Dropdown
                label="Branch"
                options={allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                )}
                selected={field.value || ""}
                onChange={(value: any) => {
                  field.onChange(value);
                  const selectedBranch: any = allActiveBranchesList?.find(
                    (branch: any) =>
                      branch?.branchName?.toLowerCase() == value?.toLowerCase()
                  );

                  setValue("branchId", selectedBranch?._id);
                }}
                error={errors.branchName}
                helperText={errors.branchName?.message}
                required
                disabled
                width="full"
              />
            )}
          />

          {/* Pre Payment Description */}
          <Controller
            name="prePaymentDescription"
            control={control}
            rules={{ required: "Pre Payment Description is required" }}
            render={({ field }) => (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pre Payment Description *
                </label>
                <textarea
                  {...{
                    ...field,
                    value: field.value || "", // safe default
                  }}
                  rows={4}
                  className={`w-full border-2 border-gray-300 p-2 rounded-md outline-none ${
                    errors.prePaymentDescription ? "border-red-500" : ""
                  }`}
                />
                {errors.prePaymentDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.prePaymentDescription.message as string}
                  </p>
                )}
              </div>
            )}
          />

          {/* Payment Source fo */}
          <Controller
            name="paymentSource"
            control={control}
            rules={{ required: "Source is required" }}
            render={({ field }) => {
              const handleOtherSourceChange = (e: any) => {
                const checked = e.target.checked;
                setotherPaymentSource(checked);
                setselectedPaymentSource("");
                setValue("projectName", "");
                setValue("projectId", "");
                setValue("studentName", "");
                setValue("studentId", "");
                setValue("recipient.userName", "");
                setValue("recipient.userId", "");
              };

              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="dropdown-checkbox flex flex-col">
                    <Dropdown
                      {...field}
                      label="Payment Source"
                      options={[
                        "HCA",
                        "Schools",
                        "Organizers",
                        "Workshops",
                        "Sales",
                        "Student fee",
                      ]}
                      selected={
                        selectedPaymentType?.toLowerCase() === "outgoing"
                          ? "HCA"
                          : field.value || ""
                      }
                      onChange={(value: any) => {
                        field.onChange(value);
                        // reset other fields
                        setselectedPaymentSource(value);
                        setValue("recipient.userName", "");
                        setValue("recipient.userId", "");
                        // reset school
                        if (value?.toLowerCase() !== "schools") {
                          setValue("projectName", "");
                          setValue("projectId", "");
                        }
                        // reset student
                        if (value?.toLowerCase() !== "schools") {
                          setValue("studentName", "");
                          setValue("studentId", "");
                        }
                      }}
                      disabled
                      required
                      width="full"
                      error={errors.paymentSource}
                      helperText={errors.paymentSource?.message}
                    />

                    {selectedPaymentType?.toLowerCase() == "incoming" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="othersourceid"
                          checked={otherPaymentSource}
                          disabled
                          onChange={handleOtherSourceChange}
                        />
                        <label
                          htmlFor="othersourceid"
                          className="text-sm mt-1 cursor-pointer"
                        >
                          Other payment source
                        </label>
                      </div>
                    )}
                  </div>

                  {otherPaymentSource && (
                    <Input
                      {...field}
                      label="Other payment source"
                      value={field.value || ""}
                      disabled
                      type="text"
                      required
                      error={errors.paymentSource}
                      helperText={errors.paymentSource?.message}
                    />
                  )}
                </div>
              );
            }}
          />
          {/* Payment Purpose */}
          <Controller
            name="paymentPurpose"
            control={control}
            rules={{ required: "Payment purpose is required" }}
            render={({ field }) => {
              const handleOtherPurposeChange = (e: any) => {
                const checked = e.target.checked;
                setotherPaymentPurpose(checked);
                setselectedPaymentPurpose("");

                // reset recipient.userName, userid
                setValue("recipient.userName", "");
                setValue("recipient.userId", "");
              };

              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="dropdown-checkbox flex flex-col">
                    <Dropdown
                      {...field}
                      label="Payment purpose"
                      options={paymentPurposeOptions}
                      selected={field.value || ""}
                      disabled
                      onChange={(value: any) => {
                        field.onChange(value);
                        // reset other fields
                        setselectedPaymentPurpose(value);
                        // reset user
                        if (value?.toLowerCase() !== "salaries") {
                          setValue("recipient.userName", "");
                          setValue("recipient.userId", "");
                        }
                      }}
                      required
                      width="full"
                      error={errors.paymentPurpose}
                      helperText={errors.paymentPurpose?.message}
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="otherpurposeid"
                        checked={otherPaymentPurpose}
                        disabled
                        onChange={handleOtherPurposeChange}
                      />
                      <label
                        htmlFor="otherpurposeid"
                        className="text-sm mt-1 cursor-pointer"
                      >
                        Other payment purpose
                      </label>
                    </div>
                  </div>

                  {otherPaymentPurpose && (
                    <Input
                      {...field}
                      label="Other payment purpose"
                      value={field.value || ""}
                      disabled
                      type="text"
                      required
                      error={errors.paymentPurpose}
                      helperText={errors.paymentPurpose?.message}
                    />
                  )}
                </div>
              );
            }}
          />

          {/* Conditional fields based on payment type */}
          {selectedPaymentType?.toLowerCase() === "incoming" && (
            <>
              {/* Sender Info */}
              <div className="col-span-2 border p-4 rounded-md bg-gray-50">
                <h3 className="font-bold mb-3">Payment Source Information</h3>
                <div className="grid grid-cols-4 items-start gap-4">
                  {/* display project drop down if selectedPaymentSource == "schools" */}
                  {selectedPaymentSource?.toLowerCase() == "schools" && (
                    // project name/ id
                    <Controller
                      name="projectName"
                      control={control}
                      rules={{ required: "School is required" }}
                      render={({ field }) => (
                        <Dropdown
                          label="School"
                          options={allActiveProjects?.map(
                            (project: any) => project.name
                          )}
                          selected={field.value || ""}
                          disabled
                          onChange={(value: any) => {
                            field.onChange(value);
                            const selectedProject: any =
                              allActiveProjects?.find(
                                (project: any) =>
                                  project?.name?.toLowerCase() ==
                                  value?.toLowerCase()
                              );
                            setValue("projectId", selectedProject?._id);
                          }}
                          error={errors.paymentType}
                          helperText={errors.paymentType?.message}
                          required
                          width="full"
                        />
                      )}
                    />
                  )}
                  {/* display studnets drop down if selectedPaymentSource == "student fee" */}
                  {selectedPaymentSource?.toLowerCase() == "student fee" && (
                    // project name/ id
                    <Controller
                      name="studentName"
                      control={control}
                      rules={{ required: "Student is required" }}
                      render={({ field }) => (
                        <Dropdown
                          label="Student name"
                          options={allActiveHcaStudentsList?.map(
                            (student: any) => student.name
                          )}
                          selected={field.value || ""}
                          disabled
                          onChange={(value: any) => {
                            field.onChange(value);
                            const selectedStudent: any =
                              allActiveHcaStudentsList?.find(
                                (student: any) =>
                                  student?.name?.toLowerCase() ==
                                  value?.toLowerCase()
                              );

                            setValue("studentId", selectedStudent?._id);
                          }}
                          error={errors.paymentType}
                          helperText={errors.paymentType?.message}
                          required
                          width="full"
                        />
                      )}
                    />
                  )}
                  <Controller
                    name="paymentSourceInfo.senderName"
                    control={control}
                    rules={{ required: "Sender name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Sender Name"
                        type="text"
                        required
                        value={field.value || ""}
                        error={!!(errors.paymentSourceInfo as any)?.senderName}
                        helperText={
                          (errors.paymentSourceInfo as any)?.senderName?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentSourceInfo.phone"
                    control={control}
                    rules={{
                      // required: "Phone number is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Phone"
                        value={field.value || ""}
                        type="number"
                        error={!!(errors.paymentSourceInfo as any)?.phone}
                        helperText={
                          (errors.paymentSourceInfo as any)?.phone?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentSourceInfo.email"
                    control={control}
                    rules={{
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Email"
                        value={field.value || ""}
                        type="email"
                        error={!!(errors.paymentSourceInfo as any)?.email}
                        helperText={
                          (errors.paymentSourceInfo as any)?.email?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentSourceInfo.bankName"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Bank Name"
                        value={field.value || ""}
                        type="text"
                        error={!!(errors.paymentSourceInfo as any)?.bankName}
                        helperText={
                          (errors.paymentSourceInfo as any)?.bankName?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentSourceInfo.bankAccountNumber"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Bank Account Number"
                        value={field.value || ""}
                        type="number"
                        error={
                          !!(errors.paymentSourceInfo as any)?.bankAccountNumber
                        }
                        helperText={
                          (errors.paymentSourceInfo as any)?.bankAccountNumber
                            ?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="paymentSourceInfo.ewalletName"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Ewallet name "
                        value={field.value || ""}
                        options={[
                          "None",
                          ...eWalletsInNepalOptions.map(
                            (wallet: any) => wallet
                          ),
                        ]}
                        selected={field.value || ""}
                        width="full"
                        error={!!(errors.paymentSourceInfo as any)?.ewalletName}
                        helperText={
                          (errors.paymentSourceInfo as any)?.ewalletName
                            ?.message
                        }
                      />
                    )}
                  />{" "}
                  <Controller
                    name="paymentSourceInfo.ewalletNumber"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Ewallet number"
                        value={field.value || ""}
                        type="number"
                        error={
                          !!(errors.paymentSourceInfo as any)?.ewalletNumber
                        }
                        helperText={
                          (errors.paymentSourceInfo as any)?.ewalletNumber
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Recipient innfo */}
          {selectedPaymentType?.toLowerCase() === "outgoing" && (
            <>
              {/* Recipient Info for Outgoing */}
              <div className="col-span-2 border p-4 rounded-md bg-gray-50">
                <div className="title flex items-center mb-2">
                  <h3 className="font-bold">Recipient Information</h3>

                  <div className="checkbox flex items-center ml-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="othersourceid"
                        checked={recipientIsHcaUser}
                        disabled
                        onChange={handleRecipientIsHcaUser}
                      />
                      <label
                        htmlFor="othersourceid"
                        className="text-sm cursor-pointer"
                      >
                        Recipient is HCA User
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {recipientIsHcaUser && (
                    // project name/ id
                    <Controller
                      name="recipient.userName"
                      control={control}
                      rules={{ required: "User is required" }}
                      render={({ field }) => (
                        <Dropdown
                          label="Affiliated User"
                          options={allActiveUsersList?.map(
                            (user: any) => user.name
                          )}
                          selected={field.value || ""}
                          onChange={(value: any) => {
                            field.onChange(value);
                            const selectedUser: any = allActiveUsersList?.find(
                              (user: any) =>
                                user?.name?.toLowerCase() ==
                                value?.toLowerCase()
                            );
                            setValue("recipient.userId", selectedUser?._id);
                          }}
                          error={!!(errors.recipient as any)?.userName}
                          helperText={
                            (errors.recipient as any)?.userName?.message
                          }
                          required
                          width="full"
                        />
                      )}
                    />
                  )}
                  {/* only show recipient name phone email if not hca user */}
                  {!recipientIsHcaUser && (
                    <>
                      <Controller
                        name="recipient.name"
                        control={control}
                        rules={{ required: "Recipient name is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Recipient Name"
                            value={field.value || ""}
                            type="text"
                            required
                            error={!!(errors.recipient as any)?.name}
                            helperText={
                              (errors.recipient as any)?.name?.message
                            }
                          />
                        )}
                      />
                      <Controller
                        name="recipient.phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Phone"
                            value={field.value || ""}
                            type="tel"
                            error={!!(errors.recipient as any)?.phone}
                            helperText={
                              (errors.recipient as any)?.phone?.message
                            }
                          />
                        )}
                      />
                      <Controller
                        name="recipient.email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Email"
                            value={field.value || ""}
                            type="email"
                            error={!!(errors.recipient as any)?.email}
                            helperText={
                              (errors.recipient as any)?.email?.message
                            }
                          />
                        )}
                      />
                    </>
                  )}
                  <Controller
                    name="recipient.bankName"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Bank Name"
                        value={field.value || ""}
                        type="text"
                        error={!!(errors.recipient as any)?.bankName}
                        helperText={
                          (errors.recipient as any)?.bankName?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="recipient.bankAccountNumber"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Bank Account Number"
                        value={field.value || ""}
                        type="number"
                        error={!!(errors.recipient as any)?.bankAccountNumber}
                        helperText={
                          (errors.recipient as any)?.bankAccountNumber?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name="recipient.ewalletName"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Ewallet name "
                        value={field.value || ""}
                        options={[
                          "None",
                          ...eWalletsInNepalOptions.map(
                            (wallet: any) => wallet
                          ),
                        ]}
                        selected={field.value || ""}
                        width="full"
                        error={!!(errors.recipient as any)?.ewalletName}
                        helperText={
                          (errors.recipient as any)?.ewalletName?.message
                        }
                      />
                    )}
                  />{" "}
                  <Controller
                    name="recipient.ewalletNumber"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Ewallet number"
                        value={field.value || ""}
                        type="number"
                        error={!!(errors.recipient as any)?.ewalletNumber}
                        helperText={
                          (errors.recipient as any)?.ewalletNumber?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* installment section start here */}
          <div className="col-span-2">
            <Divider sx={{ margin: ".5rem 0" }} />
          </div>

          <h1 className="col-span-2 font-bold text-gray-500 flex items-center">
            <CurrencyExchangeIcon sx={{ fontSize: "1.2rem" }} />
            <span className="ml-1">
              Payment Installments {`(${installmentFields?.length})`}
            </span>
          </h1>

          <div className="installments-array-fields col-span-2">
            <div className="installment-container flex flex-col gap-3">
              {installmentFields.filter((field: any) => field?.activeStatus)
                .length === 0 ? (
                <p className="text-gray-500 mb-2">No Installments yet.</p>
              ) : (
                installmentFields
                  .filter((field: any) => field?.activeStatus)
                  .map((field: any, index: number) => (
                    <div
                      key={`${field?.id}`}
                      className="p-4 border rounded-md bg-gray-50 grid grid-cols-[repeat(4,1fr),50px] gap-4"
                    >
                      {/* Amount */}
                      <Controller
                        name={`installments.${index}.amount`}
                        control={control}
                        rules={{
                          required: "Amount is required",
                          min: {
                            value: 1,
                            message: "Amount must be greater than 0",
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Amount"
                            type="number"
                            error={
                              !!(errors.installments as any)?.[index]?.amount
                            }
                            helperText={
                              (errors.installments as any)?.[index]?.amount
                                ?.message
                            }
                            required
                            width="full"
                          />
                        )}
                      />

                      {/* Paid Date */}
                      <Controller
                        name={`installments.${index}.paidDate`}
                        control={control}
                        rules={{
                          required: "Paid Date is required",
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Paid Date"
                            type="date"
                            error={
                              !!(errors.installments as any)?.[index]?.paidDate
                            }
                            helperText={
                              (errors.installments as any)?.[index]?.paidDate
                                ?.message
                            }
                            required
                            width="full"
                          />
                        )}
                      />

                      {/* Payment Method Dropdown */}
                      <Controller
                        name={`installments.${index}.paymentMethod`}
                        control={control}
                        rules={{ required: "Payment method is required" }}
                        render={({ field }) => (
                          <Dropdown
                            label="Payment Method"
                            options={["Cash", "Online", "Bank"]}
                            selected={field.value || ""}
                            onChange={field.onChange}
                            error={
                              !!(errors.installments as any)?.[index]
                                ?.paymentMethod
                            }
                            helperText={
                              (errors.installments as any)?.[index]
                                ?.paymentMethod?.message
                            }
                            required
                            width="full"
                          />
                        )}
                      />

                      {/* Payment Title */}
                      <Controller
                        name={`installments.${index}.paymentTitle`}
                        control={control}
                        rules={{ required: "Payment title is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Payment Title"
                            type="text"
                            error={
                              !!(errors.installments as any)?.[index]
                                ?.paymentTitle
                            }
                            helperText={
                              (errors.installments as any)?.[index]
                                ?.paymentTitle?.message
                            }
                            required
                            width="full"
                          />
                        )}
                      />

                      {/* Remove Button */}
                      <div
                        title="Delete"
                        className="remove-button flex items-center"
                      >
                        <Button
                          type="button"
                          variant="text"
                          color="error"
                          onClick={() =>
                            handleConfirmDeleteModalOpen(index, field?.amount)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Confirm delete modal */}
            <Modal
              open={confirmDeleteModalOpen}
              onClose={handleConfirmDeleteModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
              BackdropProps={{
                style: {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
                <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
                <p>
                  Rs.{" "}
                  {getValues(
                    `installments.${selectedDeleteInstallmentIndex}.amount`
                  )}
                </p>

                <p className="mb-6 text-gray-600">
                  You want to delete this installment.
                </p>
                <div className="buttons flex gap-4">
                  <Button
                    variant="outlined"
                    onClick={handleConfirmDeleteModalClose}
                    className="text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      removeInstallment(Number(selectedDeleteInstallmentIndex));
                      notify(`Installment deleted`, 200);
                      handleConfirmDeleteModalClose();
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </Box>
            </Modal>

            {/* Add Installment Button */}
            <Button
              type="button"
              onClick={() =>
                appendInstallment({
                  amount: 0,
                  paidDate: "",
                  paymentMethod: "",
                  paymentTitle: "",
                  activeStatus: true,
                })
              }
              variant="outlined"
              sx={{ margin: ".7rem 0 0 0" }}
            >
              + Add Installment
            </Button>
          </div>

          <div className="col-span-2">
            <Divider sx={{ margin: ".5rem 0" }} />
          </div>

          {/* payment files */}
          <div className="paymentfiles-header col-span-2 flex gap-4 items-center">
            <h1 className=" font-bold text-gray-500 flex items-center">
              <File />
              <span className="ml-1">
                Payment Files{" "}
                {`(${
                  paymentFiles?.filter((file: any) => file.activeStatus)?.length
                })`}
              </span>
            </h1>

            <Button
              variant="outlined"
              size="small"
              onClick={handleFileUploadModalOpen}
            >
              <AddIcon />
              <span className="ml-1">Add payment files</span>
            </Button>

            {/* add payment file modal */}
            <Modal
              open={fileUploadModalOpen}
              onClose={handleFileUploadModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
              BackdropProps={{
                style: { backgroundColor: "rgba(0,0,0,0.4)" },
              }}
            >
              <div className="w-96 h-max p-6 rounded-lg shadow-md bg-white">
                {/* title close */}
                <div className="title-close flex justify-between">
                  {/* TITLE */}
                  <h1 className="font-bold flex items-center">
                    <CloudUploadIcon />
                    <span className="ml-2">Upload payment file</span>
                  </h1>
                  {/* close button */}
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={handleFileUploadModalClose}
                  >
                    <CloseIcon />
                  </Button>
                </div>
                {/* divider */}
                <Divider sx={{ margin: ".4rem 0" }} />
                {/* inputfield */}
                <TextField
                  size="small"
                  label="File name"
                  className="w-full "
                  sx={{ marginTop: "0.9rem" }}
                  value={fileName}
                  onChange={({ target }) => setfileName(target.value)}
                />

                {/* <label htmlFor="studymaterialupload">upload here</label> */}
                <input
                  // accept="application/pdf,image/*" // allow pdf and image
                  onChange={handlePaymentFileChange}
                  type="file"
                  id="studymaterialupload"
                  name="contractInput"
                  className="mt-4"
                />

                {/* upload button */}
                {updatePaymentFileLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updatePaymentFileLoading}
                    loadingPosition="start"
                    variant="contained"
                    className="w-full"
                    sx={{ marginTop: "1.5rem" }}
                  >
                    <span>Uploading</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    className="w-full"
                    onClick={handleUpdatePaymentByFile}
                    sx={{ marginTop: "1.5rem" }}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </Modal>
          </div>

          {/* payment files container */}
          {paymentFiles?.filter((file: any) => file.activeStatus)?.length ===
          0 ? (
            <p className="text-gray-500">
              No documents attached to this payment.
            </p>
          ) : (
            <div className=" w-full col-span-2">
              <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(6,1fr)] gap-1 w-full bg-gray-200">
                <span className="py-3 text-center text-sm font-bold text-gray-600">
                  SN
                </span>
                <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
                  File Name
                </span>
                <span className="py-3 text-left text-sm font-bold text-gray-600">
                  File Type
                </span>
                <span className="py-3 text-left text-sm  font-bold text-gray-600">
                  Uploaded By
                </span>

                <span className="py-3 text-left text-sm font-bold text-gray-600">
                  Uploaded At
                </span>
                <span className="py-3 text-center text-sm font-bold text-gray-600">
                  Action
                </span>
              </div>
              {paymentFiles
                ?.filter((file: any) => file.activeStatus)
                ?.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-[70px,repeat(6,1fr)] gap-1 py-2 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-sm text-center font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <Link
                      title="View"
                      target="_blank"
                      href={`${file?.fileUrl}`}
                      className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                    >
                      {file?.fileType?.toLowerCase() == "image" ? (
                        <ImageOutlinedIcon
                          className=" text-gray-500"
                          fontSize="small"
                        />
                      ) : file?.fileType?.toLowerCase() === "pdf" ? (
                        <PictureAsPdfOutlinedIcon
                          className=" text-gray-500"
                          fontSize="small"
                        />
                      ) : (
                        <InsertDriveFileOutlinedIcon
                          className=" text-gray-500"
                          fontSize="small"
                        />
                      )}
                      <span className="ml-2">{file?.fileName}</span>
                    </Link>
                    <span className="text-sm text-left font-medium text-gray-600">
                      {file.fileType}
                    </span>
                    <span className="text-sm text-left font-medium text-gray-600">
                      {file.uploadedByName || "N/A"}
                    </span>
                    <p className="text-sm text-gray-500 ">
                      {dayjs(file.uploadedAt)
                        .tz(timeZone)
                        .format("DD MMM, YYYY hh:mm A")}
                    </p>
                    <div className="text-center" title="Delete">
                      <Button
                        className="w-max"
                        color="error"
                        onClick={() =>
                          handleconfirmDeletePaymentFileModalOpen(
                            file?.fileName
                          )
                        }
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* confirm delete payment file delete modal */}
          <Modal
            open={confirmDeletePaymentFileModalOpen}
            onClose={handleconfirmDeletePaymentFileModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-0 text-gray-600">
                You want to detete this payment file.
              </p>{" "}
              <p className="text-lg font-bold">
                {" "}
                {selectedDeletePaymentFileName}
              </p>
              <div className="buttons mt-4 flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleconfirmDeletePaymentFileModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {deletePaymentFileLoading ? (
                  <LoadingButton
                    size="large"
                    loading={deletePaymentFileLoading}
                    loadingPosition="start"
                    variant="contained"
                  >
                    <span>Deleting </span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      handleDeletePaymentFile();
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </Box>
          </Modal>

          {/* Submit button */}
          <div className="submitbutton mt-3 col-span-2">
            <Button
              onClick={handleConfirmModalOpen}
              variant="contained"
              color="info"
              size="large"
              className="w-max"
            >
              Submit
            </Button>
          </div>
          {/* Hidden Submit Button */}
          <button type="submit" id="hiddenSubmit" hidden></button>
          {/* Confirm modal */}
          <Modal
            open={confirmModalOpen}
            onClose={handleConfirmModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-6 text-gray-600">You want to add new payment.</p>
              <div className="buttons flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleConfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {updatePaymentLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updatePaymentLoading}
                    loadingPosition="start"
                    variant="contained"
                  >
                    <span>Adding payment</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      document.getElementById("hiddenSubmit")?.click();
                      if (!isValid) handleConfirmModalClose();
                    }}
                  >
                    Update payment
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </form>
      </div>

      {/* payment record */}
      <div className="payment-record flex-[0.25] bg-white rounded-xl shadow-lg py-3 px-4 flex flex-col gap-4 ">
        {/* Header */}
        <div className="flex items-center justify-center  text-gray-700 text-lg font-semibold gap-2">
          <PaidIcon className="text-gray-600" />
          Payment Records
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Payment Status */}
          <div className="col-span-2 flex justify-center">
            <span
              className={`text-sm font-semibold flex items-center gap-1 px-3 py-1 rounded-full shadow-sm
          ${
            watch("paymentStatus") === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : watch("paymentStatus") === "Partial"
              ? "bg-blue-100 text-blue-800"
              : watch("paymentStatus") === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
            >
              {watch("paymentStatus")?.toLowerCase() === "pending" && (
                <QueryBuilder fontSize="small" />
              )}
              {watch("paymentStatus")?.toLowerCase() === "partial" && (
                <HourglassBottom fontSize="small" />
              )}
              {watch("paymentStatus")?.toLowerCase() === "paid" && (
                <DoneAll fontSize="small" />
              )}
              {watch("paymentStatus")}
            </span>
          </div>

          {/* Total */}
          <div className="flex flex-col col-span-2 items-center bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Amount</p>
            <h2 className="text-xl font-bold text-gray-500">
              Rs. {watch("totalAmount") || 0}
            </h2>
          </div>

          {/* Paid & Remaining */}
          <div className="flex flex-col items-center bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-500">Total Paid</p>
            <p className="text-lg font-semibold text-green-600">
              Rs.{" "}
              {watch("installments")?.reduce(
                (sum: number, i: any) => sum + (Number(i.amount) || 0),
                0
              )}
            </p>
          </div>

          <div className="flex flex-col items-center bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-500">Remaining</p>
            <p className="text-lg font-semibold text-red-500">
              Rs.{" "}
              {(watch("totalAmount") || 0) -
                (watch("installments")?.reduce(
                  (sum: number, i: any) => sum + (Number(i.amount) || 0),
                  0
                ) || 0)}
            </p>
          </div>
        </div>

        {/* Installment List */}
        <div className="flex-1 h-full overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            <CurrencyExchangeIcon sx={{ fontSize: "1.2rem" }} />
            <span className="ml-1">
              Installments ({watch("installments")?.length || 0})
            </span>
          </h3>

          <div className=" flex flex-col gap-2   pb-9  flex-1 h-full overflow-y-auto pr-1">
            {watch("installments")?.length > 0 ? (
              watch("installments")
                .filter((installment: any) => installment.activeStatus)
                .map((installment: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CalendarMonth
                          fontSize="small"
                          className="text-gray-400"
                        />
                        {installment?.paidDate
                          ? dayjs(installment.paidDate)
                              .tz(timeZone)
                              .format("DD MMM, YYYY")
                          : "Date"}
                      </p>
                      <span className="text-xs bg-green-400  text-white font-bold px-2 py-0.5 rounded-full">
                        {installment?.paymentMethod || "Payment Method"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {installment?.paymentTitle || "Payment Title"}
                    </p>

                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-green-700">
                        Rs. {installment?.amount || "Amount"}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-400 text-center">
                No installments added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePayment;
