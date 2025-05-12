import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportTournamentOrganizedByHcaRecordToExcel(tournament: any) {
  const wb = XLSX.utils.book_new();

  const formatDate = (date: any) =>
    date ? dayjs(date).tz(timeZone).format("DD MMM YYYY") : "N/A";

  // Sheet 1: Tournament Details
  const basicDetailsRow: any = {
    "Tournament Name": tournament.tournamentName || "N/A",
    "Start Date": formatDate(tournament.startDate),
    "End Date": formatDate(tournament.endDate),
    "Branch Name": tournament.branchName || "N/A",
    "Tournament Type": tournament.tournamentType || "N/A",
    "Initial Time (min)": tournament.clockTime?.initialTime ?? "N/A",
    "Increment (sec)": tournament.clockTime?.increment ?? "N/A",
    "Total Rounds": tournament.totalRounds ?? "N/A",
    "Total Participants": tournament.totalParticipants ?? "N/A",
    "Is Rated": tournament.isRated ? "Yes" : "No",
    "FIDE URL": tournament.fideUrl || "N/A",
    "Chess Results URL": tournament.chessResultsUrl || "N/A",
    "Tournament URL": tournament.tournamentUrl || "N/A",
  };

  if (tournament.chiefArbiter?.chiefArbiterName)
    basicDetailsRow["Chief Arbiter Name"] =
      tournament.chiefArbiter.chiefArbiterName;
  if (tournament.chiefArbiter?.chiefArbiterPhone)
    basicDetailsRow["Chief Arbiter Phone"] =
      tournament.chiefArbiter.chiefArbiterPhone;
  if (tournament.chiefArbiter?.chiefArbiterEmail)
    basicDetailsRow["Chief Arbiter Email"] =
      tournament.chiefArbiter.chiefArbiterEmail;

  const basicDetailsSheet = XLSX.utils.json_to_sheet([basicDetailsRow]);
  XLSX.utils.book_append_sheet(wb, basicDetailsSheet, "Tournament Details");

  // Sheet 2: Participants
  const participantRows: any[] = [];

  participantRows.push({
    "Tournament Name": tournament.tournamentName || "N/A",
    "Start Date": formatDate(tournament.startDate),
    "Branch Name": tournament.branchName || "N/A",
  });

  participantRows.push({
    Rank: "Rank",
    "Player Name": "Player Name",
    "FIDE ID": "FIDE ID",
    "Performance URL": "Performance URL",
    "Prize Title": "Prize Title",
    "Prize Position": "Prize Position",
    "Other Prize Title": "Other Prize Title",
    "Total Points": "Total Points",
    Active: "Active",
  });

  const participants = (tournament.participants || [])
    .filter((p: any) => p.activeStatus)
    .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));

  participants.forEach((p: any) => {
    participantRows.push({
      Rank: p.rank || "-",
      "Player Name": p.studentName || "-",
      "FIDE ID": p.fideId || "-",
      "Performance URL": p.performanceUrl || "-",
      "Prize Title": p.prize?.title || "-",
      "Prize Position": p.prize?.position || "-",
      "Other Prize Title": p.prize?.otherTitleStatus
        ? p.prize?.otherTitle || "-"
        : "-",
      "Total Points": p.totalPoints || "-",
      Active: p.activeStatus ? "Yes" : "No",
    });
  });

  const participantSheet = XLSX.utils.json_to_sheet(participantRows);
  XLSX.utils.book_append_sheet(wb, participantSheet, "Participants");

  XLSX.writeFile(
    wb,
    `OrganizedByHCA_Tournament_${tournament?.tournamentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
