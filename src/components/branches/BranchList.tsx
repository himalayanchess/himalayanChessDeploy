import { Box, Button, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import LockIcon from "@mui/icons-material/Lock";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import Link from "next/link";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { deleteBranch } from "@/redux/allListSlice";

const BranchList = ({
  allFilteredActiveBranchesList,
  currentPage,
  branchesPerPage,
  allBranchesLoading,
  role,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  const [loaded, setloaded] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedbranchName, setSelectedbranchName] = useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(branchId: any, branchName: any) {
    setSelectedBranchId(branchId);
    setSelectedbranchName(branchName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  async function handlebranchDelete(id: any) {
    try {
      const { data: resData } = await axios.post("/api/branches/deleteBranch", {
        branchId: id,
      });
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteBranch(id));
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
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm  col-span-2 font-bold text-gray-600">
          Branch Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Branch Code
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Address
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {allBranchesLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting branches</p>
        </div>
      )}
      {/* No branches Found */}
      {allFilteredActiveBranchesList.length === 0 && !allBranchesLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Branch Found</p>
        </div>
      )}
      {/* branches List */}
      {!allBranchesLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveBranchesList
            .slice(
              (currentPage - 1) * branchesPerPage,
              currentPage * branchesPerPage
            )
            .map((branch: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * branchesPerPage + index + 1;

              return (
                <div
                  key={branch?._id}
                  className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    title="View"
                    href={`branches/${branch?._id}`}
                    className="text-left text-sm col-span-2 font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {branch?.branchName}

                    {branch?.isMainBranch && (
                      <span className="ml-2 bg-gray-400 text-white font-bold rounded-full text-xs px-2 py-0.5">
                        Main
                      </span>
                    )}
                  </Link>
                  <span className="text-sm text-gray-700">
                    {branch?.branchCode}
                  </span>
                  <span className="text-sm text-gray-700">
                    {branch?.address}
                  </span>
                  {role?.toLowerCase() == "superadmin" ? (
                    <div className="text-sm text-gray-500">
                      <>
                        {/* edit  */}
                        <Link
                          href={`/superadmin/branches/updatebranch/${branch?._id}`}
                          title="Edit"
                          className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-gray-500 hover:text-white"
                        >
                          <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                        </Link>

                        {/* delete modal */}
                        {branch?.activeStatus == true && (
                          <button
                            title="Delete"
                            className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                            onClick={() =>
                              handleDeleteModalOpen(
                                branch?._id,
                                branch?.branchName
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
                              backgroundColor: "rgba(0,0,0,0.3)", // Make the backdrop transparent
                            },
                          }}
                        >
                          <Box className="w-96 p-5 border-y-4 border-red-400 flex flex-col items-center bg-white">
                            <DeleteIcon
                              className="text-white bg-red-600 rounded-full"
                              sx={{ fontSize: "3rem", padding: "0.5rem" }}
                            />

                            <p className="text-md mt-1 font-bold ">
                              Delete branch?
                            </p>
                            <span className="text-center mt-2">
                              <span className="font-bold text-xl">
                                {selectedbranchName}
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
                                  handlebranchDelete(selectedBranchId)
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

export default BranchList;
