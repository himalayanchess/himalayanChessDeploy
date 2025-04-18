import Dropdown from "@/components/Dropdown";
import LeaveApprovalFilterComponent from "@/components/filtercomponents/LeaveApprovalFilterComponent";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import React, { useEffect, useState } from "react";
import LeaveApprovalList from "./LeaveApprovalList";
import { Pagination, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllLeaveRequests,
  filterLeaveRequests,
} from "@/redux/leaveApprovalSlice";
import { fetchAllTrainers } from "@/redux/allListSlice";

const LeaveApproval = () => {
  // dispatch
  const dispatch = useDispatch<any>();

  // useselector
  const {
    allFilteredLeaveRequests,
    allLeaveRequests,
    allLeaveRequestsLoading,
  } = useSelector((state: any) => state.leaveApprovalReducer);
  // get all users form alnother reduer (slice)
  const { allActiveTrainerList } = useSelector(
    (state: any) => state.allListReducer
  );

  // state vars
  const [selectedApprovalStatus, setselectedApprovalStatus] = useState("All");
  const [selectedTrainer, setselectedTrainer] = useState("None");
  const [totalLeaveRequests, settotalLeaveRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [leaveRequestsPerPage] = useState(7);

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // filter leave requests based on conditions and diaptach the array
  useEffect(() => {
    let tempFilteredLeaveRequests =
      selectedApprovalStatus.toLowerCase() === "all"
        ? allLeaveRequests
        : allLeaveRequests.filter(
            (request: any) =>
              request.approvalStatus.toLowerCase() ==
              selectedApprovalStatus.toLowerCase()
          );
    // sort by trainer name
    if (selectedTrainer?.toLowerCase() !== "none") {
      tempFilteredLeaveRequests = tempFilteredLeaveRequests.filter(
        (request: any) => request.trainerName === selectedTrainer
      );
    }
    // cant directly update redux state
    //make shallow copy by adding slice()
    tempFilteredLeaveRequests = tempFilteredLeaveRequests
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // update total leave request count
    settotalLeaveRequests(tempFilteredLeaveRequests?.length);
    setCurrentPage(1);
    // update redux state
    dispatch(filterLeaveRequests(tempFilteredLeaveRequests));
  }, [selectedApprovalStatus, selectedTrainer]);

  // get intial all leave requests
  // it is used in leaveapprovallist itself (useSelector in leaveaprvallist)
  useEffect(() => {
    dispatch(fetchAllLeaveRequests());
    dispatch(fetchAllTrainers());
  }, []);

  return (
    <div className="flex w-full ">
      <div className="requestForm flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        <p className="text-2xl font-bold flex items-center">
          <LuggageOutlinedIcon sx={{ fontSize: "2rem" }} />
          <span className="ml-1">Leave Approval</span>
        </p>
        {/* header */}
        <div className="header mt-2 flex items-end gap-5">
          <div className="approvestatus">
            <Dropdown
              label="Status"
              options={["All", "Pending", "Approved", "Rejected"]}
              selected={selectedApprovalStatus}
              onChange={setselectedApprovalStatus}
            />
          </div>
          {/* select trainer */}
          <div className="select-trainer ">
            <Dropdown
              label="Trainer"
              // add None to first element in array
              options={[
                "None",
                ...allActiveTrainerList?.map((trainer: any) => trainer?.name),
              ]}
              selected={selectedTrainer}
              onChange={setselectedTrainer}
            />
          </div>
          {/* totalLeaveRequests count */}
          <p className="bg-gray-400 text-white px-3 py-1.5 text-lg font-semibold rounded-md">
            {totalLeaveRequests}
          </p>
        </div>
        {/* leave approval list */}
        <LeaveApprovalList
          allFilteredLeaveRequests={allFilteredLeaveRequests}
          currentPage={currentPage}
          leaveRequestsPerPage={leaveRequestsPerPage}
          allLeaveRequestsLoading={allLeaveRequestsLoading}
        />

        {/* pagination */}
        <Stack spacing={2} className="mx-auto w-max mt-7">
          <Pagination
            count={Math.ceil(
              allFilteredLeaveRequests?.length / leaveRequestsPerPage
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

export default LeaveApproval;
