import React, { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { Avatar, Button, Skeleton, Box, Modal, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Dropdown from "../Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches } from "@/redux/allListSlice";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const ViewAllAssignedClasses = ({
  countData,
  handleClose,
  modalOpen,
  todaysAssignedClasses,
}: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();
  // selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const affilatedToOptions = ["All", "HCA", "School"];
  const statusOptions = ["All", "Taken", "Not Taken"];
  // state vars
  // affilated to is initialized to all (because need to show all classes at first)
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  const [selectedClassStatus, setselectedClassStatus] = useState("All");
  const [filteredTodaysAssignedClasses, setfilteredTodaysAssignedClasses] =
    useState([]);

  // filter
  useEffect(() => {
    if (!todaysAssignedClasses) return;

    let filtered = todaysAssignedClasses;

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

    // filter by class status
    filtered =
      selectedClassStatus?.toLowerCase() === "all"
        ? filtered
        : selectedClassStatus?.toLowerCase() === "taken"
        ? filtered.filter(
            (record: any) => record.recordUpdatedByTrainer === true
          )
        : filtered.filter(
            (record: any) => record.recordUpdatedByTrainer === false
          );

    setfilteredTodaysAssignedClasses(filtered);
  }, [
    todaysAssignedClasses,
    selectedAffiliatedTo,
    selectedBranch,
    selectedClassStatus,
  ]);

  // Reset branch and class taken affiliated to  changes
  useEffect(() => {
    setselectedBranch("All");
    setselectedClassStatus("All");
  }, [selectedAffiliatedTo]);

  // showing text
  const showingText = `Showing ${filteredTodaysAssignedClasses?.length} records`;

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

  // fetch initla data
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => {
          handleClose();
          setselectedAffiliatedTo("All");
          setselectedBranch("All");
          setselectedClassStatus("All");
        }}
        aria-labelledby="todays-classes-modal-title"
        aria-describedby="todays-classes-modal-description"
        className="flex items-center justify-center"
      >
        <Box className="w-[80%] h-[80%] overflow-y-auto p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
          {/* Modal Header */}
          <div className="flex justify-between border-b pb-3 items-center w-full mb-2">
            <p className="font-semibold text-2xl  flex text-gray-500 items-center">
              <BookOpenCheck />
              <span className="ml-2">
                Todays assigned classes
                <span className="text-sm ml-2">
                  ({countData?.totalClasses}) classes
                </span>
              </span>
            </p>
            <Button
              onClick={() => {
                handleClose();
                setselectedAffiliatedTo("All");
                setselectedBranch("All");
                setselectedClassStatus("All");
              }}
              className="text-gray-500"
            >
              <CloseIcon />
            </Button>
          </div>

          {/* drop downs */}
          <div className="topheader w-full grid grid-cols-5 items-end mb-3 gap-3 mt-0">
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
              label="Class Status"
              options={statusOptions}
              selected={selectedClassStatus}
              onChange={setselectedClassStatus}
              width="full"
              disabled={!isSuperOrGlobalAdmin}
            />
            {/* count */}
            <span className="text-sm text-gray-600">{showingText}</span>
          </div>

          {/* assigned classes list */}
          <div className="overflow-y-auto  flex-1 h-full w-full border flex flex-col bg-white rounded-lg">
            {/* Table Headings */}
            <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(7,1fr)] gap-1 w-full bg-gray-200">
              <span className="py-3 text-center text-sm font-bold text-gray-600">
                SN
              </span>

              <span className="py-3  text-left text-sm font-bold text-gray-600">
                Batch Name
              </span>
              <span className="py-3  text-left text-sm font-bold text-gray-600">
                Affiliated To
              </span>
              <span className="py-3  text-left text-sm font-bold text-gray-600">
                Branch
              </span>
              <span className="py-3  text-left text-sm font-bold text-gray-600">
                Trainer
              </span>
              <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
                Course
              </span>
              <span className="py-3  text-left text-sm font-bold text-gray-600">
                Status
              </span>
            </div>

            {/* List of Records */}

            <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
              {filteredTodaysAssignedClasses?.length == 0 && (
                <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
                  <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
                  <p className="text-md">No records found</p>
                </div>
              )}
              {filteredTodaysAssignedClasses?.length != 0 &&
                filteredTodaysAssignedClasses?.map(
                  (activityRecord: any, index: any) => {
                    // serial number
                    const serialNumber = index + 1;

                    return (
                      <Link
                        href={`/${session?.data?.user?.role?.toLowerCase()}/activityrecords/${
                          activityRecord?._id
                        }`}
                        key={activityRecord?._id}
                        className={` grid grid-cols-[50px,repeat(7,1fr)] gap-1 py-3 border-b border-gray-200 items-center cursor-pointer transition-all ease duration-150
                  ${
                    activityRecord?.isPlayDay ||
                    activityRecord?.mainStudyTopic?.toLowerCase() === "play"
                      ? "bg-green-100"
                      : "hover:bg-gray-100"
                  }`}
                      >
                        <span className="text-xs text-center font-medium text-gray-600">
                          {serialNumber}
                        </span>
                        <span className=" text-left px-1 text-xs font-medium text-gray-600  ">
                          {activityRecord?.batchName}
                        </span>
                        <span className=" text-left px-1 text-xs font-medium text-gray-600">
                          {activityRecord?.affiliatedTo}
                        </span>
                        <span className=" text-left px-1 text-xs font-medium text-gray-600">
                          {activityRecord?.branchName || "N/A"}
                        </span>
                        <span className=" text-left px-1 text-xs font-medium text-gray-600">
                          {activityRecord?.trainerName}
                        </span>
                        <span className=" text-left col-span-2 px-1 text-xs font-medium text-gray-600">
                          {activityRecord?.courseName}
                        </span>
                        <span className="flex items-center text-left px-1 text-xs font-medium text-gray-600">
                          <span
                            className={`w-2 h-2 mr-2 rounded-full ${
                              activityRecord?.recordUpdatedByTrainer
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {activityRecord?.recordUpdatedByTrainer
                            ? "Taken"
                            : "Not Taken"}
                        </span>
                      </Link>
                    );
                  }
                )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewAllAssignedClasses;
