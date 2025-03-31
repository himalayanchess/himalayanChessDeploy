import React, { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Input from "../Input";
import { Checkbox, FormControlLabel, Pagination, Stack } from "@mui/material";
import Dropdown from "../Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActivityRecords,
  filterActivityRecords,
} from "@/redux/activityRecordSlice";
import ActivityRecordList from "./ActivityRecordList";
import { fetchAllBatches, fetchAllTrainers } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ActivityRecordComponent = () => {
  // dispatch
  const dispatch = useDispatch<any>();

  const getTodaysNepaliMonth = () => dayjs().tz(timeZone).format("YYYY-MM");

  //use selector
  const { allActiveBatches, allActiveTrainerList } = useSelector(
    (state: any) => state.allListReducer
  );

  const {
    allActiveActivityRecords,
    allFilteredActiveActivityRecords,
    allActivityRecordsLoading,
  } = useSelector((state: any) => state.activityRecordReducer);

  const [filteredActivityRecordCount, setfilteredActivityRecordCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [activityRecordsPerPage] = useState(7);
  const [selectedBatchName, setselectedBatchName] = useState("All");
  const [selectedTrainer, setselectedTrainer] = useState("All");
  const [selectedDate, setselectedDate] = useState(getTodaysNepaliMonth());
  const [useDateFilter, setuseDateFilter] = useState(false);

  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // filter activity records list
  useEffect(() => {
    // Filter by batch name
    let tempfilteredActivityRecordsList =
      selectedBatchName.toLowerCase() === "all"
        ? allActiveActivityRecords
        : allActiveActivityRecords.filter(
            (activityRecord: any) =>
              activityRecord.batchName.toLowerCase() ===
              selectedBatchName.toLowerCase()
          );

    // Filter by trainer name
    tempfilteredActivityRecordsList =
      selectedTrainer.toLowerCase() === "all"
        ? tempfilteredActivityRecordsList
        : tempfilteredActivityRecordsList.filter(
            (activityRecord: any) =>
              activityRecord.trainerName.toLowerCase() ===
              selectedTrainer.toLowerCase()
          );

    // Apply date filtering if useDateFilter is true
    if (useDateFilter && selectedDate) {
      tempfilteredActivityRecordsList = tempfilteredActivityRecordsList.filter(
        (activityRecord: any) => {
          // Convert `selectedDate` and `nepaliDate` to Nepali timezone
          const selectedDateNepali = dayjs(selectedDate)
            .tz(timeZone)
            .format("YYYY-MM");

          const recordNepaliDate = dayjs(activityRecord?.nepaliDate)
            .tz(timeZone)
            .format("YYYY-MM");

          return selectedDateNepali === recordNepaliDate;
        }
      );
    }

    // Sort by createdAt descending
    tempfilteredActivityRecordsList = [...tempfilteredActivityRecordsList].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setfilteredActivityRecordCount(tempfilteredActivityRecordsList?.length);
    setCurrentPage(1);
    dispatch(filterActivityRecords(tempfilteredActivityRecordsList));
  }, [selectedBatchName, selectedDate, selectedTrainer, useDateFilter]);

  useEffect(() => {
    dispatch(fetchAllActivityRecords());
    dispatch(fetchAllBatches());
    dispatch(fetchAllTrainers());
  }, []);

  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl font-medium text-gray-700">Activity Records</h2>
      <div className="activityrecord-header my-0 flex items-end justify-between">
        <div className="batch-date flex items-end gap-4 ">
          {/* batchlist dropdown */}
          <Dropdown
            label="Batch"
            options={[
              "All",
              ...allActiveBatches?.map((batch: any) => batch?.batchName),
            ]}
            selected={selectedBatchName}
            onChange={setselectedBatchName}
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
          />
          {/* date */}
          <div
            className={`date w-60 flex items-end ${
              useDateFilter
                ? " pointer-events-auto opacity-100 "
                : " pointer-events-none opacity-50 "
            }`}
          >
            <Input
              label="Date"
              type="month"
              value={selectedDate}
              onChange={(e) => setselectedDate(e.target.value)}
            />
            <button
              className="ml-2 pb-2"
              title="Reset date"
              onClick={() => setselectedDate(getTodaysNepaliMonth())}
            >
              <RestartAltIcon sx={{ fontSize: "1.8rem" }} />
            </button>
          </div>
          {/* use date filter boolean */}
          <div className="useDateFilter">
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDateFilter}
                  onChange={(e) => setuseDateFilter(e.target.checked)}
                  color="primary"
                />
              }
              label="Use Date Filter"
            />
          </div>
          {/* count */}
          <p className="px-2 py-1 mb-1 rounded-lg bg-gray-400 text-white">
            {Math.min(
              activityRecordsPerPage,
              allFilteredActiveActivityRecords?.length -
                (currentPage - 1) * activityRecordsPerPage
            )}{" "}
            of {allFilteredActiveActivityRecords?.length}
          </p>
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
