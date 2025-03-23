import React, { useEffect, useRef, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrainerHistoryList from "./TrainerHistoryList";
import { useSession } from "next-auth/react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Checkbox, FormControlLabel, Pagination, Stack } from "@mui/material";
import Dropdown from "@/components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBatches } from "@/redux/allListSlice";
import {
  fetchAllTrainersActivityRecords,
  filterAllTrainersActivityRecords,
} from "@/redux/trainerHistorySlice";
import Input from "@/components/Input";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const TrainerHistory = () => {
  //getnepali date
  const getTodaysNepaliDate = () => dayjs().tz(timeZone).format("YYYY-MM-DD");

  // dispatch
  const dis = useDispatch<any>();

  //use selector
  const { allActiveBatches } = useSelector(
    (state: any) => state.allListReducer
  );
  const {
    allActiveTrainersActivityRecords,
    allFilteredActiveTrainersActivityRecords,
    allTrainersActivityRecordsLoading,
  } = useSelector((state: any) => state.trainerHistoryReducer);

  // session
  const { data: sessionData } = useSession();
  // ref
  const fetched = useRef(false); // To prevent multiple fetches

  const [totalActivityRecords, settotalActivityRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [activityRecordsPerPage] = useState(7);
  const [selectedBatchName, setselectedBatchName] = useState("All");
  const [selectedDate, setselectedDate] = useState(getTodaysNepaliDate());
  const [useDateFilter, setuseDateFilter] = useState(false);

  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // filter activity records list
  useEffect(() => {
    let tempfilteredActivityRecordsList =
      selectedBatchName.toLowerCase() === "all"
        ? allActiveTrainersActivityRecords
        : allActiveTrainersActivityRecords.filter(
            (activityRecord: any) =>
              activityRecord.batchName.toLowerCase() ==
              selectedBatchName.toLowerCase()
          );
    // Apply date filtering only if useDateFilter is true
    if (useDateFilter && selectedDate) {
      tempfilteredActivityRecordsList = tempfilteredActivityRecordsList.filter(
        (activityRecord: any) => {
          // Convert `selectedDate` and `nepaliDate` to Nepali timezone
          const selectedDateNepali = dayjs(selectedDate)
            .tz(timeZone)
            .format("YYYY-MM-DD");

          const recordNepaliDate = dayjs(activityRecord?.nepaliDate)
            .tz(timeZone)
            .format("YYYY-MM-DD");

          return selectedDateNepali == recordNepaliDate;
        }
      );
    }

    // Sort by createdAt descending
    tempfilteredActivityRecordsList = [...tempfilteredActivityRecordsList].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    settotalActivityRecords(tempfilteredActivityRecordsList?.length);
    setCurrentPage(1);
    dis(filterAllTrainersActivityRecords(tempfilteredActivityRecordsList));
  }, [selectedBatchName, selectedDate, useDateFilter]);

  // get intial trainers activity records and batch list
  useEffect(() => {
    if (!fetched.current && sessionData) {
      console.log("Fetching data...");
      dis(
        fetchAllTrainersActivityRecords({ trainerId: sessionData?.user?._id })
      );
      dis(fetchAllBatches());
      fetched.current = true; // Mark as fetched
    }
  }, [sessionData]);

  return (
    <div className="flex w-full ">
      <div className="requestForm flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        {/* title */}
        <p className="text-2xl font-bold flex items-center">
          <AssignmentIcon sx={{ fontSize: "2rem" }} />
          <span className="ml-1">Activity History</span>
        </p>
        {/* batchlist dropdown */}
        <div className="approvestatus-date mt-4 flex items-end gap-4 ">
          <Dropdown
            label="Batch"
            options={[
              "All",
              ...allActiveBatches?.map((batch: any) => batch?.batchName),
            ]}
            selected={selectedBatchName}
            onChange={setselectedBatchName}
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
              type="date"
              value={selectedDate}
              onChange={(e) => setselectedDate(e.target.value)}
            />
            <button
              className="ml-2 pb-2"
              title="Reset date"
              onClick={() => setselectedDate(getTodaysNepaliDate())}
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
            {allFilteredActiveTrainersActivityRecords?.length}
          </p>
        </div>
        {/* trainer history list */}
        <TrainerHistoryList
          loading={allTrainersActivityRecordsLoading}
          filteredTrainersActivityRecords={
            allFilteredActiveTrainersActivityRecords
          }
          activityRecordsPerPage={activityRecordsPerPage}
          currentPage={currentPage}
        />
        {/* pagination */}
        <Stack spacing={2} className="mx-auto w-max mt-7">
          <Pagination
            count={Math.ceil(
              allFilteredActiveTrainersActivityRecords?.length /
                activityRecordsPerPage
            )} // Total pages
            page={currentPage} // Current page
            onChange={handlePageChange} // Handle page change
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );
};

export default TrainerHistory;
