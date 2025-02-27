import { Box, Button, CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCourse from "./AddCourse";
import ViewCourse from "./ViewCourse";

const CourseList = ({
  searchText,
  selectedSkillLevel,
  currentPage,
  setCurrentPage,
  coursesPerPage,
  setFilteredCoursesCount,
  newCourseAdded,
  setnewCourseAdded,
  newCreatedCourse,
  setnewCreatedCourse,
}) => {
  const [allCourses, setallCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [courseListLoading, setcourseListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewCourse, setselectedViewCourse] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //edit modal
  const [selectedEditCourse, setselectedEditCourse] = useState(null);
  const [editModalOpen, seteditModalOpen] = useState(false);
  // user edited
  const [courseEdited, setcourseEdited] = useState(false);
  const [editedCourse, seteditedCourse] = useState(null);

  // view modal open
  function handleViewModalOpen(course) {
    console.log(course);
    setselectedViewCourse(course);
    setViewModalOpen(true);
  }
  // edit modal open
  function handleEditModalOpen(course) {
    console.log(course);
    setselectedEditCourse(course);
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
  function handleDeleteModalOpen(userId, userName) {
    setSelectedCourseId(userId);
    setSelectedCourseName(userName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  async function handleCourseDelete(id) {
    alert(id);
  }
  // Handle new course addition
  useEffect(() => {
    if (newCourseAdded && newCreatedCourse) {
      setallCourses((prevCourse) => [newCreatedCourse, ...prevCourse]);

      setnewCourseAdded(false);
    }
  }, [newCourseAdded, newCreatedCourse, setnewCourseAdded]);
  // Handle update(edit) user
  useEffect(() => {
    if (courseEdited && editedCourse) {
      let tempCourses = [...allCourses];
      console.log("updateeeeeeeeee", tempCourses, editedCourse);
      tempCourses = tempCourses.map((course) => {
        if (course._id == editedCourse._id) {
          return editedCourse;
        } else {
          return course;
        }
      });
      setallCourses(tempCourses);
      setcourseEdited(false);
    }
  }, [courseEdited, editedCourse, setcourseEdited]);
  //get all courses
  async function getAllCourses() {
    try {
      setcourseListLoading(true);
      const { data: resData } = await axios.get("/api/courses/getAllCourses");
      console.log(resData.allCourses);
      setallCourses(resData.allCourses);
      setcourseListLoading(false);
    } catch (error) {
      console.log("error in superadmin/courses (getallcourses)", error);
    }
  }
  useEffect(() => {
    // add new user
    let tempAllCourses = [...allCourses];

    // Sort users by createdAt in descending order (latest first)
    const sortedUsers = tempAllCourses.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // First, filter by role
    let filteredBySelectedLevel = sortedUsers.filter(
      (coures) =>
        coures.skillLevel.toLowerCase() === selectedSkillLevel.toLowerCase()
    );

    // Apply search filter if searchText is provided
    if (searchText.trim() !== "") {
      filteredBySelectedLevel = filteredBySelectedLevel.filter((course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    console.log("temp allcourses", filteredBySelectedLevel);

    // Update filtered users
    setFilteredCourses(filteredBySelectedLevel);
    setFilteredCoursesCount(filteredBySelectedLevel.length);
    setCurrentPage(1);
  }, [allCourses, selectedSkillLevel, searchText]);
  useEffect(() => {
    getAllCourses();
  }, []);
  return (
    <div className="overflow-x-auto flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings grid grid-cols-5 w-full bg-gray-200">
        <span className="p-3 text-left text-sm  col-span-2 font-medium text-gray-600">
          Course Name
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Duration (Weeks)
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Skill Level
        </span>
        <span className="p-3 text-left text-sm font-medium text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {courseListLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting courses</p>
        </div>
      )}
      {/* No courses Found */}
      {filteredCourses.length === 0 && !courseListLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No course Found</p>
        </div>
      )}
      {/* courses List */}
      <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
        {filteredCourses
          .slice(
            (currentPage - 1) * coursesPerPage,
            currentPage * coursesPerPage
          )
          .map((course: any) => (
            <div
              key={course?._id}
              className="border-t grid grid-cols-5 items-center hover:bg-gray-50"
            >
              <span className="p-3 text-sm text-gray-700 col-span-2">
                {course?.name}
              </span>
              <span className="p-3 text-sm text-gray-700">
                {course?.duration}
              </span>
              <span className="p-3 text-sm text-gray-700">
                {course?.skillLevel}
              </span>

              <div className="p-3 text-sm text-gray-500">
                <>
                  {/* view modal */}
                  <button
                    onClick={() => handleViewModalOpen(course)}
                    title="View"
                    className="edit mr-3 p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
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
                    <Box className="w-[50%] h-[90%] p-6 overflow-y-auto grid grid-cols-2 auto-rows-min grid-auto-flow-dense gap-10 bg-white rounded-xl shadow-lg">
                      <ViewCourse course={selectedViewCourse} />
                    </Box>
                  </Modal>
                  {/* edit modal */}
                  <button
                    title="Edit"
                    onClick={() => handleEditModalOpen(course)}
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
                      <AddCourse
                        courseEdited={courseEdited}
                        setcourseEdited={setcourseEdited}
                        editedCourse={editedCourse}
                        seteditedCourse={seteditedCourse}
                        handleClose={handleEditModalClose}
                        mode="edit"
                        initialData={selectedEditCourse}
                      />
                    </Box>
                  </Modal>
                  {/* delete modal */}
                  {course?.activeStatus == true && (
                    <button
                      title="Delete"
                      className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                      onClick={() =>
                        handleDeleteModalOpen(course._id, course.name)
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

                      <p className="text-md mt-1 font-bold ">Delete Course?</p>
                      <span className="text-center mt-2">
                        <span className="font-bold text-xl">
                          {selectedCourseName}
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
                          onClick={() => handleCourseDelete(selectedCourseId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                </>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CourseList;
