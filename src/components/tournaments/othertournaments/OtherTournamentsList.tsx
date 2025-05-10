import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Link from "next/link";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { deleteOtherTournament } from "@/redux/allTournamentSlice";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const OtherTournamentsList = ({
  allFilteredActiveOtherTournamentsList,
  currentPage,
  otherTournamentsPerPage,
  allOtherTournamentsLoading,
  role,
}: any) => {
  const session = useSession();
  // dispatch
  const dispatch = useDispatch<any>();
  // console.log("inside otherTournamentlist", allFilteredActiveOtherTournamentsList);

  const [loaded, setloaded] = useState(false);
  const [selectedOtherTournamentId, setSelectedOtherTournamentId] =
    useState(null);
  const [selectedOtherTournamentName, setSelectedOtherTournamentName] =
    useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(
    otherTournamentId: any,
    otherTournamentName: any
  ) {
    setSelectedOtherTournamentId(otherTournamentId);
    setSelectedOtherTournamentName(otherTournamentName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  // handleOtherTournamentDelete
  async function handleOtherTournamentDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/othertournaments/deleteOtherTournament",
        {
          otherTournamentId: id,
        }
      );
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteOtherTournament(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleOtherTournamentDelete", error);
    }
  }

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="overflow-y-auto mt-3 flex-1 border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(7,1fr)] gap-1 w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
          Tournament Name
        </span>
        <span className="py-3 text-left text-sm  font-bold text-gray-600">
          Start Date
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Total Rounds
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Type
        </span>

        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Branch
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {allOtherTournamentsLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting tournaments</p>
        </div>
      )}
      {/* No otherTournament Found */}
      {allFilteredActiveOtherTournamentsList?.length === 0 &&
        !allOtherTournamentsLoading && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No tournaments found</p>
          </div>
        )}
      {/* otherTournament List */}
      {!allOtherTournamentsLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveOtherTournamentsList
            ?.slice(
              (currentPage - 1) * otherTournamentsPerPage,
              currentPage * otherTournamentsPerPage
            )
            .map((otherTournament: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * otherTournamentsPerPage + index + 1;
              return (
                <div
                  key={otherTournament?._id}
                  className="grid grid-cols-[50px,repeat(7,1fr)] gap-1 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  {/* otherTournamentname */}
                  <Link
                    title="View"
                    href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/othertournaments/${
                      otherTournament?._id
                    }`}
                    className="text-left text-sm col-span-2 font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {otherTournament?.tournamentName}
                  </Link>
                  {/* date */}
                  <span className="  text-sm text-gray-700">
                    {otherTournament?.startDate
                      ? dayjs(otherTournament?.startDate)
                          .tz(timeZone)
                          .format("MMMM D, YYYY")
                      : "N/A"}
                  </span>
                  {/* week no */}
                  <span className=" text-sm text-gray-700">
                    {otherTournament?.totalRounds
                      ? `${otherTournament?.totalRounds}`
                      : "N/A"}
                  </span>
                  {/* tournament type */}
                  <span className=" text-sm text-gray-700 flex items-center">
                    {otherTournament?.tournamentType?.toLowerCase() ===
                    "standard" ? (
                      <WindowOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    ) : otherTournament?.tournamentType?.toLowerCase() ===
                      "rapid" ? (
                      <WatchLaterOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    ) : (
                      <FlashOnOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    )}
                    <span className="ml-1">
                      {otherTournament?.tournamentType}
                    </span>
                  </span>
                  {/* branch name */}
                  <span className=" col-span-1 text-sm text-gray-700">
                    {otherTournament.branchName
                      ? otherTournament.branchName
                      : "N/A"}
                  </span>
                  {role?.toLowerCase() != "trainer" ? (
                    <div className=" text-sm text-gray-500">
                      <>
                        {/* edit */}
                        <Link
                          href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/othertournaments/updateothertournament/${
                            otherTournament?._id
                          }`}
                          title="Edit"
                          className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-green-500 hover:text-white"
                        >
                          <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                        </Link>

                        {/* delete modal */}
                        {otherTournament?.activeStatus == true && (
                          <button
                            title="Delete"
                            className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                            onClick={() =>
                              handleDeleteModalOpen(
                                otherTournament._id,
                                otherTournament.tournamentName
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
                              backgroundColor: "rgba(0,0,0,0.4)", // Make the backdrop transparent
                            },
                          }}
                        >
                          <Box className="w-96 p-5 border-y-4 border-red-400 flex flex-col items-center bg-white">
                            <DeleteIcon
                              className="text-white bg-red-600 rounded-full"
                              sx={{ fontSize: "3rem", padding: "0.5rem" }}
                            />
                            <p className="text-md mt-1 font-bold ">
                              Delete Other Tournament?
                            </p>
                            <span className="text-center mt-2">
                              <span className="font-bold text-xl">
                                {selectedOtherTournamentName}
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
                                  handleOtherTournamentDelete(
                                    selectedOtherTournamentId
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

export default OtherTournamentsList;
