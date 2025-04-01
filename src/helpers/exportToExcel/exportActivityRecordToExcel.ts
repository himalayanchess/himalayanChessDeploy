import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Main function to process the activity record and export the data to Excel
export const exportActivityRecordToExcel = (activityRecord: any) => {
  // Generate Basic Data
  const basicData = {
    "Affiliated To": activityRecord.affiliatedTo || "N/A",
    "Nepali Date": new Date(activityRecord.nepaliDate).toLocaleDateString(),
    "Present Status": activityRecord.userPresentStatus,
    "Trainer Name": activityRecord.trainerName,
    "Course Name": activityRecord.courseName,
    "Batch Name": activityRecord.batchName,
    "Project Name": activityRecord.projectName || "N/A",
    "Week Start Date": new Date(
      activityRecord.weekStartDate
    ).toLocaleDateString(),
    "Week End Date": new Date(activityRecord.weekEndDate).toLocaleDateString(),
    "Week Number": activityRecord.weekNumber,
    "Start Time": new Date(activityRecord.startTime).toLocaleTimeString(),
    "End Time": new Date(activityRecord.endTime).toLocaleTimeString(),
    "Arrival Time": activityRecord.arrivalTime || "N/A",
    "Departure Time": activityRecord.departureTime || "N/A",
    "Holiday Status": activityRecord.holidayStatus ? "Yes" : "No",
    "Holiday Description": activityRecord.holidayDescription || "N/A",
  };

  // Generate Student Records
  const studentRecords = activityRecord.studentRecords.map((student: any) => {
    const studyTopicFields = student.studyTopics.map(
      (topic: string, index: number) => ({
        [`Study Topic ${index + 1}`]: topic || "N/A",
      })
    );

    // Flatten the array of study topics into a single object
    const studyTopicObject = Object.assign({}, ...studyTopicFields);

    return {
      "Student Name": student.name,
      ...studyTopicObject, // Spread the study topics dynamically
      "Completed Status": student.completedStatus
        ? "Completed"
        : "Not Completed",
      Attendance: student.attendance,
      Remark: student.remark || "N/A",
    };
  });

  // Generate Study Materials
  const studyMaterials = activityRecord.studyMaterials.map((material: any) => ({
    "File Name": material.fileName,
    "File URL": material.fileUrl,
    "Uploaded At": new Date(material.uploadedAt).toLocaleDateString(),
  }));

  // Get the file name from Nepali Date and Trainer Name
  const nepaliDate = new Date(activityRecord.nepaliDate)
    .toLocaleDateString()
    .replace(/\//g, "-");
  const trainerName = activityRecord.trainerName.replace(/\s+/g, "_"); // Replace spaces with underscores
  const fileName = `activityrecord_${nepaliDate}_${trainerName}`;

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Add basic data sheet
  const basicDataSheet = XLSX.utils.json_to_sheet([basicData]);
  XLSX.utils.book_append_sheet(wb, basicDataSheet, "Basic Data");

  // Add student records sheet
  const studentSheet = XLSX.utils.json_to_sheet(studentRecords);
  XLSX.utils.book_append_sheet(wb, studentSheet, "Student Records");

  // Add study materials sheet
  const studyMaterialSheet = XLSX.utils.json_to_sheet(studyMaterials);
  XLSX.utils.book_append_sheet(wb, studyMaterialSheet, "Study Materials");

  // Export the Excel file
  const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelFile], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
