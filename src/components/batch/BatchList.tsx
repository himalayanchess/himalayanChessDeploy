import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import AddBatch from "./AddBatch";
const BatchList = ({
  allProjects,
  currentPage,
  setCurrentPage,
  batchesPerpage,
  searchText,
  selectedBatchOption,
  setFilteredBatchesCount,
  filterbatchType,
  setfilterbatchType,
  newBatchAdded,
  setnewBatchAdded,
  newCreatedBatch,
  setnewCreatedBatch,
}) => {
  const [allBatches, setallBatches] = useState<any>([]);
  const [filteredBatches, setFilteredBatches] = useState<any>([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [batchListLoading, setbatchListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewBatch, setselectedViewBatch] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //edit modal
  const [selectedEditBatch, setselectedEditBatch] = useState(null);
  const [editModalOpen, seteditModalOpen] = useState(false);
  // batch edited
  const [batchEdited, setbatchEdited] = useState(false);
  const [editedBatch, seteditedBatch] = useState(null);

  // modal operations
  // view modal open
  function handleViewModalOpen(batch) {
    console.log(batch);
    setselectedViewBatch(batch);
    setViewModalOpen(true);
  }
  // edit modal open
  function handleEditModalOpen(batch) {
    console.log(batch);
    setselectedEditBatch(batch);
    seteditModalOpen(true);
  }

  // view modal close
  function handleViewModalClose() {
    setViewModalOpen(false);
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
  async function handleBatchDelete(id) {
    try {
      const { data: resData } = await axios.post("/api/batches/deleteBatch", {
        batchId: id,
      });
      let tempAllBatches = [...allBatches];
      tempAllBatches = tempAllBatches.map((batch) => {
        if (batch._id == id) {
          return { ...batch, activeStatus: false };
        } else {
          return batch;
        }
      });
      setallBatches(tempAllBatches);
      handleDeleteModalClose();
      console.log(resData);
    } catch (error) {
      console.log("error in handleBatchDelete", error);
    }
  }
  // filtered effect
  useEffect(() => {
    // add new batch
    let tempallBatches = [...allBatches];

    // Sort batches by createdAt in descending order (latest first)
    const sortedBatches = tempallBatches.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // First, filter by completed Status
    let filteredBatches = sortedBatches.filter(
      (batch) =>
        batch.completedStatus.toLowerCase() ===
        selectedBatchOption.toLowerCase()
    );

    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      filteredBatches = filteredBatches.filter((batch) =>
        batch.batchName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    console.log("filteredBatches", filteredBatches);

    // Apply filterbatchType filter
    if (filterbatchType?.toLowerCase() === "hca") {
      filteredBatches = filteredBatches.filter(
        (batch) => batch?.affiliatedTo?.toLowerCase() == "hca"
      );
    } else if (filterbatchType?.toLowerCase() === "school") {
      filteredBatches = filteredBatches.filter(
        (batch) => batch?.affiliatedTo?.toLowerCase() != "hca"
      );
    }

    // only show non deleted batches
    // Filter batches by activeStatus: true
    filteredBatches = filteredBatches.filter(
      (batch) => batch.activeStatus === true
    );

    // Update filtered batchs
    setFilteredBatches(filteredBatches);
    setFilteredBatchesCount(filteredBatches.length);
    setCurrentPage(1);
  }, [allBatches, selectedBatchOption, searchText, filterbatchType]);

  // Handle new batch addition
  useEffect(() => {
    if (newBatchAdded && newCreatedBatch) {
      setallBatches((prevBatches) => [newCreatedBatch, ...prevBatches]);
      setnewBatchAdded(false);
    }
  }, [newBatchAdded, newCreatedBatch, setnewBatchAdded]);
  // Handle update(edit) project
  useEffect(() => {
    if (batchEdited && editedBatch) {
      let tempBatches = [...allBatches];
      console.log("updateeeeeeeeee", tempBatches, editedBatch);
      tempBatches = tempBatches.map((batch) => {
        if (batch._id == editedBatch._id) {
          return editedBatch;
        } else {
          return batch;
        }
      });
      setallBatches(tempBatches);
      setbatchEdited(false);
    }
  }, [batchEdited, editedBatch, setbatchEdited]);

  // function get all batches
  async function getAllBatches() {
    try {
      setbatchListLoading(true);
      const { data: resData } = await axios.get("/api/batches/getAllBatches");
      console.log(resData.allBatches);
      setallBatches(resData.allBatches);
      setbatchListLoading(false);
    } catch (error) {
      console.log("error in superadmin/batchs (getallBatches)", error);
    }
  }
  // intital fetch all batches
  useEffect(() => {
    getAllBatches();
  }, []);
  return (
    <div className="overflow-x-auto flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings grid grid-cols-5 w-full bg-gray-200">
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Batch Name
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Affiliated
        </span>
        <span className="p-3 text-left col-span-2 text-sm font-medium text-gray-600">
          School Name
        </span>

        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {batchListLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting batches</p>
        </div>
      )}
      {/* No batchs Found */}
      {filteredBatches.length === 0 && !batchListLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Batches Found</p>
        </div>
      )}
      {/* batch List */}
      <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
        {filteredBatches
          .slice(
            (currentPage - 1) * batchesPerpage,
            currentPage * batchesPerpage
          )
          .map((batch: any) => (
            <div
              key={batch?._id}
              className="border-t grid grid-cols-5 items-center hover:bg-gray-50"
            >
              {/* batchname */}
              <span className="p-3 text-sm text-gray-700">
                {batch?.batchName}
              </span>
              {/* affiliatedTo */}
              <span className="p-3 text-sm text-gray-700">
                {batch?.affiliatedTo}
              </span>
              {/* school name */}
              <span className="p-3 col-span-2 text-sm text-gray-700">
                {batch.projectName ? batch.projectName : "None"}
              </span>
              <div className="p-3 text-sm text-gray-500">
                <>
                  {/* view modal */}
                  <button
                    onClick={() => handleViewModalOpen(batch)}
                    title="View"
                    className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                  >
                    <WysiwygIcon />
                  </button>
                  <Modal
                    open={viewModalOpen}
                    onClose={handleViewModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="flex items-center justify-center"
                    BackdropProps={{
                      style: {
                        backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                      },
                    }}
                  >
                    <Box className="w-[50%] h-[90%] p-6 overflow-y-auto grid grid-cols-2 auto-rows-min grid-auto-flow-dense gap-10 bg-white rounded-xl shadow-lg">
                      {/* <Viewbatch batch={selectedViewbatch} /> */}
                      <p>View batch</p>
                    </Box>
                  </Modal>
                  {/* edit modal */}
                  <button
                    title="Edit"
                    onClick={() => handleEditModalOpen(batch)}
                    className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                  >
                    <ModeEditIcon />
                  </button>
                  <Modal
                    open={editModalOpen}
                    onClose={handleEditModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="flex items-center justify-center"
                    BackdropProps={{
                      style: {
                        backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                      },
                    }}
                  >
                    <Box className="w-[50%] h-max p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                      <AddBatch
                        batchEdited={batchEdited}
                        setbatchEdited={setbatchEdited}
                        handleClose={handleEditModalClose}
                        mode="edit"
                        allProjects={allProjects}
                        initialData={selectedEditBatch}
                        editedBatch={editedBatch}
                        seteditedBatch={seteditedBatch}
                      />
                    </Box>
                  </Modal>
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
                      <p className="text-md mt-1 font-bold ">Delete Account?</p>
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
                          onClick={() => handleBatchDelete(selectedBatchId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                </>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BatchList;
