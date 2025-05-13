import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";

import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";

import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";
import ViewProject from "./ViewProject";
import Link from "next/link";
import { notify } from "@/helpers/notify";
import { useDispatch } from "react-redux";
import { deleteProject } from "@/redux/allListSlice";

const ProjectList = ({
  allFilteredActiveProjects,
  currentPage,
  projectsPerPage,
  allProjectsLoading,
  role = "",
}: any) => {
  const dispatch = useDispatch<any>();

  const [loaded, setloaded] = useState(false);
  const [selectedProjectId, setselectedProjectId] = useState(null);
  const [selectedProjectName, setselectedProjectName] = useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewProject, setselectedViewProject] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // project Delete Function
  async function handleProjectDelete(id: any) {
    try {
      const { data: resData } = await axios.post(
        "/api/projects/deleteProject",
        {
          projectId: id,
        }
      );
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteProject(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleProjectDelete", error);
    }
  }
  // view modal open
  function handleViewModalOpen(project: any) {
    console.log(project);
    setselectedViewProject(project);
    setViewModalOpen(true);
  }

  // view modal close
  function handleViewModalClose() {
    setViewModalOpen(false);
  }

  function handleDeleteModalOpen(projectId: any, projectName: any) {
    setselectedProjectId(projectId);
    setselectedProjectName(projectName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  useEffect(() => {
    setloaded(true);
  }, []);

  if (!loaded) return <div></div>;

  return (
    <div className="overflow-y-auto mt-2 border  flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          School Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Address
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Trainers
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Status
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Action
        </span>
      </div>
      {/* loading */}
      {allProjectsLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting projects</p>
        </div>
      )}
      {/* No projects Found */}
      {/* {allFilteredActiveProjects.length === 0 && !projectListLoading && ( */}
      {allFilteredActiveProjects.length === 0 && !allProjectsLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Projects Found</p>
        </div>
      )}
      {/* projects List */}
      {!allProjectsLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveProjects
            .slice(
              (currentPage - 1) * projectsPerPage,
              currentPage * projectsPerPage
            )
            .map((project: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * projectsPerPage + index + 1;

              return (
                <div
                  key={project?._id}
                  className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    title="View"
                    href={`projects/${project?._id}`}
                    className="text-left text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {project?.name}
                  </Link>
                  <span className=" text-sm text-gray-700">
                    {project?.address}
                  </span>
                  <div className=" text-sm text-gray-700 flex gap-1">
                    {project?.assignedTrainers?.map((trainer: any, i: any) => {
                      return (
                        <span
                          key={trainer?.trainerId}
                          className="text-xs border border-gray-300 px-2  rounded-full"
                        >
                          {trainer?.trainerName}
                        </span>
                      );
                    })}
                  </div>
                  <span className=" text-sm text-gray-500">
                    {project?.completedStatus}
                  </span>

                  {role?.toLowerCase() == "superadmin" ? (
                    <div className=" text-sm text-gray-500">
                      {/* edit modal */}
                      <Link
                        href={`/superadmin/projects/updateproject/${project?._id}`}
                        title="Edit"
                        className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-gray-500 hover:text-white"
                      >
                        <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                      </Link>

                      {/* delete modal */}
                      {project?.activeStatus == true && (
                        <button
                          title="Delete"
                          className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                          onClick={() =>
                            handleDeleteModalOpen(project._id, project.name)
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
                            Delete project?
                          </p>
                          <span className="text-center mt-2">
                            <span className="font-bold text-xl">
                              {selectedProjectName}
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
                                handleProjectDelete(selectedProjectId)
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

export default ProjectList;
