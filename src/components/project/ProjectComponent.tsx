import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { School } from "lucide-react";
import DownloadIcon from "@mui/icons-material/Download";

import { Button, Pagination, Stack } from "@mui/material";
import ProjectList from "./ProjectList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  filterProjectsList,
  getAllUsers,
} from "@/redux/allListSlice";
import { exportProjectsListToExcel } from "@/helpers/exportToExcel/exportProjectsListToExcel";

const ProjectComponent = ({ role }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const {
    allActiveProjects,
    allFilteredActiveProjects,
    allProjectsLoading,
    allActiveUsersList,
  } = useSelector((state: any) => state.allListReducer);
  //options
  const options = ["All", "Ongoing", "Completed"];
  //state vars
  const [searchText, setsearchText] = useState("");
  const [selectedStatus, setselectedStatus] = useState("All");
  const [selectedTrainer, setselectedTrainer] = useState("All");
  const [filteredProjectCount, setFilteredProjectCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [projectsPerPage] = useState(7);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * projectsPerPage + 1;
  const endItem = Math.min(currentPage * projectsPerPage, filteredProjectCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredProjectCount}`;

  //export to excel
  const exportToExcel = () => {
    exportProjectsListToExcel(allFilteredActiveProjects);
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
            (project: any) =>
              project?.completedStatus?.toLowerCase() ==
              selectedStatus.toLowerCase()
          );

    // filter by trainer
    tempFilteredProjectsList =
      selectedTrainer.toLowerCase() == "all"
        ? tempFilteredProjectsList
        : tempFilteredProjectsList.filter((project: any) =>
            project?.assignedTrainers?.some(
              (trainer: any) =>
                trainer?.trainerName?.toLowerCase() ==
                selectedTrainer?.toLowerCase()
            )
          );

    if (searchText.trim() !== "") {
      tempFilteredProjectsList = tempFilteredProjectsList.filter(
        (project: any) =>
          project.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredProjectsList = tempFilteredProjectsList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setFilteredProjectCount(tempFilteredProjectsList?.length);
    setCurrentPage(1);
    dispatch(filterProjectsList(tempFilteredProjectsList));
  }, [allActiveProjects, selectedStatus, selectedTrainer, searchText]);

  // intial data fetch
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllUsers());
  }, []);
  return (
    <div className=" flex-1 flex flex-col mr-4 py-4 px-10 rounded-md shadow-md bg-white ">
      <div className="flex justify-between">
        <h2 className="text-3xl mb-2  text-gray-700 flex items-center">
          <School />
          <span className="ml-2">Schools List</span>
        </h2>
        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveProjects?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="title-search-container  flex justify-between items-end">
        {/* title and Dropdown */}
        <div className="title-options">
          <div className="dropdown flex gap-4 mb-1 items-end">
            <Dropdown
              label="Status"
              options={options}
              selected={selectedStatus}
              onChange={setselectedStatus}
            />
            <Dropdown
              label="Trainer"
              options={[
                "All",
                ...allActiveUsersList
                  ?.filter(
                    (user: any) => user?.role?.toLowerCase() == "trainer"
                  )
                  .map((user: any) => user.name),
              ]}
              selected={selectedTrainer}
              onChange={setselectedTrainer}
            />
            <span className="text-sm text-gray-600">{showingText}</span>
          </div>
        </div>

        <div className="search-options flex items-center">
          {/* Search */}
          <div className="search-filter-menus flex gap-4">
            {/* search input */}
            <SearchInput
              placeholder="Search"
              value={searchText}
              onChange={(e: any) => setsearchText(e.target.value)}
            />

            {/* add project button */}

            {role?.toLowerCase() == "superadmin" ? (
              <Link href={"/superadmin/projects/addproject"}>
                <Button variant="contained" size="small">
                  <AddIcon />
                  <span className="ml-1">Add Project</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                size="small"
                className="w-max h-max"
                disabled
              >
                <LockIcon sx={{ fontSize: "1.2rem" }} />
                <span className="ml-1">Add Project</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Table */}

      <ProjectList
        allFilteredActiveProjects={allFilteredActiveProjects}
        currentPage={currentPage}
        projectsPerPage={projectsPerPage}
        allProjectsLoading={allProjectsLoading}
        role={role}
      />

      <Stack spacing={2} className="mx-auto w-max mt-3">
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
