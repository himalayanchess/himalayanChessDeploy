import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportLitchesTournamentListToExcel(tournaments: any[]) {
  // Basic Tournament Info Sheet
  const basicDetails = tournaments.map((t, index) => ({
    SN: index + 1,
    "Tournament Name": t.tournamentName || "N/A",
    Date: t.date ? dayjs(t.date).tz(timeZone).format("DD MMMM, YYYY") : "N/A",
    Day: t.day || "N/A",
    Time: t.time || "N/A",
    "Tournament URL": t.tournamentUrl || "N/A",
    "Clock Initial Time (min)": t.clockTime?.initialTime ?? "N/A",
    "Clock Increment (sec)": t.clockTime?.increment ?? "N/A",
    "Branch Name": t.branchName || "N/A",
    "Tournament Type": t.tournamentType || "N/A",
    "Week No": t.weekNo ?? "N/A",
    Year: t.year ?? "N/A",
    "Active Status": t.activeStatus ? "Active" : "Inactive",
    "Created At": dayjs(t.createdAt)
      .tz(timeZone)
      .format("DD MMMM, YYYY hh:mm A"),
    "Updated At": dayjs(t.updatedAt)
      .tz(timeZone)
      .format("DD MMMM, YYYY hh:mm A"),
  }));

  const basicSheet = XLSX.utils.json_to_sheet(basicDetails);
  basicSheet["!cols"] = Array(
    basicDetails[0] ? Object.keys(basicDetails[0]).length : 0
  ).fill({ wch: 20 });

  // Winner Data Sheet
  const winnerDetails: any[] = [];

  tournaments.forEach((t, index) => {
    t.litchesWeeklyWinners.forEach((w: any, wIndex: number) => {
      winnerDetails.push({
        "Tournament SN": index + 1,
        "Tournament Name": t.tournamentName || "N/A",
        "Winner SN": wIndex + 1,
        "Student Name": w.studentName || "N/A",
        "Litches Username": w.litchesUsername || "N/A",
        "Litches URL": w.litchesUrl || "N/A",
        "Performance URL": w.performanceUrl || "N/A",
        "Medal Points": w.medalPoints ?? "N/A",
        Rank: w.rank ?? "N/A",
        "Active Status": w.activeStatus ? "Active" : "Inactive",
      });
    });
  });

  const winnerSheet = XLSX.utils.json_to_sheet(winnerDetails);
  winnerSheet["!cols"] = Array(
    winnerDetails[0] ? Object.keys(winnerDetails[0]).length : 0
  ).fill({ wch: 25 });

  // Workbook and Save
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, basicSheet, "Tournaments");
  XLSX.utils.book_append_sheet(wb, winnerSheet, "Winners");

  XLSX.writeFile(
    wb,
    `Litches_Tournaments_${dayjs().tz(timeZone).format("YYYY-MM-DD")}.xlsx`
  );
}
