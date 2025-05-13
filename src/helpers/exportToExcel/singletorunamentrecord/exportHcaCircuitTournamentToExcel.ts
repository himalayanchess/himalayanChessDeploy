import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportHcaCircuitTournamentToExcel(
  hcaCircuitTournament: any, // Single object
  seriesTournaments: any[],
  leaderboard: any[]
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: HCA Circuit Tournament (Single Object)
  const circuitSheetRows = [
    {
      "Tournament Name": hcaCircuitTournament.tournamentName || "-",
      "Start Date": hcaCircuitTournament.startDate
        ? dayjs(hcaCircuitTournament.startDate)
            .tz(timeZone)
            .format("DD MMM YYYY")
        : "-",
      "End Date": hcaCircuitTournament.endDate
        ? dayjs(hcaCircuitTournament.endDate).tz(timeZone).format("DD MMM YYYY")
        : "-",
      Branch: hcaCircuitTournament.branchName || "-",
      Status: hcaCircuitTournament.activeStatus ? "Active" : "Inactive",
    },
  ];

  const circuitSheet = XLSX.utils.json_to_sheet(circuitSheetRows);
  XLSX.utils.book_append_sheet(wb, circuitSheet, "HCA Circuit Tournament");

  // Sheet 2: Series Tournaments with Participants
  const participantRows: any[] = [];

  seriesTournaments.forEach((t, tIndex) => {
    // Tournament Header
    participantRows.push({
      "SN.": tIndex + 1,
      "Tournament Name": t.tournamentName || "-",
      "Start Date": t.startDate
        ? dayjs(t.startDate).tz(timeZone).format("DD MMM YYYY")
        : "-",
      "End Date": t.endDate
        ? dayjs(t.endDate).tz(timeZone).format("DD MMM YYYY")
        : "-",
      Branch: t.branchName || "-",
      Type: t.tournamentType || "-",
      "Total Participants": (t.participants || []).filter(
        (p: any) => p.activeStatus
      ).length,
    });

    // Participant Header
    participantRows.push({
      "Participant No.": "Participant No.",
      Rank: "Rank",
      "Player Name": "Player Name",
      "FIDE ID": "FIDE ID",
      "Total Points": "Total Points",
      "Circuit Points": "Circuit Points",
      "Prize Title": "Prize Title",
      Position: "Position",
      "Other Prize": "Other Prize",
      "Performance Link": "Performance Link",
    });

    // Participant Data
    const activeParticipants = (t.participants || [])
      .filter((p: any) => p.activeStatus)
      .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0));

    activeParticipants.forEach((p: any, pIndex: number) => {
      const prize = p.prize || {};
      participantRows.push({
        "Participant No.": pIndex + 1,
        Rank: p.rank || "-",
        "Player Name": p.studentName || "-",
        "FIDE ID": p.fideId || "-",
        "Total Points": p.totalPoints || "-",
        "Circuit Points": p.circuitPoints || "-",
        "Prize Title": prize.title || "-",
        Position: prize.position || "-",
        "Other Prize": prize.otherTitleStatus ? prize.otherTitle : "-",
        "Performance Link": p.performanceUrl || "-",
      });
    });

    // Empty row between tournaments
    participantRows.push({});
  });

  const participantSheet = XLSX.utils.json_to_sheet(participantRows);
  XLSX.utils.book_append_sheet(wb, participantSheet, "Series Participants");

  // Sheet 3: Leaderboard
  const leaderboardRows = leaderboard.map((item, index) => ({
    "SN.": index + 1,
    Rank: index + 1,
    "Player Name": item.studentName || "-",
    "FIDE ID": item.fideId || "-",
    Branch: item.branchName || "-",
    "Circuit Points": item.circuitPoints || 0,
    "Tournaments Played": item.tournamentCount || 0,
  }));

  const leaderboardSheet = XLSX.utils.json_to_sheet(leaderboardRows);
  XLSX.utils.book_append_sheet(wb, leaderboardSheet, "Leaderboard");

  // Column Widths
  circuitSheet["!cols"] = [
    { wch: 30 }, // Tournament Name
    { wch: 15 }, // Start Date
    { wch: 15 }, // End Date
    { wch: 20 }, // Branch
    { wch: 10 }, // Status
  ];

  participantSheet["!cols"] = [
    { wch: 5 }, // SN.
    { wch: 30 }, // Tournament Name
    { wch: 12 }, // Start Date
    { wch: 12 }, // End Date
    { wch: 20 }, // Branch
    { wch: 10 }, // Type
    { wch: 8 }, // Total Participants
    { wch: 15 }, // Participant No.
    { wch: 8 }, // Rank
    { wch: 25 }, // Player Name
    { wch: 15 }, // FIDE ID
    { wch: 8 }, // Points
    { wch: 20 }, // Prize Title
    { wch: 15 }, // Position
    { wch: 15 }, // Other Prize
    { wch: 30 }, // Performance Link
  ];

  leaderboardSheet["!cols"] = [
    { wch: 5 }, // SN.
    { wch: 5 }, // Rank
    { wch: 25 }, // Player Name
    { wch: 15 }, // FIDE ID
    { wch: 20 }, // Branch
    { wch: 15 }, // Circuit Points
    { wch: 15 }, // Tournaments Played
  ];

  // Final export
  XLSX.writeFile(
    wb,
    `HCA_Circuit_Tournament_${hcaCircuitTournament?.tournamentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
