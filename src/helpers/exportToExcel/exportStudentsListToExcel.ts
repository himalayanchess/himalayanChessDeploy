import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

function formatDate(date: any) {
  if (!date) return "N/A";
  return dayjs(date).tz(timeZone).format("DD MMM YYYY");
}

export function exportStudentsListToExcel(students: any[]) {
  const data = students.map((student) => {
    const batchNames = (student.batches || [])
      .map((b: any) => b.batchName || "Unnamed")
      .join(", ");

    return {
      "Affiliated To": student.affiliatedTo || "N/A",
      Name: student.name || "N/A",
      "Date of Birth": formatDate(student.dob),
      Gender: student.gender || "N/A",
      "Educational Institute": student.educationalInstitute || "N/A",
      "Joined Date": formatDate(student.joinedDate),
      "End Date": formatDate(student.endDate),
      Address: student.address || "N/A",
      Phone: student.phone || "N/A",
      "Emergency Contact Name": student.emergencyContactName || "N/A",
      "Emergency Contact No": student.emergencyContactNo || "N/A",
      Title: student.title || "N/A",
      Rating: student.rating || "N/A",
      "FIDE ID": student.fideId || "N/A",
      "Completed Status": student.completedStatus || "N/A",
      "Branch Name": student.branchName || "N/A",
      "Project Name": student.projectName || "N/A",
      "Batch Names": batchNames || "N/A",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = new Array(Object.keys(data[0] || {}).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");

  XLSX.writeFile(
    wb,
    `Students_List_${dayjs().tz(timeZone).format("YYYY-MM-DD_HH-mm")}.xlsx`
  );
}
