import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportHcaCircuitSeriesTournamentRecordToExcel(tournament: any) {
  const wb = XLSX.utils.book_new();

  const formatDate = (date: any) =>
    date ? dayjs(date).tz(timeZone).format("DD MMM YYYY") : "N/A";

  const formatChiefArbiter = (arbiter: any) =>
    arbiter
      ? {
          "Chief Arbiter Name": arbiter.chiefArbiterName || "-",
          "Chief Arbiter Phone": arbiter.chiefArbiterPhone || "-",
          "Chief Arbiter Email": arbiter.chiefArbiterEmail || "-",
        }
      : {};

  // Sheet 1: Tournament Overview
  const overviewRow: any = {
    "Main Tournament Name": tournament.mainHcaCircuitTournamentName || "N/A",
    "Tournament Name": tournament.tournamentName || "N/A",
    "Tournament URL": tournament.tournamentUrl || "N/A",
    "Branch Name": tournament.branchName || "N/A",
    "Tournament Type": tournament.tournamentType || "N/A",
    "Start Date": formatDate(tournament.startDate),
    "End Date": formatDate(tournament.endDate),
    "Initial Time (min)": tournament.clockTime?.initialTime ?? "N/A",
    "Increment (sec)": tournament.clockTime?.increment ?? "N/A",
    "Total Rounds": tournament.totalRounds ?? "N/A",
    "Total Participants": tournament.totalParticipants ?? "N/A",
    Rated: tournament.isRated ? "Yes" : "No",
    "FIDE URL": tournament.fideUrl || "N/A",
    "ChessResults URL": tournament.chessResultsUrl || "N/A",
  };

  const arbiterDetails = formatChiefArbiter(tournament.chiefArbiter || {});
  Object.assign(overviewRow, arbiterDetails);

  const overviewSheet = XLSX.utils.json_to_sheet([overviewRow]);
  XLSX.utils.book_append_sheet(wb, overviewSheet, "Tournament Details");

  // Sheet 2: Participants
  const participants = (tournament.participants || []).filter(
    (p: any) => p.activeStatus
  );
  const participantRows: any[] = [];

  participantRows.push({
    Rank: "Rank",
    "Student Name": "Student Name",
    "Participant Type": "Participant Type",
    "FIDE ID": "FIDE ID",
    "Circuit Points": "Circuit Points",
    "Total Points": "Total Points",
    "Performance URL": "Performance URL",
    "Prize Title": "Prize Title",
    "Prize Position": "Prize Position",
    "Other Title": "Other Title",
    Description: "Description",
  });

  participants.forEach((p: any) => {
    participantRows.push({
      Rank: p.rank ?? "-",
      "Student Name": p.studentName || "-",
      "Participant Type": p.participantType || "-",
      "FIDE ID": p.fideId ?? "-",
      "Circuit Points": p.circuitPoints ?? "-",
      "Total Points": p.totalPoints ?? "-",
      "Performance URL": p.performanceUrl || "-",
      "Prize Title": p.prize?.title || "-",
      "Prize Position": p.prize?.position || "-",
      "Other Title": p.prize?.otherTitleStatus ? p.prize.otherTitle : "-",
      Description: p.description || "",
    });
  });

  const participantsSheet = XLSX.utils.json_to_sheet(participantRows);
  XLSX.utils.book_append_sheet(wb, participantsSheet, "Participants");

  // Export to file
  XLSX.writeFile(
    wb,
    `HCA_Circuit_Series_Tournament_${tournament.tournamentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
