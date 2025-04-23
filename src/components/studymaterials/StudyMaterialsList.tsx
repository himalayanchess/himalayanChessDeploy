import { notify } from "@/helpers/notify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";
import Link from "next/link";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { useDispatch } from "react-redux";
import { deleteStudyMaterial } from "@/redux/allListSlice";

const StudyMaterialsList = ({
  allFilteredActiveStudyMaterialsList,
  currentPage,
  studyMaterialsPerPage,
  allStudyMaterialsLoading,
  role,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();
  //state vars
  const [loaded, setloaded] = useState(false);
  const [selectedStudyMaterialId, setSelectedStudyMaterialId] = useState(null);
  const [selectedStudyMaterialName, setSelectedStudyMaterialName] =
    useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(studyMaterialId: any, studyMaterialName: any) {
    setSelectedStudyMaterialId(studyMaterialId);
    setSelectedStudyMaterialName(studyMaterialName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  // Study Material Delete Function
  async function handleStudyMaterialDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/studymaterials/deleteStudyMaterial",
        {
          studyMaterialId: id,
        }
      );
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteStudyMaterial(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handlestudyMaterialDelete", error);
    }
  }

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded)
    return (
      <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg"></div>
    );

  return (
    <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(6,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
          Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Type
        </span>
        <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
          Course
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {allStudyMaterialsLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting materials</p>
        </div>
      )}
      {/* No STudy Materials Found */}
      {allFilteredActiveStudyMaterialsList.length === 0 &&
        !allStudyMaterialsLoading && (
          <div className="flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No Materials Found</p>
          </div>
        )}

      {/* STudy Materials List */}
      {!allStudyMaterialsLoading && (
        <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveStudyMaterialsList
            .slice(
              (currentPage - 1) * studyMaterialsPerPage,
              currentPage * studyMaterialsPerPage
            )
            .map((studyMaterial: any, index: any) => {
              // serial number
              const serialNumber =
                (currentPage - 1) * studyMaterialsPerPage + index + 1;
              return (
                <div
                  key={`${studyMaterial?.fileName}_${index}`}
                  className="grid grid-cols-[70px,repeat(6,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    title="View"
                    target="_blank"
                    href={`${studyMaterial?.fileUrl}`}
                    className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {studyMaterial?.fileType?.toLowerCase() == "image" ? (
                      <ImageOutlinedIcon
                        className=" text-gray-500"
                        fontSize="small"
                      />
                    ) : studyMaterial?.fileType?.toLowerCase() === "pdf" ? (
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
                    <span className="ml-2">{studyMaterial?.fileName}</span>
                  </Link>
                  <span className="text-sm text-gray-700">
                    {studyMaterial?.fileType || "N/A"}
                  </span>

                  <span className="text-sm col-span-2 text-gray-700">
                    {studyMaterial?.courseName || "N/A"}
                  </span>

                  {role?.toLowerCase() == "superadmin" ? (
                    <div className="text-sm text-gray-500">
                      {/* delete modal */}
                      {studyMaterial?.activeStatus == true && (
                        <button
                          title="Delete"
                          className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                          onClick={() =>
                            handleDeleteModalOpen(
                              studyMaterial._id,
                              studyMaterial.fileName
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
                            Delete Study Material?
                          </p>
                          <span className="text-center mt-2">
                            <span className="font-bold text-xl">
                              {selectedStudyMaterialName}
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
                                handleStudyMaterialDelete(
                                  selectedStudyMaterialId
                                )
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </Box>
                      </Modal>
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

export default StudyMaterialsList;
