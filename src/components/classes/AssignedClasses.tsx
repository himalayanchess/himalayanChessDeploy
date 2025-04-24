import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { fetchAssignedClasses } from "@/redux/assignedClassesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";
import ViewAssignedClass from "./ViewAssignedClass";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Check, MapPinHouse, School, X } from "lucide-react";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AssignedClasses = ({ selectedDate }: any) => {
  const session = useSession();
  const dispatch = useDispatch<any>();
  const { allActiveAssignedClasses, allAssignedClassesLoading, status, error } =
    useSelector((state: any) => state.assignedClassesReducer);

  const [selectedAssignedClass, setSelectedAssignedClass] = useState<any>(null);
  const [filteredAssignedClasses, setFilteredAssignedClasses] = useState([]);
  const [editAssignedClassModalOpen, setEditAssignedClassModalOpen] =
    useState(false);

  // Open modal and set the selected class
  const handleEditAssignedModalOpen = (assignedClass: any) => {
    setSelectedAssignedClass(assignedClass);
    setEditAssignedClassModalOpen(true);
  };

  // Close modal
  const handleEditAssignedModalClose = () => {
    setSelectedAssignedClass(null);
    setEditAssignedClassModalOpen(false);
  };

  // Filter assigned classes according to selected date (YYYY-MM-DD format)
  useEffect(() => {
    const user = session?.data?.user;

    console.log("selected date passed from above", selectedDate);

    const selectedNepaliDateOnly = dayjs(selectedDate)
      .tz(timeZone)
      .startOf("day")
      .format("YYYY-MM-DD");

    let tempFilteredAssignedClasses = allActiveAssignedClasses.filter(
      (assignedClass: any) => {
        const assignedClassDate = dayjs(assignedClass?.nepaliDate).format(
          "YYYY-MM-DD"
        );
        return assignedClassDate == selectedNepaliDateOnly;
      }
    );

    // Step 2: Filter by branch only if user is not superadmin or not a global admin
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    if (!isSuperOrGlobalAdmin) {
      tempFilteredAssignedClasses = tempFilteredAssignedClasses.filter(
        (assignedClass: any) => assignedClass?.branchId === user?.branchId // safer than comparing by branchName
      );
    }

    console.log(tempFilteredAssignedClasses); // Log filtered classes for debugging
    setFilteredAssignedClasses(tempFilteredAssignedClasses);
  }, [selectedDate, allActiveAssignedClasses, session?.data?.user]);

  // Fetch assigned classes on component mount
  useEffect(() => {
    dispatch(fetchAssignedClasses());
  }, [dispatch]);

  return (
    <div className="px-4 pb-4 h-full flex flex-col rounded-lg">
      <h1 className="mb-3">
        <span className="text-lg font-bold ">Assigned Classes</span>
        <span className="text-sm ml-2">
          Showing {filteredAssignedClasses?.length || 0} records
        </span>
      </h1>

      <div className="assigned-classes-list flex-1 h-full overflow-y-auto flex flex-col gap-3">
        {allAssignedClassesLoading ? (
          <div className="w-full text-center my-6">
            <CircularProgress sx={{ color: "gray" }} />
            <p className="text-gray-500">Getting record</p>
          </div>
        ) : filteredAssignedClasses.length === 0 ? (
          <p>No assigned Classes</p>
        ) : (
          filteredAssignedClasses.map((assignedClass: any, index: any) => (
            <div key={assignedClass?._id}>
              <div
                className={`py-2 px-3 shadow-sm rounded-md cursor-pointer hover:opacity-80
          ${
            assignedClass?.isPlayDay
              ? "bg-green-100 border border-green-200"
              : assignedClass?.affiliatedTo?.toLowerCase() === "hca"
              ? "bg-blue-100"
              : "bg-gray-100"
          }`}
                onClick={() => handleEditAssignedModalOpen(assignedClass)}
              >
                <p className="text-sm">
                  {index + 1}. {assignedClass?.batchName}
                </p>
                {assignedClass?.affiliatedTo?.toLowerCase() == "hca" ? (
                  <p className="text-sm mt-1 flex items-center text-gray-600">
                    <MapPinHouse size={15} />
                    <span className="ml-1">{assignedClass?.branchName}</span>
                  </p>
                ) : (
                  <p className="text-sm mt-1 flex items-center text-gray-600">
                    <School size={15} />
                    <span className="ml-1">{assignedClass?.projectName}</span>
                  </p>
                )}
                {assignedClass?.recordUpdatedByTrainer ? (
                  <p className="text-sm flex items-center text-green-600">
                    <Check size={15} />
                    <span className="ml-1">Record updated by trainer</span>
                  </p>
                ) : (
                  <p className="text-sm flex items-center text-gray-600">
                    <X size={15} />
                    <span className="ml-1">Not updated by trainer</span>
                  </p>
                )}

                <div className="trainer-attendance flex justify-between items-center">
                  <div className="trainer flex items-center">
                    <AccountCircleIcon
                      sx={{ fontSize: "1rem", color: "gray" }}
                    />
                    <span className="ml-0.5 text-xs text-gray-500">
                      {assignedClass?.trainerName}
                    </span>
                  </div>

                  <div className="status-indicators flex items-center">
                    {assignedClass?.studentRecords?.length != 0 && (
                      <span className="mr-2 h-[10px] w-[10px] rounded-full bg-green-500"></span>
                    )}
                    <p
                      className={`text-xs px-2 rounded-full py-0.5 font-bold w-max ${
                        assignedClass?.userPresentStatus?.toLowerCase() ===
                        "present"
                          ? "bg-green-500 text-white"
                          : assignedClass?.userPresentStatus?.toLowerCase() ===
                            "absent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {assignedClass?.userPresentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <Modal
                open={
                  editAssignedClassModalOpen &&
                  selectedAssignedClass?._id === assignedClass?._id
                }
                onClose={handleEditAssignedModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[50%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  <ViewAssignedClass
                    assignedClass={selectedAssignedClass}
                    handleClose={handleEditAssignedModalClose}
                  />
                </Box>
              </Modal>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedClasses;
