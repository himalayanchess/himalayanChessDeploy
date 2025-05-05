import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ne";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportProjectsListToExcel(projects: any[]) {
  const data = projects.map((project) => {
    const trainerList = (project.assignedTrainers || [])
      .map(
        (t: any) =>
          `${t.trainerName || "N/A"} (${t.trainerRole || "-"})${
            t.startDate
              ? ` [${dayjs(t.startDate).tz(timeZone).format("DD MMM YYYY")}`
              : ""
          }${
            t.endDate
              ? ` - ${dayjs(t.endDate).tz(timeZone).format("DD MMM YYYY")}]`
              : "]"
          }`
      )
      .join(", ");

    const slotList = (project.timeSlots || [])
      .map(
        (slot: any) =>
          `${slot.day || "N/A"}: ${slot.fromTime || ""} - ${slot.toTime || ""}`
      )
      .join(" | ");

    return {
      "School Name": project.name || "N/A",
      "Contract Type": project.contractType || "N/A",
      Address: project.address || "N/A",
      "Map Location": project.mapLocation || "N/A",
      "Start Date": project.startDate
        ? dayjs(project.startDate).tz(timeZone).format("DD MMM YYYY")
        : "N/A",
      "End Date": project.endDate
        ? dayjs(project.endDate).tz(timeZone).format("DD MMM YYYY")
        : "N/A",
      Duration: project.duration || "N/A",
      Status: project.completedStatus || "N/A",
      "Contract Paper": project.contractPaper || "N/A",
      "Drive Link": project.contractDriveLink || "N/A",
      "Primary Contact Name": project.primaryContact?.name || "N/A",
      "Primary Contact Phone": project.primaryContact?.phone || "N/A",
      "Primary Contact Email": project.primaryContact?.email || "N/A",
      "Assigned Trainers": trainerList || "N/A",
      "Time Slots": slotList || "N/A",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = new Array(Object.keys(data[0] || {}).length).fill({ wch: 25 });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projects");

  XLSX.writeFile(
    wb,
    `Schools_List_${dayjs().tz(timeZone).format("YYYY-MM-DD_HH-mm")}.xlsx`
  );
}
