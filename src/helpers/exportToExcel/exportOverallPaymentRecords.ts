import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export function exportOverallPaymentRecords(allFilteredActivePaymentRecordsList: any[]) {
  // Format basic information
  const basicInfoData = allFilteredActivePaymentRecordsList.map((record, index) => ({
    SN: index + 1,
    "Payment Type": record.paymentType,
    "Issued Date": record.issuedDate 
      ? dayjs(record.issuedDate).tz(timeZone).format("DD MMMM, YYYY") 
      : "N/A",
    "Record Added Date": record.recordAddedDate 
      ? dayjs(record.recordAddedDate).tz(timeZone).format("DD MMMM, YYYY") 
      : "N/A",
    "Payment Title": record.prePaymentTitle || "N/A",
    "Payment Description": record.prePaymentDescription || "N/A",
    "Payment Purpose": record.otherPaymentPurpose 
      ? "Other" 
      : record.paymentPurpose || "N/A",
    "Project Name": record.projectName || "N/A",
    "Student Name": record.studentName || "N/A",
    "Total Amount": record.totalAmount || 0,
    "Total Paid": record.totalPaid || 0,
    "Remaining Amount": record.remainingAmount || 0,
    "Payment Status": record.paymentStatus || "Pending",
    "Active Status": record.activeStatus ? "Active" : "Inactive"
  }));

  // Format payment source info
  const paymentSourceData = allFilteredActivePaymentRecordsList.map((record, index) => ({
    SN: index + 1,
    "Payment Type": record.paymentType,
    "Payment Source": record.otherPaymentSource 
      ? "Other" 
      : record.paymentSource || "N/A",
    "Sender Name": record.paymentSourceInfo?.senderName || "N/A",
    "Phone": record.paymentSourceInfo?.phone || "N/A",
    "Email": record.paymentSourceInfo?.email || "N/A",
    "Bank Name": record.paymentSourceInfo?.bankName || "N/A",
    "Bank Account": record.paymentSourceInfo?.bankAccountNumber || "N/A",
    "E-Wallet Name": record.paymentSourceInfo?.ewalletName || "N/A",
    "E-Wallet Number": record.paymentSourceInfo?.ewalletNumber || "N/A"
  }));

  // Format recipient info
  const recipientData = allFilteredActivePaymentRecordsList.map((record, index) => ({
    SN: index + 1,
    "Payment Type": record.paymentType,
    "Recipient Name": record.recipient?.name || "N/A",
    "User Name": record.recipient?.userName || "N/A",
    "Phone": record.recipient?.phone || "N/A",
    "Email": record.recipient?.email || "N/A",
    "Bank Name": record.recipient?.bankName || "N/A",
    "Bank Account": record.recipient?.bankAccountNumber || "N/A",
    "E-Wallet Name": record.recipient?.ewalletName || "N/A",
    "E-Wallet Number": record.recipient?.ewalletNumber || "N/A"
  }));

  // Format installments - this will create multiple rows per payment record
  const installmentsData: any[] = [];
  allFilteredActivePaymentRecordsList.forEach((record, index) => {
    if (record.installments && record.installments.length > 0) {
      record.installments.forEach((installment: any, instIndex: number) => {
        installmentsData.push({
          "Payment SN": index + 1,
          "Installment SN": instIndex + 1,
          "Amount": installment.amount || 0,
          "Paid Date": installment.paidDate 
            ? dayjs(installment.paidDate).tz(timeZone).format("DD MMMM, YYYY") 
            : "N/A",
          "Payment Method": installment.paymentMethod || "N/A",
          "Payment Title": installment.paymentTitle || "N/A",
          "Payment Time": installment.paymentTime 
            ? dayjs(installment.paymentTime).tz(timeZone).format("DD MMMM, YYYY hh:mm A") 
            : "N/A"
        });
      });
    } else {
      installmentsData.push({
        "Payment SN": index + 1,
        "Installment SN": "N/A",
        "Amount": "N/A",
        "Paid Date": "N/A",
        "Payment Method": "N/A",
        "Payment Title": "N/A",
        "Payment Time": "N/A"
      });
    }
  });

  // Format payment files
  const paymentFilesData: any[] = [];
  allFilteredActivePaymentRecordsList.forEach((record, index) => {
    if (record.paymentFiles && record.paymentFiles.length > 0) {
      record.paymentFiles.forEach((file: any, fileIndex: number) => {
        paymentFilesData.push({
          "Payment SN": index + 1,
          "File SN": fileIndex + 1,
          "File Name": file.fileName || "N/A",
          "File URL": file.fileUrl || "N/A",
          "File Type": file.fileType || "N/A",
          "Uploaded At": file.uploadedAt 
            ? dayjs(file.uploadedAt).tz(timeZone).format("DD MMMM, YYYY hh:mm A") 
            : "N/A"
        });
      });
    } else {
      paymentFilesData.push({
        "Payment SN": index + 1,
        "File SN": "N/A",
        "File Name": "N/A",
        "File URL": "N/A",
        "File Type": "N/A",
        "Uploaded At": "N/A"
      });
    }
  });

  // Format created by info
  const createdByData = allFilteredActivePaymentRecordsList.map((record, index) => ({
    SN: index + 1,
    "Created By": record.createdBy?.name || record.createdBy?.username || "N/A",
    "Created At": record.createdAt 
      ? dayjs(record.createdAt).tz(timeZone).format("DD MMMM, YYYY hh:mm A") 
      : "N/A"
  }));

  // Format updated by info - may have multiple entries
  const updatedByData: any[] = [];
  allFilteredActivePaymentRecordsList.forEach((record, index) => {
    if (record.updatedBy && record.updatedBy.length > 0) {
      record.updatedBy.forEach((update: any, updateIndex: number) => {
        updatedByData.push({
          "Payment SN": index + 1,
          "Update SN": updateIndex + 1,
          "Updated By": update.name || update.username || "N/A",
          "Updated At": update.timestamp 
            ? dayjs(update.timestamp).tz(timeZone).format("DD MMMM, YYYY hh:mm A") 
            : "N/A",
          "Update Details": update.details || "N/A"
        });
      });
    } else {
      updatedByData.push({
        "Payment SN": index + 1,
        "Update SN": "N/A",
        "Updated By": "N/A",
        "Updated At": "N/A",
        "Update Details": "N/A"
      });
    }
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add sheets to workbook
  const basicInfoWs = XLSX.utils.json_to_sheet(basicInfoData);
  const paymentSourceWs = XLSX.utils.json_to_sheet(paymentSourceData);
  const recipientWs = XLSX.utils.json_to_sheet(recipientData);
  const installmentsWs = XLSX.utils.json_to_sheet(installmentsData);
  const paymentFilesWs = XLSX.utils.json_to_sheet(paymentFilesData);
  const createdByWs = XLSX.utils.json_to_sheet(createdByData);
  const updatedByWs = XLSX.utils.json_to_sheet(updatedByData);

  // Set column widths for each sheet
  const setColumnWidths = (ws: any, widths: number[]) => {
    ws["!cols"] = widths.map(w => ({ wch: w }));
  };

  setColumnWidths(basicInfoWs, [5, 12, 15, 15, 20, 25, 20, 20, 20, 12, 12, 12, 15, 12]);
  setColumnWidths(paymentSourceWs, [5, 12, 20, 20, 15, 25, 20, 20, 20, 20]);
  setColumnWidths(recipientWs, [5, 12, 20, 20, 15, 25, 20, 20, 20, 20]);
  setColumnWidths(installmentsWs, [10, 10, 12, 15, 15, 20, 25]);
  setColumnWidths(paymentFilesWs, [10, 10, 20, 40, 15, 25]);
  setColumnWidths(createdByWs, [5, 25, 25]);
  setColumnWidths(updatedByWs, [10, 10, 25, 25, 40]);

  // Add sheets to workbook with names
  XLSX.utils.book_append_sheet(wb, basicInfoWs, "Basic Info");
  XLSX.utils.book_append_sheet(wb, paymentSourceWs, "Payment Source");
  XLSX.utils.book_append_sheet(wb, recipientWs, "Recipient Info");
  XLSX.utils.book_append_sheet(wb, installmentsWs, "Installments");
  XLSX.utils.book_append_sheet(wb, paymentFilesWs, "Payment Files");
  XLSX.utils.book_append_sheet(wb, createdByWs, "Created By");
  XLSX.utils.book_append_sheet(wb, updatedByWs, "Updated By");

  // Generate the Excel file and trigger download
  XLSX.writeFile(wb, `PaymentRecords_${dayjs().format("YYYY-MM-DD")}.xlsx`);
}