import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Modal } from "@mui/material";
import StudentList from "./StudentList";
import { Pagination, Stack } from "@mui/material";
import { Users } from "lucide-react";
import AddStudent from "./AddStudent";
import axios from "axios";
import StudentFilterComponent from "../filtercomponents/StudentFilterComponent";
import DownloadIcon from "@mui/icons-material/Download";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBatches,
  filterStudentsList,
  getAllBranches,
  getAllStudents,
} from "@/redux/allListSlice";
import { useSession } from "next-auth/react";
import { exportStudentsListToExcel } from "@/helpers/exportToExcel/exportStudentsListToExcel";

const StudentComponent = ({ role }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // dispatch
  const dispath = useDispatch<any>();
  // use selector
  // batches
  const {
    allActiveBatches,
    allActiveStudentsList,
    allFilteredActiveStudents,
    allStudentsLoading,
    allActiveBranchesList,
  } = useSelector((state: any) => state.allListReducer);

  // state vars
  const affiliatedToOptions = ["All", "HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  const [selectedBatch, setselectedBatch] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");
  const [searchText, setsearchText] = useState("");
  const [filteredStudentCount, setfilteredStudentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [studentsPerPage] = useState(7);
  // batchlist
  const [filteredBatches, setfilteredBatches] = useState([]);

  // Calculate showing text
  const startItem = (currentPage - 1) * studentsPerPage + 1;
  const endItem = Math.min(currentPage * studentsPerPage, filteredStudentCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredStudentCount}`;

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  //export to excel
  const exportToExcel = () => {
    exportStudentsListToExcel(allFilteredActiveStudents);
  };

  // reset acive status to "active" when selectedAffiliatedTo changes
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    if (isSuperOrGlobalAdmin) {
      setselectedBranch("All");
      setsearchText(""); // optional: include this if needed for super/global
      setselectedBatch("All"); // optional: include this if needed for super/global
    }
  }, [selectedAffiliatedTo, session?.data?.user]);

  // reset search when batch changes
  useEffect(() => {
    setsearchText("");
  }, [selectedBatch]);

  // reset batch if branch changes
  useEffect(() => {
    setselectedBatch("All");
  }, [selectedBranch]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    let affiliatedTo = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
      affiliatedTo = "HCA";
    }
    setselectedBranch(branchName);
    setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  // filter
  useEffect(() => {
    // filter students
    let tempFilteredStudentsList =
      selectedAffiliatedTo?.toLowerCase() === "all"
        ? allActiveStudentsList
        : allActiveStudentsList.filter(
            (student: any) =>
              student.affiliatedTo.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // filter by branch
    tempFilteredStudentsList =
      selectedBranch?.toLowerCase() === "all"
        ? tempFilteredStudentsList
        : tempFilteredStudentsList.filter(
            (student: any) =>
              student.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
          );

    console.log("affiliated to", tempFilteredStudentsList);
    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      tempFilteredStudentsList = tempFilteredStudentsList.filter(
        (student: any) =>
          student.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // // Sort students by createdAt in descending order (latest first)
    tempFilteredStudentsList = tempFilteredStudentsList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // sort student by batch if not "none"
    if (selectedBatch?.toLowerCase() != "all") {
      tempFilteredStudentsList = tempFilteredStudentsList.filter(
        (student: any) =>
          student.batches.some(
            (batch: any) =>
              batch.activeStatus === true && // Active batch
              !batch.endDate && // No end date
              batch.batchName == selectedBatch // Match batchName
          )
      );
    }

    // filter batches
    let tempFilteredBatches =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? allActiveBatches
        : allActiveBatches?.filter(
            (batch: any) =>
              batch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    tempFilteredBatches =
      selectedBranch?.toLowerCase() == "all"
        ? tempFilteredBatches
        : tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
          );

    //sort
    tempFilteredBatches = tempFilteredBatches
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

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
    selectedBranch,
  ]);

  // intial data fetching
  useEffect(() => {
    dispath(getAllStudents());
    dispath(fetchAllBatches());
    dispath(getAllBranches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-4 px-10 border bg-white rounded-lg">
      <div className="main-head flex justify-between">
        <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
          <Users />
          <span className="ml-2">Student Management</span>
        </h2>{" "}
        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveStudents?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      {/* student header */}
      <div className="student-header my-0 flex items-end justify-between gap-2">
        {/* dropdown */}
        <div className="dropdowns-showing flex flex-1  gap-4 items-end">
          <div className="dropdowns grid grid-cols-4 gap-2 items-end  w-full">
            <Dropdown
              label="Affiliated to"
              options={affiliatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              disabled={!isSuperOrGlobalAdmin}
              width="full"
            />
            <Dropdown
              label="Branch"
              options={[
                "All",
                ...(allActiveBranchesList?.map(
                  (branch: any) => branch.branchName
                ) || []),
              ]}
              disabled={
                selectedAffiliatedTo?.toLowerCase() != "hca" ||
                !isSuperOrGlobalAdmin
              }
              selected={selectedBranch}
              onChange={setselectedBranch}
              width="full"
            />
            <Dropdown
              label="Batch name"
              options={[
                "All",
                ...filteredBatches?.map((batch: any) => batch?.batchName),
              ]}
              selected={selectedBatch}
              onChange={setselectedBatch}
              width="full"
            />
            {/* Student count */}
            <span className="text-sm text-gray-600">{showingText}</span>
          </div>
        </div>
        {/* search-filter-menus */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e: any) => setsearchText(e.target.value)}
          />

          {/* add student button */}
          <Link href={`/${role?.toLowerCase()}/students/addstudent`}>
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
        role={role}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
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
