import React, { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
  Box,
  Button,
  Modal,
} from "@mui/material";
import { CircleDollarSign, LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  filterSelectedProjectsPaymentRecordsList,
  getAllSelectedProjectsPaymentRecords,
} from "@/redux/allListSlice";
import {
  ArrowDownward,
  ArrowUpward,
  HourglassEmpty,
  AccessTime,
  CheckCircle,
  AttachMoney,
} from "@mui/icons-material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { CircleCheck } from "lucide-react";
import { exportOverallActivityRecordToExcel } from "@/helpers/exportToExcel/exportOverallActivityRecordToExcel";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useSession } from "next-auth/react";
import { exportOverallPaymentRecords } from "@/helpers/exportToExcel/exportOverallPaymentRecords";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import SearchInput from "@/components/SearchInput";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ProjectPaymentRecords = ({
  allActiveSelectedProjectsPaymentRecordsList,
  allFilteredActiveSelectedProjectsPaymentRecordsList,
  allSelectedProjectsPaymentRecordsLoading,
}: any) => {
  // session
  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // dispatch
  const dispatch = useDispatch<any>();

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  const [selectedPaymentStatus, setselectedPaymentStatus] = useState("All");
  const [searchText, setsearchText] = useState("");
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [showAllRecords, setshowAllRecords] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // options
  const paymentTypeOptions = ["All", "Incoming", "Outgoing"];
  const paymentStatusOptions = ["All", "Pending", "Partial", "Paid"];

  // export to excel
  const exportToExcel = () => {
    exportOverallPaymentRecords(
      allFilteredActiveSelectedProjectsPaymentRecordsList
    );
  };

  // Calculate showing text

  const showingText = `Showing ${allFilteredActiveSelectedProjectsPaymentRecordsList?.length} records`;

  // filter activity records list
  useEffect(() => {
    if (!allActiveSelectedProjectsPaymentRecordsList) return;

    let filtered = allActiveSelectedProjectsPaymentRecordsList;

    // filter by payment status
    filtered =
      selectedPaymentStatus?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.paymentStatus?.toLowerCase() ==
              selectedPaymentStatus?.toLowerCase()
          );

    // filter by search text
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (record: any) =>
          record.prePaymentTitle
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          record.prePaymentDescription
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Date Filtering
    if (!showAllRecords) {
      if (useAdvancedDate) {
        filtered = filtered.filter((record: any) => {
          const recordDate = dayjs(record.issuedDate)
            .tz(timeZone)
            .format("YYYY-MM-DD");

          return recordDate >= startDate && recordDate <= endDate;
        });
      } else {
        filtered = filtered.filter((record: any) => {
          const recordMonth = dayjs(record.issuedDate)
            .tz(timeZone)
            .format("YYYY-MM");

          return recordMonth === selectedMonth;
        });
      }
    }

    // Sort by createdAt descending
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Set results
    dispatch(filterSelectedProjectsPaymentRecordsList(filtered));
  }, [
    allActiveSelectedProjectsPaymentRecordsList,
    selectedPaymentStatus,
    searchText,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
    showAllRecords,
  ]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="title-button w-full flex items-center gap-2">
        <h2 className="text-md font-medium text-gray-700 flex items-center ">
          <CircleDollarSign size={18} className="text-gray-500" />
          <span className="ml-1 font-bold text-gray-500">Payment Records</span>
        </h2>

        <span className="text-sm text-gray-500">{"showingText"}</span>
      </div>
      <div className="paymentreocord-header mt-1 w-full  flex flex-col gap-3">
        {/* batchlist dropdown */}
        <div className="topheader w-full grid grid-cols-4  gap-3 mt-0">
          <Dropdown
            label="Payment status"
            options={paymentStatusOptions}
            //   disabled={!isSuperOrGlobalAdmin}
            selected={selectedPaymentStatus}
            onChange={setselectedPaymentStatus}
            width="full"
          />

          {/* date */}

          <Input
            label="Date"
            type="month"
            value={selectedMonth}
            disabled={useAdvancedDate || showAllRecords}
            onChange={(e: any) => setselectedMonth(e.target.value)}
            width="full"
          />

          <Input
            label="Start Date"
            type="date"
            value={startDate}
            disabled={!useAdvancedDate || showAllRecords}
            onChange={(e: any) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            disabled={!useAdvancedDate || showAllRecords}
            onChange={(e: any) => setEndDate(e.target.value)}
          />
        </div>

        <div className="bottomheader w-full  grid grid-cols-4 place-items-start">
          <div className="checkboxes col-span-2 grid grid-cols-2  gap-3">
            {/* Checkbox for Advanced Date Selection */}
            <div className="mt-2 flex items-center gap-2">
              <input
                id="advancedcheckbox"
                type="checkbox"
                checked={useAdvancedDate}
                onChange={() => setUseAdvancedDate(!useAdvancedDate)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
              />
              <label
                htmlFor="advancedcheckbox"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Use Advanced Date Selection
              </label>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                id="showallrecords"
                type="checkbox"
                checked={showAllRecords}
                onChange={() => {
                  setshowAllRecords(!showAllRecords);
                  setUseAdvancedDate(false);
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
              />
              <label
                htmlFor="showallrecords"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Show all records
              </label>
            </div>
          </div>
          <div className="exceldownloadbutton ml-auto flex gap-3 col-span-2">
            <SearchInput
              placeholder="Search"
              value={searchText}
              onChange={(e: any) => setsearchText(e.target.value)}
              width="full"
            />
            <Button
              onClick={exportToExcel}
              variant="contained"
              color="success"
              // disabled={filteredPaymentRecordsCount === 0}
              startIcon={<DownloadIcon />}
              className=""
            >
              Export to Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Projects payment record record list */}
      <div className="overflow-y-auto mt-3 flex-1 h-full bg-white rounded-lg shadow-sm">
        {/* Table Headings */}
        <div className="table-headings  grid grid-cols-[50px,repeat(6,1fr)] gap-2 w-full bg-gray-200 px-4 mb-2">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Issued Date
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Payment Title
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Payment Type
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Payment Status
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Total Amount
          </span>
        </div>

        {/* Loading Spinner */}
        {allSelectedProjectsPaymentRecordsLoading && (
          <div className="w-full text-center my-6">
            <CircularProgress sx={{ color: "gray" }} />
            <p className="text-gray-500">Getting records</p>
          </div>
        )}

        {/* No Records Found */}
        {allFilteredActiveSelectedProjectsPaymentRecordsList?.length === 0 &&
          !allSelectedProjectsPaymentRecordsLoading && (
            <div className="flex justify-center items-center text-gray-500 w-full my-4">
              <SearchOffIcon className="mr-2" sx={{ fontSize: "1.5rem" }} />
              <p className="text-md">No records found</p>
            </div>
          )}

        {/* Table Contents */}
        {!allSelectedProjectsPaymentRecordsLoading && (
          <div className="table-contents grid gap-0">
            {allFilteredActiveSelectedProjectsPaymentRecordsList?.map(
              (paymentRecord: any, index: number) => (
                <div
                  key={paymentRecord?._id}
                  className="grid grid-cols-[50px,repeat(6,1fr)] gap-2 px-4 py-3 border-b border-gray-200 items-center hover:bg-gray-50 transition-all"
                >
                  <span className="text-xs text-center font-medium text-gray-600">
                    {index + 1}
                  </span>

                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/payments/${
                      paymentRecord?._id
                    }`}
                    className="text-left px-1 text-xs font-medium text-gray-600 underline hover:text-blue-500"
                  >
                    {dayjs(paymentRecord?.issuedDate)
                      .tz(timeZone)
                      .format("MMM D, YYYY, ddd")}
                  </Link>

                  <span className="text-left px-1 col-span-2 text-xs font-medium text-gray-600">
                    {paymentRecord?.prePaymentTitle}
                  </span>

                  <span className="text-left px-1 text-xs font-medium text-gray-600 flex items-center gap-1">
                    {paymentRecord?.paymentType === "Incoming" ? (
                      <ArrowCircleDownIcon
                        fontSize="small"
                        className="text-green-600"
                      />
                    ) : (
                      <ArrowCircleUpIcon
                        fontSize="small"
                        className="text-red-600"
                      />
                    )}
                    <span
                      className={`font-bold ${
                        paymentRecord?.paymentType?.toLowerCase() === "incoming"
                          ? "text-green-600"
                          : paymentRecord?.paymentType?.toLowerCase() ===
                            "outgoing"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {paymentRecord?.paymentType}
                    </span>
                  </span>

                  <span
                    className={`text-left px-1 text-xs font-bold flex items-center gap-1 ${
                      paymentRecord?.paymentStatus?.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : paymentRecord?.paymentStatus?.toLowerCase() ===
                          "partial"
                        ? "text-blue-600"
                        : paymentRecord?.paymentStatus?.toLowerCase() === "paid"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {paymentRecord?.paymentStatus === "Pending" && (
                      <AccessTime fontSize="small" />
                    )}
                    {paymentRecord?.paymentStatus === "Partial" && (
                      <HourglassEmpty fontSize="small" />
                    )}
                    {paymentRecord?.paymentStatus === "Paid" && (
                      <CircleCheck size={18} />
                    )}
                    {paymentRecord?.paymentStatus}
                  </span>

                  <span className="text-left px-1 text-sm font-bold text-gray-600">
                    Rs. {paymentRecord?.totalAmount}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPaymentRecords;
