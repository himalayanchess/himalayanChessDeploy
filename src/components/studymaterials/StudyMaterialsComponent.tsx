import { LibraryBig } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchInput from "../SearchInput";
import Link from "next/link";
import { Button, Divider, Modal, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Dropdown from "../Dropdown";
import StudyMaterialsList from "./StudyMaterialsList";
import { LoadingButton } from "@mui/lab";

import { useDispatch, useSelector } from "react-redux";
import {
  addNewStudyMaterial,
  filterStudyMaterialsList,
  getAllCourses,
  getAllStudyMaterials,
} from "@/redux/allListSlice";

import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { notify } from "@/helpers/notify";
import axios from "axios";
import { useSession } from "next-auth/react";

const StudyMaterialsComponent = ({ role = "" }: any) => {
  const session = useSession();

  const dispatch = useDispatch<any>();

  const {
    allActiveStudyMaterialsList,
    allFilteredActiveStudyMaterialsList,
    allStudyMaterialsLoading,
    allActiveCoursesList,
  } = useSelector((state: any) => state.allListReducer);

  const fileTypeOptions = ["All", "Image", "PDF", "PGN", "Others"];
  const [selectedCourse, setselectedCourse] = useState("All");
  const [selectedStudyMaterialCourse, setselectedStudyMaterialCourse] =
    useState("");
  const [selectedStudyMaterialCourseId, setselectedStudyMaterialCourseId] =
    useState("");
  const [selectedFileType, setselectedFileType] = useState("All");
  const [studyMaterialFile, setstudyMaterialFile] = useState<File | any>(null);
  const [fileName, setfileName] = useState("");
  const [uploadFileLoading, setuploadFileLoading] = useState(false);

  const [searchText, setsearchText] = useState("");
  const [filteredStudyMaterialsCount, setfilteredStudyMaterialsCount] =
    useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [studyMaterialsPerPage] = useState(7);
  const [uploadStudyMaterialModalOpen, setuploadStudyMaterialModalOpen] =
    useState(false);

  function handleuploadStudyMaterialModalOpen() {
    setuploadStudyMaterialModalOpen(true);
  }

  //handleuploadStudyMaterialModalClose
  function handleuploadStudyMaterialModalClose() {
    setstudyMaterialFile(null);
    setfileName("");
    setuploadStudyMaterialModalOpen(false);
    setselectedStudyMaterialCourse("");
    setselectedStudyMaterialCourseId("");
  }

  //handle file change
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setstudyMaterialFile(file);
    }
  };

  // Calculate showing text
  const startItem = (currentPage - 1) * studyMaterialsPerPage + 1;
  const endItem = Math.min(
    currentPage * studyMaterialsPerPage,
    filteredStudyMaterialsCount
  );
  const showingText = `Showing ${startItem}-${endItem} of ${filteredStudyMaterialsCount}`;

  // onSubmit function for upload study material file
  async function onSubmit(e: any) {
    e.preventDefault();
    let fileUrl = "";
    // required fileName
    if (fileName.trim() == "") {
      notify("File name  is required", 204);
      return;
    }

    // course required
    if (!selectedStudyMaterialCourse || !selectedStudyMaterialCourseId) {
      notify("Course is required", 204);
      return;
    }
    // file required
    if (!studyMaterialFile) {
      notify("Study material file is required", 204);
      return;
    }
    // if file set
    if (studyMaterialFile) {
      setuploadFileLoading(true);
      // check for same file name in studymaterial model
      const { data: checkStudyMaterialResData } = await axios.post(
        "/api/studymaterials/checkStudyMaterial",
        {
          fileName,
        }
      );
      // file name exists
      if (checkStudyMaterialResData?.statusCode != 200) {
        notify(
          checkStudyMaterialResData?.msg,
          checkStudyMaterialResData?.statusCode
        );
        setuploadFileLoading(false);

        return;
      }
      const formData = new FormData();
      formData.append("file", studyMaterialFile);
      const folderName = `studymaterials/${fileName}`;
      formData.append("folderName", folderName);
      formData.append("cloudinaryFileType", "studyMaterials");

      const { data: resData } = await axios.post(
        "/api/fileupload/uploadfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // cloudinary error
      if (resData.error) {
        notify("Error uploading file", 204);
        setuploadFileLoading(false);

        return;
      }
      // cloudinary success
      else {
        fileUrl = resData.res.secure_url;
        const fileExtension = studyMaterialFile?.name
          ?.split(".")
          ?.pop()
          ?.toLowerCase();
        const studyMaterial = {
          fileName,
          fileUrl,
          activeStatus: true,
          fileType: studyMaterialFile?.type.startsWith("image/")
            ? "image"
            : studyMaterialFile?.type === "application/pdf"
            ? "pdf"
            : fileExtension === "pgn"
            ? "pgn"
            : "others",
          uploadedBy: session?.data?.user?.name,
          uploadedById: session?.data?.user?._id,
          courseName: selectedStudyMaterialCourse || "",
          courseId: selectedStudyMaterialCourseId || "",
        };
        const { data: addNewStudyMaterialResData } = await axios.post(
          "/api/studymaterials/addNewStudyMaterial",
          {
            ...studyMaterial,
          }
        );

        if (addNewStudyMaterialResData?.statusCode == 200) {
          notify(
            addNewStudyMaterialResData?.msg,
            addNewStudyMaterialResData?.statusCode
          );
          // update redux state after adding new study material
          dispatch(
            addNewStudyMaterial(addNewStudyMaterialResData?.newStudyMaterial)
          );
          handleuploadStudyMaterialModalClose();
          setuploadFileLoading(false);

          return;
        }
        setuploadFileLoading(false);

        notify(
          addNewStudyMaterialResData?.msg,
          addNewStudyMaterialResData?.statusCode
        );
        return;
      }
    }
  }

  // filter
  useEffect(() => {
    // filter study materials
    let tempFilteredStudyMaterialsList =
      selectedFileType.toLowerCase() == "all"
        ? allActiveStudyMaterialsList
        : allActiveStudyMaterialsList.filter(
            (studyMaterial: any) =>
              studyMaterial?.fileType?.toLowerCase() ==
              selectedFileType.toLowerCase()
          );

    // filter by course
    tempFilteredStudyMaterialsList =
      selectedCourse.toLowerCase() == "all"
        ? tempFilteredStudyMaterialsList
        : tempFilteredStudyMaterialsList.filter(
            (studyMaterial: any) =>
              studyMaterial?.courseName?.toLowerCase() ==
              selectedCourse.toLowerCase()
          );

    if (searchText.trim() !== "") {
      tempFilteredStudyMaterialsList = tempFilteredStudyMaterialsList.filter(
        (studyMaterial: any) =>
          studyMaterial?.fileName
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    tempFilteredStudyMaterialsList = tempFilteredStudyMaterialsList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setfilteredStudyMaterialsCount(tempFilteredStudyMaterialsList?.length);
    setCurrentPage(1);
    dispatch(filterStudyMaterialsList(tempFilteredStudyMaterialsList));
  }, [
    allActiveStudyMaterialsList,
    selectedCourse,
    selectedFileType,
    searchText,
  ]);

  // intial data fetching
  useEffect(() => {
    dispatch(getAllStudyMaterials());
    dispatch(getAllCourses());
  }, []);

  return (
    <div className="flex-1 flex flex-col py-4 px-10 border bg-white rounded-lg">
      <h2 className="text-3xl mb-2 font-medium text-gray-700 flex items-center">
        <LibraryBig />
        <span className="ml-2">Study Materials</span>
      </h2>{" "}
      {/* student header */}
      <div className="student-header my-0 flex items-end justify-between gap-2">
        {/* dropdown */}
        <div className="dropdowns-showing flex flex-1  gap-4 items-end">
          <Dropdown
            label="File Type"
            options={fileTypeOptions}
            selected={selectedFileType}
            onChange={setselectedFileType}
          />
          <Dropdown
            label="Course"
            options={[
              "All",
              ...allActiveCoursesList?.map((course: any) => course?.name),
            ]}
            selected={selectedCourse}
            onChange={setselectedCourse}
          />
          <span className="text-sm text-gray-600">{showingText}</span>
        </div>
        {/* search-filter-menus */}
        <div className="search-filter-menus flex gap-4">
          {/* search input */}
          <SearchInput
            placeholder="Search"
            value={searchText}
            onChange={(e: any) => setsearchText(e.target.value)}
          />

          {/* add student button */}
          {/* <Link href={`/${role?.toLowerCase()}/students/addstudent`}> */}
          <Button
            onClick={handleuploadStudyMaterialModalOpen}
            variant="contained"
            size="small"
          >
            <AddIcon />
            <span className="ml-1">Add Study Material</span>
          </Button>
          {/* </Link> */}
          <Modal
            open={uploadStudyMaterialModalOpen}
            onClose={handleuploadStudyMaterialModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="flex items-center justify-center"
            BackdropProps={{
              style: { backgroundColor: "rgba(0,0,0,0.4)" },
            }}
          >
            <form
              onSubmit={onSubmit}
              className="w-96 h-max p-6 rounded-lg shadow-md bg-white"
            >
              {/* title close */}
              <div className="title-close flex justify-between">
                {/* TITLE */}
                <h1 className="font-bold flex items-center">
                  <CloudUploadIcon />
                  <span className="ml-2">Upload study material file</span>
                </h1>
                {/* close button */}
                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleuploadStudyMaterialModalClose}
                >
                  <CloseIcon />
                </Button>
              </div>
              {/* divider */}
              <Divider sx={{ margin: ".4rem 0" }} />
              {/* inputfield */}
              <TextField
                size="small"
                label="File name"
                className="w-full "
                sx={{ marginTop: "0.9rem" }}
                value={fileName}
                onChange={({ target }) => setfileName(target.value)}
              />
              {/* coruse  */}
              <div className="course-dropdown mt-2">
                <Dropdown
                  label="Course"
                  options={allActiveCoursesList?.map(
                    (course: any) => course?.name
                  )}
                  selected={selectedStudyMaterialCourse}
                  onChange={(value: any) => {
                    setselectedStudyMaterialCourse(value);
                    const selectedStudyMaterialCourse: any =
                      allActiveCoursesList.find(
                        (course: any) => course.name == value
                      );
                    setselectedStudyMaterialCourseId(
                      selectedStudyMaterialCourse?._id
                    );
                  }}
                  width="full"
                />
              </div>
              {/* <label htmlFor="studymaterialupload">upload here</label> */}
              <input
                // accept="application/pdf,image/*" // allow pdf and image
                onChange={handleFileChange}
                type="file"
                id="studymaterialupload"
                name="contractInput"
                className="mt-4"
              />

              {/* upload button */}
              {uploadFileLoading ? (
                <LoadingButton
                  size="large"
                  loading={uploadFileLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="w-full"
                  sx={{ marginTop: "1.5rem" }}
                >
                  <span>Uploading</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  className="w-full"
                  type="submit"
                  sx={{ marginTop: "1.5rem" }}
                >
                  Upload
                </Button>
              )}
            </form>
          </Modal>
        </div>
      </div>
      <StudyMaterialsList
        allFilteredActiveStudyMaterialsList={
          allFilteredActiveStudyMaterialsList
        }
        currentPage={currentPage}
        studyMaterialsPerPage={studyMaterialsPerPage}
        allStudyMaterialsLoading={allStudyMaterialsLoading}
        role={role}
      />
    </div>
  );
};

export default StudyMaterialsComponent;
