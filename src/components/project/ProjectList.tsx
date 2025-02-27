import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Radio, FormControlLabel } from "@mui/material";

import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";
import ViewProject from "./ViewProject";

const ProjectList = ({
  currentPage,
  setCurrentPage,
  projectsPerPage,
  searchText,
  selectedProjectStatus,
  filteredProjectCount,
  setfilteredProjectCount,
  newProjectAdded,
  setnewProjectAdded,
  newCreatedProject,
  setnewCreatedProject,
  trainersList,
}) => {
  const [allProjects, setallProjects] = useState<any>([]);
  const [filteredProjects, setfilteredProjects] = useState([]);
  const [selectedProjectId, setselectedProjectId] = useState(null);
  const [selectedProjectName, setselectedProjectName] = useState("");
  const [projectListLoading, setprojectListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewProject, setselectedViewProject] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //edit modal
  const [selectedEditProject, setselectedEditProject] = useState(null);
  const [editModalOpen, seteditModalOpen] = useState(false);
  // user edited
  const [projectEdited, setprojectEdited] = useState(false);
  const [editedProject, seteditedProject] = useState(null);
  // User Delete Function
  async function handleUserDelete(id) {
    try {
      const { data: resData } = await axios.post(
        "/api/projects/deleteProject",
        {
          projectId: id,
        }
      );
      console.log(resData);
      let tempAllProjects = [...allProjects];
      tempAllProjects = tempAllProjects.map((project) => {
        if (project._id == id) {
          return { ...project, activeStatus: false };
        } else {
          return project;
        }
      });
      setallProjects(tempAllProjects);
      handleDeleteModalClose();
    } catch (error) {
      console.log("error in handleProjectDelete", error);
    }
  }
  // view modal open
  function handleViewModalOpen(project) {
    console.log(project);
    setselectedViewProject(project);
    setViewModalOpen(true);
  }
  // edit modal open
  function handleEditModalOpen(project) {
    console.log(project);
    setselectedEditProject(project);
    seteditModalOpen(true);
  }

  // view modal close
  function handleViewModalClose() {
    setViewModalOpen(false);
  }
  // edit modal close
  function handleEditModalClose() {
    seteditModalOpen(false);
  }

  function handleDeleteModalOpen(projectId, projectName) {
    setselectedProjectId(projectId);
    setselectedProjectName(projectName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  // filter effect
  useEffect(() => {
    // add new user
    let tempAllProjects = [...allProjects];

    // Sort users by createdAt in descending order (latest first)
    const sortedProjects = tempAllProjects.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // First, filter by status
    let filteredByStatus = sortedProjects.filter(
      (project) =>
        project.completedStatus.toLowerCase() ===
        selectedProjectStatus.toLowerCase()
    );

    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      filteredByStatus = filteredByStatus.filter((project) =>
        project.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    // only show project with active status (not deleted)
    filteredByStatus = filteredByStatus.filter(
      (project) => project.activeStatus
    );
    // Apply Active Status Filter
    // if (activeStatus === "active") {
    //   filteredByStatus = filteredByStatus.filter((user) => user.activeStatus);
    // } else if (activeStatus === "inactive") {
    //   filteredByStatus = filteredByStatus.filter((user) => !user.activeStatus);
    // }

    // Update filtered users
    setfilteredProjects(filteredByStatus);
    setfilteredProjectCount(filteredByStatus.length);
    setCurrentPage(1);
  }, [allProjects, selectedProjectStatus, searchText]);

  // Handle new project addition
  useEffect(() => {
    if (newProjectAdded && newCreatedProject) {
      setallProjects((prevProjects) => [newCreatedProject, ...prevProjects]);
      setnewProjectAdded(false);
    }
  }, [newProjectAdded, newCreatedProject, setnewProjectAdded]);

  // Handle update(edit) project
  useEffect(() => {
    if (projectEdited && editedProject) {
      let tempProjects = [...allProjects];
      console.log("updateeeeeeeeee", tempProjects, editedProject);
      tempProjects = tempProjects.map((project) => {
        if (project._id == editedProject._id) {
          return editedProject;
        } else {
          return project;
        }
      });
      setallProjects(tempProjects);
      setprojectEdited(false);
    }
  }, [projectEdited, editedProject, setprojectEdited]);

  //function get all projects
  async function getAllProjects() {
    setprojectListLoading(true);
    const { data: resData } = await axios.get("/api/projects/getAllProjects");
    setallProjects(resData.allProjects);
    setprojectListLoading(false);
  }
  // get all projects
  useEffect(() => {
    getAllProjects();
  }, []);
  return (
    <div className="overflow-x-auto flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings grid grid-cols-5 w-full bg-gray-200">
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Project Name
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Address
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Trainers
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Status
        </span>

        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Action
        </span>
      </div>
      {/* loading */}
      {projectListLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting projects</p>
        </div>
      )}
      {/* No projects Found */}
      {filteredProjects.length === 0 && !projectListLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Projects Found</p>
        </div>
      )}
      {/* projects List */}
      <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
        {filteredProjects
          .slice(
            (currentPage - 1) * projectsPerPage,
            currentPage * projectsPerPage
          )
          .map((project: any) => (
            <div
              key={project?._id}
              className="border-t grid grid-cols-5 items-center hover:bg-gray-50"
            >
              <span className="p-3 text-sm text-gray-700">{project?.name}</span>
              <span className="p-3 text-sm text-gray-700">
                {project?.address}
              </span>
              <div className="p-3 text-sm text-gray-700">
                {project?.assignedTrainers?.map((trainer, i) => {
                  return (
                    <span key={trainer?.trainerId}>
                      {trainer?.trainerName}
                      <br />
                    </span>
                  );
                })}
              </div>
              <span className="p-3 text-sm text-gray-500">
                {project?.completedStatus}
              </span>

              <div className="p-3 text-sm text-gray-500">
                {/* view modal */}
                <button
                  onClick={() => handleViewModalOpen(project)}
                  title="View"
                  className="view mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                >
                  <WysiwygIcon />
                </button>
                <Modal
                  open={viewModalOpen}
                  onClose={handleViewModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="flex items-center justify-center"
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                    },
                  }}
                >
                  <Box className="w-[50%] h-[90%] p-6 overflow-y-auto grid grid-cols-2 auto-rows-min grid-auto-flow-dense gap-4 bg-white rounded-xl shadow-lg">
                    <ViewProject project={selectedViewProject} />
                  </Box>
                </Modal>
                {/* edit modal */}
                <button
                  title="Edit"
                  onClick={() => handleEditModalOpen(project)}
                  className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                >
                  <ModeEditIcon />
                </button>
                <Modal
                  open={editModalOpen}
                  onClose={handleEditModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="flex items-center justify-center"
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                    },
                  }}
                >
                  <Box className="w-[50%] h-[90%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                    <AddProject
                      projectEdited={projectEdited}
                      setProjectEdited={setprojectEdited}
                      handleClose={handleEditModalClose}
                      mode="edit"
                      initialData={selectedEditProject}
                      editedProject={editedProject}
                      seteditedProject={seteditedProject}
                      trainersList={trainersList}
                    />
                  </Box>
                </Modal>
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
                    <p className="text-md mt-1 font-bold ">Delete Account?</p>
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
                        sx={{ marginRight: ".5rem", paddingInline: "2rem" }}
                        onClick={handleDeleteModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ marginLeft: ".5rem", paddingInline: "2rem" }}
                        onClick={() => handleUserDelete(selectedProjectId)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Box>
                </Modal>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectList;
