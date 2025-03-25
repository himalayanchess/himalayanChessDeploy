import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

import { Button, Pagination, Stack } from "@mui/material";
import ProjectList from "./ProjectList";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects, filterProjectsList } from "@/redux/allListSlice";

const ProjectComponent = () => {
  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const { allActiveProjects, allFilteredActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );
  //options
  const options = ["All", "Ongoing", "Completed"];
  //state vars
  const [searchText, setsearchText] = useState("");
  const [selectedStatus, setselectedStatus] = useState("All");
  const [filteredProjectCount, setFilteredProjectCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [projectsPerPage] = useState(7);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // Reset current page to 1 and searchtext when selectedStatus changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedStatus]);

  // filter
  useEffect(() => {
    // filter users
    let tempFilteredProjectsList =
      selectedStatus.toLowerCase() == "all"
        ? allActiveProjects
        : allActiveProjects.filter(
            (project) =>
              project?.completedStatus?.toLowerCase() ==
              selectedStatus.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredProjectsList = tempFilteredProjectsList.filter((project) =>
        project.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredProjectsList = tempFilteredProjectsList
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProjectCount(tempFilteredProjectsList?.length);
    setCurrentPage(1);
    dispatch(filterProjectsList(tempFilteredProjectsList));
  }, [allActiveProjects, selectedStatus, searchText]);

  // intial data fetch
  useEffect(() => {
    dispatch(fetchAllProjects());
  }, []);
  return (
    <div className=" flex-1 flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
      <div className="title-search-container mb-4 flex justify-between items-end">
        {/* title and Dropdown */}
        <div className="title-options">
          <h2 className="text-3xl mb-2 font-medium text-gray-700">
            Projects List
          </h2>
          <div className="dropdown flex gap-4 items-end">
            <Dropdown
              label="Status"
              options={options}
              selected={selectedStatus}
              onChange={setselectedStatus}
            />
            <span className="text-xl text-white bg-gray-400 rounded-md py-1 px-3 font-bold">
              {filteredProjectCount}
            </span>
          </div>
        </div>

        <div className="search-options flex items-center">
          {/* Search */}
          <div className="search-filter-menus flex gap-4">
            {/* search input */}
            <SearchInput
              placeholder="Search"
              value={searchText}
              onChange={(e) => setsearchText(e.target.value)}
            />

            {/* add student button */}
            <Link href={"/superadmin/projects/addproject"}>
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Project</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Table */}

      <ProjectList
        allFilteredActiveProjects={allFilteredActiveProjects}
        currentPage={currentPage}
        projectsPerPage={projectsPerPage}
      />

      <Stack spacing={2} className="mx-auto w-max mt-7">
        <Pagination
          count={Math.ceil(filteredProjectCount / projectsPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default ProjectComponent;
