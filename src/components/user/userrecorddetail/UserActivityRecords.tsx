import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";

import { fetchAllBatches } from "@/redux/allListSlice";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Box, Button, Divider, Modal, Pagination, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import { exportTrainerActivityRecordsToExcel } from "@/helpers/exportToExcel/exportTrainerActivityRecordsToExcel";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const UserActivityRecords = ({ userRecord }: any) => {
  // Redux hooks
  const dispatch = useDispatch<any>();

  // Selectors
  const {
    allActiveTrainersActivityRecords,
    allTrainersActivityRecordsLoading,
  } = useSelector((state: any) => state.trainerHistoryReducer);
  const { allActiveProjects, allActiveBatches } = useSelector(
    (state: any) => state.allListReducer
  );

  // session
  const session = useSession();

  // Options
  const affilatedToOptions = ["All", "HCA", "School"];

  // Default values
  const defaultMonth = dayjs().tz(timeZone).format("YYYY-MM");
  const defaultStartDate = dayjs()
    .tz(timeZone)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const defaultEndDate = dayjs().tz(timeZone).format("YYYY-MM-DD");

  // State variables
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

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Fetch initial data
  useEffect(() => {
    if (userRecord) {
      setloaded(true);
      dispatch(fetchAllTrainersActivityRecords({ trainerId: userRecord?._id }));
      dispatch(fetchAllBatches());
    }
  }, [userRecord]);

  // Filter batches based on "Affiliated To" and "Project"
  useEffect(() => {
    let tempFilteredBatches = allActiveBatches.slice();

    if (selectedAffiliatedTo.toLowerCase() !== "all") {
      tempFilteredBatches = tempFilteredBatches.filter(
        (batch: any) =>
          batch?.affiliatedTo.toLowerCase() ===
          selectedAffiliatedTo.toLowerCase()
      );
    }

    if (
      selectedAffiliatedTo.toLowerCase() === "school" &&
      selectedProject.toLowerCase() !== "all"
    ) {
      tempFilteredBatches = tempFilteredBatches.filter(
        (batch: any) =>
          batch?.projectName?.toLowerCase() === selectedProject?.toLowerCase()
      );
    }

    setFilteredBatches(tempFilteredBatches || []);
  }, [selectedAffiliatedTo, allActiveBatches, selectedProject]);

  //

  // Reset start and end date when toggling advanced date selection
  useEffect(() => {
    if (!useAdvancedDate) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [useAdvancedDate]);

  // Filter records whenever any filter changes
  useEffect(() => {
    if (!allActiveTrainersActivityRecords) return;

    const filtered = allActiveTrainersActivityRecords.filter((record: any) => {
      // Filter by "Affiliated To"
      if (
        selectedAffiliatedTo !== "All" &&
        record.affiliatedTo !== selectedAffiliatedTo
      ) {
        return false;
      }

      // Filter by "Project"
      if (selectedProject !== "All" && record.projectName !== selectedProject) {
        return false;
      }

      // Filter by "Batch"
      if (selectedBatch !== "All" && record.batchName !== selectedBatch) {
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
    allActiveTrainersActivityRecords,
    selectedAffiliatedTo,
    selectedProject,
    selectedBatch,
    useAdvancedDate,
    startDate,
    endDate,
    selectedMonth,
  ]);

  // Calculate showing text
  const startItem = (currentPage - 1) * recordsPerPage + 1;
  const endItem = Math.min(currentPage * recordsPerPage, filteredRecordCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredRecordCount}`;

  const exportToExcel = () => {
    exportTrainerActivityRecordsToExcel(filteredRecords, userRecord?.name);
  };

  if (!loaded) return <div></div>;

  return (
    <div className="w-full">
      <div className="header w-full">
        {/* Top Filters */}
        <div className="topheader w-full grid grid-cols-4 gap-3 mt-3">
          <Dropdown
            label="Affiliated to"
            options={affilatedToOptions}
            width="full"
            selected={selectedAffiliatedTo}
            onChange={(value: any) => {
              setselectedAffiliatedTo(value);
              setselectedProject("All");
              setselectedBatch("All");
            }}
          />
          <Dropdown
            label="Project"
            width="full"
            options={[
              "All",
              ...(allActiveProjects?.map((project: any) => project.name) || []),
            ]}
            disabled={selectedAffiliatedTo.toLowerCase() !== "school"}
            selected={selectedProject}
            onChange={(value: any) => {
              setselectedProject(value);
              setselectedBatch("All");
            }}
          />
          <Dropdown
            label="Batch"
            width="full"
            options={[
              "All",
              ...(filteredBatches?.map((batch: any) => batch.batchName) || []),
            ]}
            selected={selectedBatch}
            onChange={setselectedBatch}
          />
          <Input
            label="Month"
            type="month"
            value={selectedMonth}
            disabled={useAdvancedDate}
            onChange={(e: any) => setselectedMonth(e.target.value)}
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
            onChange={(e: any) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            disabled={!useAdvancedDate}
            onChange={(e: any) => setEndDate(e.target.value)}
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
      <div className="mt-2">
        <div className="table-headings mb-2 grid gap-2 grid-cols-[70px,repeat(7,1fr)] w-full bg-gray-200">
          <span className="py-3 text-center text-sm font-bold text-gray-600">
            SN
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Date
          </span>
          <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
            Main Study Topic
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Batch
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Attendance
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Trainer role
          </span>
          <span className="py-3 text-left text-sm font-bold text-gray-600">
            Materials
          </span>
        </div>

        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {/* loading */}
          {allTrainersActivityRecordsLoading && (
            <div className="bg-white rounded-md  flex-1 h-full flex flex-col items-center justify-center w-full px-14 py-7 ">
              <CircularProgress />
              <span className="mt-2">Loading records...</span>
            </div>
          )}

          {/* no records */}
          {!allTrainersActivityRecordsLoading &&
            filteredRecords?.length == 0 && (
              <p className="w-full py-4 flex items-center justify-center">
                <BrowserNotSupportedIcon />
                <span className="ml-2">No records found</span>
              </p>
            )}

          {/* record list */}
          {!allTrainersActivityRecordsLoading &&
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
                    className={`grid grid-cols-[70px,repeat(7,1fr)] gap-2 border-b border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150
                    ${
                      record?.isPlayDay ||
                      record?.mainStudyTopic?.toLowerCase() == "play"
                        ? "bg-yellow-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="py-3 text-center text-xs text-gray-600">
                      {serialNumber}
                    </span>
                    <Link
                      href={`/${session?.data?.user?.role?.toLowerCase()}/activityrecords/${
                        record?._id
                      }`}
                      className="py-3 text-left text-xs text-gray-600 underline hover:text-blue-600"
                    >
                      {dayjs(record.utcDate)
                        .tz(timeZone)
                        .format("DD MMMM, YYYY")}
                    </Link>
                    <span className="py-3 text-left col-span-2 text-xs text-gray-600">
                      {record?.userPresentStatus?.toLowerCase() == "holiday"
                        ? "N/A"
                        : record?.mainStudyTopic}
                    </span>
                    <span className="py-3 text-left text-xs text-gray-600">
                      {record?.batchName}
                    </span>
                    <span className="py-3 text-left text-xs text-gray-600 px-2 rounded">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          record?.userPresentStatus?.toLowerCase() === "present"
                            ? "bg-green-400 text-white"
                            : record?.userPresentStatus?.toLowerCase() ===
                              "absent"
                            ? "bg-red-400 text-white"
                            : record?.userPresentStatus?.toLowerCase() ===
                              "holiday"
                            ? "bg-gray-400 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {record?.userPresentStatus || "N/A"}
                      </span>
                    </span>
                    <span className="py-3 text-left text-xs text-gray-600">
                      {record?.trainerRole ? record?.trainerRole : "N/A"}
                    </span>
                    <div className="text-left flex items-center text-xs text-gray-600">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleviewStudyMaterialsModalOpen(record)
                        }
                      >
                        View
                      </Button>
                      <span className="ml-2 text-xs bg-gray-400 text-white font-bold h-[20px] w-[20px] flex items-center justify-center rounded-full">
                        {record?.studyMaterials?.length || "0"}
                      </span>
                    </div>
                  </div>
                );
              })}

          {/* view study materials modal */}
          <Modal
            open={viewStudyMaterialsModalOpen}
            onClose={handleviewStudyMaterialsModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] max-h-[60%] p-4 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
              <h1 className="text-xl font-bold">Study Materials</h1>
              <Divider sx={{ margin: ".3rem 0" }} />
              <div className="materials mt-2 flex flex-col gap-3">
                {selectedRecord?.studyMaterials?.length === 0 ? (
                  <p className="text-gray-500">No study materials</p>
                ) : (
                  selectedRecord?.studyMaterials?.map(
                    (material: any, index: any) => (
                      <Link
                        href={`${material?.fileUrl}`}
                        target="_blank"
                        key={index}
                        className="studyMaterial flex items-center justify-between cursor-pointer bg-gray-50 border px-3 py-2 rounded-md border-gray-00 transition-all duration-150 ease hover:bg-gray-200"
                      >
                        <div className="title flex items-center">
                          <InsertDriveFileIcon sx={{ color: "gray" }} />
                          <p className="ml-2 text-sm">{material?.fileName}</p>
                        </div>
                        <div className="view-button text-xs mr-2 border border-gray-400 rounded-full px-3 py-0.5">
                          View
                        </div>
                      </Link>
                    )
                  )
                )}
              </div>
            </Box>
          </Modal>
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

export default UserActivityRecords;
