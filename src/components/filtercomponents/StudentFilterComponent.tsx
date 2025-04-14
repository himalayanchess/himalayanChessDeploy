import React, { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Divider, FormControlLabel, Modal, Radio } from "@mui/material";

const FilterComponent = ({
  selectedActiveStatus,
  setselectedActiveStatus,
}: any) => {
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
        className="filter-button border border-gray-300 rounded-md px-3  flex items-center cursor-pointer"
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
        <Box className="w-[30%] h-max p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
          <h1 className="text-lg font-bold">Filters</h1>
          <Divider sx={{ margin: ".6rem 0" }} />
          {selectedActiveStatus && (
            <div className="flex flex-col">
              <p className="font- text-md">Active Status:</p>
              <div className="radio-buttons flex">
                <FormControlLabel
                  control={
                    <Radio
                      size="small"
                      checked={selectedActiveStatus === "active"}
                      onChange={() => {
                        setselectedActiveStatus("active");
                        handleFilterModalClose();
                      }}
                      color="default"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Radio
                      size="small"
                      checked={selectedActiveStatus === "inactive"}
                      onChange={() => {
                        setselectedActiveStatus("inactive");
                        handleFilterModalClose();
                      }}
                      color="default"
                    />
                  }
                  label="Inactive"
                />
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default FilterComponent;
