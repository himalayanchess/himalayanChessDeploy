"use client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { Component, Trophy } from "lucide-react";
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

import { getAllBranches } from "@/redux/allListSlice";

import Link from "next/link";

import SearchInput from "@/components/SearchInput";
import {
  fetchAllLitchesTournaments,
  filterLitchesTournamentList,
} from "@/redux/allTournamentSlice";
import LitchesTournamentsList from "./LitchesTournamentsList";
import { exportLitchesTournamentListToExcel } from "@/helpers/exportToExcel/exportLitchesTournamentListToExcel";

const LitchesWeeklyTournamentComponent = () => {
  // dispatch
  const dispatch = useDispatch<any>();

  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  // selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const {
    allActiveLitchesTournamentsList,
    allFilteredActiveLitchesTournamentsList,
    allLitchesTournamentsLoading,
  } = useSelector((state: any) => state.allTournamentReducer);

  // const affilatedToOptions = ["All", "HCA", "School"];
  // const completedStatusOptions = ["All", "Ongoing", "Completed"];

  const [searchText, setsearchText] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredLitchesTournamentCount, setfilteredLitchesTournamentCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [litchesTournamentsPerPage] = useState(7);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * litchesTournamentsPerPage + 1;
  const endItem = Math.min(
    currentPage * litchesTournamentsPerPage,
    filteredLitchesTournamentCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredLitchesTournamentCount}`;

  //export to excel
  const exportToExcel = () => {
    exportLitchesTournamentListToExcel(allFilteredActiveLitchesTournamentsList);
  };

  // Reset current page to 1 and search text when selectedStatus changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedBranch]);

  // if affiliated to changes then reset project dropdown
  useEffect(() => {
    // Check if the user is a superadmin or global admin
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // Only reset if it's a superadmin or global admin
    if (isSuperOrGlobalAdmin) {
      setselectedBranch("All");
    }
  }, [session?.data?.user]);

  // filter
  useEffect(() => {
    // filter litchtes tournaments
    let tempFilteredLitchesTournamentsList =
      allActiveLitchesTournamentsList?.slice();

    // filter by branch
    tempFilteredLitchesTournamentsList =
      selectedBranch?.toLowerCase() == "all"
        ? tempFilteredLitchesTournamentsList
        : tempFilteredLitchesTournamentsList?.filter(
            (tournament: any) =>
              tournament.branchName.toLowerCase() ==
              selectedBranch?.toLowerCase()
          );

    // search text
    if (searchText.trim() !== "") {
      tempFilteredLitchesTournamentsList =
        tempFilteredLitchesTournamentsList.filter((tournament: any) =>
          tournament.tournamentName
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
    }

    tempFilteredLitchesTournamentsList =
      tempFilteredLitchesTournamentsList?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setfilteredLitchesTournamentCount(
      tempFilteredLitchesTournamentsList?.length
    );
    setCurrentPage(1);
    dispatch(filterLitchesTournamentList(tempFilteredLitchesTournamentsList));
  }, [allActiveLitchesTournamentsList, selectedBranch, searchText]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "All";
    // let affiliatedTo = "All";
    if (!isSuperOrGlobalAdmin) {
      branchName = user?.branchName;
      // affiliatedTo = "HCA";
    }
    setselectedBranch(branchName);
    // setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  // intial data fetch
  useEffect(() => {
    dispatch(fetchAllLitchesTournaments());

    dispatch(getAllBranches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <div className="main-header flex justify-between">
        <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
          <Trophy />
          <span className="ml-1">Litches Tournaments List</span>
        </h2>

        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveLitchesTournamentsList?.length === 0}
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
              href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/litchesweeklytournament/addlitchesweeklytournament`}
            >
              <Button variant="contained" size="small">
                <AddIcon />
                <span className="ml-1">Add Tournament</span>
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
              <span className="ml-1">Add Tournament</span>
            </Button>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-600">{showingText}</span>
      {/* Table */}
      <LitchesTournamentsList
        allFilteredActiveLitchesTournamentsList={
          allFilteredActiveLitchesTournamentsList
        }
        currentPage={currentPage}
        litchesTournamentsPerPage={litchesTournamentsPerPage}
        allLitchesTournamentsLoading={allLitchesTournamentsLoading}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(
            filteredLitchesTournamentCount / litchesTournamentsPerPage
          )} // Total pages
          page={currentPage} //allCoursesLoading Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default LitchesWeeklyTournamentComponent;
