import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportTestHistoryListToExcel(testHistories: any[]) {
  const data = testHistories.map((history) => {
    return {
      "Affiliated To": history.affiliatedTo || "N/A",
      "Exam Date (UTC)": history.examUtcDate
        ? dayjs(history.examUtcDate).tz(timeZone).format("DD MMM YYYY")
        : "N/A",
      "Exam Date (Nepali)": history.examNepaliDate
        ? dayjs(history.examNepaliDate).format("DD MMM YYYY")
        : "N/A",
      "Student Name": history.studentName || "N/A",
      "Branch Name": history.branchName || "N/A",
      "Batch Name": history.batchName || "N/A",
      "Course Name": history.courseName || "N/A",
      "Checked By": history.checkedByName || "N/A",
      "Test Material URL": history.testMaterialUrl || "N/A",
      "Exam Title": history.examTitle || "N/A",
      "Total Marks": history.totalMarks || "N/A",
      "Pass Marks": history.passMarks || "N/A",
      "Obtained Score": history.obtainedScore || "N/A",
      "Result Status": history.resultStatus || "N/A",
      "Active Status": history.activeStatus ? "Active" : "Inactive",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = new Array(Object.keys(data[0] || {}).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Test History");

  XLSX.writeFile(
    wb,
    `Test_History_List_${dayjs().tz(timeZone).format("YYYY-MM-DD_HH-mm")}.xlsx`
  );
}
