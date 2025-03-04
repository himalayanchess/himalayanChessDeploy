import React, { useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import StudentList from "./StudentList";

const StudentComponent = () => {
  const affiliatedToOptions = ["All", "HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("All");
  return (
    <div className="flex-1 py-6 px-10 border bg-white rounded-lg">
      <h1 className="text-2xl font-bold">Student Management</h1>
      {/* student header */}
      <div className="student-header my-2 flex items-end justify-between">
        {/* dropdown */}
        <div className="dropdown flex items-end">
          <Dropdown
            label="Affiliated to"
            options={affiliatedToOptions}
            selected={selectedAffiliatedTo}
            onChange={setselectedAffiliatedTo}
          />
          {/* Student count */}
          <span className="text-xl text-gray-500 font-bold ml-2">55</span>
        </div>
        {/* search-filter-menus */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput placeholder="Search" />
          {/* filter button */}
          <div className="filter-button border border-gray-300 rounded-md px-3  flex items-center cursor-pointer">
            <FilterListIcon />
            <span className="ml-1 text-sm">Filters</span>
          </div>
          {/* add student button */}
          <Button variant="contained" size="small">
            <AddIcon />
            <span className="ml-1">Add Student</span>
          </Button>
        </div>
      </div>
      {/* students list */}
      <StudentList />
    </div>
  );
};

export default StudentComponent;
