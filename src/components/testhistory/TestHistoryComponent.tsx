import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Modal } from "@mui/material";
import { Pagination, Stack } from "@mui/material";
import { FileSpreadsheet, Users } from "lucide-react";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";

import StudentFilterComponent from "../filtercomponents/StudentFilterComponent";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBatches,
  filterTestHistoriesList,
  getAllBranches,
  getAllCourses,
  getAllStudents,
  getAllTestHistories,
} from "@/redux/allListSlice";
import { useSession } from "next-auth/react";
import StudentList from "../student/StudentList";
import TestHistoryList from "./TestHistoryList";
import { exportTestHistoryListToExcel } from "@/helpers/exportToExcel/exportTestHistoryListToExcel";

const TestHistoryComponent = ({ role }: any) => {
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
    allActiveTestHistoryList,
    allFilteredActiveTestHistoryList,
    allTestHistoryLoading,
    allActiveBatches,
    allActiveStudentsList,
    allActiveBranchesList,
    allActiveCoursesList,
  } = useSelector((state: any) => state.allListReducer);

  // state vars
  const [isBelowPassChecked, setIsBelowPassChecked] = useState(false);
  const [selectedCourse, setselectedCourse] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState("All");
  const [selectedBatch, setselectedBatch] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");
  const [searchText, setsearchText] = useState("");
  const [filteredTestHistoriesCount, setfilteredTestHistoriesCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [testHistoriesPerPage] = useState(7);
  // batchlist
  const [filteredBatches, setfilteredBatches] = useState([]);
  const [filteredStudents, setfilteredStudents] = useState([]);

  // Calculate showing text
  const startItem = (currentPage - 1) * testHistoriesPerPage + 1;
  const endItem = Math.min(
    currentPage * testHistoriesPerPage,
    filteredTestHistoriesCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredTestHistoriesCount}`;

  // handle page change
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };
  //export to excel
  const exportToExcel = () => {
    exportTestHistoryListToExcel(allFilteredActiveTestHistoryList);
  };

  // reset acive status to "active" when selectedAffiliatedTo changes
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    if (isSuperOrGlobalAdmin) {
      setSelectedStudent("All");
      setsearchText(""); // optional: include this if needed for super/global
      setselectedBatch("All"); // optional: include this if needed for super/global
    }
  }, [selectedBranch, session?.data?.user]);

  // reset search when batch changes
  useEffect(() => {
    setsearchText("");
    setSelectedStudent("All");
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
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // filter
  useEffect(() => {
    // filter test histories by course
    let tempFilteredTestHistoriesList =
      selectedCourse?.toLowerCase() === "all"
        ? allActiveTestHistoryList
        : allActiveTestHistoryList.filter(
            (testHistory: any) =>
              testHistory.courseName.toLowerCase() ==
              selectedCourse?.toLowerCase()
          );

    // filter by branch
    tempFilteredTestHistoriesList =
      selectedBranch?.toLowerCase() === "all"
        ? tempFilteredTestHistoriesList
        : tempFilteredTestHistoriesList.filter(
            (testRecord: any) =>
              testRecord.branchName?.toLowerCase() ==
              selectedBranch?.toLowerCase()
          );

    // filter by student name
    tempFilteredTestHistoriesList =
      selectedStudent?.toLowerCase() === "all"
        ? tempFilteredTestHistoriesList
        : tempFilteredTestHistoriesList.filter(
            (testRecord: any) =>
              testRecord.studentName?.toLowerCase() ==
              selectedStudent?.toLowerCase()
          );

    // is below pass checkeed
    if (isBelowPassChecked) {
      tempFilteredTestHistoriesList = tempFilteredTestHistoriesList.filter(
        (testRecord: any) => testRecord?.resultStatus?.toLowerCase() != "pass"
      );
    }

    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      tempFilteredTestHistoriesList = tempFilteredTestHistoriesList.filter(
        (testRecord: any) =>
          testRecord.examTitle
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          testRecord.studentName
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // sort test histories by batch if not "none"
    if (selectedBatch?.toLowerCase() != "all") {
      tempFilteredTestHistoriesList = tempFilteredTestHistoriesList.filter(
        (testRecord: any) =>
          testRecord?.batchName?.toLowerCase() == selectedBatch?.toLowerCase()
      );
    }

    // // Sort test histories by createdAt in descending order (latest first)
    tempFilteredTestHistoriesList = tempFilteredTestHistoriesList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // filter batches
    let tempFilteredBatches = allActiveBatches?.filter(
      (batch: any) => batch?.affiliatedTo?.toLowerCase() == "hca"
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

    // filter students
    let tempFilteredStudentsList = allActiveStudentsList.filter(
      (student: any) => student.affiliatedTo.toLowerCase() == "hca"
    );
    // fitler students by branch
    tempFilteredStudentsList =
      selectedBranch?.toLowerCase() === "all"
        ? tempFilteredStudentsList
        : tempFilteredStudentsList.filter(
            (student: any) =>
              student.branchName.toLowerCase() == selectedBranch?.toLowerCase()
          );
    // fitler students by batch
    tempFilteredStudentsList =
      selectedBatch?.toLowerCase() === "all"
        ? tempFilteredStudentsList
        : tempFilteredStudentsList.filter((student: any) =>
            student?.batches?.some(
              (batch: any) =>
                batch?.batchName?.toLowerCase() ===
                  selectedBatch?.toLowerCase() && batch?.activeStatus
            )
          );

    // update states
    setfilteredTestHistoriesCount(tempFilteredTestHistoriesList?.length);
    setfilteredBatches(tempFilteredBatches);
    setfilteredStudents(tempFilteredStudentsList);
    setCurrentPage(1);
    // update redux state
    dispath(filterTestHistoriesList(tempFilteredTestHistoriesList));
  }, [
    allActiveTestHistoryList,
    allActiveBatches,
    allActiveStudentsList,
    searchText,
    selectedCourse,
    selectedBatch,
    selectedStudent,
    selectedBranch,
    isBelowPassChecked,
  ]);

  // intial data fetching
  useEffect(() => {
    dispath(getAllStudents());
    dispath(fetchAllBatches());
    dispath(getAllCourses());
    dispath(getAllBranches());
    dispath(getAllTestHistories());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-5 px-7 border bg-white rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
          <FileSpreadsheet />
          <span className="ml-2">Test History</span>
        </h2>{" "}
        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveTestHistoryList?.length === 0}
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
          <div className="dropdowns grid grid-cols-5 gap-2 items-end  w-full">
            <Dropdown
              label="Course"
              options={[
                "All",
                ...(allActiveCoursesList?.map((course: any) => course.name) ||
                  []),
              ]}
              selected={selectedCourse}
              onChange={setselectedCourse}
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
              disabled={!isSuperOrGlobalAdmin}
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
            <Dropdown
              label="Student"
              options={[
                "All",
                ...filteredStudents?.map((student: any) => student?.name),
              ]}
              selected={selectedStudent}
              onChange={setSelectedStudent}
              width="full"
            />
            {/* Student count */}
            <div className="checkbox-showing">
              <div className="checkbox flex items-center">
                <input
                  type="checkbox"
                  id="belowpass"
                  checked={isBelowPassChecked}
                  onChange={(e) => setIsBelowPassChecked(e.target.checked)}
                />{" "}
                <label
                  htmlFor="belowpass"
                  className="ml-2 cursor-pointer text-gray-600 text-sm"
                >
                  Below pass mark
                </label>
              </div>
              <span className="text-sm text-gray-600">{showingText}</span>
            </div>
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
          <Link href={`/${role?.toLowerCase()}/testhistory/addtestrecord`}>
            <Button variant="contained" size="small">
              <AddIcon />
              <span className="ml-1">Add Test Record</span>
            </Button>
          </Link>
        </div>
      </div>
      {/* test history list */}
      <TestHistoryList
        allFilteredActiveTestHistoryList={allFilteredActiveTestHistoryList}
        currentPage={currentPage}
        testHistoriesPerPage={testHistoriesPerPage}
        allTestHistoryLoading={allTestHistoryLoading}
        role={role}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(filteredTestHistoriesCount / testHistoriesPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default TestHistoryComponent;
