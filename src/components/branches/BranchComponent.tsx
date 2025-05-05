import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import DownloadIcon from "@mui/icons-material/Download";

import {
  Button,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { filterBranchList, getAllBranches } from "@/redux/allListSlice";
import { BookCopy, MapPinHouse } from "lucide-react";
import BranchList from "./BranchList";
import { useSession } from "next-auth/react";
import { exportBranchesListToExcel } from "@/helpers/exportToExcel/exportBranchesListToExcel";

const BranchComponent = ({ role = "" }: any) => {
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();

  // selector
  const {
    allActiveBranchesList,
    allFilteredActiveBranchesList,
    allBranchesLoading,
  } = useSelector((state: any) => state.allListReducer);
  //options
  const affiliatedToOptions = ["All", "HCA", "School"];
  //state vars
  const [filterMainBranch, setfilterMainBranch] = useState(false);
  const [searchText, setsearchText] = useState("");
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const [filteredBranchCount, setfilteredBranchCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [branchesPerPage] = useState(7);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * branchesPerPage + 1;
  const endItem = Math.min(currentPage * branchesPerPage, filteredBranchCount);
  const showingText = `Showing ${startItem}-${endItem} of ${filteredBranchCount}`;

  //export to excel
  const exportToExcel = () => {
    exportBranchesListToExcel(allFilteredActiveBranchesList);
  };

  // Reset current page to 1 and searchtext when selectedAffiliatedTo changes
  useEffect(() => {
    setCurrentPage(1);
    setsearchText("");
  }, [selectedAffiliatedTo]);

  // filter
  useEffect(() => {
    // filter users
    let tempFilteredBranchesList =
      selectedAffiliatedTo.toLowerCase() == "all" ||
      selectedAffiliatedTo.toLowerCase() == "hca"
        ? allActiveBranchesList
        : allActiveBranchesList.filter(
            (branch: any) =>
              branch?.affiliatedTo?.toLowerCase() ==
              selectedAffiliatedTo.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredBranchesList = tempFilteredBranchesList.filter(
        (branch: any) =>
          branch.branchName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterMainBranch) {
      tempFilteredBranchesList = tempFilteredBranchesList.filter(
        (branch: any) => branch.isMainBranch === true
      );
    }

    tempFilteredBranchesList = tempFilteredBranchesList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setfilteredBranchCount(tempFilteredBranchesList?.length);
    setCurrentPage(1);
    dispatch(filterBranchList(tempFilteredBranchesList));
  }, [
    allActiveBranchesList,
    selectedAffiliatedTo,
    searchText,
    filterMainBranch,
  ]);

  // intial data fetch
  useEffect(() => {
    dispatch(getAllBranches());
  }, []);
  return (
    <div className="flex-1 flex flex-col py-6 px-10 border bg-white rounded-lg">
      <div className="main-header flex justify-between">
        <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
          <MapPinHouse />
          <span className="ml-2">Branches List</span>
        </h2>
        {/* excel button */}
        <div className="excelbutton">
          <Button
            onClick={exportToExcel}
            variant="contained"
            color="success"
            disabled={allFilteredActiveBranchesList?.length === 0}
            startIcon={<DownloadIcon />}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="branches-header my-0 flex items-end justify-between">
        {/* title and Dropdown */}
        <div className="title-options  ">
          <div className="dropdown flex gap-4 items-end">
            <Dropdown
              label="Affiliated to"
              options={affiliatedToOptions}
              selected={selectedAffiliatedTo}
              onChange={setselectedAffiliatedTo}
              disabled
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mainBranch"
                checked={filterMainBranch}
                onChange={(e) => setfilterMainBranch(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="mainBranch"
                className="ml-2 text-sm cursor-pointer"
              >
                Show main branch
              </label>
            </div>

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

            {/* add branch button */}
            {session?.data?.user?.role?.toLowerCase() == "superadmin" ? (
              <Link href={`/${role?.toLowerCase()}/branches/addbranch`}>
                <Button variant="contained" size="small">
                  <AddIcon />
                  <span className="ml-1">Add Branch</span>
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
                <span className="ml-1">Unauthorized</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}

      <BranchList
        allFilteredActiveBranchesList={allFilteredActiveBranchesList}
        currentPage={currentPage}
        branchesPerPage={branchesPerPage}
        allBranchesLoading={allBranchesLoading}
        role={role}
      />

      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-3">
        <Pagination
          count={Math.ceil(filteredBranchCount / branchesPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default BranchComponent;
