import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

import { Button, Pagination, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { filterCourseList, getAllCourses } from "@/redux/allListSlice";
import CourseList from "./CourseList";

const CourseComponent = ({ role = "" }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const {
    allActiveCoursesList,
    allFilteredActiveCoursesList,
    allCoursesLoading,
  } = useSelector((state: any) => state.allListReducer);
  //options
  const affiliatedToOptions = ["All", "HCA", "School"];
  //state vars
  const [searchText, setsearchText] = useState("");
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [filteredCourseCount, setFilteredCourseCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [coursesPerPage] = useState(7);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // Reset current page to 1 and searchtext when selectedAffiliatedTo changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedAffiliatedTo]);

  // filter
  useEffect(() => {
    // filter users
    let tempFilteredCoursesList =
      selectedAffiliatedTo.toLowerCase() == "all"
        ? allActiveCoursesList
        : allActiveCoursesList.filter(
            (course) =>
              course?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredCoursesList = tempFilteredCoursesList.filter((course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredCoursesList = tempFilteredCoursesList
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredCourseCount(tempFilteredCoursesList?.length);
    setCurrentPage(1);
    dispatch(filterCourseList(tempFilteredCoursesList));
  }, [allActiveCoursesList, selectedAffiliatedTo, searchText]);

  // intial data fetch
  useEffect(() => {
    dispatch(getAllCourses());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl mb-2 font-medium text-gray-700">Course List</h2>
      <div className="courses-header my-2 flex items-end justify-between">
        {/* title and Dropdown */}
        <div className="title-options">
          <div className="dropdown flex gap-4 items-end">
            <Dropdown
              label="Affiliated to"
              options={affiliatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
            />
            <span className="text-xl text-white bg-gray-400 rounded-md py-1 px-3 font-bold">
              {filteredCourseCount}
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

            {/* add course button */}
            <Link href={`/${role?.toLowerCase()}/courses/addcourse`}>
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Course</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}

      <CourseList
        allFilteredActiveCoursesList={allFilteredActiveCoursesList}
        currentPage={currentPage}
        coursesPerPage={coursesPerPage}
        allCoursesLoading={allCoursesLoading}
        role={role}
      />

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-7">
        <Pagination
          count={Math.ceil(filteredCourseCount / coursesPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default CourseComponent;
