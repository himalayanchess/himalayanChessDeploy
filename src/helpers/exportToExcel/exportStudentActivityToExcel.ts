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
  studentInfo: any // This should be a HcaAffiliatedStudent document
) {
  // Format basic student information
  const basicInfo = {
    "Student Name": studentInfo?.name || "N/A",
    "Date of Birth": studentInfo?.dob
      ? dayjs(studentInfo.dob).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    Gender: studentInfo?.gender || "N/A",
    "Educational Institute": studentInfo?.educationalInstitute || "N/A",
    "Affiliated To": studentInfo?.affiliatedTo || "N/A",
    "Joined Date": studentInfo?.joinedDate
      ? dayjs(studentInfo.joinedDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    "End Date": studentInfo?.endDate
      ? dayjs(studentInfo.endDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    Address: studentInfo?.address || "N/A",
    Phone: studentInfo?.phone || "N/A",
    "Completed Status": studentInfo?.completedStatus || "N/A",
    "FIDE ID": studentInfo?.fideId || "N/A",
    "Emergency Contact": `${studentInfo?.emergencyContactName || "N/A"} - ${
      studentInfo?.emergencyContactNo || "N/A"
    }`,
    "Current Batches":
      studentInfo?.batches
        ?.filter((b: any) => b.activeStatus)
        ?.map((b: any) => b.batchName)
        ?.join(", ") || "N/A",
    "Enrolled Courses":
      studentInfo?.enrolledCourses
        ?.filter((c: any) => c.activeStatus)
        ?.map((c: any) => c.course)
        ?.join(", ") || "N/A",
    Rating: studentInfo?.rating || "N/A",
    "Active Status": studentInfo?.activeStatus ? "Active" : "Inactive",
  };

  // Create basic info sheet
  const basicInfoSheet = XLSX.utils.json_to_sheet([basicInfo]);

  // Format activity records
  const dataToExport = filteredRecords.map((record: any, index: number) => {
    const studentRecord = record.studentRecords?.[0] || {};

    // Format day in Nepali
    const dayInNepali = dayjs(record.utcDate).tz(timeZone).format("dddd");

    // Format study topics
    const studyTopics = studentRecord?.studyTopics?.join(", ") || "N/A";

    // Format study materials if available
    const studyMaterials =
      record.studyMaterials
        ?.map((material: any) => `${material.fileName}: ${material.fileUrl}`)
        ?.join("\n") || "N/A";

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

  // Create activity records sheet
  const activitySheet = XLSX.utils.json_to_sheet(dataToExport);

  // Set column widths for activity sheet
  activitySheet["!cols"] = [
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
  ];

  // Set column widths for basic info sheet
  basicInfoSheet["!cols"] = [
    { wch: 25 }, // Field names
    { wch: 40 }, // Values
  ];

  // Set row heights for basic info sheet
  basicInfoSheet["!rows"] = [
    { hpx: 20 }, // Header row
    ...Array(Object.keys(basicInfo).length).fill({ hpx: 20 }), // Data rows
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(wb, basicInfoSheet, "Student Profile");
  XLSX.utils.book_append_sheet(wb, activitySheet, "Activity Records");

  // Generate the Excel file and trigger download
  XLSX.writeFile(
    wb,
    `Student_${
      studentInfo?.name?.replace(/\s+/g, "_") || "Profile"
    }_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
}
