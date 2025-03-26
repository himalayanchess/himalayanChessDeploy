"use client";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Box, Modal, Pagination, Stack } from "@mui/material";
import CourseList from "@/components/course/CourseList";
import AddCourse from "@/components/course/AddCourse";

const page = () => {
  const [searchText, setsearchText] = useState("");
  const [addCourseModalOpen, setaddCourseModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [filteredCoursesCount, setFilteredCoursesCount] = useState(0);
  const [newCourseAdded, setnewCourseAdded] = useState(false);
  const [newCreatedCourse, setnewCreatedCourse] = useState();
  const [coursesPerPage] = useState(7);
  const skillLevelOptions = ["Beginner", "Intermediate", "Advanced"];
  const [selectedSkillLevel, setselectedSkillLevel] = useState(
    skillLevelOptions[0]
  );
  // handleaddCourseModalOpen
  function handleaddCourseModalOpen() {
    setaddCourseModalOpen(true);
  }
  // handleaddCourseModalClose
  function handleaddCourseModalClose() {
    setaddCourseModalOpen(false);
  }
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Courses"
      />
      <div className="ml-[3rem] w-[96%]">
        <Header />
        {/* main container */}
        <div className="pb-6 h-[92dvh] flex flex-col pt-3 px-14">
          {/* title-search */}
          <div className="title-search-container mb-4 flex justify-between items-end">
            {/* title and Dropdown */}
            <div className="title-options">
              <h2 className="text-3xl mb-2 font-medium text-gray-700">
                Course List
              </h2>
              <Dropdown
                label=""
                options={skillLevelOptions}
                selected={selectedSkillLevel}
                onChange={setselectedSkillLevel}
              />
            </div>
            {/* search */}
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
              <button title="Add user" onClick={handleaddCourseModalOpen}>
                <AddIcon
                  className="bg-gray-400 text-white p-1 rounded-full"
                  style={{ fontSize: "2rem" }}
                />
              </button>
              <Modal
                open={addCourseModalOpen}
                onClose={handleaddCourseModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
              >
                <Box className="w-[50%] h-max p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                  <AddCourse
                    newCourseAdded={newCourseAdded}
                    setnewCourseAdded={setnewCourseAdded}
                    newCreatedCourse={newCreatedCourse}
                    setnewCreatedCourse={setnewCreatedCourse}
                    handleClose={handleaddCourseModalClose}
                  />
                </Box>
              </Modal>
            </div>
          </div>
          {/* course list */}
          <CourseList
            searchText={searchText}
            selectedSkillLevel={selectedSkillLevel}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            coursesPerPage={coursesPerPage}
            setFilteredCoursesCount={setFilteredCoursesCount}
            newCourseAdded={newCourseAdded}
            setnewCourseAdded={setnewCourseAdded}
            newCreatedCourse={newCreatedCourse}
            setnewCreatedCourse={setnewCreatedCourse}
          />
          <Stack spacing={2} className="mx-auto w-max mt-7">
            <Pagination
              count={Math.ceil(filteredCoursesCount / coursesPerPage)} // Total pages
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
