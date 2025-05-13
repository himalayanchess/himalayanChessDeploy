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
import { fetchAllTrainers, getAllBranches } from "@/redux/allListSlice";
import { useSession } from "next-auth/react";

const LeaveApproval = () => {
  // dispatch
  const dispatch = useDispatch<any>();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // useselector
  const {
    allFilteredLeaveRequests,
    allLeaveRequests,
    allLeaveRequestsLoading,
  } = useSelector((state: any) => state.leaveApprovalReducer);
  // get all users form alnother reduer (slice)
  const { allActiveTrainerList, allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  // state vars
  const [selectedApprovalStatus, setselectedApprovalStatus] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  const [selectedUser, setselectedUser] = useState("All");
  const [totalLeaveRequests, settotalLeaveRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [leaveRequestsPerPage] = useState(7);

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * leaveRequestsPerPage + 1;
  const endItem = Math.min(
    currentPage * leaveRequestsPerPage,
    totalLeaveRequests
  );
  const showingText = `Showing ${startItem}-${endItem} of ${totalLeaveRequests}`;

  // filter leave requests based on conditions and diaptach the array
  useEffect(() => {
    let tempFilteredLeaveRequests =
      selectedApprovalStatus?.toLowerCase() === "all"
        ? allLeaveRequests
        : allLeaveRequests.filter(
            (request: any) =>
              request.approvalStatus.toLowerCase() ==
              selectedApprovalStatus?.toLowerCase()
          );

    // filter by branch
    tempFilteredLeaveRequests =
      selectedBranch?.toLowerCase() === "all"
        ? tempFilteredLeaveRequests
        : tempFilteredLeaveRequests.filter(
            (request: any) =>
              request.branchName.toLowerCase() == selectedBranch?.toLowerCase()
          );

    // sort by trainer name
    if (selectedUser?.toLowerCase() !== "all") {
      tempFilteredLeaveRequests = tempFilteredLeaveRequests.filter(
        (request: any) =>
          request.userName?.toLowerCase() === selectedUser?.toLowerCase()
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
  }, [allLeaveRequests, selectedApprovalStatus, selectedBranch, selectedUser]);

  // if affiliated to changes then reset  dropdown
  useEffect(() => {
    // Check if the user is a superadmin or global admin
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // Only reset if it's a superadmin or global admin
    if (isSuperOrGlobalAdmin) {
      setselectedUser("All");
    }
  }, [selectedBranch, session?.data?.user]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // get intial all leave requests
  // it is used in leaveapprovallist itself (useSelector in leaveaprvallist)
  useEffect(() => {
    dispatch(fetchAllLeaveRequests());
    dispatch(fetchAllTrainers());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full ">
      <div className="requestForm flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        <p className="text-3xl  flex items-center">
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
          {/* Branch */}
          <div className="select-branch ">
            <Dropdown
              label="Branch"
              // add All to first element in array
              options={[
                "All",
                ...(allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                ) || []),
              ]}
              disabled={!isSuperOrGlobalAdmin}
              selected={selectedBranch}
              onChange={setselectedBranch}
            />
          </div>
          {/* select trainer */}
          <div className="select-trainer ">
            <Dropdown
              label="Trainer"
              // add All to first element in array
              options={[
                "All",
                ...allActiveTrainerList?.map((trainer: any) => trainer?.name),
              ]}
              selected={selectedUser}
              onChange={setselectedUser}
            />
          </div>
          {/* totalLeaveRequests count */}
          <span className="text-sm text-gray-600">{showingText}</span>
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
            count={Math.ceil(totalLeaveRequests / leaveRequestsPerPage)} // Total pages
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
