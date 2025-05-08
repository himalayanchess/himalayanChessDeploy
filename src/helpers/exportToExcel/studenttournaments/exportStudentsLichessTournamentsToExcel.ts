import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportStudentsLichessTournamentsToExcel(
  tournaments: any[],
  studentId: string,
  studentName: string
) {
  const rows: any[] = [];

  tournaments?.forEach((t, index) => {
    const selected = t?.lichessWeeklyWinners?.find(
      (w: any) => w?.studentId == studentId
    );

    if (!selected) return; // Skip tournament if student not found

    const row = {
      SN: index + 1,
      "Tournament Name": t?.tournamentName || "N/A",
      Date: t?.date
        ? dayjs(t?.date).tz(timeZone).format("D MMMM, YYYY")
        : "N/A",
      Day: t?.day || "N/A",
      Time: t?.time || "N/A",
      "Tournament URL": t?.tournamentUrl || "N/A",
      "Clock Initial Time (min)": t?.clockTime?.initialTime ?? "N/A",
      "Clock Increment (sec)": t?.clockTime?.increment ?? "N/A",
      "Branch Name": t?.branchName || "N/A",
      "Tournament Type": t?.tournamentType || "N/A",
      "Week No": t?.weekNo ?? "N/A",
      Year: t?.year ?? "N/A",
      "Active Status": t?.activeStatus ? "Active" : "Inactive",

      // Selected student's data
      "Student Name": selected?.studentName || "N/A",
      "Lichess Username": selected?.lichessUsername || "N/A",
      "Lichess URL": selected?.lichessUrl || "N/A",
      "Performance URL": selected?.performanceUrl || "N/A",
      "Lichess Points": selected?.lichessPoints ?? "N/A",
      "Medal Points": selected?.medalPoints ?? "N/A",
      Rank: selected?.rank ?? "N/A",
      "Winner Active Status": selected?.activeStatus ? "Active" : "Inactive",
    };

    rows.push(row);
  });

  if (rows.length === 0) return;

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = Array(Object.keys(rows[0]).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "SelectedStudentTournaments");

  XLSX.writeFile(
    wb,
    `Lichess_Student_Tournaments_${studentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
