import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportLichessTournamentListToExcel(tournaments: any[]) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tournament Basic Details
  const basicDetailsRows = tournaments.map((t, index) => ({
    "SN.": index + 1,
    "Tournament Name": t.tournamentName || "N/A",
    Date: t.date ? dayjs(t.date).tz(timeZone).format("DD MMM YYYY") : "N/A",
    Day: t.day || "N/A",
    Time: t.time || "N/A",
    "Branch Name": t.branchName || "N/A",
    "Tournament Type": t.tournamentType || "N/A",
    "Initial Time (min)": t.clockTime?.initialTime ?? "N/A",
    "Increment (sec)": t.clockTime?.increment ?? "N/A",
    "Week No": t.weekNo ?? "N/A",
    Year: t.year ?? "N/A",
    "Tournament URL": t.tournamentUrl || "N/A",
  }));

  const basicDetailsSheet = XLSX.utils.json_to_sheet(basicDetailsRows);
  XLSX.utils.book_append_sheet(wb, basicDetailsSheet, "Tournament Details");

  // Sheet 2: Tournament Winners
  const winnerRows: any[] = [];

  tournaments.forEach((t, tIndex) => {
    // Tournament header
    winnerRows.push({
      "SN.": tIndex + 1,
      "Tournament Name": t.tournamentName,
      Date: t.date ? dayjs(t.date).tz(timeZone).format("DD MMM YYYY") : "N/A",
      Day: t.day || "N/A",
      Time: t.time || "N/A",
      "Branch Name": t.branchName || "N/A",
    });

    // Winners header
    winnerRows.push({
      Rank: "Rank",
      "Player Name": "Player Name",
      "Lichess Points": "Lichess Points",
      "Medal Points": "Medal Points",
    });

    // Winners data
    const winners = (t.lichessWeeklyWinners || [])
      .filter((w: any) => w.activeStatus)
      .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));

    winners.forEach((w: any, wIndex: number) => {
      winnerRows.push({
        Rank: w.rank || "-",
        "Player Name": w.studentName || "-",
        "Lichess Points": w.lichessPoints || "-",
        "Medal Points": w.medalPoints || "-",
      });
    });

    // Empty row between tournaments
    winnerRows.push({});
  });

  const winnerSheet = XLSX.utils.json_to_sheet(winnerRows);
  XLSX.utils.book_append_sheet(wb, winnerSheet, "Winners");

  // Set column widths
  basicDetailsSheet["!cols"] = [
    { wch: 5 }, // SN.
    { wch: 30 }, // Tournament Name
    { wch: 12 }, // Date
    { wch: 10 }, // Day
    { wch: 12 }, // Time
    { wch: 20 }, // Branch Name
    { wch: 15 }, // Tournament Type
    { wch: 8 }, // Initial Time
    { wch: 8 }, // Increment
    { wch: 8 }, // Week No
    { wch: 8 }, // Year
    { wch: 30 }, // Tournament URL
  ];

  winnerSheet["!cols"] = [
    { wch: 10 }, // Rank
    { wch: 25 }, // Player Name
    { wch: 15 }, // Lichess Points
    { wch: 12 }, // Medal Points
  ];

  XLSX.writeFile(
    wb,
    `Lichess_Tournaments_${dayjs().tz(timeZone).format("YYYY-MM-DD")}.xlsx`
  );
}
