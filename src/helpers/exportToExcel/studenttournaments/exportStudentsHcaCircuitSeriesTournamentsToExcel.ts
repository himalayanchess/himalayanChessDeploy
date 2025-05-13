import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportStudentsHcaCircuitSeriesTournamentsToExcel(
  tournaments: any[],
  studentId: string,
  studentName: string
) {
  const rows: any[] = [];

  tournaments?.forEach((t, index) => {
    const participant = t?.participants?.find(
      (p: any) => p?.studentId == studentId
    );
    if (!participant) return;

    const prize = participant?.prize || {};
    const chiefArbiter = t?.chiefArbiter || {};

    const row = {
      SN: rows.length + 1,
      "Tournament Name": t?.tournamentName || "N/A",
      "Main Tournament": t?.mainHcaCircuitTournamentName || "N/A",
      "Tournament URL": t?.tournamentUrl || "N/A",
      "FIDE URL": t?.fideUrl || "N/A",
      "Chess Results URL": t?.chessResultsUrl || "N/A",
      "Start Date": t?.startDate
        ? dayjs(t?.startDate).tz(timeZone).format("D MMMM, YYYY")
        : "N/A",
      "End Date": t?.endDate
        ? dayjs(t?.endDate).tz(timeZone).format("D MMMM, YYYY")
        : "N/A",
      "Branch Name": t?.branchName || "N/A",
      "Tournament Type": t?.tournamentType || "N/A",
      "Clock Initial Time (min)": t?.clockTime?.initialTime ?? "N/A",
      "Clock Increment (sec)": t?.clockTime?.increment ?? "N/A",
      "Total Rounds": t?.totalRounds ?? "N/A",
      "Total Participants": t?.totalParticipants ?? "N/A",
      "Chief Arbiter Name": chiefArbiter?.chiefArbiterName || "N/A",
      "Chief Arbiter Phone": chiefArbiter?.chiefArbiterPhone || "N/A",
      "Chief Arbiter Email": chiefArbiter?.chiefArbiterEmail || "N/A",
      "Rated Status": t?.isRated ? "Rated" : "Unrated",
      "Tournament Active Status": t?.activeStatus ? "Active" : "Inactive",

      // 👇 Participant details from ParticipantsSchema
      "Student Name": participant?.studentName || "N/A",
      "FIDE ID": participant?.fideId || "N/A",
      Rank: participant?.rank ?? "N/A",
      "Circuit Points": participant?.circuitPoints ?? "N/A",
      "Total Points": participant?.totalPoints ?? "N/A",
      "Performance URL": participant?.performanceUrl || "N/A",
      "Prize Title": prize?.title || "N/A",
      "Prize Position": prize?.position || "N/A",
      "Other Prize Title":
        prize?.otherTitleStatus && prize?.otherTitle ? prize.otherTitle : "N/A",
      "Participant Active Status": participant?.activeStatus
        ? "Active"
        : "Inactive",
    };

    rows.push(row);
  });

  if (rows.length === 0) return;

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = Array(Object.keys(rows[0]).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "StudentCircuitTournaments");

  XLSX.writeFile(
    wb,
    `HCA_Circuit_Tournaments_${studentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
