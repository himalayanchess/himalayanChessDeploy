import React, { useEffect, useRef, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Input from "@/components/Input";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
} from "@mui/material";
import Dropdown from "@/components/Dropdown";
import { FolderClock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTrainersActivityRecords,
  filterAllTrainersActivityRecords,
} from "@/redux/trainerHistorySlice";
import { fetchAllBatches, fetchAllProjects } from "@/redux/allListSlice";
import TrainerHistoryList from "./TrainerHistoryList";
import { exportOverallActivityRecordToExcel } from "@/helpers/exportToExcel/exportOverallActivityRecordToExcel";
import { useSession } from "next-auth/react";
import { projectNew } from "next/dist/build/swc/generated-native";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const TrainerHistory = () => {
  // session
  const session = useSession();

  // ref
  const fetched = useRef(false); // To prevent multiple fetches

  // dispatch
  const dispatch = useDispatch<any>();

  //use selector
  const { allActiveBatches, allActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );
  const {
    allActiveTrainersActivityRecords,
    allFilteredActiveTrainersActivityRecords,
    allTrainersActivityRecordsLoading,
  } = useSelector((state: any) => state.trainerHistoryReducer);

  const affiliatedTo = ["All", "HCA", "School"];

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedProject, setselectedProject] = useState("All");
  const [selectedBatchName, setselectedBatchName] = useState("All");
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [filteredProjectList, setfilteredProjectList] = useState<any>([]);
  const [filteredBatches, setfilteredBatches] = useState<any>([]);

  const [totalActivityRecords, settotalActivityRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [activityRecordsPerPage] = useState(7);

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const exportToExcel = () => {
    exportOverallActivityRecordToExcel(
      allFilteredActiveTrainersActivityRecords
    );
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * activityRecordsPerPage + 1;
  const endItem = Math.min(
    currentPage * activityRecordsPerPage,
    totalActivityRecords
  );
  const showingText = `Showing ${startItem}-${endItem} of ${totalActivityRecords}`;

  // Reset start and end date when toggling advanced date selection
  useEffect(() => {
    if (!useAdvancedDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [useAdvancedDate]);

  // reset dropdowns when affiliated to changes
  useEffect(() => {
    setselectedBatchName("All");
    setselectedProject("All");
  }, [selectedAffiliatedTo]);

  //filter batch list accrding to affilaited to and project
  useEffect(() => {
    if (
      !allActiveBatches ||
      !filteredProjectList ||
      !session?.data?.user?.branchName
    )
      return;

    const branchName = session.data.user.branchName.toLowerCase();
    const selectedProjectName = selectedProject?.toLowerCase();
    const projectNames = filteredProjectList.map((proj: any) =>
      proj.name?.toLowerCase()
    );

    // Step 1: Filter batches where affiliatedTo is 'HCA' and batchName matches session batchName
    const hcaFilteredBatches = allActiveBatches.filter((batch: any) => {
      return (
        batch?.affiliatedTo?.toLowerCase() == "hca" &&
        batch?.branchName?.toLowerCase() ==
          session?.data?.user?.branchName?.toLowerCase()
      );
    });

    // Step 2: Filter batches where projectName is in filteredProjectList
    const projectFilteredBatches = allActiveBatches.filter((batch: any) => {
      const batchProject = batch?.projectName?.toLowerCase();
      return projectNames.includes(batchProject);
    });

    // Combine the two filtered lists
    const combinedBatches = [
      ...new Set([...hcaFilteredBatches, ...projectFilteredBatches]),
    ];

    // Step 3: Apply additional filters based on selectedAffiliatedTo and selectedProject
    let tempFilteredBatches =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? combinedBatches
        : combinedBatches?.filter(
            (batch: any) =>
              batch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // filter by project
    tempFilteredBatches =
      selectedProject?.toLowerCase() == "all"
        ? tempFilteredBatches
        : tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.projectName?.toLowerCase() ==
              selectedProject?.toLowerCase()
          );

    setfilteredBatches(tempFilteredBatches);
  }, [
    allActiveBatches,
    filteredProjectList,
    selectedAffiliatedTo,
    selectedProject,
    session?.data?.user,
  ]);

  // filter activity records list
  useEffect(() => {
    if (!allActiveTrainersActivityRecords) return;

    let filtered = allActiveTrainersActivityRecords;

    // filter by affiliated to
    filtered =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    //filter by project
    filtered =
      selectedProject?.toLowerCase() == "all"
        ? filtered
        : filtered.filter(
            (record: any) =>
              record.projectName?.toLowerCase() ==
              selectedProject?.toLowerCase()
          );

    // Filter by Batch Name
    if (selectedBatchName?.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (record: any) =>
          record.batchName?.toLowerCase() === selectedBatchName.toLowerCase()
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
    settotalActivityRecords(filtered.length);
    setCurrentPage(1);
    dispatch(filterAllTrainersActivityRecords(filtered));
  }, [
    allActiveTrainersActivityRecords,
    selectedBatchName,
    selectedProject,
    selectedAffiliatedTo,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
  ]);

  // filter project dropdown options as project that has assigned trainers as my session.user.name
  useEffect(() => {
    if (!session?.data?.user) return;

    const filteredProjects = allActiveProjects.filter((project: any) => {
      return project?.assignedTrainers?.some(
        (trainer: any) => trainer.trainerName === session.data.user.name
      );
    });

    // Now set this filtered list to some state if needed
    setfilteredProjectList(filteredProjects);
  }, [allActiveProjects, session?.data?.user]);

  // get initial trainers activity records and batch list
  useEffect(() => {
    if (!fetched.current && session.data) {
      dispatch(
        fetchAllTrainersActivityRecords({ trainerId: session.data?.user?._id })
      );
      dispatch(fetchAllBatches());
      dispatch(fetchAllProjects());
      fetched.current = true; // Mark as fetched
    }
  }, [session.data]);

  return (
    <div className="flex-1 flex flex-col py-3 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl font-medium text-gray-700 flex items-center ">
        <FolderClock />
        <span className="ml-2">Activity History</span>
      </h2>
      <div className="activityrecord-header my-0 w-full flex items-end justify-between">
        <div className="batch-date w-full flex flex-col  items-end gap-0 ">
          {/* batchlist dropdown */}
          <div className="topheader w-full grid grid-cols-5  gap-3 mt-0">
            <Dropdown
              label="Affiliated to"
              options={affiliatedTo}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              width="full"
            />
            <Dropdown
              label="Project name"
              options={[
                "All",
                ...filteredProjectList?.map((project: any) => project.name),
              ]}
              selected={selectedProject}
              onChange={setselectedProject}
              width="full"
              disabled={selectedAffiliatedTo?.toLowerCase() != "school"}
            />

            <Dropdown
              label="Batch"
              options={[
                "All",
                ...filteredBatches?.map((batch: any) => batch?.batchName),
              ]}
              selected={selectedBatchName}
              onChange={setselectedBatchName}
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
                  disabled={totalActivityRecords === 0}
                  startIcon={<DownloadIcon />}
                >
                  Export to Excel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer history list */}
      <TrainerHistoryList
        loading={allTrainersActivityRecordsLoading}
        filteredTrainersActivityRecords={
          allFilteredActiveTrainersActivityRecords
        }
        activityRecordsPerPage={activityRecordsPerPage}
        currentPage={currentPage}
      />

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(totalActivityRecords / activityRecordsPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default TrainerHistory;
