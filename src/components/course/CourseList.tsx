import { Box, Button, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import Link from "next/link";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { deleteCourse, deleteUser } from "@/redux/allListSlice";
import { useDispatch } from "react-redux";

const CourseList = ({
  allFilteredActiveCoursesList,
  currentPage,
  coursesPerPage,
  allCoursesLoading,
}: any) => {
  // dispatch
  const dispatch = useDispatch<any>();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function handleDeleteModalOpen(courseId, courseName) {
    setSelectedCourseId(courseId);
    setSelectedCourseName(courseName);
    setDeleteModalOpen(true);
  }
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }
  async function handleCourseDelete(id) {
    try {
      const { data: resData } = await axios.post("/api/courses/deleteCourse", {
        courseId: id,
      });
      if (resData.statusCode == 200) {
        notify(resData.msg, resData.statusCode);
        dispatch(deleteCourse(id));
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleUserDelete", error);
    }
  }

  return (
    <div className="overflow-y-auto mt-3 flex-1 border flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left text-sm  col-span-2 font-bold text-gray-600">
          Course Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Duration (Weeks)
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Affiliated to
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Actions
        </span>
      </div>
      {/* loading */}
      {allCoursesLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting courses</p>
        </div>
      )}
      {/* No courses Found */}
      {allFilteredActiveCoursesList.length === 0 && !allCoursesLoading && (
        <div className="flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No course Found</p>
        </div>
      )}
      {/* courses List */}
      {!allCoursesLoading && (
        <div className="table-contents overflow-y-auto h-full  flex-1 grid grid-cols-1 grid-rows-7">
          {allFilteredActiveCoursesList
            .slice(
              (currentPage - 1) * coursesPerPage,
              currentPage * coursesPerPage
            )
            .map((course: any, index: any) => {
              const serialNumber =
                (currentPage - 1) * coursesPerPage + index + 1;

              return (
                <div
                  key={course?._id}
                  className="grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                >
                  <span className="text-sm text-center font-medium text-gray-600">
                    {serialNumber}
                  </span>
                  <Link
                    title="View"
                    href={`courses/${course?._id}`}
                    className="text-left text-sm col-span-2 font-medium text-gray-600 hover:underline hover:text-blue-500"
                  >
                    {course?.name}
                  </Link>
                  <span className="text-sm text-gray-700">
                    {course?.duration}
                  </span>
                  <span className="text-sm text-gray-700">
                    {course?.affiliatedTo}
                  </span>

                  <div className="text-sm text-gray-500">
                    <>
                      {/* edit  */}
                      <Link
                        href={`/superadmin/courses/updatecourse/${course?._id}`}
                        title="Edit"
                        className="edit mx-3 px-1.5 py-2 rounded-full transition-all ease duration-200  hover:bg-green-500 hover:text-white"
                      >
                        <ModeEditIcon sx={{ fontSize: "1.3rem" }} />
                      </Link>

                      {/* delete modal */}
                      {course?.activeStatus == true && (
                        <button
                          title="Delete"
                          className="delete p-1 ml-3 transition-all ease duration-200 rounded-full hover:bg-gray-500 hover:text-white"
                          onClick={() =>
                            handleDeleteModalOpen(course?._id, course?.name)
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
                            Delete Course?
                          </p>
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
                                handleCourseDelete(selectedCourseId)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </Box>
                      </Modal>
                    </>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CourseList;
