import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { fetchAssignedClasses } from "@/redux/assignedClassesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";
import dayjs from "dayjs";
import ViewAssignedClass from "./ViewAssignedClass";

const AssignedClasses = ({ selectedDate }) => {
  const dispatch = useDispatch<any>();
  const { allActiveAssignedClasses, status, error } = useSelector(
    (state) => state.assignedClassesReducer
  );

  const [selectedAssignedClass, setSelectedAssignedClass] = useState(null);
  const [filteredAssignedClasses, setFilteredAssignedClasses] = useState([]);
  const [editAssignedClassModalOpen, setEditAssignedClassModalOpen] =
    useState(false);

  // Open modal and set the selected class
  const handleEditAssignedModalOpen = (assignedClass) => {
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
    const selectedDateISOString = dayjs(selectedDate).format("YYYY-MM-DD");

    const tempFilteredAssignedClasses = allActiveAssignedClasses.filter(
      (assignedClass) => {
        const assignedClassDate = dayjs(assignedClass?.date).format(
          "YYYY-MM-DD"
        );
        return assignedClassDate === selectedDateISOString;
      }
    );

    console.log(tempFilteredAssignedClasses); // Log filtered classes for debugging
    setFilteredAssignedClasses(tempFilteredAssignedClasses);
  }, [selectedDate, allActiveAssignedClasses]);

  // Fetch assigned classes on component mount
  useEffect(() => {
    dispatch(fetchAssignedClasses());
  }, [dispatch]);

  return (
    <div className="px-4 pb-4 h-full rounded-lg">
      <h1 className="text-lg font-bold mb-3">Assigned Classes</h1>

      <div className="assigned-classes-list flex flex-col gap-3">
        {filteredAssignedClasses.length === 0 ? (
          <p>No assigned Classes</p>
        ) : (
          filteredAssignedClasses.map((assignedClass) => (
            <div key={assignedClass?._id}>
              <div
                className={`py-2 px-3 ${
                  assignedClass?.affiliatedTo?.toLowerCase() === "hca"
                    ? "bg-blue-100"
                    : "bg-gray-100"
                } shadow-sm rounded-md cursor-pointer hover:opacity-80`}
                onClick={() => handleEditAssignedModalOpen(assignedClass)} // Pass the assignedClass to the handler
              >
                <p className="text-sm">{assignedClass?.batchName}</p>

                <div className="trainer-attendance flex justify-between items-center">
                  <div className="trainer">
                    <AccountCircleIcon
                      sx={{ fontSize: "1rem", color: "gray" }}
                    />
                    <span className="ml-0.5 text-xs text-gray-500">
                      {assignedClass?.trainerName}
                    </span>
                  </div>
                  <p
                    className={`text-xs px-2 rounded-full py-0.5 w-max ${
                      assignedClass?.trainerPresentStatus?.toLowerCase() ==
                      "present"
                        ? " bg-green-400 text-white "
                        : assignedClass?.trainerPresentStatus?.toLowerCase() ==
                          "absent"
                        ? " bg-red-400 text-white "
                        : " bg-gray-400 text-white "
                    } `}
                  >
                    {assignedClass?.trainerPresentStatus}
                  </p>
                </div>
              </div>

              {/* Modal */}
              <Modal
                open={
                  editAssignedClassModalOpen &&
                  selectedAssignedClass?._id === assignedClass?._id
                } // Ensure modal is only open for the selected class
                onClose={handleEditAssignedModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[40%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
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
