import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CircularProgress from "@mui/material/CircularProgress";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import Link from "next/link";
import { Box, Button, Modal } from "@mui/material";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { deleteTestHistory } from "@/redux/allListSlice";
import { useSession } from "next-auth/react";

const TestHistoryList = ({
  allFilteredActiveTestHistoryList,
  currentPage,
  testHistoriesPerPage,
  allTestHistoryLoading,
  role,
}: any) => {
  //dispatch
  const dispatch = useDispatch();
  const session = useSession();
  const [loaded, setloaded] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTestHistoryId, setselectedTestHistoryId] = useState(null);
  const [selectedTestHistoryName, setselectedTestHistoryName] = useState(null);
  // delete modal open
  function handleDeleteModalOpen(testRecordId: any, testRecordName: any) {
    setselectedTestHistoryId(testRecordId);
    setselectedTestHistoryName(testRecordName);
    setDeleteModalOpen(true);
  }

  // delete modal close
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  // User Delete Function
  async function handleTestHistoryDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/testhistory/deleteTestRecord",
        {
          testRecordId: id,
        }
      );
      if (resData?.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteTestHistory(id));
        handleDeleteModalClose();

        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {}
  }

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="overflow-y-auto mt-3 flex-1 border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(10,1fr)] gap-2 w-full bg-gray-200">
        <span className="py-3  text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
          Exam Title
        </span>
        <span className="py-3  col-span-2 text-left text-sm font-bold text-gray-600">
          Student
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Branch
        </span>
        <span className="py-3 col-span-2  text-left text-sm font-bold text-gray-600">
          Course
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Score
        </span>
        <span className="py-3  text-left text-sm font-bold text-gray-600">
          Result
        </span>
        <span className="py-3  text-center text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>

      {/* loading */}
      {allTestHistoryLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting records</p>
        </div>
      )}
      {/* No test reocrd Found */}
      {allFilteredActiveTestHistoryList.length === 0 &&
        !allTestHistoryLoading && (
          <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No Test Record Found</p>
          </div>
        )}
      {/* test record list */}
      {!allTestHistoryLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveTestHistoryList
            .slice(
              (currentPage - 1) * testHistoriesPerPage,
              currentPage * testHistoriesPerPage
            )
            .map((testRecord: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * testHistoriesPerPage + index + 1;
              return (
                <div
                  key={testRecord?._id}
                  className="table-headings  grid grid-cols-[50px,repeat(10,1fr)] gap-2 items-center w-full cursor-pointer border-b border-gray-2  hover:bg-gray-100"
                >
                  {/* SN */}
                  <span className="text-center text-xs font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  {/* testRecord name */}
                  <Link
                    title="View"
                    href={`/${session?.data?.user?.role?.toLowerCase()}/testhistory/${
                      testRecord?._id
                    }`}
                    className="text-left  col-span-2 text-xs font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {testRecord?.examTitle}
                  </Link>
                  {/* studeent name  */}
                  <span className="text-left col-span-2 text-xs font-medium text-gray-600">
                    {testRecord?.studentName}
                  </span>

                  {/* branch */}
                  <span className="text-left text-xs font-medium text-gray-600">
                    {testRecord?.branchName}
                  </span>

                  {/* course */}
                  <span className="text-left col-span-2 text-xs font-medium text-gray-600">
                    {testRecord?.courseName || "N/A"}
                  </span>
                  {/* marks */}
                  <span className="text-left text-xs font-medium text-gray-600">
                    {testRecord?.obtainedScore}
                  </span>
                  {/* result */}
                  <span className="flex items-center gap-1 text-left text-xs font-medium text-gray-600">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        testRecord?.resultStatus === "Pass"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    {testRecord?.resultStatus || "N/A"}
                  </span>

                  {/* edit button */}
                  <div className="text-center text-sm font-medium text-gray-600">
                    {/* edit */}
                    <Link
                      href={`/${role?.toLowerCase()}/testhistory/updatetestrecord/${
                        testRecord?._id
                      }`}
                      title="Edit"
                      className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-gray-500 hover:text-white"
                    >
                      <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                    </Link>

                    {/* delete modal */}
                    {session?.data?.user?.role?.toLowerCase() != "trainer" && (
                      <>
                        {testRecord?.activeStatus == true && (
                          <button
                            title="Delete"
                            className="delete py-1 px-1 transition-all ease duration-200 rounded-full hover:bg-red-500 hover:text-white"
                            onClick={() =>
                              handleDeleteModalOpen(
                                testRecord._id,
                                testRecord?.examTitle
                              )
                            }
                          >
                            <DeleteIcon sx={{ fontSize: "1.3rem" }} />
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
                              Delete Test Record?
                            </p>
                            <span className="text-center mt-2">
                              <span className="font-bold text-xl">
                                {selectedTestHistoryName}
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
                                  handleTestHistoryDelete(selectedTestHistoryId)
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          </Box>
                        </Modal>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default TestHistoryList;
