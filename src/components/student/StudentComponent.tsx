import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SearchInput from "../SearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Modal } from "@mui/material";
import StudentList from "./StudentList";
import { Pagination, Stack } from "@mui/material";
import AddStudent from "./AddStudent";
import axios from "axios";
import StudentFilterComponent from "../filtercomponents/StudentFilterComponent";

const StudentComponent = () => {
  const affiliatedToOptions = ["HCA", "School"];
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const [selectedActiveStatus, setselectedActiveStatus] = useState("active");
  const [searchText, setsearchText] = useState("");
  const [filteredStudentCount, setfilteredStudentCount] = useState(0);
  // new student added
  const [newStudentAdded, setnewStudentAdded] = useState(false);
  const [newCreatedStudent, setnewCreatedStudent] = useState();
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [studentsPerPage] = useState(7);
  //modal
  const [addStudentModalOpen, setaddStudentModalOpen] = useState(false);
  // batchlist
  const [hcaBatchList, sethcaBatchList] = useState([]);
  const [schoolBatchList, setschoolBatchList] = useState([]);
  //projectList
  const [projectList, setprojectList] = useState([]);

  // reset acive status to "active" when selectedAffiliatedTo changes
  useEffect(() => {
    setselectedActiveStatus("active");
    setsearchText("");
  }, [selectedAffiliatedTo]);

  // modal operation
  // handleAddStudentModalOpen
  function handleAddStudentModalOpen() {
    setaddStudentModalOpen(true);
  }

  // handleAddStudentModalClose
  function handleAddStudentModalClose() {
    setaddStudentModalOpen(false);
  }
  // handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // getInitialData function
  async function getInitialData() {
    // get all batches
    const { data: batchResData } = await axios.get(
      "/api/batches/getAllBatches"
    );
    let tempHcaBatches = batchResData.allBatches.filter(
      (batch) => batch.affiliatedTo.toLowerCase() == "hca"
    );
    let tempSchoolBatches = batchResData.allBatches.filter(
      (batch) => batch.affiliatedTo.toLowerCase() == "school"
    );
    sethcaBatchList(tempHcaBatches);
    setschoolBatchList(tempSchoolBatches);

    // get all projects
    const { data: projectResData } = await axios.get(
      "/api/projects/getAllProjects"
    );
    setprojectList(projectResData.allProjects);
  }
  // intial data fetching
  useEffect(() => {
    getInitialData();
  }, []);
  return (
    <div className="flex-1 py-6 px-10 border bg-white rounded-lg">
      <h1 className="text-2xl font-bold">Student Management</h1>
      {/* student header */}
      <div className="student-header my-2 flex items-end justify-between">
        {/* dropdown */}
        <div className="dropdown flex items-end">
          <Dropdown
            label="Affiliated to"
            options={affiliatedToOptions}
            selected={selectedAffiliatedTo}
            onChange={setselectedAffiliatedTo}
          />
          {/* Student count */}
          <span className="text-xl text-white bg-gray-400 rounded-md py-1 px-3 font-bold ml-2">
            {filteredStudentCount}
          </span>
        </div>
        {/* search-filter-menus */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e) => setsearchText(e.target.value)}
          />

          {/* filter button */}
          <StudentFilterComponent
            selectedActiveStatus={selectedActiveStatus}
            setselectedActiveStatus={setselectedActiveStatus}
          />
          {/* add student button */}
          <Button
            variant="contained"
            size="small"
            onClick={handleAddStudentModalOpen}
          >
            <AddIcon />
            <span className="ml-1">Add Student</span>
          </Button>
          <Modal
            open={addStudentModalOpen}
            onClose={handleAddStudentModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[70%] max-h-[87%] p-6 overflow-y-auto flex flex-col bg-white rounded-xl shadow-lg">
              {/* add mode */}
              <AddStudent
                mode="add"
                hcaBatchList={hcaBatchList}
                schoolBatchList={schoolBatchList}
                projectList={projectList}
                newStudentAdded={newStudentAdded}
                setnewStudentAdded={setnewStudentAdded}
                newCreatedStudent={newCreatedStudent}
                setnewCreatedStudent={setnewCreatedStudent}
                handleClose={handleAddStudentModalClose}
              />
            </Box>
          </Modal>
        </div>
      </div>
      {/* students list */}
      <StudentList
        hcaBatchList={hcaBatchList}
        schoolBatchList={schoolBatchList}
        projectList={projectList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleClose={handleAddStudentModalClose}
        studentsPerPage={studentsPerPage}
        searchText={searchText}
        selectedAffiliatedTo={selectedAffiliatedTo}
        setfilteredStudentCount={setfilteredStudentCount}
        selectedActiveStatus={selectedActiveStatus}
        setselectedActiveStatus={setselectedActiveStatus}
        newStudentAdded={newStudentAdded}
        setnewStudentAdded={setnewStudentAdded}
        newCreatedStudent={newCreatedStudent}
        setnewCreatedStudent={setnewCreatedStudent}
      />
      {/* pagination */}
      <Stack spacing={2} className="mx-auto w-max mt-7">
        <Pagination
          count={Math.ceil(filteredStudentCount / studentsPerPage)} // Total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default StudentComponent;
