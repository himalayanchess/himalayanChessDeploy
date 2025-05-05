import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportUsersListToExcel(users: any[]) {
  const data = users.map((user) => ({
    "Full Name": user?.name || "N/A",
    Role: user?.role || "N/A",
    "Date of Birth": user?.dob
      ? dayjs(user.dob).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    Gender: user?.gender || "N/A",
    Address: user?.address || "N/A",
    Phone: user?.phone || "N/A",
    Email: user?.email || "N/A",
    "Joined Date": user?.joinedDate
      ? dayjs(user.joinedDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    "End Date": user?.endDate
      ? dayjs(user.endDate).tz(timeZone).format("DD MMMM, YYYY")
      : "N/A",
    "Completed Status": user?.completedStatus || "N/A",
    Title: user?.title || "N/A",
    "FIDE ID": user?.fideId || "N/A",
    Rating: user?.rating || "N/A",
    "Trainer CV": user?.trainerCvUrl || "N/A",
    "Emergency Contact Name": user?.emergencyContactName || "N/A",
    "Emergency Contact No": user?.emergencyContactNo || "N/A",
    "Branch Name": user?.branchName || "N/A",
    "Active Status": user?.activeStatus ? "Active" : "Inactive",
    "Login Access": user?.isActive ? "Enabled" : "Disabled",
    "Global Admin": user?.isGlobalAdmin ? "Yes" : "No",
    "Image URL": user?.imageUrl || "N/A",
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Optional: column width settings
  ws["!cols"] = new Array(Object.keys(data[0] || {}).length).fill({ wch: 20 });

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // Write file
  XLSX.writeFile(
    wb,
    `User_List_${dayjs().tz(timeZone).format("YYYY-MM-DD_HH-mm")}.xlsx`
  );
}
