"use client";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import { projectCompletedStatusOptions } from "@/options/projectOptions";
import AddIcon from "@mui/icons-material/Add";
import { Box, Modal, Pagination, Stack } from "@mui/material";
import AddProject from "@/components/project/AddProject";
import axios from "axios";
import ProjectList from "@/components/project/ProjectList";
const page = () => {
  const [searchText, setsearchText] = useState("");
  const [trainersList, settrainersList] = useState([]);
  //options

  const [selectedProjectStatus, setselectedProjectStatus] = useState(
    projectCompletedStatusOptions[0]
  );
  const [filteredProjectCount, setfilteredProjectCount] = useState(0);

  const [addProjectModalOpen, setaddProjectModalOpen] = useState(false);
  const [newProjectAdded, setnewProjectAdded] = useState(false);
  const [newCreatedProject, setnewCreatedProject] = useState();
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [projectsPerPage] = useState(2);

  //handleaddProjectModalClose
  function handleaddProjectModalClose() {
    setaddProjectModalOpen(false);
  }
  //handleaddProjectModalOpen
  function handleaddProjectModalOpen() {
    setaddProjectModalOpen(true);
  }
  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // get all trainers
  async function getAllTrainers() {
    const { data: resData } = await axios.get("/api/users/getTrainersList");
    if (resData.statusCode == 200) {
      settrainersList(resData.trainersList);
    }
  }
  //get trainers list
  useEffect(() => {
    getAllTrainers();
  }, []);
  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Projects"
      />
      <div className="ml-[3rem] w-[96%]">
        <Header />
        <div className="pb-6 h-[92dvh] flex flex-col pt-3 px-14">
          <div className="title-search-container mb-4 flex justify-between items-end">
            {/* title and Dropdown */}
            <div className="title-options">
              <h2 className="text-3xl mb-2 font-medium text-gray-700">
                Projects List
              </h2>
              <Dropdown
                label=""
                options={projectCompletedStatusOptions}
                selected={selectedProjectStatus}
                onChange={setselectedProjectStatus}
              />
            </div>

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
              <button title="Add Project" onClick={handleaddProjectModalOpen}>
                <AddIcon
                  className="bg-gray-400 text-white p-1 rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </button>
              <Modal
                open={addProjectModalOpen}
                onClose={handleaddProjectModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[50%] max-h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  {/* add mode */}
                  <AddProject
                    newProjectAdded={newProjectAdded}
                    setnewProjectAdded={setnewProjectAdded}
                    newCreatedProject={newCreatedProject}
                    setnewCreatedProject={setnewCreatedProject}
                    handleClose={handleaddProjectModalClose}
                    trainersList={trainersList}
                    mode="add"
                  />
                </Box>
              </Modal>
            </div>
          </div>
          {/* table */}
          <ProjectList
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            projectsPerPage={projectsPerPage}
            searchText={searchText}
            selectedProjectStatus={selectedProjectStatus}
            filteredProjectCount={filteredProjectCount}
            setfilteredProjectCount={setfilteredProjectCount}
            newProjectAdded={newProjectAdded}
            setnewProjectAdded={setnewProjectAdded}
            newCreatedProject={newCreatedProject}
            setnewCreatedProject={setnewCreatedProject}
            trainersList={trainersList}
          />
          {/* pagination */}
          <Stack spacing={2} className="mx-auto w-max mt-7">
            <Pagination
              count={Math.ceil(filteredProjectCount / projectsPerPage)} // Total pages
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
