import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, Button, Divider, dividerClasses, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import {
  Book,
  CircleDollarSign,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import {
  fetchAllProjects,
  getAllStudents,
  getAllUsers,
} from "@/redux/allListSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const AddPayment = () => {
  const router = useRouter();
  const session = useSession();
  const dispatch = useDispatch<any>();

  // selectors
  const { allActiveProjects, allActiveUsersList, allActiveHcaStudentsList } =
    useSelector((state: any) => state.allListReducer);

  const paymentPurposeOptions = [
    "Student Fee",
    "Rating Fee",
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
  const [addPaymentLoading, setAddPaymentLoading] = useState(false);
  const [addPaymentFileLoading, setAddPaymentFileLoading] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otherPaymentSource, setotherPaymentSource] = useState(false);
  const [otherPaymentPurpose, setotherPaymentPurpose] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("Incoming");
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedDeleteInstallmentIndex, setselectedDeleteInstallmentIndex] =
    useState<any>("");
  const [selectedDeleteInstallmentAmount, setselectedDeleteInstallmentAmount] =
    useState<any>(0);

  // Modal operation - no changes needed here
  const handleConfirmDeleteModalOpen = (index: number, amount: any) => {
    setselectedDeleteInstallmentIndex(index);
    setselectedDeleteInstallmentAmount(amount);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDeleteModalClose = () => {
    setConfirmDeleteModalOpen(false);
  };

  // Payment type options
  const paymentTypeOptions = ["Incoming", "Outgoing"];
  const paymentMethodOptions = ["Cash", "Online", "Bank"];
  const paymentStatusOptions = ["Pending", "Paid"];

  // default values
  const defaultValues = {
    paymentType: "Incoming",
    prePaymentTitle: "",
    issuedDate: "",
    // record added date from server
    // recordAddedDate: "",
    prePaymentDescription: "",
    paymentPurpose: "",
    // otherPaymentPurpose also pass in onsubmit
    otherPaymentPurpose: false,
    paymentSource: "",
    // otherPaymentSource also pass in onsubmit
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
    paymentStatus: "Pending",
    // payment files from update payment
    // paymentFiles: [],
    // updateby from update payment
    // updatedBy: [],
    // created by in onsubmit function from session
    // createdBy:{},
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
  };

  // Handle confirm modal
  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);

  // Handle payment file change
  const handlePaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPaymentFile(file);
  };

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

  // Add payment by file
  const handleAddPaymentByFile = async () => {
    try {
      setAddPaymentFileLoading(true);
      if (!paymentFile) {
        notify("File is required", 204);
        return;
      }
      if (paymentFile.type !== "application/json") {
        notify("Please upload a valid JSON file", 204);
        return;
      }

      const formData = new FormData();
      formData.append("file", paymentFile);
      const { data: resData } = await axios.post(
        "/api/uploadbyfile/addNewFilePayment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resData?.statusCode === 200) {
        notify(resData?.msg, resData?.statusCode);
        handleFileUploadModalClose();
        setTimeout(() => {
          router.push(`/${session?.data?.user?.role?.toLowerCase()}/payments`);
        }, 50);
      } else {
        notify(resData?.msg, resData?.statusCode);
      }
    } catch (error) {
      notify("Invalid data inside JSON file", 204);
      console.error("Error in handleAddPaymentByFile", error);
    } finally {
      setAddPaymentFileLoading(false);
    }
  };

  // On submit function
  const onSubmit = async (data: any) => {
    setAddPaymentLoading(true);
    try {
      // console.log("submit ", {
      //   ...data,
      //   otherPaymentPurpose,
      //   otherPaymentSource,
      //   createdBy: session?.data?.user,
      // });

      const { data: resData } = await axios.post(
        "/api/payments/addNewPayment",
        {
          ...data,
          otherPaymentPurpose,
          otherPaymentSource,
          createdBy: session?.data?.user,
        }
      );
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
      console.error("Error submitting payment:", error);
      notify("Failed to add payment", 500);
    } finally {
      setAddPaymentLoading(false);
    }
  };

  // clear paymentSource when otherPaymentSourceChanges
  useEffect(() => {
    setValue("paymentSource", "");
  }, [otherPaymentSource]);
  // clear paymentPurpose when otherpaymentPurposeChanges
  useEffect(() => {
    setValue("paymentPurpose", "");
  }, [otherPaymentPurpose]);

  // console.log("installments feid", installmentFields);

  // get initial data
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllStudents());
    dispatch(getAllUsers());
  }, []);
  return (
    <div className="flex gap-4 w-full h-full">
      {/* addpayment */}
      <div className="flex-[0.75] flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
        <div className="heading flex items-center gap-4">
          <div className="header w-full flex items-end justify-between">
            <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
              <CircleDollarSign />
              <span className="ml-2">Add Payment</span>
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
          <h1 className="col-span-2 font-bold">Pre payment information</h1>
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
                  selected={field.value}
                  onChange={(value: any) => {
                    field.onChange(value);
                    setSelectedPaymentType(value);
                    setselectedPaymentSource("");
                    setselectedPaymentPurpose("");
                    setotherPaymentPurpose(false);
                    setotherPaymentSource(false);
                    reset({
                      ...defaultValues, // reset everything
                      paymentType: value, // but use the new paymentType
                      paymentSource:
                        value?.toLowerCase() == "outgoing" ? "HCA" : "",
                    });
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
                  selected={field.value || ""}
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
                label="Amount (Rs.)"
                type="number"
                required
                error={errors.totalAmount}
                helperText={errors.totalAmount?.message}
              />
            )}
          />

          {/* Payment Status */}
          <Controller
            name="paymentStatus"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Dropdown
                label="Payment Status"
                options={paymentStatusOptions}
                selected={field.value}
                onChange={field.onChange}
                error={errors.paymentStatus}
                helperText={errors.paymentStatus?.message}
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
                  {...field}
                  rows={4}
                  className={`w-full border-2 border-gray-300 p-2 rounded-md outline-none ${
                    errors.prePaymentDescription ? "border-red-500" : ""
                  }`}
                />
                {errors.prePaymentDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.prePaymentDescription?.message as string}
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
                      disabled={
                        selectedPaymentType?.toLowerCase() === "outgoing" ||
                        otherPaymentSource
                      }
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
                      disabled={otherPaymentPurpose}
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
                          selected={field.value}
                          onChange={(value: any) => {
                            field.onChange(value);
                            const selectedProject: any =
                              allActiveProjects?.filter(
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
                          selected={field.value}
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
                            const selectedUser: any =
                              allActiveUsersList?.filter(
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

          <h1 className="col-span-2 font-bold">
            Payment Installments {`(${installmentFields?.length})`}
          </h1>

          <div className="installments-array-fields col-span-2">
            <div className="installment-container flex flex-col gap-3">
              {installmentFields.length === 0 ? (
                <p className="text-gray-500 mb-2">No Installments yet.</p>
              ) : (
                installmentFields.map((field: any, index: number) => (
                  <div
                    key={`${field?.id}`}
                    className="p-4 border rounded-md bg-gray-50 grid grid-cols-5 gap-4"
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
                            (errors.installments as any)?.[index]?.paymentMethod
                              ?.message
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
                            (errors.installments as any)?.[index]?.paymentTitle
                              ?.message
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
                      notify(`${selectedDeleteInstallmentIndex}`, 200);
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
                })
              }
              variant="outlined"
              sx={{ margin: ".7rem 0 0 0" }}
            >
              + Add Installment
            </Button>
          </div>

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
                {addPaymentLoading ? (
                  <LoadingButton
                    size="large"
                    loading={addPaymentLoading}
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
                    Add payment
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </form>
      </div>

      {/* payment record */}
      <div className="payment-record flex-[0.25] flex flex-col overflow-hidden bg-white px-5 py-7 rounded-md shadow-md">
        <h1 className="text-xl font-bold flex items-center text-gray-600">
          <FileSpreadsheet />
          <span className="ml-2 ">Payment Records</span>
        </h1>
        <Divider sx={{ margin: ".7rem 0 " }} />
        <div className="summary mb-6">
          <div className="flex justify-between items-center flex-col ">
            <span className="font-medium text-sm">Total Amount:</span>
            <span className="font-bold text-3xl">
              Rs. {watch("totalAmount") || 0}
            </span>
          </div>

          <div className="paid-amount flex justify-around mt-5">
            <div className="flex justify-between items-center flex-col mb-2">
              <span className="font-medium text-sm">Total Paid:</span>
              <span className="font-bold text-green-600">
                Rs.{" "}
                {watch("installments")?.reduce(
                  (sum: number, installment: any) =>
                    sum + (Number(installment.amount) || 0),
                  0
                )}
              </span>
            </div>

            <div className="flex items-center flex-col">
              <span className="font-medium text-sm">Remaining:</span>
              <span className="font-bold text-red-600">
                Rs.{" "}
                {(watch("totalAmount") || 0) -
                  (watch("installments")?.reduce(
                    (sum: number, installment: any) =>
                      sum + (Number(installment.amount) || 0),
                    0
                  ) || 0)}
              </span>
            </div>
          </div>
        </div>

        <h1 className="font-bold text-sm text-gray-600 mb-2">
          Installments ({watch("installments")?.length})
        </h1>

        <div className="installment-list  flex-1 h-full overflow-y-auto">
          {watch("installments")?.length > 0 ? (
            watch("installments").map((installment: any, index: number) => (
              <div
                key={index}
                className="mb-3 p-3 border rounded-md bg-gray-50"
              >
                <div className="date-paymentmethod flex justify-between">
                  <p className="text-xs text-gray-600">
                    {installment?.paidDate
                      ? dayjs(installment?.paidDate)
                          .tz(timeZone)
                          .format("DD MMM, YYYY")
                      : "Date"}
                  </p>

                  {/* paymentmethod */}
                  <p className="text-xs  bg-green-400 font-bold px-2 rounded-full py-0.5 text-white">
                    {installment?.paymentMethod || "Payment method"}
                  </p>
                </div>

                {/* title */}
                <p className="title text-sm mt-1">
                  {installment?.paymentTitle || "Title here"}
                </p>
                {/* amount */}
                <p className="amount mt-1 text-md font-bold text-green-600">
                  Rs. {installment?.amount || "Amount"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No installments added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
