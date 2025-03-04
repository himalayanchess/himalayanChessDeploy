"use client";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import {
  Box,
  FormControlLabel,
  Modal,
  Pagination,
  Radio,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import AddBatch from "@/components/batch/AddBatch";
import axios from "axios";
import BatchList from "@/components/batch/BatchList";

const page = () => {
  const batchOptions = ["Ongoing", "Completed"];

  const [selectedBatchOption, setselectedBatchOption] = useState(
    batchOptions[0]
  );
  const [allProjects, setallProjects] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [addBatchModalOpen, setaddBatchModalOpen] = React.useState(false);
  const [filteredBatchesCount, setFilteredBatchesCount] = useState(0);

  const [filterbatchType, setfilterbatchType] = useState("All"); // Default: Active
  // new user added
  const [newBatchAdded, setnewBatchAdded] = useState(false);
  const [newCreatedBatch, setnewCreatedBatch] = useState();

  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [batchesPerpage] = useState(7);
  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // handle handleAddBatchOpen function
  function handleAddBatchModalOpen() {
    setaddBatchModalOpen(true);
  }
  // handle handleAddBatchOpen function
  function handleAddBatchModalClose() {
    setaddBatchModalOpen(false);
  }
  // getAllProjects function
  async function getAllProjects() {
    const { data: resData } = await axios.get("/api/projects/getAllProjects");
    const modifiedAllProjects = resData.allProjects.map((project: any) => {
      return {
        projectDetails: { ...project },
        projectName:
          project.contractType === "Academy"
            ? `HCA (${project.assignedTrainers
                .map((trainer: any) => trainer.trainerName)
                .join(",")})`
            : project.name,
      };
    });

    setallProjects(modifiedAllProjects);
  }
  // get all projects
  useEffect(() => {
    getAllProjects();
  }, []);
  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Batches"
      />
      <div className="ml-[3rem] w-[96%]">
        <Header />
        <div className="pb-6 h-[92dvh] flex flex-col pt-3 px-14">
          <div className="title-search-container mb-4 flex justify-between items-end">
            {/* title and Dropdown */}
            <div className="title-options">
              <h2 className="text-3xl mb-2 font-medium text-gray-700">
                Batches List
              </h2>
              <Dropdown
                label=""
                options={batchOptions}
                selected={selectedBatchOption}
                onChange={setselectedBatchOption}
              />
            </div>
            {/* Filters Section */}
            <div className=" flex items-center justify-start ">
              <span className="bg-gray-400  text-white py-1 px-3 rounded-full  mr-4 text-sm font-bold">
                Filter by
              </span>
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={filterbatchType === "All"}
                    onChange={() => setfilterbatchType("All")}
                    color="default"
                  />
                }
                label="All"
              />
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={filterbatchType === "HCA"}
                    onChange={() => setfilterbatchType("HCA")}
                    color="default"
                  />
                }
                label="HCA"
              />
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={filterbatchType === "School"}
                    onChange={() => setfilterbatchType("School")}
                    color="default"
                  />
                }
                label="School"
              />
            </div>
            {/* search-add-menu */}
            <div className="search-options flex items-center">
              {/* Search */}
              <div className="search-div flex border-b-[1px] mr-7 border-gray-300 p-2  ">
                <SearchIcon className="mr-2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search"
                  value={searchText}
                  className="w-full outline-none"
                  onChange={(e) => setsearchText(e.target.value)}
                />
              </div>
              <button title="Add Batch" onClick={handleAddBatchModalOpen}>
                <AddIcon
                  className="bg-gray-400 text-white p-1 rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </button>
              <Modal
                open={addBatchModalOpen}
                onClose={handleAddBatchModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[50%] h-max p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  {/* add mode */}
                  <AddBatch
                    newBatchAdded={newBatchAdded}
                    setnewBatchAdded={setnewBatchAdded}
                    newCreatedBatch={newCreatedBatch}
                    setnewCreatedBatch={setnewCreatedBatch}
                    allProjects={allProjects}
                    handleClose={handleAddBatchModalClose}
                    mode="add"
                  />
                </Box>
              </Modal>
            </div>
          </div>
          {/* table */}
          <BatchList
            allProjects={allProjects}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            batchesPerpage={batchesPerpage}
            searchText={searchText}
            selectedBatchOption={selectedBatchOption}
            setFilteredBatchesCount={setFilteredBatchesCount}
            filterbatchType={filterbatchType}
            setfilterbatchType={setfilterbatchType}
            newBatchAdded={newBatchAdded}
            setnewBatchAdded={setnewBatchAdded}
            newCreatedBatch={newCreatedBatch}
            setnewCreatedBatch={setnewCreatedBatch}
          />
          {/* pagination */}
          <Stack spacing={2} className="mx-auto w-max mt-7">
            <Pagination
              count={Math.ceil(filteredBatchesCount / batchesPerpage)} // Total pages
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              shape="rounded"
            />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default page;
