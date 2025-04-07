import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne"; // Import Nepali locale

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportStudentActivityRecordsToExcel(
  filteredRecords: any,
  studentName: any
) {
  const dataToExport = filteredRecords.map((record: any, index: number) => {
    const studentRecord = record.studentRecords?.[0] || {};

    // Format day in Nepali
    const dayInNepali = dayjs(record.utcDate).tz(timeZone).format("dddd"); // Full day name in Nepali

    // Format study topics
    const studyTopics = studentRecord?.studyTopics?.join(", ") || "N/A";

    // Format study materials if available
    const studyMaterials =
      record.studyMaterials
        ?.map((material: any) => `${material.fileName}: ${material.fileUrl}`)
        .join("\n") || "N/A";

    return {
      SN: index + 1,
      Date: dayjs(record.utcDate).tz(timeZone).format("DD MMMM, YYYY"),
      Day: dayInNepali,
      "Affiliated To": record.affiliatedTo,
      "Project Name": record.projectName,
      "Batch Name": record.batchName,
      "Study Topics": studyTopics,
      "Main Study Topic": record.mainStudyTopic || "N/A",
      "Attendance Status": studentRecord?.attendance || "N/A",
      "Start Time": record.startTime
        ? dayjs(record.startTime).tz(timeZone).format("hh:mm A")
        : "N/A",
      "End Time": record.endTime
        ? dayjs(record.endTime).tz(timeZone).format("hh:mm A")
        : "N/A",
      Remark: studentRecord?.remark || "N/A",
      "Completed Status": studentRecord?.completedStatus ? "Yes" : "No",
      "Week Number": record.weekNumber || "N/A",
      "Holiday Status": record.holidayStatus ? "Yes" : "No",
      "Holiday Description": record.holidayDescription || "N/A",
      "Study Materials Count": record.studyMaterials?.length || 0,
      "Study Materials Details": studyMaterials,
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataToExport);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 }, // SN
    { wch: 15 }, // Date
    { wch: 15 }, // Day (Nepali)
    { wch: 15 }, // Affiliated To
    { wch: 15 }, // Project Name
    { wch: 15 }, // Batch Name
    { wch: 30 }, // Study Topics
    { wch: 25 }, // Main Study Topic
    { wch: 15 }, // Attendance Status
    { wch: 10 }, // Start Time
    { wch: 10 }, // End Time
    { wch: 20 }, // Remark
    { wch: 15 }, // Completed Status
    { wch: 10 }, // Week Number
    { wch: 10 }, // Holiday Status
    { wch: 20 }, // Holiday Description
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

    // Check Study Materials Details column (column R, index 17)
    const studyMaterialsCell = ws[XLSX.utils.encode_cell({ c: 17, r: R })];
    if (studyMaterialsCell && studyMaterialsCell.v) {
      const lineCount = studyMaterialsCell.v.toString().split("\n").length;
      rowHeight = Math.max(rowHeight, lineCount * 15);
    }

    // Check Study Topics column (column G, index 6)
    const studyTopicsCell = ws[XLSX.utils.encode_cell({ c: 6, r: R })];
    if (studyTopicsCell && studyTopicsCell.v) {
      const lineCount = studyTopicsCell.v.toString().split(", ").length;
      rowHeight = Math.max(rowHeight, lineCount * 15);
    }

    // Set the row height
    ws["!rows"][R] = { hpx: rowHeight };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Student Activity Records");

  // Generate the Excel file and trigger download
  XLSX.writeFile(
    wb,
    `StudentActivityRecords_${studentName}_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
}
