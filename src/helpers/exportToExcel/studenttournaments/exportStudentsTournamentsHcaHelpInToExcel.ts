import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportStudentsTournamentsHcaHelpInToExcel(
  tournaments: any[],
  studentId: string,
  studentName: string
) {
  const rows: any[] = [];

  tournaments?.forEach((t, index) => {
    // Find the student's participation record
    const participation = t?.participants?.find(
      (p: any) => p?.studentId == studentId && p?.activeStatus
    );

    if (!participation) return; // Skip if student didn't participate

    const prize = participation?.prize || {};

    const row = {
      SN: index + 1,
      "Tournament Name": t?.tournamentName || "N/A",
      "Start Date": t?.startDate
        ? dayjs(t?.startDate).tz(timeZone).format("D MMMM, YYYY")
        : "N/A",
      "End Date": t?.endDate
        ? dayjs(t?.endDate).tz(timeZone).format("D MMMM, YYYY")
        : "N/A",
      "Branch Name": t?.branchName || "N/A",
      "Tournament Type": t?.tournamentType || "N/A",
      "Total Rounds": t?.totalRounds ?? "N/A",
      "Total Participants": t?.totalParticipants ?? "N/A",
      "Initial Time (min)": t?.clockTime?.initialTime ?? "N/A",
      "Increment (sec)": t?.clockTime?.increment ?? "N/A",
      "Chief Arbiter": t?.chiefArbiter?.chiefArbiterName || "N/A",
      "Tournament URL": t?.tournamentUrl || "N/A",
      "Is Rated": t?.isRated ? "Yes" : "No",
      "FIDE URL": t?.isRated && t?.fideUrl ? t.fideUrl : "N/A",
      "Chess Results URL":
        t?.isRated && t?.chessResultsUrl ? t.chessResultsUrl : "N/A",

      // Student's participation details
      "Student Name": participation?.studentName || "N/A",
      Rank: participation?.rank ?? "N/A",
      "Total Points": participation?.totalPoints ?? "N/A",
      "Performance URL": participation?.performanceUrl || "N/A",
      "Prize Title": prize?.title || "N/A",
      "Prize Position": prize?.position || "N/A",
      "Other Prize": prize?.otherTitleStatus ? prize?.otherTitle : "N/A",
    };

    rows.push(row);
  });

  if (rows.length === 0) return;

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = Array(Object.keys(rows[0]).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "StudentOtherTournaments");

  XLSX.writeFile(
    wb,
    `Tournaments_HCA_Help_In_${studentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
