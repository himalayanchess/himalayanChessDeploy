import React from "react";
import Input from "../Input";
import { Divider } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
const SelectBatch = ({ selectedBatch, setselectedBatch }: any) => {
  const arr = Array.from({ length: 7 }, (_, i) => i);

  return (
    <>
      <h1 className="font-medium text-lg mb-3 flex items-center">
        <GroupIcon />
        <span className="ml-1">Batches</span>
      </h1>
      <div className="search-batches-container h-1/2 flex flex-col">
        {/* search input */}
        <div className="searchInput mb-3 sticky top-0">
          <Input placeholder="Search batch" />
        </div>
        {/* batches list */}
        <div className="batch-list  overflow-y-auto ">
          {arr.map((el, i) => {
            return (
              <div
                key={i}
                className="w-full bg-white rounded-md text-xs p-2 mb-2 cursor-pointer hover:bg-gray-100"
              >
                batch-{el}
              </div>
            );
          })}
        </div>
      </div>
      <Divider sx={{ margin: "1rem 0" }} />
      {/* assigned class list */}
      <div className="assigned-classlist-container h-1/2 ">
        <h1 className="font-medium text-lg flex items-center">
          <AssignmentIndIcon />
          <span className="ml-1">Assigned Classes</span>
        </h1>
        {/* assigned classes list */}
        <div className="assigned-class-list">
          <div className="assigned-class p-3  w-full my-2 cursor-pointer hover:bg-gray-100 rounded-md">
            <p className="text-sm">Batch-0</p>
            {/* student-trainer */}
            <div className="student-trainer flex ">
              <p className="text-xs flex items-center mr-4">
                <PeopleAltOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                <span className="ml-1">10 students</span>
              </p>
              <p className="text-xs flex items-center">
                <AccountCircleOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                <span className="ml-1">Trainer mhr</span>
              </p>
            </div>
            {/* <Divider sx={{ margin: "0.5rem 0" }} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectBatch;
