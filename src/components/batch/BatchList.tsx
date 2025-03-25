import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import AddBatch from "./AddBatch";
import Link from "next/link";
const BatchList = ({
  allFilteredActiveBatches,
  currentPage,
  batchesPerPage,
}: any) => {
  console.log("inside batchlist", allFilteredActiveBatches);

  const [filteredBatches, setFilteredBatches] = useState<any>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [batchListLoading, setbatchListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //edit modal
  const [selectedEditBatch, setselectedEditBatch] = useState(null);
  const [editModalOpen, seteditModalOpen] = useState(false);
  // batch edited
  const [batchEdited, setbatchEdited] = useState(false);
  const [editedBatch, seteditedBatch] = useState(null);

  // edit modal open
  function handleEditModalOpen(batch) {
    console.log(batch);
    setselectedEditBatch(batch);
    seteditModalOpen(true);
  }

  // edit modal close
  function handleEditModalClose() {
    seteditModalOpen(false);
  }

  function handleDeleteModalOpen(batchId, batchName) {
    setSelectedBatchId(batchId);
    setSelectedBatchName(batchName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  // handleBatchDelete
  // async function handleBatchDelete(id) {
  //   try {
  //     const { data: resData } = await axios.post("/api/batches/deleteBatch", {
  //       batchId: id,
  //     });
  //     let tempAllBatches = [...allBatches];
  //     tempAllBatches = tempAllBatches.map((batch) => {
  //       if (batch._id == id) {
  //         return { ...batch, activeStatus: false };
  //       } else {
  //         return batch;
  //       }
  //     });
  //     setallBatches(tempAllBatches);
  //     handleDeleteModalClose();
  //     console.log(resData);
  //   } catch (error) {
  //     console.log("error in handleBatchDelete", error);
  //   }
  // }
  // filtered effect
  // useEffect(() => {
  //   // add new batch
  //   let tempallBatches = [...allBatches];

  //   // Sort batches by createdAt in descending order (latest first)
  //   const sortedBatches = tempallBatches.sort(
  //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //   );

  //   // First, filter by completed Status
  //   let filteredBatches = sortedBatches.filter(
  //     (batch) =>
  //       batch.completedStatus.toLowerCase() ===
  //       selectedBatchOption.toLowerCase()
  //   );

  //   // Apply search filter if searchText is provided
  //   if (searchText.trim() !== "") {
  //     filteredBatches = filteredBatches.filter((batch) =>
  //       batch.batchName.toLowerCase().includes(searchText.toLowerCase())
  //     );
  //   }
  //   console.log("filteredBatches", filteredBatches);

  //   // Apply filterbatchType filter
  //   if (filterbatchType?.toLowerCase() === "hca") {
  //     filteredBatches = filteredBatches.filter(
  //       (batch) => batch?.affiliatedTo?.toLowerCase() == "hca"
  //     );
  //   } else if (filterbatchType?.toLowerCase() === "school") {
  //     filteredBatches = filteredBatches.filter(
  //       (batch) => batch?.affiliatedTo?.toLowerCase() != "hca"
  //     );
  //   }

  //   // only show non deleted batches
  //   // Filter batches by activeStatus: true
  //   filteredBatches = filteredBatches.filter(
  //     (batch) => batch.activeStatus === true
  //   );

  //   // Update filtered batchs
  //   setFilteredBatches(filteredBatches);
  //   setFilteredBatchesCount(filteredBatches.length);
  //   setCurrentPage(1);
  // }, [allBatches, selectedBatchOption, searchText, filterbatchType]);

  return (
    <div className="overflow-y-auto mt-3 flex-1 border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Batch Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Affiliated
        </span>
        <span className="py-3 text-left text-sm col-span-2 font-bold text-gray-600">
          School Name
        </span>

        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {false && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting batches</p>
        </div>
      )}
      {/* No batchs Found */}
      {allFilteredActiveBatches.length === 0 && !false && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Batches Found</p>
        </div>
      )}
      {/* batch List */}
      <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
        {allFilteredActiveBatches
          .slice(
            (currentPage - 1) * batchesPerPage,
            currentPage * batchesPerPage
          )
          .map((batch: any, index: any) => {
            const serialNumber = (currentPage - 1) * batchesPerPage + index + 1;
            return (
              <div
                key={batch?._id}
                className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="text-sm text-center font-medium text-gray-600">
                  {serialNumber}
                </span>
                {/* batchname */}
                <Link
                  title="View"
                  href={`batches/${batch?._id}`}
                  className="text-left text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                >
                  {batch?.batchName}
                </Link>
                {/* affiliatedTo */}
                <span className=" text-sm text-gray-700">
                  {batch?.affiliatedTo}
                </span>
                {/* school name */}
                <span className=" col-span-2 text-sm text-gray-700">
                  {batch.projectName ? batch.projectName : "None"}
                </span>
                <div className=" text-sm text-gray-500">
                  <>
                    {/* edit */}
                    <Link
                      href={`/superadmin/batches/updatebatch/${batch?._id}`}
                      title="Edit"
                      className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-green-500 hover:text-white"
                    >
                      <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                    </Link>

                    {/* delete modal */}
                    {batch?.activeStatus == true && (
                      <button
                        title="Delete"
                        className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                        onClick={() =>
                          handleDeleteModalOpen(batch._id, batch.batchName)
                        }
                      >
                        <DeleteIcon />
                      </button>
                    )}
                    <Modal
                      open={deleteModalOpen}
                      onClose={handleDeleteModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="flex items-center justify-center"
                      BackdropProps={{
                        style: {
                          backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                        },
                      }}
                    >
                      <Box className="w-96 p-5 border-y-4 border-red-400 flex flex-col items-center bg-white">
                        <DeleteIcon
                          className="text-white bg-red-600 rounded-full"
                          sx={{ fontSize: "3rem", padding: "0.5rem" }}
                        />
                        <p className="text-md mt-1 font-bold ">Delete Batch?</p>
                        <span className="text-center mt-2">
                          <span className="font-bold text-xl">
                            {selectedBatchName}
                          </span>
                          <br />
                          will be deleted permanently.
                        </span>
                        <div className="buttons mt-5">
                          <Button
                            variant="outlined"
                            sx={{ marginRight: ".5rem", paddingInline: "2rem" }}
                            onClick={handleDeleteModalClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ marginLeft: ".5rem", paddingInline: "2rem" }}
                            // onClick={() => handleBatchDelete(selectedBatchId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Box>
                    </Modal>
                  </>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BatchList;
