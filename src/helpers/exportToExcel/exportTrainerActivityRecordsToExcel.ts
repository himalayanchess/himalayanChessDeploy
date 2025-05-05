import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";
export function exportTrainerActivityRecordsToExcel(
  filteredRecords: any,
  name: any
) {
  const dataToExport = filteredRecords.map((record: any, index: number) => {
    const studyMaterials =
      record.classStudyMaterials
        ?.map((material: any) => `${material.fileName}: ${material.fileUrl}`)
        .join("\n") || "N/A";

    return {
      SN: index + 1,
      Date: dayjs(record.utcDate).tz(timeZone).format("DD MMMM, YYYY"),
      "Affiliated To": record.affiliatedTo,
      "Main Study Topic": record.mainStudyTopic || "N/A",
      "Batch Name": record.batchName,
      "Course Name": record.courseName,
      "Trainer Name": record.trainerName,
      "Trainer Role": record.trainerRole || "Primary",
      "Attendance Status": record.userPresentStatus || "N/A",
      "Start Time": record.startTime
        ? dayjs(record.startTime).tz(timeZone).format("hh:mm A")
        : "N/A",
      "End Time": record.endTime
        ? dayjs(record.endTime).tz(timeZone).format("hh:mm A")
        : "N/A",
      "Week Number": record.weekNumber || "N/A",
      Description: record.description || "N/A",
      "Current Class Number": record.currentClassNumber || 0,
      "Holiday Status": record.holidayStatus ? "Yes" : "No",
      "Holiday Description": record.holidayDescription || "N/A",
      "Study Materials Count": record.classStudyMaterials?.length || 0,
      "Study Materials Details": studyMaterials,
      "Active Status": record.activeStatus ? "Active" : "Inactive",
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataToExport);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 }, // SN
    { wch: 15 }, // Date
    { wch: 15 }, // Affiliated To
    { wch: 25 }, // Main Study Topic
    { wch: 15 }, // Batch Name
    { wch: 15 }, // Course Name
    { wch: 15 }, // Trainer Name
    { wch: 15 }, // Trainer Role
    { wch: 15 }, // Attendance Status
    { wch: 10 }, // Start Time
    { wch: 10 }, // End Time
    { wch: 10 }, // Week Number
    { wch: 10 }, // Holiday Status
    { wch: 10 }, // Holiday Description
    { wch: 10 }, // Study Materials Count
    { wch: 40 }, // Study Materials Details
    { wch: 10 }, // Active Status
  ];

  // Initialize rows array if it doesn't exist
  if (!ws["!rows"]) {
    ws["!rows"] = [];
  }

  // Process each row to set appropriate height
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    // Skip header row (R=0)
    if (R === 0) {
      ws["!rows"][R] = { hpx: 20 }; // Header row height
      continue;
    }

    // Default row height
    let rowHeight = 20;

    // Check Study Materials Details column (column N, index 13)
    const studyMaterialsCell = ws[XLSX.utils.encode_cell({ c: 13, r: R })];
    if (studyMaterialsCell && studyMaterialsCell.v) {
      const lineCount = studyMaterialsCell.v.toString().split("\n").length;
      rowHeight = Math.max(rowHeight, lineCount * 15);
    }

    // Set the row height
    ws["!rows"][R] = { hpx: rowHeight };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Activity Records");

  // Generate the Excel file and trigger download
  XLSX.writeFile(
    wb,
    `ActivityRecords_${name}_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
}
