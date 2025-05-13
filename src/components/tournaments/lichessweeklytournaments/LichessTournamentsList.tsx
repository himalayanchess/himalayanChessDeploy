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
import { deleteLichessTournament } from "@/redux/allTournamentSlice";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LichessTournamentsList = ({
  allFilteredActiveLichessTournamentsList,
  currentPage,
  lichessTournamentsPerPage,
  allLichessTournamentsLoading,
}: any) => {
  const session = useSession();
  // dispatch
  const dispatch = useDispatch<any>();
  // console.log("inside lichessTournamentlist", allFilteredActiveLichessTournamentsList);

  const [loaded, setloaded] = useState(false);
  const [selectedLichessTournamentId, setSelectedLichessTournamentId] =
    useState(null);
  const [selectedLichessTournamentName, setSelectedLichessTournamentName] =
    useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(
    lichessTournamentId: any,
    lichessTournamentName: any
  ) {
    setSelectedLichessTournamentId(lichessTournamentId);
    setSelectedLichessTournamentName(lichessTournamentName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  // handleLichessTournamentDelete
  async function handleLichessTournamentDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/tournaments/lichess/deleteLichessTournament",
        {
          lichessTournamentId: id,
        }
      );
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteLichessTournament(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleLichessTournamentDelete", error);
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
          Date
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Week No.
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
      {allLichessTournamentsLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting tournaments</p>
        </div>
      )}
      {/* No lichessTournament Found */}
      {allFilteredActiveLichessTournamentsList?.length === 0 &&
        !allLichessTournamentsLoading && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No tournaments found</p>
          </div>
        )}
      {/* lichessTournament List */}
      {!allLichessTournamentsLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveLichessTournamentsList
            ?.slice(
              (currentPage - 1) * lichessTournamentsPerPage,
              currentPage * lichessTournamentsPerPage
            )
            .map((lichessTournament: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * lichessTournamentsPerPage + index + 1;
              return (
                <div
                  key={lichessTournament?._id}
                  className="grid grid-cols-[50px,repeat(7,1fr)] gap-1 border-b  border-gray-200  items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  {/* lichessTournamentname */}
                  <Link
                    title="View"
                    href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/lichessweeklytournament/${
                      lichessTournament?._id
                    }`}
                    className="text-left text-sm col-span-2 font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {lichessTournament?.tournamentName}
                  </Link>
                  {/* date */}
                  <span className="  text-sm text-gray-700">
                    {lichessTournament?.date
                      ? dayjs(lichessTournament?.date)
                          .tz(timeZone)
                          .format("MMMM D, YYYY")
                      : "N/A"}
                  </span>
                  {/* week no */}
                  <span className=" text-sm text-gray-700">
                    #{lichessTournament?.weekNo}
                  </span>
                  {/* tournament type */}
                  <span className=" text-sm text-gray-700 flex items-center">
                    {lichessTournament?.tournamentType?.toLowerCase() ===
                    "standard" ? (
                      <WindowOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    ) : lichessTournament?.tournamentType?.toLowerCase() ===
                      "rapid" ? (
                      <WatchLaterOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    ) : (
                      <FlashOnOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                    )}
                    <span className="ml-1">
                      {lichessTournament?.tournamentType}
                    </span>
                  </span>
                  {/* branch name */}
                  <span className=" col-span-1 text-sm text-gray-700">
                    {lichessTournament.branchName
                      ? lichessTournament.branchName
                      : "N/A"}
                  </span>
                  {session?.data?.user?.role?.toLowerCase() != "trainer" ? (
                    <div className=" text-sm text-gray-500">
                      <>
                        {/* edit */}
                        <Link
                          href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/lichessweeklytournament/updatelichessweeklytournament/${
                            lichessTournament?._id
                          }`}
                          title="Edit"
                          className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-gray-500 hover:text-white"
                        >
                          <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                        </Link>

                        {/* delete modal */}
                        {lichessTournament?.activeStatus == true && (
                          <button
                            title="Delete"
                            className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                            onClick={() =>
                              handleDeleteModalOpen(
                                lichessTournament._id,
                                lichessTournament.tournamentName
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
                              Delete Lichess Tournament?
                            </p>
                            <span className="text-center mt-2">
                              <span className="font-bold text-xl">
                                {selectedLichessTournamentName}
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
                                  handleLichessTournamentDelete(
                                    selectedLichessTournamentId
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

export default LichessTournamentsList;
