import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import { fetchAllBatches } from "@/redux/allListSlice";
import { fetchAllTrainersActivityRecords } from "@/redux/trainerHistorySlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Pagination, Stack } from "@mui/material";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const UserActivityRecords = ({ userRecord }: any) => {
  // Redux hooks
  const dispatch = useDispatch<any>();

  // Selectors
  const { allActiveTrainersActivityRecords } = useSelector(
    (state: any) => state.trainerHistoryReducer
  );
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
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [recordsPerPage] = useState(1);

  const handlePageChange = (event, value) => {
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
    if (!allActiveTrainersActivityRecords) return;

    const filtered = allActiveTrainersActivityRecords.filter((record) => {
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

      {/* Filtered Records Table */}
      <div className="mt-4">
        <div className="table-headings  mb-2 grid gap-2 grid-cols-[70px,repeat(6,1fr)] w-full bg-gray-200">
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
            Trainer role
          </span>
        </div>

        {/* record list */}
        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {filteredRecords.map((record: any) => {
            // const serialNumber = (currentPage - 1) * recordsPerPage + index + 1;
            const serialNumber = 1;
            return (
              <Link
                key={record?._id}
                href={`/${session?.data?.user?.role?.toLowerCase()}/activityrecords/${
                  record?._id
                }`}
                className="grid grid-cols-[70px,repeat(6,1fr)] gap-2  border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="py-3 text-center text-sm  text-gray-600">
                  {serialNumber}
                </span>
                <span className="py-3 text-left text-sm  text-gray-600">
                  {dayjs(record.utcDate).tz(timeZone).format("DD MMMM, YYYY")}
                </span>
                <span className="py-3 text-left col-span-2 text-xs  text-gray-600">
                  {record?.mainStudyTopic}
                </span>
                <span className="py-3 text-left text-sm  text-gray-600">
                  {record?.batchName}
                </span>
                <span className="py-3 text-left text-sm  text-gray-600">
                  {record?.trainerPresentStatus || "N/A"}
                </span>
                <span className="py-3 text-left text-sm  text-gray-600">
                  {record?.trainerRole ? record?.trainerRole : "N/A"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(filteredRecordCount / recordsPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default UserActivityRecords;
