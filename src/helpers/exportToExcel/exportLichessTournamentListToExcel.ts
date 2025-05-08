import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportLichessTournamentListToExcel(tournaments: any[]) {
  const rows: any[] = [];

  tournaments.forEach((t, index) => {
    const base: any = {
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
    };

    const winners = t.lichessWeeklyWinners || [];

    const formatWinner = (w: any) =>
      `${w.studentName || "N/A"} (${w.lichessPoints ?? "N/A"}) (${
        w.medalPoints ?? "N/A"
      })`;

    base["First (Lichess Points) (Medal Points)"] = winners[0]
      ? formatWinner(winners[0])
      : "N/A";
    base["Second (Lichess Points) (Medal Points)"] = winners[1]
      ? formatWinner(winners[1])
      : "N/A";
    base["Third (Lichess Points) (Medal Points)"] = winners[2]
      ? formatWinner(winners[2])
      : "N/A";

    rows.push(base);
  });

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = Array(Object.keys(rows[0]).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Tournaments");

  XLSX.writeFile(
    wb,
    `Lichess_Tournaments_${dayjs().tz(timeZone).format("YYYY-MM-DD")}.xlsx`
  );
}
