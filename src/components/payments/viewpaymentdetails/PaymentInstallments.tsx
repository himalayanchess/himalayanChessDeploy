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
  ArrowUpCircle,
} from "lucide-react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

export default function PaymentInstallments({ paymentRecord }: any) {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="font-semibold text-md text-gray-500 mb-2">
        Payment Installments (
        {
          paymentRecord.installments?.filter(
            (installment: any) => installment.activeStatus
          )?.length
        }
        )
      </h3>

      {paymentRecord.installments?.filter(
        (installment: any) => installment.activeStatus
      )?.length === 0 ? (
        <p className="text-gray-500">No installments recorded yet.</p>
      ) : (
        <div className="">
          {/* Table Headings */}
          <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
            <span className="py-3 text-center text-sm font-bold text-gray-600">
              SN
            </span>
            <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
              Payment Title
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Date
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Payment Method
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Amount
            </span>
          </div>

          <div className="table-contents mt-2 overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
            {paymentRecord?.installments
              ?.filter((installment: any) => installment?.activeStatus)
              .map((installment: any, index: any) => {
                return (
                  <div
                    key={`installment_${installment?.paidDate}`}
                    className="grid grid-cols-[70px,repeat(5,1fr)] border-b py-2 border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <span className="text-sm text-center font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <span className=" text-sm col-span-2 text-gray-700">
                      {installment?.paymentTitle || "N/A"}
                    </span>
                    {/* date */}
                    <span className=" text-sm text-gray-700">
                      {installment?.paidDate
                        ? dayjs(installment?.paidDate)
                            .tz(timeZone)
                            .format("DD MMM, YYYY")
                        : "N/A"}
                    </span>
                    {/* school name */}
                    <span className="  text-sm text-gray-700">
                      {installment.paymentMethod
                        ? installment.paymentMethod
                        : "N/A"}
                    </span>
                    {/* branch name */}
                    <span className="col-span-1 text-sm text-green-600 font-bold flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4 text-green-600" />
                      {installment.amount ? `Rs. ${installment.amount}` : "N/A"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
