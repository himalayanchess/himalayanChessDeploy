import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import {
  Home,
  Info,
  User,
  Wallet,
  Banknote,
  Clock,
  CheckCircle,
  CircleDollarSign,
  FileText,
  Edit,
} from "lucide-react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export default function PaymentFiles({ paymentRecord }: any) {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="font-semibold text-md text-gray-500 mb-2">
        Payment Documents/ Files (
        {
          paymentRecord.paymentFiles?.filter((file: any) => file.activeStatus)
            ?.length
        }
        )
      </h3>

      {paymentRecord.paymentFiles?.filter((file: any) => file.activeStatus)
        ?.length === 0 ? (
        <p className="text-gray-500">No documents attached to this payment.</p>
      ) : (
        <div className="payment-container">
          <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
            <span className="py-3 text-center text-sm font-bold text-gray-600">
              SN
            </span>
            <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
              File Name
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              File Type
            </span>
            <span className="py-3 text-left text-sm  font-bold text-gray-600">
              Uploaded By
            </span>

            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Uploaded At
            </span>
          </div>

          {/* main list */}
          {paymentRecord.paymentFiles
            ?.filter((file: any) => file.activeStatus)
            ?.map((file: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-[70px,repeat(5,1fr)] py-3 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
              >
                <span className="text-sm text-center font-medium text-gray-600">
                  {index + 1}
                </span>
                <Link
                  title="View"
                  target="_blank"
                  href={`${file?.fileUrl}`}
                  className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                >
                  {file?.fileType?.toLowerCase() == "image" ? (
                    <ImageOutlinedIcon
                      className=" text-gray-500"
                      fontSize="small"
                    />
                  ) : file?.fileType?.toLowerCase() === "pdf" ? (
                    <PictureAsPdfOutlinedIcon
                      className=" text-gray-500"
                      fontSize="small"
                    />
                  ) : (
                    <InsertDriveFileOutlinedIcon
                      className=" text-gray-500"
                      fontSize="small"
                    />
                  )}
                  <span className="ml-2">{file?.fileName}</span>
                </Link>
                <span className="text-sm text-left font-medium text-gray-600">
                  {file.fileType}
                </span>
                <span className="text-sm text-left font-medium text-gray-600">
                  {file.uploadedByName || "N/A"}
                </span>
                <p className="text-sm text-gray-500 ">
                  {dayjs(file.uploadedAt)
                    .tz(timeZone)
                    .format("DD MMM, YYYY hh:mm A")}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
