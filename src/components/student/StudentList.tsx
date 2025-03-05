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
import AddStudent from "./AddStudent";
import { notify } from "@/helpers/notify";

const StudentList = ({
  hcaBatchList,
  schoolBatchList,
  projectList,
  currentPage,
  setCurrentPage,
  studentsPerPage,
  handleClose,
  searchText,
  selectedAffiliatedTo,
  setfilteredStudentCount,
  selectedActiveStatus,
  setselectedActiveStatus,
  newStudentAdded,
  setnewStudentAdded,
  newCreatedStudent,
  setnewCreatedStudent,
}) => {
  const [allHcaStudents, setallHcaStudents] = useState<any>([]);
  const [allSchoolStudents, setallSchoolStudents] = useState<any>([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setselectedStudentId] = useState(null);
  const [selectedStudentName, setselectedStudentName] = useState("");
  const [studentListLoading, setstudentListLoading] = useState(true);
  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // view modal
  const [selectedViewStudent, setselectedViewStudent] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //edit modal
  const [selectedEditStudent, setselectedEditStudent] = useState(null);
  const [editModalOpen, seteditModalOpen] = useState(false);
  // user edited
  const [studentEdited, setstudentEdited] = useState(false);
  const [editedStudent, seteditedStudent] = useState(null);

  // edit modal open
  function handleEditModalOpen(student) {
    console.log(student);
    setselectedEditStudent(student);
    seteditModalOpen(true);
  }

  // edit modal close
  function handleEditModalClose() {
    seteditModalOpen(false);
  }

  // delete modal open
  function handleDeleteModalOpen(studentId, studentName) {
    setselectedStudentId(studentId);
    setselectedStudentName(studentName);
    setDeleteModalOpen(true);
  }

  // delete modal close
  function handleDeleteModalClose() {
    setDeleteModalOpen(false);
  }

  // User Delete Function
  async function handleStudentDelete(id, affiliatedTo) {
    try {
      const { data: resData } = await axios.post(
        "/api/students/deleteStudent",
        {
          studentId: id,
          affiliatedTo,
        }
      );
      if (resData?.statusCode == 200) {
        let tempAllStudents =
          selectedAffiliatedTo?.toLowerCase() === "hca"
            ? [...allHcaStudents]
            : [...allSchoolStudents];
        tempAllStudents = tempAllStudents.map((student) => {
          if (student._id == id) {
            return { ...student, activeStatus: false };
          } else {
            return student;
          }
        });

        if (selectedAffiliatedTo?.toLowerCase() === "hca") {
          setallHcaStudents(tempAllStudents);
        }
        if (selectedAffiliatedTo?.toLowerCase() === "school") {
          setallSchoolStudents(tempAllStudents);
        }
        notify(resData.msg, resData.statusCode);
        handleDeleteModalClose();
        return;
      }
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in handleStudentDelete", error);
    }
  }

  // filter effect
  useEffect(() => {
    console.log("affiliated to", selectedAffiliatedTo);

    // Determine which list to use based on selectedAffiliatedTo
    let tempAllStudents =
      selectedAffiliatedTo?.toLowerCase() === "hca"
        ? [...allHcaStudents]
        : [...allSchoolStudents];
    console.log("tempAllStudents", tempAllStudents);

    // Sort students by createdAt in descending order (latest first)
    const sortedStudents = tempAllStudents.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply search filter if searchText is provided
    let filteredStudents = sortedStudents;
    if (searchText.trim() !== "") {
      filteredStudents = filteredStudents.filter((student) =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    // Apply active status filter if selectedActiveStatus is provided
    if (selectedActiveStatus.toLowerCase() === "active") {
      filteredStudents = filteredStudents.filter(
        (student) => student.activeStatus === true
      );
    } else if (selectedActiveStatus.toLowerCase() === "inactive") {
      filteredStudents = filteredStudents.filter(
        (student) => student.activeStatus === false
      );
    }
    // Update filtered students and count
    setFilteredStudents(filteredStudents);
    setfilteredStudentCount(filteredStudents.length);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [
    allHcaStudents,
    allSchoolStudents,
    selectedAffiliatedTo,
    searchText,
    selectedActiveStatus,
  ]);

  // function getAllStudents
  async function getAllStudents() {
    try {
      setstudentListLoading(true);
      // get all hca students
      const { data: resData } = await axios.get("/api/students/getAllStudents");
      setallHcaStudents(resData.allHcaAffiliatedStudents);
      setallSchoolStudents(resData.allNonAffiliatedStudents);
      setstudentListLoading(false);
    } catch (error) {
      console.log("error in students/getallstudents", error);
    }
  }
  // intial get all students
  useEffect(() => {
    getAllStudents();
  }, []);
  return (
    <div className="overflow-y-auto  mt-3 flex-1 flex flex-col bg-white rounded-lg">
      {/* Table Headings */}
      <div className="table-headings mb-2 grid grid-cols-5 w-full bg-gray-100">
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Name
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Affiliated to
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Gender
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Active Status
        </span>
        <span className="py-3 px-5 text-left text-sm font-medium text-gray-600">
          Actions
        </span>
      </div>

      {/* loading */}
      {studentListLoading && (
        <div className="w-full text-center my-6">
          <CircularProgress sx={{ color: "gray" }} />
          <p className="text-gray-500">Getting users</p>
        </div>
      )}
      {/* No Student Found */}
      {filteredStudents.length === 0 && !studentListLoading && (
        <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
          <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
          <p className="text-md">No Student Found</p>
        </div>
      )}

      {/* students list */}
      <div className="table-contents overflow-y-auto flex-1 grid grid-cols-1 grid-rows-7">
        {filteredStudents
          .slice(
            (currentPage - 1) * studentsPerPage,
            currentPage * studentsPerPage
          )
          .map((student: any) => (
            <div
              key={student?._id}
              className="table-headings  grid grid-cols-5 items-center w-full border-b border-gray-100"
            >
              {/* student name */}
              <span className="py-1 px-5 text-left text-sm font-medium text-gray-600">
                {student?.name}
              </span>
              {/* Affiliate to  */}
              <span className="py-1 px-5 text-left text-sm font-medium text-gray-600">
                {selectedAffiliatedTo.toLowerCase() == "hca"
                  ? "HCA"
                  : student?.projectName}
              </span>
              {/* Gender */}
              <span className="py-1 px-5 text-left text-sm font-medium text-gray-600">
                {student?.gender}
              </span>

              {/* Active Status */}
              <span className="py-1 px-5 text-left text-sm font-medium text-gray-600">
                {student?.activeStatus ? "Active" : "Inactive"}
              </span>
              {/* Active Status */}
              <div className="py-1 px-5 text-left text-sm font-medium text-gray-600">
                {/* view */}
                <Link
                  title="View"
                  href={`/student/${student?._id}`}
                  target="_blank"
                  className="transition-all ease duration-200 px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white"
                >
                  <ViewKanbanOutlinedIcon />
                </Link>

                {/* edit */}
                <button
                  title="Edit"
                  onClick={() => handleEditModalOpen(student)}
                  className="edit mx-3 px-2 py-2 transition-all ease duration-200 rounded-full hover:bg-green-500 hover:text-white"
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
                  <Box className="w-[70%] max-h-[87%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
                    <AddStudent
                      mode="edit"
                      hcaBatchList={hcaBatchList}
                      schoolBatchList={schoolBatchList}
                      projectList={projectList}
                      newStudentAdded={newStudentAdded}
                      setnewStudentAdded={setnewStudentAdded}
                      newCreatedStudent={newCreatedStudent}
                      setnewCreatedStudent={setnewCreatedStudent}
                      handleClose={handleClose}
                      initialData={selectedEditStudent}
                      editedStudent={editedStudent}
                      seteditedStudent={seteditedStudent}
                    />
                  </Box>
                </Modal>
                {/* delete modal */}
                {student?.activeStatus == true && (
                  <button
                    title="Delete"
                    className="delete px-2 py-2 transition-all ease duration-200 rounded-full hover:bg-red-500 hover:text-white"
                    onClick={() =>
                      handleDeleteModalOpen(student._id, student.name)
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
                        {selectedStudentName}
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
                        onClick={() =>
                          handleStudentDelete(
                            selectedStudentId,
                            student?.affiliatedTo
                          )
                        }
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

export default StudentList;
