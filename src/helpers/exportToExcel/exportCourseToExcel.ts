import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Function to Export Course Data to Excel
export const exportCourseToExcel = (courseRecord: any) => {
  // Generate Basic Course Data
  const basicCourseData = {
    "Course Name": courseRecord.name,
    "Duration (Months)": courseRecord.duration,
    "Affiliated To": courseRecord.affiliatedTo,
    "Active Status": courseRecord.activeStatus ? "Active" : "Inactive",
    "Next Course Name": courseRecord.nextCourseName || "N/A",
  };

  // Generate Chapters and Sub-Chapters Data
  const chaptersData = courseRecord.chapters.map(
    (chapter: any, index: number) => {
      const chapterName = chapter.chapterName || "N/A";
      const subChapters = chapter.subChapters.length
        ? chapter.subChapters.join(", ")
        : "N/A";

      return {
        "Chapter Index": index + 1,
        "Chapter Name": chapterName,
        "Sub-Chapters": subChapters,
        "Chapter Status": chapter.activeStatus ? "Active" : "Inactive",
      };
    }
  );

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  const courseName = courseRecord.name.replace(/\s+/g, "_"); // Replace spaces with underscores
  const fileName = `course_${courseName}`;

  // Add basic course data sheet
  const basicCourseSheet = XLSX.utils.json_to_sheet([basicCourseData]);
  XLSX.utils.book_append_sheet(wb, basicCourseSheet, "Basic Course Data");

  // Add chapters data sheet
  const chaptersSheet = XLSX.utils.json_to_sheet(chaptersData);
  XLSX.utils.book_append_sheet(wb, chaptersSheet, "Chapters Data");

  // Export the Excel file
  const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelFile], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
