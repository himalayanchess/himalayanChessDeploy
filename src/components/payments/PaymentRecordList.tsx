import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import { Box, Button, Modal } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  HourglassEmpty,
  AccessTime,
  CheckCircle,
  AttachMoney,
} from "@mui/icons-material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { CircleCheck } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { deletePaymentRecord } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const PaymentRecordList = ({
  loading,
  allFilteredActivePaymentRecordsList,
  paymentRecordsPerPage,
  currentPage,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  const [loaded, setLoaded] = useState(false);
  const [selectedPaymentRecordId, setselectedPaymentRecordId] = useState(null);
  const [selectedPaymentRecordName, setselectedPaymentRecordName] =
    useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(paymentRecordId: any, paymentRecordName: any) {
    setselectedPaymentRecordId(paymentRecordId);
    setselectedPaymentRecordName(paymentRecordName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  // handlepaymentRecordDelete
  async function handlepaymentRecordDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/payments/deletePaymentRecord",
        {
          paymentRecordId: id,
        }
      );
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deletePaymentRecord(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {}
  }

  // session
  const session = useSession();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="overflow-y-auto mt-3 flex-1 h-full border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(7,1fr)] gap-2 w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Issued Date
        </span>
        <span className="py-3  text-left col-span-2 text-sm font-bold text-gray-600">
          Payment Title
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Payment Type
        </span>
        <span className="py-3   text-left text-sm font-bold text-gray-600">
          Payment Status
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Total Amount
        </span>{" "}
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Action
        </span>
        {/* <span className="py-3  text-left text-sm font-bold text-gray-600">
          Attendance
        </span> */}
      </div>

      {/* Loading */}
      {loading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting records</p>
        </div>
      )}

      {/* No Records Found */}
      {allFilteredActivePaymentRecordsList.length === 0 && !loading && (
        <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No records found</p>
        </div>
      )}

      {/* List of Records */}
      {!loading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActivePaymentRecordsList
            ?.slice(
              (currentPage - 1) * paymentRecordsPerPage,
              currentPage * paymentRecordsPerPage
            )
            ?.map((paymentRecord: any, index: any) => {
              // serial number
              const serialNumber =
                (currentPage - 1) * paymentRecordsPerPage + index + 1;

              return (
                <div
                  key={paymentRecord?._id}
                  className={` grid grid-cols-[50px,repeat(7,1fr)] gap-2 border-b border-gray-200 items-center cursor-pointer transition-all ease duration-150`}
                >
                  <span className="text-xs text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    href={`/${session?.data?.user?.role?.toLowerCase()}/payments/${
                      paymentRecord?._id
                    }`}
                    // target="_blank"
                    className=" text-left px-1 text-xs font-medium text-gray-600 underline hover:text-blue-500"
                  >
                    {dayjs(paymentRecord?.issuedDate)
                      .tz(timeZone)
                      .format("MMM D, YYYY, ddd")}
                  </Link>
                  <span className=" text-left px-1 col-span-2 text-xs font-medium text-gray-600">
                    {paymentRecord?.prePaymentTitle}
                  </span>
                  <span className="text-left px-1 text-xs font-medium text-gray-600 flex items-center gap-1">
                    {paymentRecord?.paymentType === "Incoming" ? (
                      <ArrowCircleDownIcon
                        fontSize="small"
                        className="text-green-600"
                      />
                    ) : (
                      <ArrowCircleUpIcon
                        fontSize="small"
                        className="text-red-600"
                      />
                    )}

                    <span
                      className={`font-bold ${
                        paymentRecord?.paymentType?.toLowerCase() === "incoming"
                          ? "text-green-600"
                          : paymentRecord?.paymentType?.toLowerCase() ===
                            "outgoing"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {paymentRecord?.paymentType}
                    </span>
                  </span>
                  <span
                    className={`text-left px-1 text-xs font-bold flex items-center gap-1 
      ${
        paymentRecord?.paymentStatus?.toLowerCase() === "pending"
          ? "text-yellow-600"
          : paymentRecord?.paymentStatus?.toLowerCase() === "partial"
          ? "text-blue-600"
          : paymentRecord?.paymentStatus?.toLowerCase() === "paid"
          ? "text-green-600"
          : "text-gray-600"
      }`}
                  >
                    {paymentRecord?.paymentStatus === "Pending" && (
                      <AccessTime fontSize="small" />
                    )}
                    {paymentRecord?.paymentStatus === "Partial" && (
                      <HourglassEmpty fontSize="small" />
                    )}
                    {paymentRecord?.paymentStatus === "Paid" && (
                      <CircleCheck size={18} fontSize="small" />
                    )}
                    {paymentRecord?.paymentStatus}
                  </span>
                  <span className=" text-left px-1 text-sm font-bold text-gray-600">
                    Rs. {paymentRecord?.totalAmount}
                  </span>

                  {session?.data?.user?.session?.data?.user?.role?.toLowerCase() !=
                  "trainer" ? (
                    <div className=" text-left px-1 text-xs font-medium text-gray-600">
                      <>
                        {/* edit */}
                        <Link
                          href={`/${session?.data?.user?.role?.toLowerCase()}/payments/updatepayment/${
                            paymentRecord?._id
                          }`}
                          title="Edit"
                          className="edit  px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-gray-500 hover:text-white"
                        >
                          <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                        </Link>

                        {/* delete modal */}
                        {paymentRecord?.activeStatus == true && (
                          <button
                            title="Delete"
                            className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                            onClick={() =>
                              handleDeleteModalOpen(
                                paymentRecord?._id,
                                paymentRecord?.prePaymentTitle
                              )
                            }
                          >
                            <DeleteIcon />
                          </button>
                        )}
                        <Modal
                          open={deleteModalOpen}
                          onClose={handleDeleteModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          className="flex items-center justify-center"
                          BackdropProps={{
                            style: {
                              backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                            },
                          }}
                        >
                          <Box className="w-96 p-5 border-y-4 border-red-400 flex flex-col items-center bg-white">
                            <DeleteIcon
                              className="text-white bg-red-600 rounded-full"
                              sx={{ fontSize: "3rem", padding: "0.5rem" }}
                            />
                            <p className="text-md mt-1 font-bold ">
                              Delete payment record?
                            </p>
                            <span className="text-center mt-2">
                              <span className="font-bold text-xl">
                                {selectedPaymentRecordName}
                              </span>
                              <br />
                              will be deleted permanently.
                            </span>
                            <div className="buttons mt-5">
                              <Button
                                variant="outlined"
                                sx={{
                                  marginRight: ".5rem",
                                  paddingInline: "2rem",
                                }}
                                onClick={handleDeleteModalClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                sx={{
                                  marginLeft: ".5rem",
                                  paddingInline: "2rem",
                                }}
                                onClick={() =>
                                  handlepaymentRecordDelete(
                                    selectedPaymentRecordId
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          </Box>
                        </Modal>
                      </>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      className="w-max h-max"
                      disabled
                    >
                      <LockIcon sx={{ fontSize: "1.2rem" }} />
                      <span className="ml-1">Unauthorized</span>
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PaymentRecordList;
