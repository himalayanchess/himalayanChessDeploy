import React, { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Input from "../Input";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
} from "@mui/material";
import Dropdown from "../Dropdown";
import { CircleDollarSign, LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActivityRecords } from "@/redux/activityRecordSlice";
import {
  fetchAllProjects,
  fetchAllTrainers,
  filterPaymentRecordsList,
  getAllBranches,
  getAllPaymentRecords,
  getAllStudents,
} from "@/redux/allListSlice";
import { useSession } from "next-auth/react";
import PaymentRecordList from "./PaymentRecordList";
import { exportOverallPaymentRecords } from "@/helpers/exportToExcel/exportOverallPaymentRecords";
import Link from "next/link";
import SearchInput from "../SearchInput";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const PaymentComponent = () => {
  // session
  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // dispatch
  const dispatch = useDispatch<any>();

  //use selector
  const {
    allActiveHcaStudentsList,
    allActiveProjects,
    allActiveBranchesList,
    allActivePaymentRecordsList,
    allFilteredActivePaymentRecordsList,
    allPaymentRecordsLoading,
  } = useSelector((state: any) => state.allListReducer);

  const paymentTypeOptions = ["All", "Incoming", "Outgoing"];
  const paymentStatusOptions = ["All", "Pending", "Partial", "Paid"];

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  const [selectedPaymentType, setselectedPaymentType] = useState("");
  const [selectedPaymentStatus, setselectedPaymentStatus] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  const [selectedProject, setselectedProject] = useState("All");
  const [filteredStudents, setfilteredStudents] = useState([]);
  const [selectedStudent, setselectedStudent] = useState("All");
  const [searchText, setsearchText] = useState("");

  const [filteredPaymentRecordsCount, setfilteredPaymentRecordsCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [paymentRecordsPerPage] = useState(7);
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [showAllRecords, setshowAllRecords] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const exportToExcel = () => {
    exportOverallPaymentRecords(allFilteredActivePaymentRecordsList);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * paymentRecordsPerPage + 1;
  const endItem = Math.min(
    currentPage * paymentRecordsPerPage,
    filteredPaymentRecordsCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredPaymentRecordsCount}`;

  // Reset start and end date when toggling advanced date selection
  useEffect(() => {
    if (!useAdvancedDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [useAdvancedDate]);

  // Reset student and project when branch changes
  useEffect(() => {
    setselectedStudent("All");
    setselectedProject("All");
  }, [selectedBranch]);

  // filter srudent list by branch
  useEffect(() => {
    const tempFilteredStudents =
      selectedBranch?.toLowerCase() == "all"
        ? allActiveHcaStudentsList
        : allActiveHcaStudentsList?.filter(
            (student: any) =>
              student?.branchName?.toLowerCase() ==
              selectedBranch?.toLowerCase()
          );
    setfilteredStudents(tempFilteredStudents);
  }, [allActiveHcaStudentsList, selectedBranch]);

  // reset  student when project changes
  useEffect(() => {
    setselectedStudent("All");
  }, [selectedProject]);

  // filter activity records list
  useEffect(() => {
    if (!allActivePaymentRecordsList) return;

    let filtered = allActivePaymentRecordsList;

    // filter by affiliated to
    filtered =
      selectedPaymentType?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.paymentType?.toLowerCase() ==
              selectedPaymentType?.toLowerCase()
          );
    // filter by payment status
    filtered =
      selectedPaymentStatus?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.paymentStatus?.toLowerCase() ==
              selectedPaymentStatus?.toLowerCase()
          );

    // filter by branch
    filtered =
      selectedBranch?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
          );

    // Filter by project
    filtered =
      selectedProject?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.projectName?.toLowerCase() ==
              selectedProject?.toLowerCase()
          );

    // Filter by student
    if (selectedStudent?.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (record: any) =>
          record.studentName?.toLowerCase() === selectedStudent.toLowerCase()
      );
    }

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
    setfilteredPaymentRecordsCount(filtered.length);
    setCurrentPage(1);
    dispatch(filterPaymentRecordsList(filtered));
  }, [
    allActivePaymentRecordsList,
    selectedPaymentType,
    selectedPaymentStatus,
    selectedBranch,
    searchText,
    selectedProject,
    selectedStudent,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
    showAllRecords,
  ]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    // let branchName = "All";
    let paymentType = "All";
    // if (!isSuperOrGlobalAdmin) {
    //   branchName = user?.branchName;
    //   paymentType = "All";
    // }
    let branchName = user?.branchName;
    setselectedBranch(branchName);
    setselectedPaymentType(paymentType);
  }, [session?.data?.user]);

  useEffect(() => {
    dispatch(getAllPaymentRecords());
    dispatch(fetchAllTrainers());
    dispatch(getAllBranches());
    dispatch(getAllStudents());
    dispatch(fetchAllProjects());
  }, []);

  return (
    <div className="flex-1 flex flex-col py-3 px-10 border bg-white rounded-lg">
      <div className="title-button flex justify-between">
        <h2 className="text-3xl font-medium text-gray-700 flex items-center ">
          <CircleDollarSign />
          <span className="ml-2">Payment Records</span>
        </h2>

        <Link
          href={`/${session?.data?.user?.role?.toLowerCase()}/payments/addpayment`}
        >
          <Button variant="contained" size="small">
            <AddIcon />
            <span className="ml-2">Add payment record</span>
          </Button>
        </Link>
      </div>
      <div className="activityrecord-header mt-1 w-full flex items-end justify-between">
        <div className="batch-date w-full flex flex-col  items-end gap-0 ">
          {/* batchlist dropdown */}
          <div className="topheader w-full grid grid-cols-6  gap-3 mt-0">
            <Dropdown
              label="Payment type"
              options={paymentTypeOptions}
              selected={selectedPaymentType}
              onChange={setselectedPaymentType}
              width="full"
              //   disabled={!isSuperOrGlobalAdmin}
            />

            <Dropdown
              label="Payment status"
              options={paymentStatusOptions}
              //   disabled={!isSuperOrGlobalAdmin}
              selected={selectedPaymentStatus}
              onChange={setselectedPaymentStatus}
              width="full"
            />

            <Dropdown
              label="Branch"
              options={[
                "All",
                ...(allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                ) || []),
              ]}
              // disabled={!isSuperOrGlobalAdmin}
              disabled
              selected={selectedBranch}
              onChange={setselectedBranch}
              width="full"
            />

            {isSuperOrGlobalAdmin && (
              <Dropdown
                label="Project"
                options={[
                  "All",
                  ...allActiveProjects?.map((project: any) => project.name),
                ]}
                selected={selectedProject}
                onChange={setselectedProject}
                width="full"
              />
            )}

            {/* batchlist dropdown */}
            <Dropdown
              label="Student"
              options={[
                "All",
                ...filteredStudents?.map((student: any) => student?.name),
              ]}
              selected={selectedStudent}
              onChange={setselectedStudent}
              width="full"
            />
            {/* date */}
            <div
              className={`date  flex items-end 
              `}
            >
              <Input
                label="Date"
                type="month"
                value={selectedMonth}
                disabled={useAdvancedDate || showAllRecords}
                onChange={(e: any) => setselectedMonth(e.target.value)}
                width="full"
              />
              {/* <button
                className="ml-2 pb-2"
                title="Reset date"
                onClick={() => setselectedMonth(defaultMonth)}
              >
                <RestartAltIcon sx={{ fontSize: "1.8rem" }} />
              </button> */}
            </div>
          </div>

          <div className="bottomheader flex flex-col  justify-center w-full">
            <div className="checkboxes flex items-center gap-3">
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
            {/* Start and End Date Inputs */}
            <div className="bottom-header mt-2 w-full  flex justify-between items-end">
              <div className="buttons flex-1 grid grid-cols-4  items-end gap-3">
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
                {/* count */}
                <span className="text-sm text-gray-600">{showingText}</span>
                <SearchInput
                  placeholder="Search"
                  value={searchText}
                  onChange={(e: any) => setsearchText(e.target.value)}
                />
              </div>

              <div className="exceldownloadbutton ml-3">
                <Button
                  onClick={exportToExcel}
                  variant="contained"
                  color="success"
                  disabled={filteredPaymentRecordsCount === 0}
                  startIcon={<DownloadIcon />}
                >
                  Export to Excel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity record list */}
      <PaymentRecordList
        loading={allPaymentRecordsLoading}
        allFilteredActivePaymentRecordsList={
          allFilteredActivePaymentRecordsList
        }
        paymentRecordsPerPage={paymentRecordsPerPage}
        currentPage={currentPage}
      />

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(
            allFilteredActivePaymentRecordsList?.length / paymentRecordsPerPage
          )} // Total pages
          page={currentPage} //allCoursesLoading Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default PaymentComponent;
