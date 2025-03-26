import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Modal } from "@mui/material";
import StudentList from "./StudentList";
import { Pagination, Stack } from "@mui/material";
import AddStudent from "./AddStudent";
import axios from "axios";
import StudentFilterComponent from "../filtercomponents/StudentFilterComponent";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBatches,
  filterStudentsList,
  getAllStudents,
} from "@/redux/allListSlice";

const StudentComponent = () => {
  // dispatch
  const dispath = useDispatch<any>();
  // use selector
  // batches
  const {
    allActiveBatches,
    allActiveStudentsList,
    allFilteredActiveStudents,
    allStudentsLoading,
  } = useSelector((state: any) => state.allListReducer);

  // state vars
  const affiliatedToOptions = ["All", "HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedBatch, setselectedBatch] = useState("None");
  const [searchText, setsearchText] = useState("");
  const [filteredStudentCount, setfilteredStudentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [studentsPerPage] = useState(7);
  // batchlist
  const [filteredBatches, setfilteredBatches] = useState([]);

  // reset acive status to "active" when selectedAffiliatedTo changes
  useEffect(() => {
    setsearchText("");
    setselectedBatch("None");
  }, [selectedAffiliatedTo]);

  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // filter
  useEffect(() => {
    // filter students
    let tempFilteredStudentsList =
      selectedAffiliatedTo.toLowerCase() === "all"
        ? allActiveStudentsList
        : allActiveStudentsList.filter(
            (student) =>
              student.affiliatedTo.toLowerCase() ==
              selectedAffiliatedTo.toLowerCase()
          );

    console.log("affiliated to", tempFilteredStudentsList);
    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      tempFilteredStudentsList = tempFilteredStudentsList.filter((student) =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // // Sort students by createdAt in descending order (latest first)
    tempFilteredStudentsList = tempFilteredStudentsList
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // filter batches
    let tempFilteredBatches =
      selectedAffiliatedTo.toLowerCase() == "all"
        ? allActiveBatches
        : allActiveBatches?.filter(
            (batch) =>
              batch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // sort student by batch if not "none"
    if (selectedBatch?.toLowerCase() != "none") {
      tempFilteredStudentsList = tempFilteredStudentsList.filter((student) =>
        student.batches.some(
          (batch) =>
            batch.activeStatus === true && // Active batch
            !batch.endDate && // No end date
            batch.batchName == selectedBatch // Match batchName
        )
      );
    }

    //sort
    tempFilteredBatches = tempFilteredBatches
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // update states
    setfilteredStudentCount(tempFilteredStudentsList?.length);
    setfilteredBatches(tempFilteredBatches);
    setCurrentPage(1);
    // update redux state
    dispath(filterStudentsList(tempFilteredStudentsList));
  }, [
    allActiveBatches,
    allActiveStudentsList,
    selectedAffiliatedTo,
    searchText,
    selectedBatch,
  ]);

  // intial data fetching
  useEffect(() => {
    dispath(getAllStudents());
    dispath(fetchAllBatches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <h1 className="text-2xl font-bold">Student Management</h1>
      {/* student header */}
      <div className="student-header my-2 flex items-end justify-between">
        {/* dropdown */}
        <div className="dropdown flex gap-4 items-end">
          <Dropdown
            label="Affiliated to"
            options={affiliatedToOptions}
            selected={selectedAffiliatedTo}
            onChange={setselectedAffiliatedTo}
          />
          <Dropdown
            label="Batch name"
            options={[
              "None",
              ...filteredBatches?.map((batch: any) => batch?.batchName),
            ]}
            selected={selectedBatch}
            onChange={setselectedBatch}
          />
          {/* Student count */}
          <span className="text-xl text-white bg-gray-400 rounded-md py-1 px-3 font-bold">
            {filteredStudentCount}
          </span>
        </div>
        {/* search-filter-menus */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e) => setsearchText(e.target.value)}
          />

          {/* add student button */}
          <Link href={"/superadmin/students/addstudent"}>
            <Button variant="contained" size="small">
              <AddIcon />
              <span className="ml-1">Add Student</span>
            </Button>
          </Link>
        </div>
      </div>
      {/* students list */}
      <StudentList
        allFilteredActiveStudents={allFilteredActiveStudents}
        currentPage={currentPage}
        studentsPerPage={studentsPerPage}
        allStudentsLoading={allStudentsLoading}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-7">
        <Pagination
          count={Math.ceil(filteredStudentCount / studentsPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default StudentComponent;
