import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne"; // Nepali locale

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportBatchesListToExcel(batches: any[]) {
  const formattedData = batches.map((batch, index) => ({
    SN: index + 1,
    "Batch Name": batch.batchName || "N/A",
    "Affiliated To": batch.affiliatedTo || "N/A",
    "Project Name": batch.projectName || "N/A",
    "Completed Status": batch.completedStatus || "N/A",
    "Batch Start Date": batch.batchStartDate
      ? dayjs(batch.batchStartDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    "Batch End Date": batch.batchEndDate
      ? dayjs(batch.batchEndDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    "Branch Name": batch.branchName || "N/A",
    "Total No. of Classes": batch.totalNoOfClasses || 0,
    "Total Classes Taken": batch.totalClassesTaken || 0,
    "Current Course Name": batch.currentCourseName || "N/A",
    "Active Status": batch.activeStatus ? "Active" : "Inactive",
    "Created At": dayjs(batch.createdAt)
      .tz(timeZone)
      .format("DD MMMM, YYYY hh:mm A"),
    "Updated At": dayjs(batch.updatedAt)
      .tz(timeZone)
      .format("DD MMMM, YYYY hh:mm A"),
  }));

  const sheet = XLSX.utils.json_to_sheet(formattedData);

  sheet["!cols"] = [
    { wch: 5 }, // SN
    { wch: 20 }, // Batch Name
    { wch: 20 }, // Affiliated To
    { wch: 25 }, // Project Name
    { wch: 15 }, // Completed Status
    { wch: 18 }, // Batch Start Date
    { wch: 18 }, // Batch End Date
    { wch: 20 }, // Branch Name
    { wch: 20 }, // Total No. of Classes
    { wch: 20 }, // Total Classes Taken
    { wch: 25 }, // Current Course Name
    { wch: 15 }, // Active Status
    { wch: 25 }, // Created At
    { wch: 25 }, // Updated At
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Batches List");

  XLSX.writeFile(
    wb,
    `Batches_List_${dayjs().tz(timeZone).format("YYYY-MM-DD")}.xlsx`
  );
}
