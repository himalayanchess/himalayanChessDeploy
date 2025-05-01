import React, { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DownloadIcon from "@mui/icons-material/Download";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";

import Input from "../Input";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
} from "@mui/material";
import Dropdown from "../Dropdown";
import { File, LayoutList } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActivityRecords,
  filterActivityRecords,
} from "@/redux/activityRecordSlice";

import {
  fetchAllBatches,
  fetchAllTrainers,
  getAllBranches,
} from "@/redux/allListSlice";
import { exportOverallActivityRecordToExcel } from "@/helpers/exportToExcel/exportOverallActivityRecordToExcel";
import ActivityRecordList from "../activityrecord/ActivityRecordList";
import ActivityAssignedClassesRecordList from "./ActivityAssignedClassesRecordList";
import { useSession } from "next-auth/react";
import {
  BarChart as BarChartIcon,
  Dashboard as DashboardIcon,
  LibraryBooks as LibraryBooksIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MedicalServices as MedicalServicesIcon,
  Numbers as NumbersIcon,
  School as SchoolIcon,
  Folder as FolderIcon,
  NoteAlt as NoteAltIcon,
} from "@mui/icons-material";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

const timeZone = "Asia/Kathmandu";

const ActivityAssignedClassesComponent = () => {
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
  // Default values as start and end date of week compared to day
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .startOf("isoWeek")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs()
    .tz(timeZone)
    .endOf("isoWeek")
    .format("YYYY-MM-DD");

  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");

  const [filteredActivityRecordCount, setfilteredActivityRecordCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [activityRecordsPerPage] = useState(7);
  const [selectedBatchName, setselectedBatchName] = useState("All");
  const [selectedTrainer, setselectedTrainer] = useState("All");
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(true);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [recordStats, setRecordStats] = useState<any>({
    overall: { total: 0, taken: 0, notTaken: 0 },
    hca: { total: 0, taken: 0, notTaken: 0 },
    school: { projectWise: [] },
  });

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const handleNextWeek = () => {
    setStartDate(dayjs(startDate).add(1, "week").format("YYYY-MM-DD"));
    setEndDate(dayjs(endDate).add(1, "week").format("YYYY-MM-DD"));
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

    // Apply filters
    filtered =
      selectedAffiliatedTo?.toLowerCase() === "all"
        ? filtered
        : filtered?.filter(
            (record: any) =>
              record.affiliatedTo?.toLowerCase() ===
              selectedAffiliatedTo?.toLowerCase()
          );

    filtered =
      selectedBranch?.toLowerCase() === "all"
        ? filtered
        : filtered?.filter(
            (record: any) =>
              record.branchName?.toLowerCase() === selectedBranch?.toLowerCase()
          );

    if (selectedBatchName?.toLowerCase() !== "all") {
      filtered = filtered?.filter(
        (record: any) =>
          record.batchName?.toLowerCase() === selectedBatchName.toLowerCase()
      );
    }

    if (selectedTrainer?.toLowerCase() !== "all") {
      filtered = filtered?.filter(
        (record: any) =>
          record.trainerName?.toLowerCase() === selectedTrainer.toLowerCase()
      );
    }

    // Date filtering
    if (useAdvancedDate) {
      filtered = filtered?.filter((record: any) => {
        const recordDate = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");
        return recordDate >= startDate && recordDate <= endDate;
      });
    } else {
      filtered = filtered?.filter((record: any) => {
        const recordMonth = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM");
        return recordMonth === selectedMonth;
      });
    }

    // Sort descending
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setfilteredActivityRecordCount(filtered?.length);
    setCurrentPage(1);
    dispatch(filterActivityRecords(filtered));

    // === Stats Generation ===

    // Overall Stats
    const totalClasses = filtered?.length;
    const takenClasses = filtered?.filter(
      (record: any) => record.recordUpdatedByTrainer
    ).length;
    const notTakenClasses = totalClasses - takenClasses;

    // Affiliated to "hca"
    const hcaRecords = filtered?.filter(
      (record: any) => record.affiliatedTo?.toLowerCase() === "hca"
    );
    const hcaStats = {
      total: hcaRecords.length,
      taken: hcaRecords.filter((record: any) => record.recordUpdatedByTrainer)
        .length,
      notTaken:
        hcaRecords.length -
        hcaRecords.filter((record: any) => record.recordUpdatedByTrainer)
          .length,
    };

    // Project-wise breakdown for affiliatedTo === 'school'
    const schoolProjectStatsMap: {
      [projectName: string]: {
        total: number;
        taken: number;
        notTaken: number;
      };
    } = {};

    filtered
      .filter((record: any) => record.affiliatedTo?.toLowerCase() === "school")
      .forEach((record: any) => {
        const project = record.projectName || "Unknown";
        if (!schoolProjectStatsMap[project]) {
          schoolProjectStatsMap[project] = {
            total: 0,
            taken: 0,
            notTaken: 0,
          };
        }
        schoolProjectStatsMap[project].total += 1;
        if (record.recordUpdatedByTrainer) {
          schoolProjectStatsMap[project].taken += 1;
        } else {
          schoolProjectStatsMap[project].notTaken += 1;
        }
      });

    const schoolProjectWise = Object.entries(schoolProjectStatsMap).map(
      ([projectName, stats]) => ({
        projectName,
        ...stats,
      })
    );

    // Final object to display
    const activityStats = {
      overall: {
        total: totalClasses,
        taken: takenClasses,
        notTaken: notTakenClasses,
      },
      hca: hcaStats,
      school: {
        projectWise: schoolProjectWise,
      },
    };

    console.log("Activity Stats:", activityStats);
    setRecordStats(activityStats);
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

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
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
      <h2 className="text-3xl font-medium text-gray-700 flex items-center mb-2">
        <File />
        <span className="ml-2">Assigned Classes</span>
      </h2>
      <div className="activityrecord-header mb-3 w-full flex items-end justify-between">
        <div className="batch-date w-full flex flex-col  items-end gap-0 ">
          {/* batchlist dropdown */}
          <div className="topheader w-full grid grid-cols-5  gap-3 mt-0">
            <Dropdown
              label="Affiliated to"
              options={affilatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              disabled={!isSuperOrGlobalAdmin}
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
                ...allActiveBatches?.map((batch: any) => batch?.batchName),
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

      {/* Activity assigned class record list */}
      <div className="list-chart flex-1 h-full flex gap-4 mb-2">
        <div className="classlist flex-[0.75]  bg-white ">
          <ActivityAssignedClassesRecordList
            loading={allActivityRecordsLoading}
            allFilteredActiveActivityRecords={allFilteredActiveActivityRecords}
            activityRecordsPerPage={activityRecordsPerPage}
            currentPage={currentPage}
          />
        </div>

        <div className="recordchart border p-3 flex-[0.25] flex flex-col h-[350px] overflow-y-auto rounded-lg shadow-sm bg-white ">
          <div className="flex flex-col items-start gap-2 justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <BarChartIcon fontSize="small" />
              Record Statistics
            </h1>
            <div className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              Trainer: <b>{selectedTrainer}</b>
            </div>
          </div>

          <div className="record-content space-y-4  overflow-y-auto pr-1">
            {/* Overall Stats */}
            <div className="card  rounded-lg p-0 ">
              <div className="flex items-center gap-2 mb-2">
                <DashboardIcon fontSize="small" className="text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-600">
                  Overall Class Records
                </h2>
              </div>
              <div className="card-body grid grid-cols-3 gap-2">
                <StatCard
                  value={recordStats?.overall?.total ?? 0}
                  label="Classes"
                  icon={<LibraryBooksIcon fontSize="small" />}
                  color="bg-purple-50 text-purple-600"
                />
                <StatCard
                  value={recordStats?.overall?.taken ?? 0}
                  label="Taken"
                  icon={<CheckCircleIcon fontSize="small" />}
                  color="bg-green-50 text-green-600"
                />
                <StatCard
                  value={recordStats?.overall?.notTaken ?? 0}
                  label="Not Taken"
                  icon={<CancelIcon fontSize="small" />}
                  color="bg-red-50 text-red-600"
                />
              </div>
            </div>

            {/* HCA Stats */}
            <div className="card  rounded-lg  ">
              <div className="flex items-center gap-2 mb-2">
                <MedicalServicesIcon
                  fontSize="small"
                  className="text-gray-500"
                />
                <h2 className="text-sm font-semibold text-gray-600">
                  HCA Class Stats
                </h2>
              </div>
              <div className="card-body grid grid-cols-3 gap-2">
                <StatCard
                  value={recordStats?.hca?.total ?? 0}
                  label="Total"
                  icon={<NumbersIcon fontSize="small" />}
                  color="bg-blue-50 text-blue-600"
                />
                <StatCard
                  value={recordStats?.hca?.taken ?? 0}
                  label="Taken"
                  icon={<CheckCircleIcon fontSize="small" />}
                  color="bg-green-50 text-green-600"
                />
                <StatCard
                  value={recordStats?.hca?.notTaken ?? 0}
                  label="Not Taken"
                  icon={<CancelIcon fontSize="small" />}
                  color="bg-red-50 text-red-600"
                />
              </div>
            </div>

            {/* School Project Stats */}
            <div className="card  rounded-lg pb-5">
              <div className="flex items-center gap-2 mb-2">
                <SchoolIcon fontSize="small" className="text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-600">
                  Project-wise Stats (School)
                </h2>
              </div>
              {recordStats?.school?.projectWise?.length > 0 ? (
                <div className="card-body space-y-3">
                  {recordStats.school.projectWise.map((project: any) => (
                    <div
                      key={project.projectName}
                      className="bg-white  pl-4 rounded-md shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FolderIcon
                          fontSize="small"
                          className="text-gray-400"
                        />
                        <h3 className="text-sm font-medium text-gray-700">
                          {project.projectName}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <MiniStatCard
                          value={project.total}
                          label="Total"
                          color="bg-blue-50 text-blue-600"
                        />
                        <MiniStatCard
                          value={project.taken}
                          label="Taken"
                          color="bg-green-50 text-green-600"
                        />
                        <MiniStatCard
                          value={project.notTaken}
                          label="Not Taken"
                          color="bg-red-50 text-red-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 bg-white rounded border">
                  <NoteAltIcon fontSize="small" className="text-gray-400" />
                  <p className="text-xs text-gray-500 mt-1">
                    No project records available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* pagination */}
      <div className="classlist w-[70%]">
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
    </div>
  );
};

export default ActivityAssignedClassesComponent;

// StatCard component (define this separately)
function StatCard({ value, label, icon, color }: any) {
  return (
    <div
      className={`stat p-2 rounded-md flex flex-col items-center ${
        color.split(" ")[0]
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full ${
          color.split(" ")[1]
        } flex items-center justify-center mb-1`}
      >
        {icon}
      </div>
      <span className="text-xs">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
}

// MiniStatCard component
function MiniStatCard({ value, label, color }: any) {
  return (
    <div
      className={`stat p-1 mt-1 rounded flex flex-col items-center ${color}`}
    >
      <span className="text-sm">{label}</span>
      <span className="font-bold text-md">{value}</span>
    </div>
  );
}
