"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { Component } from "lucide-react";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Box, Button, FormControlLabel, Modal, Radio } from "@mui/material";
import AddUser from "@/components/user/AddUser";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import UserList from "@/components/user/UserList";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";

import {
  fetchAllBatches,
  fetchAllProjects,
  filterBatchesList,
  getAllBranches,
} from "@/redux/allListSlice";
import SearchInput from "../SearchInput";
import Link from "next/link";
import BatchList from "./BatchList";
import { exportBatchesListToExcel } from "@/helpers/exportToExcel/exportBatchesListToExcel";

const BatchComponent = ({ role = "" }: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // selector
  const {
    allActiveProjects,
    allActiveBatches,
    allFilteredActiveBatches,
    allBatchesLoading,
    allActiveBranchesList,
  } = useSelector((state: any) => state.allListReducer);

  const affilatedToOptions = ["All", "HCA", "School"];
  const completedStatusOptions = ["All", "Ongoing", "Completed"];

  const [searchText, setsearchText] = useState("");
  const [selectedCompleteStatus, setselectedCompleteStatus] = useState("All");
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("");
  const [selectedProject, setselectedProject] = useState("All");
  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredBatchCount, setfilteredBatchCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [batchesPerPage] = useState(7);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * batchesPerPage + 1;
  const endItem = Math.min(currentPage * batchesPerPage, filteredBatchCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredBatchCount}`;

  //export to excel
  const exportToExcel = () => {
    exportBatchesListToExcel(allFilteredActiveBatches);
  };

  // Reset current page to 1 and search text when selectedStatus changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedAffiliatedTo, selectedCompleteStatus, selectedProject]);

  // if affiliated to changes then reset project dropdown
  useEffect(() => {
    // Check if the user is a superadmin or global admin
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // Only reset if it's a superadmin or global admin
    if (isSuperOrGlobalAdmin) {
      setselectedProject("All");
      setselectedBranch("All");
    }
  }, [selectedAffiliatedTo, session?.data?.user]);

  // filter
  useEffect(() => {
    // filter users
    // complete status
    let tempFilteredBatchesList =
      selectedCompleteStatus.toLowerCase() == "all"
        ? allActiveBatches
        : allActiveBatches.filter(
            (batch: any) =>
              batch.completedStatus.toLowerCase() ==
              selectedCompleteStatus.toLowerCase()
          );

    // affiliated to
    tempFilteredBatchesList =
      selectedAffiliatedTo?.toLowerCase() == "all"
        ? tempFilteredBatchesList
        : tempFilteredBatchesList.filter(
            (batch: any) =>
              batch.affiliatedTo.toLowerCase() ==
              selectedAffiliatedTo?.toLowerCase()
          );

    // project name
    if (selectedAffiliatedTo?.toLowerCase() == "school") {
      tempFilteredBatchesList =
        selectedProject.toLowerCase() == "all"
          ? tempFilteredBatchesList
          : tempFilteredBatchesList.filter(
              (batch: any) =>
                batch.projectName.toLowerCase() == selectedProject.toLowerCase()
            );
    }

    // filter by batch
    tempFilteredBatchesList =
      selectedBranch?.toLowerCase() == "all"
        ? tempFilteredBatchesList
        : tempFilteredBatchesList.filter(
            (batch: any) =>
              batch.branchName.toLowerCase() == selectedBranch.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredBatchesList = tempFilteredBatchesList.filter(
        (batch: any) =>
          batch.batchName.toLowerCase().includes(searchText.toLowerCase()) ||
          batch.projectName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    tempFilteredBatchesList = tempFilteredBatchesList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setfilteredBatchCount(tempFilteredBatchesList?.length);
    setCurrentPage(1);
    dispatch(filterBatchesList(tempFilteredBatchesList));
  }, [
    allActiveProjects,
    allActiveBatches,
    selectedCompleteStatus,
    selectedAffiliatedTo,
    selectedProject,
    selectedBranch,
    searchText,
  ]);

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

  // intial data fetch
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(fetchAllBatches());
    dispatch(getAllBranches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-4 px-10 border bg-white rounded-lg">
      <div className="main-header flex justify-between">
        <h2 className="text-3xl mb-2  text-gray-700 flex items-center">
          <Component />
          <span className="ml-1">Batch List</span>
        </h2>

        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveBatches?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      {/* title and Dropdown */}
      <div className="batches-header my-0 flex items-end justify-between gap-2">
        <div className="dropdowns-showing flex flex-1  gap-4 items-end">
          <div className="dropdowns grid grid-cols-4 gap-2  w-full">
            <Dropdown
              label="Status"
              options={completedStatusOptions}
              selected={selectedCompleteStatus}
              onChange={setselectedCompleteStatus}
              width="full"
            />
            <Dropdown
              label="Affiliated to"
              options={affilatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              width="full"
              disabled={!isSuperOrGlobalAdmin}
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
            {isSuperOrGlobalAdmin && (
              <Dropdown
                label="Project"
                options={[
                  "All",
                  ...(allActiveProjects?.map((project: any) => project.name) ||
                    []),
                ]}
                disabled={selectedAffiliatedTo?.toLowerCase() != "school"}
                selected={selectedProject}
                onChange={setselectedProject}
                width="full"
              />
            )}
          </div>
        </div>

        {/* Search */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e: any) => setsearchText(e.target.value)}
          />

          {/* add batch button */}
          {session?.data?.user?.role?.toLowerCase() != "trainer" ? (
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/batches/addbatch`}
            >
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Batch</span>
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
              <span className="ml-1">Add Batch</span>
            </Button>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-600">{showingText}</span>
      {/* Table */}
      <BatchList
        allFilteredActiveBatches={allFilteredActiveBatches}
        currentPage={currentPage}
        batchesPerPage={batchesPerPage}
        allBatchesLoading={allBatchesLoading}
        role={role}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(filteredBatchCount / batchesPerPage)} // Total pages
          page={currentPage} //allCoursesLoading Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default BatchComponent;
