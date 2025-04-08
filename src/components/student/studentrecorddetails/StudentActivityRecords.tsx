import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchAllBatches, fetchAllProjects } from "@/redux/allListSlice";
import { Box, Button, Divider, Modal, Pagination, Stack } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { exportStudentActivityRecordsToExcel } from "@/helpers/exportToExcel/exportStudentActivityToExcel";
dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
const StudentActivityRecords = ({
  studentRecord,
  allActiveStudentsActivityRecords,
  allStudentsActivityRecordsLoading,
}: any) => {
  console.log(
    "inside student activity records",
    allActiveStudentsActivityRecords
  );

  // dispatch
  const dispatch = useDispatch<any>();

  // session
  const session = useSession();

  // Selectors
  const { allActiveProjects, allActiveBatches } = useSelector(
    (state: any) => state.allListReducer
  );

  // Options
  const affilatedToOptions = ["All", "HCA", "School"];

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  // state vars
  const [loaded, setloaded] = useState(false);
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedProject, setselectedProject] = useState("All");
  const [selectedBatch, setselectedBatch] = useState("All");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedMonth, setselectedMonth] = useState(defaultMonth);
  const [useAdvancedDate, setUseAdvancedDate] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filteredRecordCount, setfilteredRecordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(7);
  const [selectedRecord, setselectedRecord] = useState<any>(null);
  const [viewStudyMaterialsModalOpen, setviewStudyMaterialsModalOpen] =
    useState(false);

  // Modal operations
  function handleviewStudyMaterialsModalOpen(record: any) {
    setselectedRecord(record);
    setviewStudyMaterialsModalOpen(true);
  }

  function handleviewStudyMaterialsModalClose() {
    setviewStudyMaterialsModalOpen(false);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // function export to excel
  function exportToExcel() {
    exportStudentActivityRecordsToExcel(filteredRecords, studentRecord);
  }

  // Calculate showing text
  const startItem = (currentPage - 1) * recordsPerPage + 1;
  const endItem = Math.min(currentPage * recordsPerPage, filteredRecordCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredRecordCount}`;

  // Filter batches based on "Affiliated To" and "Project"
  useEffect(() => {
    let tempFilteredBatches = allActiveBatches.slice();

    if (selectedAffiliatedTo.toLowerCase() !== "all") {
      tempFilteredBatches = tempFilteredBatches.filter(
        (batch) =>
          batch?.affiliatedTo.toLowerCase() ===
          selectedAffiliatedTo.toLowerCase()
      );
    }

    if (
      selectedAffiliatedTo.toLowerCase() === "school" &&
      selectedProject.toLowerCase() !== "all"
    ) {
      tempFilteredBatches = tempFilteredBatches.filter(
        (batch) =>
          batch?.projectName?.toLowerCase() === selectedProject?.toLowerCase()
      );
    }

    setFilteredBatches(tempFilteredBatches || []);
  }, [selectedAffiliatedTo, allActiveBatches, selectedProject]);

  // Reset start and end date when toggling advanced date selection
  useEffect(() => {
    if (!useAdvancedDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [useAdvancedDate]);

  // Filter records whenever any filter changes
  useEffect(() => {
    if (!allActiveStudentsActivityRecords) return;

    const filtered = allActiveStudentsActivityRecords.filter((record) => {
      // Filter by "Affiliated To"
      if (
        selectedAffiliatedTo?.toLowerCase() !== "all" &&
        record.affiliatedTo !== selectedAffiliatedTo
      ) {
        return false;
      }

      // Filter by "Project"
      if (
        selectedProject?.toLowerCase() !== "all" &&
        record.projectName !== selectedProject
      ) {
        return false;
      }

      // Filter by "Batch"
      if (
        selectedBatch?.toLowerCase() !== "all" &&
        record.batchName !== selectedBatch
      ) {
        return false;
      }

      // Date Filtering
      if (useAdvancedDate) {
        const recordDate = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");
        return recordDate >= startDate && recordDate <= endDate;
      } else {
        const recordMonth = dayjs(record.utcDate)
          .tz(timeZone)
          .format("YYYY-MM");
        return recordMonth === selectedMonth;
      }
    });

    setFilteredRecords(filtered);
    setfilteredRecordCount(filtered?.length);
  }, [
    allActiveStudentsActivityRecords,
    selectedAffiliatedTo,
    selectedProject,
    selectedBatch,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
  ]);

  // loaded
  useEffect(() => {
    if (studentRecord) {
      setloaded(true);
      dispatch(fetchAllBatches());
      dispatch(fetchAllProjects());
    }
  }, [studentRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="w-full">
      {/* header */}
      <div className="header w-full">
        {/* Top Filters */}
        <div className="topheader w-full grid grid-cols-4 gap-3 mt-3">
          <Dropdown
            label="Affiliated to"
            options={affilatedToOptions}
            width="full"
            selected={selectedAffiliatedTo}
            onChange={(value) => {
              setselectedAffiliatedTo(value);
              setselectedProject("All");
            }}
          />
          <Dropdown
            label="Project"
            width="full"
            options={[
              "All",
              ...(allActiveProjects?.map((project) => project.name) || []),
            ]}
            disabled={selectedAffiliatedTo.toLowerCase() !== "school"}
            selected={selectedProject}
            onChange={setselectedProject}
          />
          <Dropdown
            label="Batch"
            width="full"
            options={[
              "All",
              ...(filteredBatches?.map((batch) => batch.batchName) || []),
            ]}
            selected={selectedBatch}
            onChange={setselectedBatch}
          />
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            disabled={useAdvancedDate}
            onChange={(e) => setselectedMonth(e.target.value)}
          />
        </div>

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
        <div className="bottom-header mt-2 grid grid-cols-4 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            disabled={!useAdvancedDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            disabled={!useAdvancedDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Showing text and Export button */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <span className="text-sm text-gray-600">{showingText}</span>
        <Button
          onClick={exportToExcel}
          variant="contained"
          color="success"
          disabled={filteredRecordCount === 0}
          startIcon={<DownloadIcon />}
        >
          Export to Excel
        </Button>
      </div>

      {/* Filtered Records Table */}
      <div className="mt-2 border rounded-md">
        <div className="table-headings mb-2 grid gap-2 grid-cols-[70px,repeat(7,1fr)] w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Date
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Study Topic
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Batch
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Attendance
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Remark
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Status
          </span>
        </div>

        {/* loading */}
        {allStudentsActivityRecordsLoading && (
          <div className="bg-white rounded-md  flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
            <CircularProgress />
            <span className="mt-2">Loading records...</span>
          </div>
        )}

        {/* no records */}
        {!allStudentsActivityRecordsLoading && filteredRecords?.length == 0 && (
          <p className="w-full py-4 flex items-center justify-center">
            <BrowserNotSupportedIcon />
            <span className="ml-2">No records found</span>
          </p>
        )}

        {/* record list */}
        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {!allStudentsActivityRecordsLoading &&
            filteredRecords?.length > 0 &&
            filteredRecords
              .slice(
                (currentPage - 1) * recordsPerPage,
                currentPage * recordsPerPage
              )
              .map((record: any, index: any) => {
                const serialNumber =
                  (currentPage - 1) * recordsPerPage + index + 1;
                return (
                  <div
                    key={record?._id}
                    className="grid grid-cols-[70px,repeat(7,1fr)] gap-2 border-b border-gray-200 py-3  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-center text-xs text-gray-600">
                      {serialNumber}
                    </span>
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/activityrecords/${
                        record?._id
                      }`}
                      className="text-left text-xs text-gray-600 underline hover:text-blue-600"
                    >
                      {dayjs(record.utcDate)
                        .tz(timeZone)
                        .format("DD MMMM, YYYY, ddd")}
                    </Link>
                    <div className="text-left col-span-2 text-xs text-gray-600 flex items-center gap-1 flex-wrap">
                      {record?.studentRecords[0]?.studyTopics?.map(
                        (topic: any, index: any) => {
                          return (
                            <span
                              className="border border-gray-400 px-2 py-0.5 rounded-full w-max"
                              key={topic + " " + index}
                            >
                              {topic}
                            </span>
                          );
                        }
                      )}
                    </div>
                    <span className="text-left text-xs text-gray-600">
                      {record?.batchName}
                    </span>
                    <span className="text-left text-xs text-gray-600 px-2 rounded">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          record?.studentRecords[0]?.attendance?.toLowerCase() ===
                          "present"
                            ? "bg-green-400 text-white"
                            : record?.studentRecords[0]?.attendance?.toLowerCase() ===
                              "absent"
                            ? "bg-red-400 text-white"
                            : record?.studentRecords[0]?.attendance?.toLowerCase() ===
                              "holiday"
                            ? "bg-gray-400 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {record?.studentRecords[0]?.attendance || "N/A"}
                      </span>
                    </span>
                    <span className="text-left text-xs text-gray-600">
                      {record?.studentRecords[0]?.remark || "N/A"}
                    </span>
                    <div className="text-left flex items-center text-xs text-gray-600">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          record?.studentRecords[0]?.completedStatus
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-xs">
                        {record?.studentRecords[0]?.completedStatus
                          ? "Completed"
                          : "Incomplete"}
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(filteredRecordCount / recordsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default StudentActivityRecords;
