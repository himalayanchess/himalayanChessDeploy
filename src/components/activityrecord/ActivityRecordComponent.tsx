import React, { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";

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
import { LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActivityRecords,
  filterActivityRecords,
} from "@/redux/activityRecordSlice";
import ActivityRecordList from "./ActivityRecordList";
import {
  fetchAllBatches,
  fetchAllTrainers,
  getAllBranches,
} from "@/redux/allListSlice";
import { exportOverallActivityRecordToExcel } from "@/helpers/exportToExcel/exportOverallActivityRecordToExcel";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ActivityRecordComponent = () => {
  // session
  const session = useSession();

  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // dispatch
  const dispatch = useDispatch<any>();

  //use selector
  const { allActiveBatches, allActiveTrainerList, allActiveBranchesList } =
    useSelector((state: any) => state.allListReducer);

  const affilatedToOptions = ["All", "HCA", "School"];

  const {
    allActiveActivityRecords,
    allFilteredActiveActivityRecords,
    allActivityRecordsLoading,
  } = useSelector((state: any) => state.activityRecordReducer);

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");

  const [filteredActivityRecordCount, setfilteredActivityRecordCount] =
    useState(0);
  const [filteredBatches, setfilteredBatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [activityRecordsPerPage] = useState(7);
  const [selectedBatchName, setselectedBatchName] = useState("All");
  const [selectedTrainer, setselectedTrainer] = useState("All");
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const exportToExcel = () => {
    exportOverallActivityRecordToExcel(allFilteredActiveActivityRecords);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * activityRecordsPerPage + 1;
  const endItem = Math.min(
    currentPage * activityRecordsPerPage,
    filteredActivityRecordCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredActivityRecordCount}`;

  // Reset start and end date when toggling advanced date selection
  useEffect(() => {
    if (!useAdvancedDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [useAdvancedDate]);

  // if affiliated to changes then reset project dropdown
  useEffect(() => {
    if (isSuperOrGlobalAdmin) {
      setselectedBranch("All");
      setselectedBatchName("All");
    }
  }, [selectedAffiliatedTo]);

  // Reset batch when branch changes
  useEffect(() => {
    setselectedBatchName("All");
  }, [selectedBranch]);

  // filter activity records list
  useEffect(() => {
    if (!allActiveActivityRecords) return;

    let filtered = allActiveActivityRecords;

    // filter by affiliated to
    filtered =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.affiliatedTo.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // filter by branch
    filtered =
      selectedBranch?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.branchName.toLowerCase() == selectedBranch?.toLowerCase()
          );

    // Filter by Batch Name
    if (selectedBatchName?.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (record: any) =>
          record.batchName?.toLowerCase() === selectedBatchName.toLowerCase()
      );
    }

    // Filter by Trainer Name
    if (selectedTrainer?.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (record: any) =>
          record.trainerName?.toLowerCase() === selectedTrainer.toLowerCase()
      );
    }

    // Date Filtering
    if (useAdvancedDate) {
      filtered = filtered.filter((record: any) => {
        const recordDate = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");

        return recordDate >= startDate && recordDate <= endDate;
      });
    } else {
      filtered = filtered.filter((record: any) => {
        const recordMonth = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM");

        return recordMonth === selectedMonth;
      });
    }

    // Sort by createdAt descending
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Set results
    setfilteredActivityRecordCount(filtered.length);
    setCurrentPage(1);
    dispatch(filterActivityRecords(filtered));
  }, [
    allActiveActivityRecords,
    selectedBatchName,
    selectedTrainer,
    selectedBranch,
    selectedAffiliatedTo,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
  ]);

  // filter batch when afiiliated to or branch changes
  useEffect(() => {
    let tempFilteredBatches =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? allActiveBatches
        : allActiveBatches?.filter(
            (batch: any) =>
              batch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );
    setfilteredBatches(tempFilteredBatches);
  }, [selectedAffiliatedTo, selectedBranch]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    let branchName = "All";
    let affiliatedTo = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
      affiliatedTo = "HCA";
    }
    setselectedBranch(branchName);
    setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  useEffect(() => {
    dispatch(fetchAllActivityRecords());
    dispatch(fetchAllBatches());
    dispatch(fetchAllTrainers());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex-1 flex flex-col py-3 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl  text-gray-700 flex items-center ">
        <LayoutList />
        <span className="ml-2">Activity Records</span>
      </h2>
      <div className="activityrecord-header my-0 w-full flex items-end justify-between">
        <div className="batch-date w-full flex flex-col  items-end gap-0 ">
          {/* batchlist dropdown */}
          <div className="topheader w-full grid grid-cols-5  gap-3 mt-0">
            <Dropdown
              label="Affiliated to"
              options={affilatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              width="full"
              disabled={!isSuperOrGlobalAdmin}
            />

            <Dropdown
              label="Branch"
              options={[
                "All",
                ...(allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                ) || []),
              ]}
              disabled={
                selectedAffiliatedTo?.toLowerCase() != "hca" ||
                !isSuperOrGlobalAdmin
              }
              selected={selectedBranch}
              onChange={setselectedBranch}
              width="full"
            />

            <Dropdown
              label="Batch"
              options={[
                "All",
                ...filteredBatches?.map((batch: any) => batch.batchName),
              ]}
              selected={selectedBatchName}
              onChange={setselectedBatchName}
              width="full"
            />

            {/* batchlist dropdown */}
            <Dropdown
              label="Trainer"
              options={[
                "All",
                ...allActiveTrainerList?.map((trainer: any) => trainer?.name),
              ]}
              selected={selectedTrainer}
              onChange={setselectedTrainer}
              width="full"
            />
            {/* date */}
            <div
              className={`date w-60 flex items-end 
              `}
            >
              <Input
                label="Date"
                type="month"
                value={selectedMonth}
                disabled={useAdvancedDate}
                onChange={(e: any) => setselectedMonth(e.target.value)}
              />
              <button
                className="ml-2 pb-2"
                title="Reset date"
                onClick={() => setselectedMonth(defaultMonth)}
              >
                <RestartAltIcon sx={{ fontSize: "1.8rem" }} />
              </button>
            </div>
          </div>

          <div className="bottomheader flex flex-col  justify-center w-full">
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

            {/* Start and End Date Inputs */}
            <div className="bottom-header mt-2 w-full  flex justify-between items-end">
              <div className="buttons flex-1 grid grid-cols-4  items-end gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  disabled={!useAdvancedDate}
                  onChange={(e: any) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  disabled={!useAdvancedDate}
                  onChange={(e: any) => setEndDate(e.target.value)}
                />

                {/* count */}
                <span className="text-sm text-gray-600">{showingText}</span>
              </div>

              <div className="exceldownloadbutton">
                <Button
                  onClick={exportToExcel}
                  variant="contained"
                  color="success"
                  disabled={filteredActivityRecordCount === 0}
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
      <ActivityRecordList
        loading={allActivityRecordsLoading}
        allFilteredActiveActivityRecords={allFilteredActiveActivityRecords}
        activityRecordsPerPage={activityRecordsPerPage}
        currentPage={currentPage}
      />

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(
            allFilteredActiveActivityRecords?.length / activityRecordsPerPage
          )} // Total pages
          page={currentPage} //allCoursesLoading Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default ActivityRecordComponent;
