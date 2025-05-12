import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportLichessTournamentRecordToExcel(tournament: any) {
  const wb = XLSX.utils.book_new();

  const formatDate = (date: any) =>
    date ? dayjs(date).tz(timeZone).format("DD MMM YYYY") : "N/A";

  const formatTime = (timeStr: string | null) => {
    if (timeStr) {
      return dayjs(timeStr).tz(timeZone).format("hh:mm A"); // e.g. 04:50 PM
    }
    return "N/A";
  };

  // Sheet 1: Tournament Details
  const basicDetailsRow: any = {
    "Tournament Name": tournament.tournamentName || "N/A",
    Date: formatDate(tournament.date),
    "Branch Name": tournament.branchName || "N/A",
    "Tournament Type": tournament.tournamentType || "N/A",
    "Initial Time (min)": tournament.clockTime?.initialTime ?? "N/A",
    "Increment (sec)": tournament.clockTime?.increment ?? "N/A",
    "Week No": tournament.weekNo ?? "N/A",
    Year: tournament.year ?? "N/A",
    "Tournament URL": tournament.tournamentUrl || "N/A",
  };

  // Conditionally add day and time
  if (tournament.day) {
    basicDetailsRow["Day"] = tournament.day;
  }
  const formattedTime = formatTime(tournament.time);
  if (formattedTime) {
    basicDetailsRow["Time"] = formattedTime;
  }

  const basicDetailsSheet = XLSX.utils.json_to_sheet([basicDetailsRow]);
  XLSX.utils.book_append_sheet(wb, basicDetailsSheet, "Tournament Details");

  // Sheet 2: Winners
  const winnerRows: any[] = [];

  const headerRow: any = {
    "Tournament Name": tournament.tournamentName || "N/A",
    Date: formatDate(tournament.date),
    "Branch Name": tournament.branchName || "N/A",
  };
  if (tournament.day) headerRow["Day"] = tournament.day;
  if (formattedTime) headerRow["Time"] = formattedTime;

  winnerRows.push(headerRow);

  winnerRows.push({
    Rank: "Rank",
    "Player Name": "Player Name",
    "FIDE ID": "FIDE ID",
    "Lichess Username": "Lichess Username",
    "Lichess URL": "Lichess URL",
    "Lichess Points": "Lichess Points",
    "Medal Points": "Medal Points",
    "Performance URL": "Performance URL",
    Active: "Active",
  });

  const winners = (tournament.lichessWeeklyWinners || [])
    .filter((w: any) => w.activeStatus)
    .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));

  winners.forEach((w: any) => {
    winnerRows.push({
      Rank: w.rank || "-",
      "Player Name": w.studentName || "-",
      "FIDE ID": w.fideId || "-",
      "Lichess Username": w.lichessUsername || "-",
      "Lichess URL": w.lichessUrl || "-",
      "Lichess Points": w.lichessPoints || "-",
      "Medal Points": w.medalPoints || "-",
      "Performance URL": w.performanceUrl || "-",
      Active: w.activeStatus ? "Yes" : "No",
    });
  });

  const winnerSheet = XLSX.utils.json_to_sheet(winnerRows);
  XLSX.utils.book_append_sheet(wb, winnerSheet, "Winners");

  XLSX.writeFile(
    wb,
    `Lichess_Tournament_${tournament?.tournamentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
