import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { fetchAssignedClasses } from "@/redux/assignedClassesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";
import dayjs from "dayjs";

const AssignedClasses = ({ selectedDate }) => {
  const dis = useDispatch<any>();
  const { allAssignedClasses, status, error } = useSelector(
    (state) => state.assignedClassesReducer
  );
  const [filteredAssignedClasses, setfilteredAssignedClasses] = useState([]);
  const [editAssignedClassModalOpen, seteditAssignedClassModalOpen] =
    useState(false);

  //handleEditAssignedModalClose
  function handleEditAssignedModalClose() {
    seteditAssignedClassModalOpen(false);
  }
  //handleEditAssignedModalOpen
  function handleEditAssignedModalOpen() {
    seteditAssignedClassModalOpen(true);
  }

  // filter assigned classes according to selected date (YYYY-MM-DD) part only
  useEffect(() => {
    // Convert selectedDate to UTC ISO format (ignoring time)
    const selectedDateISOString = dayjs(selectedDate).format("YYYY-MM-DD"); // Format as YYYY-MM-DD

    // Filter assignedClasses based on matching dates
    const tempFilteredAssignedClasses = allAssignedClasses.filter(
      (assignedClass) => {
        // Convert assignedClass.date to YYYY-MM-DD format using dayjs
        const assignedClassDate = dayjs(assignedClass?.date).format(
          "YYYY-MM-DD"
        );

        // Compare only the date part
        return assignedClassDate === selectedDateISOString;
      }
    );

    console.log(tempFilteredAssignedClasses); // Log filtered classes
    setfilteredAssignedClasses(tempFilteredAssignedClasses);
  }, [selectedDate, allAssignedClasses]);

  useEffect(() => {
    dis(fetchAssignedClasses());
  }, []);
  return (
    <div className="px-4  pb-4 h-full rounded-lg">
      <h1 className="text-lg font-bold mb-3">Assigned Classes</h1>

      <div className="assigned-classes-list flex flex-col gap-3">
        {filteredAssignedClasses.length == 0 ? (
          <p>No assigned Classes</p>
        ) : (
          filteredAssignedClasses.map((assignedClass) => {
            return (
              <div key={assignedClass?._id}>
                <div
                  className={`py-2 px-3   ${
                    assignedClass?.affiliatedTo?.toLowerCase() == "hca"
                      ? " bg-blue-100 "
                      : " bg-gray-100 "
                  } shadow-sm rounded-md cursor-pointer hover:opacity-80`}
                  onClick={handleEditAssignedModalOpen}
                >
                  <p className="text-sm">{assignedClass?.batchName}</p>
                  <div className="trainer">
                    <AccountCircleIcon
                      sx={{ fontSize: "1rem", color: "gray" }}
                    />
                    <span className="ml-0.5 text-xs text-gray-500">
                      {assignedClass?.trainerName}
                    </span>
                  </div>
                </div>

                {/* modal */}
                <Modal
                  open={editAssignedClassModalOpen}
                  onClose={handleEditAssignedModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="flex items-center justify-center"
                >
                  <Box className="w-[50%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                    {/* add mode */}
                    <p>asdfsdaf</p>
                  </Box>
                </Modal>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignedClasses;
