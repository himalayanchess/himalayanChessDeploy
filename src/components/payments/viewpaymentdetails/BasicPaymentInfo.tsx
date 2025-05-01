import React from "react";
import {
  ReceiptText,
  TimerReset,
  Contact,
  MapPinHouse,
  User,
  CircleUser,
  Phone,
  Mail,
  Landmark,
  CreditCard,
  Smartphone,
  NotebookTabs,
  UserCircle,
  Crown,
  Timer,
} from "lucide-react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import {
  ArrowDownward,
  ArrowUpward,
  HourglassEmpty,
  AccessTime,
  CheckCircle,
  AttachMoney,
} from "@mui/icons-material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSession } from "next-auth/react";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const BasicPaymentInfo = ({ paymentRecord }: any) => {
  const session = useSession();
  const formatDate = (date: string) => {
    return dayjs(date).tz(timeZone).format("MMMM D, YYYY");
  };

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  return (
    <div className="grid grid-cols-2 auto-rows-max w-full gap-3">
      {/* Basic Payment Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Payment Information</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Payment Title</p>
            <div className="detail flex items-center">
              <ReceiptText className="text-gray-500" />
              <p className="font-bold text-lg ml-1">
                {paymentRecord?.prePaymentTitle || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Issued Date</p>
            <p className="font-medium text-lg flex items-center">
              <EventOutlinedIcon className="text-gray-500" />
              <span className="ml-1">
                {formatDate(paymentRecord?.issuedDate)}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment Type</p>
            <p className="font-medium text-lg flex items-center">
              {paymentRecord?.paymentType ? (
                <>
                  {paymentRecord.paymentType.toLowerCase() === "incoming" ? (
                    <ArrowCircleDownIcon className="text-green-500" />
                  ) : (
                    <ArrowCircleUpIcon className="text-red-500" />
                  )}
                  <span
                    className={`ml-1 px-3 rounded-full ${
                      paymentRecord?.paymentType?.toLowerCase() === "incoming"
                        ? "text-green-600 bg-green-100"
                        : paymentRecord?.paymentType?.toLowerCase() ===
                          "outgoing"
                        ? "text-red-600 bg-red-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {paymentRecord?.paymentType}
                  </span>{" "}
                </>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-2 ">
          <div className="col-span-2 mb-2 grid grid-cols-2 ">
            <div className="amount ">
              <p className="text-sm text-gray-500">Total Amount</p>
              <div className="flex items-center">
                {/* <CreditCardOutlinedIcon className="text-gray-500" /> */}
                <p className=" ml-1 text-2xl font-bold text-gray-500">
                  Rs. {paymentRecord?.totalAmount || "N/A"}
                </p>
              </div>
            </div>

            {/* status */}
            <div className=" flex justify-end items-center">
              <span
                className={`text-lg font-semibold flex items-center gap-1 px-3 py-1 rounded-full shadow-sm
          ${
            paymentRecord?.paymentStatus?.toLowerCase() === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : paymentRecord?.paymentStatus?.toLowerCase() === "partial"
              ? "bg-blue-100 text-blue-800"
              : paymentRecord?.paymentStatus?.toLowerCase() === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
              >
                {paymentRecord?.paymentStatus?.toLowerCase() === "pending" && (
                  <AccessTime fontSize="small" />
                )}
                {paymentRecord?.paymentStatus?.toLowerCase() === "partial" && (
                  <HourglassEmpty fontSize="small" />
                )}
                {paymentRecord?.paymentStatus?.toLowerCase() === "paid" && (
                  <CheckCircle fontSize="small" />
                )}
                {paymentRecord?.paymentStatus}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="py-2 rounded-md">
              <p className="text-sm text-gray-500">Total Paid</p>
              <div className="flex items-center">
                {/* <TimerReset className="text-gray-500" /> */}
                <p className="font- text-lg text-green-600 font-bold">
                  Rs. {paymentRecord?.totalPaid || "N/A"}
                </p>
              </div>
            </div>
            <div className="  py-2 rounded-md">
              <p className="text-sm text-gray-500 ">Remaining</p>
              <div className="flex items-center">
                {/* <TimerReset className="text-gray-500" /> */}
                <p className="font- text-lg ml-1 text-red-600 font-bold">
                  Rs. {paymentRecord?.remainingAmount || 0  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* other */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          <InfoOutlinedIcon />
          <span className="ml-0.5">Payment Information</span>
        </p> */}
        <div className="grid grid-cols-2 gap-2">
          <div className="">
            <p className="text-xs text-gray-500">Payment Source</p>
            <div className="detail flex flex-col items-start">
              {/* <ReceiptText className="text-gray-500" /> */}
              <p className="font-medium text-md ">
                {paymentRecord?.paymentSource
                  ? paymentRecord?.paymentSource
                  : "N/A"}
              </p>
              {paymentRecord?.otherPaymentSource && (
                <p className="text-xs mt-1 bg-gray-300 px-3 py-0.5 rounded-full font-bold text-gray-600">
                  Custom
                </p>
              )}
            </div>
          </div>

          <div className="">
            <p className="text-xs text-gray-500">Payment Purpose</p>
            <div className="detail flex flex-col items-start">
              {/* <ReceiptText className="text-gray-500" /> */}
              <p className="font-medium text-md ">
                {paymentRecord?.paymentPurpose
                  ? paymentRecord?.paymentPurpose
                  : "N/A"}
              </p>
              {paymentRecord?.otherPaymentPurpose && (
                <p className="text-xs mt-1 bg-gray-300 px-3 py-0.5 rounded-full font-bold text-gray-600">
                  Custom
                </p>
              )}
            </div>
          </div>

          <div className="">
            <p className="text-xs text-gray-500">Branch name</p>
            <div className="detail flex items-center">
              <MapPinHouse className="text-gray-500" />
              {paymentRecord?.branchName ? (
                isSuperOrGlobalAdmin ? (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/branches/${
                      paymentRecord?.branchId
                    }`}
                    className="font-medium ml-1 text-lg underline hover:text-blue-500"
                  >
                    {paymentRecord.branchName}
                  </Link>
                ) : (
                  <span className="font-medium ml-1 text-lg">
                    {paymentRecord.branchName}
                  </span>
                )
              ) : (
                <p className="font-medium ml-1">N/A</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-1 font-bold flex items-center">
          <DescriptionOutlinedIcon />
          <span className="ml-0.5">Payment Description</span>
        </p>
        <div className="col-span-2 text-sm">
          {paymentRecord?.prePaymentDescription
            ? paymentRecord?.prePaymentDescription
            : "N/A"}
        </div>
      </div>

      {/* payment source info */}
      {paymentRecord?.paymentType?.toLowerCase() == "incoming" && (
        <div className="bg-gray-50 col-span-2 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1 font-bold flex items-center">
            <DescriptionOutlinedIcon />
            <span className="ml-0.5">Payment Source Information</span>
          </p>
          <div className="col-span- grid grid-cols-4 gap-2 text-sm">
            {paymentRecord?.studentName && paymentRecord?.studentId && (
              <div className="">
                <p className="text-xs text-gray-500">Student name</p>
                <div className="detail flex items-center">
                  <User className="text-gray-500" />
                  {paymentRecord?.studentName ? (
                    isSuperOrGlobalAdmin ? (
                      <Link
                        href={`/${session?.data?.user?.role?.toLowerCase()}/students/${
                          paymentRecord?.studentId
                        }`}
                        className="font-medium ml-1 text-lg underline hover:text-blue-500"
                      >
                        {paymentRecord.studentName}
                      </Link>
                    ) : (
                      <span className="font-medium ml-1 text-lg">
                        {paymentRecord.studentName}
                      </span>
                    )
                  ) : (
                    <p className="font-medium ml-1">N/A</p>
                  )}
                </div>
              </div>
            )}

            {paymentRecord?.projectName && paymentRecord?.projectId && (
              <div className="">
                <p className="text-xs text-gray-500">Project name</p>
                <div className="detail flex items-center">
                  <User className="text-gray-500" />
                  {paymentRecord?.projectName ? (
                    isSuperOrGlobalAdmin ? (
                      <Link
                        href={`/${session?.data?.user?.role?.toLowerCase()}/projects/${
                          paymentRecord?.projectId
                        }`}
                        className="font-medium ml-1 text-lg underline hover:text-blue-500"
                      >
                        {paymentRecord.projectName}
                      </Link>
                    ) : (
                      <span className="font-medium ml-1 text-lg">
                        {paymentRecord.projectName}
                      </span>
                    )
                  ) : (
                    <p className="font-medium ml-1">N/A</p>
                  )}
                </div>
              </div>
            )}

            {/* sender name */}
            <div className="">
              <p className="text-xs text-gray-500">Sender name</p>
              <div className="detail flex ">
                <CircleUser size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.senderName
                    ? paymentRecord?.paymentSourceInfo?.senderName
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* sender phone */}
            <div className="">
              <p className="text-xs text-gray-500">Phone</p>
              <div className="detail flex ">
                <Phone size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.phone
                    ? paymentRecord?.paymentSourceInfo?.phone
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* sender email */}
            <div className="">
              <p className="text-xs text-gray-500">Email</p>
              <div className="detail flex ">
                <Mail size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.email
                    ? paymentRecord?.paymentSourceInfo?.email
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* sender bankName */}
            <div className="">
              <p className="text-xs text-gray-500">Bank Name</p>
              <div className="detail flex ">
                <Landmark size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.bankName
                    ? paymentRecord?.paymentSourceInfo?.bankName
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* sender bank account number */}
            <div className="">
              <p className="text-xs text-gray-500">Bank Account Number</p>
              <div className="detail flex ">
                <CreditCard size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.bankAccountNumber
                    ? paymentRecord?.paymentSourceInfo?.bankAccountNumber
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* sender ewallet */}
            <div className="">
              <p className="text-xs text-gray-500">E-wallet</p>
              <div className="detail flex ">
                <Smartphone size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.ewalletName
                    ? paymentRecord?.paymentSourceInfo?.ewalletName
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* sender ewalletNumber */}
            <div className="">
              <p className="text-xs text-gray-500">E-waller number</p>
              <div className="detail flex ">
                <NotebookTabs size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.paymentSourceInfo?.ewalletNumber
                    ? paymentRecord?.paymentSourceInfo?.ewalletNumber
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* recepient  info */}
      {paymentRecord?.paymentType?.toLowerCase() == "outgoing" && (
        <div className="bg-gray-50 col-span-2 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1 font-bold flex items-center">
            <DescriptionOutlinedIcon />
            <span className="ml-0.5">Recipient Information</span>
          </p>
          <div className="col-span- grid grid-cols-4 gap-2 text-sm">
            {paymentRecord?.recipient?.userName &&
              paymentRecord?.recipient?.userId && (
                <div className="">
                  <p className="text-xs text-gray-500">User name</p>
                  <div className="detail flex items-center">
                    <User className="text-gray-500" />
                    {paymentRecord?.recipient?.userName ? (
                      isSuperOrGlobalAdmin ? (
                        <Link
                          href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                            paymentRecord?.recipient?.userId
                          }`}
                          className="font-medium ml-1 text-lg underline hover:text-blue-500"
                        >
                          {paymentRecord?.recipient?.userName}
                        </Link>
                      ) : (
                        <span className="font-medium ml-1 text-lg">
                          {paymentRecord?.recipient?.userName}
                        </span>
                      )
                    ) : (
                      <p className="font-medium ml-1">N/A</p>
                    )}
                  </div>
                </div>
              )}

            {!(
              paymentRecord?.recipient?.userName ||
              paymentRecord?.recipient?.userId
            ) && (
              <>
                {/* recipient name */}
                <div className="">
                  <p className="text-xs text-gray-500">Recipient name</p>
                  <div className="detail flex ">
                    <CircleUser size={20} className="text-gray-500" />
                    <p className="font-medium text-md ml-2 ">
                      {paymentRecord?.recipient?.name
                        ? paymentRecord?.recipient?.name
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* recipient phone */}
                <div className="">
                  <p className="text-xs text-gray-500">Phone</p>
                  <div className="detail flex ">
                    <Phone size={20} className="text-gray-500" />
                    <p className="font-medium text-md ml-2 ">
                      {paymentRecord?.recipient?.phone
                        ? paymentRecord?.recipient?.phone
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* recipient email */}
                <div className="">
                  <p className="text-xs text-gray-500">Email</p>
                  <div className="detail flex ">
                    <Mail size={20} className="text-gray-500" />
                    <p className="font-medium text-md ml-2 ">
                      {paymentRecord?.recipient?.email
                        ? paymentRecord?.recipient?.email
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* recipient bankName */}
            <div className="">
              <p className="text-xs text-gray-500">Bank Name</p>
              <div className="detail flex ">
                <Landmark size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.recipient?.bankName
                    ? paymentRecord?.recipient?.bankName
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* recipient bank account number */}
            <div className="">
              <p className="text-xs text-gray-500">Bank Account Number</p>
              <div className="detail flex ">
                <CreditCard size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.recipient?.bankAccountNumber
                    ? paymentRecord?.recipient?.bankAccountNumber
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* recipient ewallet */}
            <div className="">
              <p className="text-xs text-gray-500">E-wallet</p>
              <div className="detail flex ">
                <Smartphone size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.recipient?.ewalletName
                    ? paymentRecord?.recipient?.ewalletName
                    : "N/A"}
                </p>
              </div>
            </div>
            {/* recipient ewalletNumber */}
            <div className="">
              <p className="text-xs text-gray-500">E-wallet number</p>
              <div className="detail flex ">
                <NotebookTabs size={20} className="text-gray-500" />
                <p className="font-medium text-md ml-2 ">
                  {paymentRecord?.recipient?.ewalletNumber
                    ? paymentRecord?.recipient?.ewalletNumber
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* created by Information */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2 font-bold flex items-center">
          {/* <InfoOutlinedIcon /> */}
          <span className="ml-0.5">Created By</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="">
            <p className="text-xs text-gray-500">User name</p>
            <div className="detail flex items-center">
              <User className="text-gray-500" />
              {paymentRecord?.createdBy?.name ? (
                isSuperOrGlobalAdmin ? (
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                      paymentRecord?.createdBy?._id
                    }`}
                    className="font-medium ml-1 text-lg underline hover:text-blue-500"
                  >
                    {paymentRecord?.createdBy?.name}
                  </Link>
                ) : (
                  <span className="font-medium ml-1 text-lg">
                    {paymentRecord?.createdBy?.name}
                  </span>
                )
              ) : (
                <p className="font-medium ml-1">N/A</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-lg flex items-center">
              {paymentRecord?.createdBy?.role?.toLowerCase() === "admin" ? (
                <UserCircle className="text-gray-500 w-5 h-5" />
              ) : paymentRecord?.createdBy?.role?.toLowerCase() ===
                "superadmin" ? (
                <Crown className="text-gray-500 w-5 h-5" />
              ) : (
                <EventOutlinedIcon className="text-gray-500" />
              )}
              <span className="mx-1">{paymentRecord?.createdBy?.role}</span>
              {paymentRecord?.createdBy?.role?.toLowerCase() === "admin" &&
                paymentRecord?.createdBy?.isGlobalAdmin && (
                  <UserCircle className="text-gray-500 w-5 h-5" />
                )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created At</p>

            <div className="detail flex ">
              <Timer size={20} className="text-gray-500" />
              <p className="font-medium text-md ml-2 ">
                {paymentRecord?.createdBy?.paymentCreatedAt
                  ? dayjs(paymentRecord?.createdBy?.paymentCreatedAt)
                      .tz(timeZone)
                      .format("DD MMM, YYYY [at] h:mm A")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicPaymentInfo;
