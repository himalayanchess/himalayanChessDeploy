import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportLichessLeaderboardToExcel(
  leaderboard: any[],
  {
    useAdvancedDate,
    selectedMonth,
    startDate,
    endDate,
  }: {
    useAdvancedDate: boolean;
    selectedMonth: string;
    startDate: string;
    endDate: string;
  }
) {
  // 🧾 Basic Info sheet (first sheet)
  const basicInfo = [
    {
      "Advanced Date Filter": useAdvancedDate ? "Yes" : "No",
      "Selected Month": useAdvancedDate ? "N/A" : selectedMonth,
      "Start Date": useAdvancedDate
        ? dayjs(startDate).tz(timeZone).format("DD MMM, YYYY")
        : "N/A",
      "End Date": useAdvancedDate
        ? dayjs(endDate).tz(timeZone).format("DD MMM, YYYY")
        : "N/A",
      "Exported At": dayjs().tz(timeZone).format("DD MMM, YYYY hh:mm A"),
    },
  ];

  const basicInfoSheet = XLSX.utils.json_to_sheet(basicInfo);
  basicInfoSheet["!cols"] = Array(Object.keys(basicInfo[0]).length).fill({
    wch: 25,
  });

  // 🏆 Leaderboard sheet
  const leaderboardRows = leaderboard.map((item, index) => ({
    Rank: index + 1,
    "Student Name": item.studentName || "N/A",
    "FIDE ID": item.fideId || "N/A",
    "Lichess Username": item.lichessUsername || "N/A",
    "Lichess Points": item.lichessPoints ?? "N/A",
    "Medal Points": item.medalPoints ?? "N/A",
    "Branch Name": item.branchName || "N/A",
    "Lichess Profile URL": item.lichessUrl || "N/A",
  }));

  const leaderboardSheet = XLSX.utils.json_to_sheet(leaderboardRows);
  leaderboardSheet["!cols"] = Array(
    Object.keys(leaderboardRows[0]).length
  ).fill({ wch: 25 });

  // 📘 Create workbook and append sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, basicInfoSheet, "Basic Info");
  XLSX.utils.book_append_sheet(wb, leaderboardSheet, "Leaderboard");

  // 📂 Filename based on filter type
  const fileName = useAdvancedDate
    ? `Lichess_Leaderboard_${dayjs(startDate)
        .tz(timeZone)
        .format("DDMMMYYYY")}_to_${dayjs(endDate)
        .tz(timeZone)
        .format("DDMMMYYYY")}.xlsx`
    : `Lichess_Leaderboard_${selectedMonth}_Summary.xlsx`;

  XLSX.writeFile(wb, fileName);
}
