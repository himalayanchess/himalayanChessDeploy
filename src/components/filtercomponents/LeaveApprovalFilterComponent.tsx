import { Box, Divider, Modal } from "@mui/material";
import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import Dropdown from "../Dropdown";

const LeaveApprovalFilterComponent = () => {
  const [filterModalOpen, setfilterModalOpen] = useState(false);

  // handle modal operations
  //handleFilterModalClose
  function handleFilterModalOpen() {
    setfilterModalOpen(true);
  }
  //handleFilterModalClose
  function handleFilterModalClose() {
    setfilterModalOpen(false);
  }
  return (
    <>
      <button
        onClick={handleFilterModalOpen}
        title="Filters"
        className="filter-button border border-gray-300 rounded-md ml-4 px-3 py-1.5 flex items-center cursor-pointer"
      >
        <FilterListIcon />
        <span className="ml-1 text-sm">Filters</span>
      </button>
      <Modal
        open={filterModalOpen}
        onClose={handleFilterModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex items-center justify-center"
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0,0,0,0.2)", // Make the backdrop transparent
          },
        }}
      >
        <Box className="w-[30%]  p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
          <h1 className="text-lg font-bold">
            <FilterListIcon />
            <span className="ml-2">Filters</span>
          </h1>
          <Divider sx={{ margin: ".6rem 0" }} />
          {/* select trainer */}
          <div className="select-trainer mt-2">
            <Dropdown
              label="Trainers"
              options={["All", "Pending", "Approved", "Rejected"]}
              width="full"
              // selected={selectedApprovalStatus}
              // onChange={setselectedApprovalStatus}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default LeaveApprovalFilterComponent;
