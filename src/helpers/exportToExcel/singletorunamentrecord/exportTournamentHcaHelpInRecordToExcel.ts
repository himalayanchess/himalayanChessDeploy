import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportTournamentHcaHelpInRecordToExcel(t: any) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Tournament Basic Details
  const basicDetailsRow = [
    {
      "Tournament Name": t.tournamentName || "-",
      "Start Date": t.startDate
        ? dayjs(t.startDate).tz(timeZone).format("DD MMM YYYY")
        : "-",
      "End Date": t.endDate
        ? dayjs(t.endDate).tz(timeZone).format("DD MMM YYYY")
        : "-",
      Branch: t.branchName || "-",
      Type: t.tournamentType || "-",
      Rounds: t.totalRounds || "-",
      "Total Participants": t.totalParticipants || "-",
      "Initial Time (min)": t.clockTime?.initialTime || "-",
      "Increment (sec)": t.clockTime?.increment || "-",
      "Chief Arbiter": t.chiefArbiter?.chiefArbiterName || "-",
      "Arbiter Phone": t.chiefArbiter?.chiefArbiterPhone || "-",
      "Arbiter Email": t.chiefArbiter?.chiefArbiterEmail || "-",
      "Is Rated": t.isRated ? "Yes" : "No",
      "FIDE URL": t.isRated && t.fideUrl ? t.fideUrl : "-",
      "Chess Results URL":
        t.isRated && t.chessResultsUrl ? t.chessResultsUrl : "-",
    },
  ];

  const basicDetailsSheet = XLSX.utils.json_to_sheet(basicDetailsRow);
  XLSX.utils.book_append_sheet(wb, basicDetailsSheet, "Tournament Details");

  // Sheet 2: Participants
  const participantRows: any[] = [];

  // Tournament header
  participantRows.push({
    "Tournament Name": t.tournamentName,
    "Start Date": t.startDate
      ? dayjs(t.startDate).tz(timeZone).format("DD MMM YYYY")
      : "-",
    "End Date": t.endDate
      ? dayjs(t.endDate).tz(timeZone).format("DD MMM YYYY")
      : "-",
    Branch: t.branchName,
    Type: t.tournamentType,
    "Total Participants": (t.participants || []).filter(
      (p: any) => p.activeStatus
    ).length,
  });

  // Participants header
  participantRows.push({
    "Participant No.": "Participant No.",
    Rank: "Rank",
    "Player Name": "Player Name",
    "FIDE ID": "FIDE ID",
    Points: "Points",
    "Prize Title": "Prize Title",
    Category: "Category",
    "Other Prize": "Other Prize",
    "Performance Link": "Performance Link",
  });

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
      Points: p.totalPoints || "-",
      "Prize Title": prize.title || "-",
      Category: prize.position || "-",
      "Other Prize": prize.otherTitleStatus ? prize.otherTitle : "-",
      "Performance Link": p.performanceUrl || "-",
    });
  });

  const participantSheet = XLSX.utils.json_to_sheet(participantRows);
  XLSX.utils.book_append_sheet(wb, participantSheet, "Participants");

  // Set column widths
  basicDetailsSheet["!cols"] = [
    { wch: 30 }, // Tournament Name
    { wch: 12 }, // Start Date
    { wch: 12 }, // End Date
    { wch: 20 }, // Branch
    { wch: 10 }, // Type
    { wch: 8 }, // Rounds
    { wch: 8 }, // Total Participants
    { wch: 8 }, // Initial Time
    { wch: 8 }, // Increment
    { wch: 20 }, // Chief Arbiter
    { wch: 15 }, // Arbiter Phone
    { wch: 25 }, // Arbiter Email
    { wch: 10 }, // Is Rated
    { wch: 40 }, // FIDE URL
    { wch: 40 }, // Chess Results URL
  ];

  participantSheet["!cols"] = [
    { wch: 15 }, // Participant No.
    { wch: 25 }, // Player Name
    { wch: 8 }, // Rank
    { wch: 8 }, // Points
    { wch: 20 }, // Prize Title
    { wch: 15 }, // Category
    { wch: 15 }, // Other Prize
    { wch: 30 }, // Performance Link
  ];

  XLSX.writeFile(
    wb,
    `Tournament_HCA_HelpIn_Record${t.tournamentName}_${dayjs()
      .tz(timeZone)
      .format("YYYY-MM-DD")}.xlsx`
  );
}
