import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";

import BranchBatchList from "./BranchBatchList";
import { exportBatchesListToExcel } from "@/helpers/exportToExcel/exportBatchesListToExcel";

const BranchBatchInfo = ({ branchRecord, allActiveBatches }: any) => {
  const [selectedBranchStatus, setselectedBranchStatus] = useState("all");
  const [filteredbatchList, setfilteredbatchList] = useState([]);

  const exportToExcel = () => {
    exportBatchesListToExcel(filteredbatchList);
  };

  useEffect(() => {
    let tempFilteredBatches = allActiveBatches?.filter(
      (batch: any) =>
        batch?.branchName?.toLowerCase() ===
        branchRecord?.branchName?.toLowerCase()
    );

    tempFilteredBatches =
      selectedBranchStatus.toLowerCase() === "all"
        ? tempFilteredBatches
        : selectedBranchStatus.toLowerCase() === "active"
        ? tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.completedStatus?.toLowerCase() === "ongoing" ||
              !batch?.batchEndDate
          )
        : tempFilteredBatches?.filter(
            (batch: any) =>
              batch?.completedStatus?.toLowerCase() === "completed" ||
              batch?.batchEndDate
          );

    setfilteredbatchList(tempFilteredBatches);
  }, [allActiveBatches, selectedBranchStatus, branchRecord]);

  return (
    <div className="w-full flex flex-col h-full gap-5">
      <div className="students-list flex-1 flex flex-col h-full  col-span-3">
        <h1 className="font-bold text-gray-500">Batches</h1>

        <div className="buttons mt-1 flex justify-between">
          <div className="buttons  flex gap-2 items-end">
            <Button
              variant={
                selectedBranchStatus === "all" ? "contained" : "outlined"
              }
              onClick={() => setselectedBranchStatus("all")}
              size="small"
            >
              All
            </Button>
            <Button
              variant={
                selectedBranchStatus === "active" ? "contained" : "outlined"
              }
              onClick={() => setselectedBranchStatus("active")}
              size="small"
            >
              Active
            </Button>
            <Button
              variant={
                selectedBranchStatus === "completed" ? "contained" : "outlined"
              }
              onClick={() => setselectedBranchStatus("completed")}
              size="small"
            >
              Completed
            </Button>
            <p className="text-sm">
              Showing {filteredbatchList?.length} records
            </p>
          </div>
          {/* excel button */}
          <div className="excelbutton">
            <Button
              onClick={exportToExcel}
              variant="contained"
              color="success"
              disabled={filteredbatchList?.length === 0}
              startIcon={<DownloadIcon />}
            >
              Export to Excel
            </Button>
          </div>
        </div>

        <div className="flex-1 h-full">
          <BranchBatchList batchList={filteredbatchList} />
        </div>
      </div>
    </div>
  );
};

export default BranchBatchInfo;
