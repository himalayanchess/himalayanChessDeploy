import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportBranchesListToExcel(branches: any[]) {
  const data = branches.map((branch) => {
    return {
      "Branch Name": branch.branchName || "N/A",
      "Branch Code": branch.branchCode || "N/A",
      Address: branch.address || "N/A",
      Country: branch.country || "N/A",
      "Established Date": branch.establishedDate
        ? dayjs(branch.establishedDate).tz(timeZone).format("DD MMM YYYY")
        : "N/A",
      "Contact Name": branch.contactName || "N/A",
      "Contact Phone": branch.contactPhone || "N/A",
      "Contact Email": branch.contactEmail || "N/A",
      "Is Main Branch": branch.isMainBranch ? "Yes" : "No",
      "Affiliated To": branch.affiliatedTo || "N/A",
      "Map Location": branch.mapLocation || "N/A",
      "Active Status": branch.activeStatus ? "Active" : "Inactive",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = new Array(Object.keys(data[0] || {}).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Branches");

  XLSX.writeFile(
    wb,
    `Branches_List_${dayjs().tz(timeZone).format("YYYY-MM-DD_HH-mm")}.xlsx`
  );
}
