import React, { useEffect, useState } from "react";
import { Button, Divider, Modal, TextField } from "@mui/material";
import { BookCopy, Cross, LibraryBig } from "lucide-react";
import { Clear } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../Dropdown";
import {
  filterStudyMaterialsList,
  getAllCourses,
  getAllStudyMaterials,
} from "@/redux/allListSlice";
import SearchInput from "../SearchInput";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import CircularProgress from "@mui/material/CircularProgress";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { notify } from "@/helpers/notify";

const AddClassStudyMaterials = ({
  classStudyMaterials,
  setclassStudyMaterials,
  addStudyMaterialsModalOpen,
  handleaddStudyMaterialsModalClose,
}: any) => {
  const session = useSession();

  const dispatch = useDispatch<any>();

  const {
    allActiveStudyMaterialsList,
    allFilteredActiveStudyMaterialsList,
    allStudyMaterialsLoading,
    allActiveCoursesList,
  } = useSelector((state: any) => state.allListReducer);

  const [selectedCourse, setselectedCourse] = useState("All");
  const [searchText, setsearchText] = useState("");

  //handleClassStudyMaterialAdd
  function handleClassStudyMaterialAdd(studyMaterialId: any) {
    const selectedStudyMaterial = allActiveStudyMaterialsList?.find(
      (studyMaterial: any) => studyMaterial?._id == studyMaterialId
    );
    if (!selectedStudyMaterial) {
      notify("File not found", 204);
      return;
    }
    // check if already added
    const alreadyExists = classStudyMaterials.some(
      (studyMaterial: any) =>
        studyMaterial?._id === selectedStudyMaterial._id ||
        studyMaterial?.fileName === selectedStudyMaterial.fileName
    );
    if (alreadyExists) {
      notify(`${selectedStudyMaterial?.fileName} already added`, 204);
      return;
    }

    notify(`${selectedStudyMaterial?.fileName} added`, 200);
    setclassStudyMaterials((prev: any) => [selectedStudyMaterial, ...prev]);
  }

  function handleRemoveClassStudyMaterial(
    studyMaterialId: any,
    studyMaterialFileName: any
  ) {
    const tempClassStudyMaterials = classStudyMaterials?.filter(
      (studyMaterial: any) => studyMaterial?._id !== studyMaterialId
    );
    setclassStudyMaterials(tempClassStudyMaterials);
    notify(`${studyMaterialFileName} removed`, 200);
  }

  // filter
  useEffect(() => {
    // filter by course
    let tempFilteredStudyMaterialsList =
      selectedCourse.toLowerCase() == "all"
        ? allActiveStudyMaterialsList
        : allActiveStudyMaterialsList.filter(
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

    dispatch(filterStudyMaterialsList(tempFilteredStudyMaterialsList));
  }, [allActiveStudyMaterialsList, selectedCourse, searchText]);

  // intial data fetching
  useEffect(() => {
    dispatch(getAllStudyMaterials());
    dispatch(getAllCourses());
  }, []);

  return (
    <Modal
      open={addStudyMaterialsModalOpen}
      onClose={handleaddStudyMaterialsModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
      BackdropProps={{
        style: { backgroundColor: "rgba(0,0,0,0.4)" },
      }}
    >
      <div className="w-[80%] h-[80%] p-6 rounded-lg shadow-md bg-white flex flex-col">
        {/* header */}
        <div className="header flex justify-between">
          <h1 className="text-lg flex items-center font-medium">
            <LibraryBig />
            <span className="ml-2 font-bold">
              Add study material for this class
            </span>
          </h1>
          <Button onClick={handleaddStudyMaterialsModalClose}>
            <Clear />
          </Button>
        </div>

        {/* divider */}
        <Divider sx={{ margin: ".7rem 0" }} />

        {/* main container */}
        <div className="main-container flex flex-1 gap-1 overflow-hidden">
          {/* you selected */}
          <div className="you-selected  flex-[0.3] overflow-y-auto p-2">
            <div className="title-showing flex items-center">
              <h1 className="text-lg font-bold mb-1 flex items-center">
                <BookCopy />
                <span className="ml-2">You Selected</span>
              </h1>
              <span className="ml-2 text-gray-700 text-sm">
                {classStudyMaterials?.length} materials
              </span>
            </div>

            {/* divider */}
            <Divider sx={{ margin: ".7rem 0" }} />

            {/* selected materials list */}
            <div className="selectedMaterialsList flex flex-col gap-3 ">
              {classStudyMaterials?.length == 0 ? (
                <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
                  <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
                  <p className="text-md">No materials added yet</p>
                </div>
              ) : (
                classStudyMaterials?.map((studyMaterial: any, index: any) => {
                  return (
                    <div
                      key={`${studyMaterial?._id}_${index}`}
                      className="p-2 text-xs bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
                    >
                      <div className="icon-fileName flex items-center ">
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
                        <span className="ml-2">
                          {studyMaterial?.fileName || "N/A"}
                        </span>
                      </div>

                      <div className="removebutton  h-full" title="Remove">
                        <Button
                          onClick={() =>
                            handleRemoveClassStudyMaterial(
                              studyMaterial?._id,
                              studyMaterial?.fileName
                            )
                          }
                          size="small"
                          color="error"
                          className="w-max"
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* divider */}
          <Divider orientation="vertical" flexItem sx={{ margin: "0 .4rem" }} />

          {/* study materials */}
          <div className="allStudyMaterials  flex-[0.7] h-full flex flex-col overflow-y-auto p-2">
            <h1 className="text-lg font-bold mb-1 flex items-center">
              <LibraryBig />
              <span className="ml-2">All Study Materials</span>
            </h1>
            {/* all materials header */}
            <div className="allMaterialsHeader flex justify-between items-end">
              <div className="dropdown flex items-end">
                {/* course */}
                <Dropdown
                  label="Course"
                  options={[
                    "All",
                    ...allActiveCoursesList?.map((course: any) => course?.name),
                  ]}
                  selected={selectedCourse}
                  onChange={setselectedCourse}
                />
                <span className="text-sm ml-2 text-gray-700">
                  Showing {allFilteredActiveStudyMaterialsList?.length}{" "}
                  materials
                </span>
              </div>
              {/* search */}
              <SearchInput
                placeholder="Search"
                value={searchText}
                onChange={(e: any) => setsearchText(e.target.value)}
              />
            </div>
            {/* study materials list */}
            <div className="studyMaterialsList mt-4  rounded-md ">
              {/* titles */}
              <div className="table-headings  mb-2 grid grid-cols-[50px,repeat(5,1fr)] gap-2 w-full bg-gray-200">
                <span className="py-3 text-center text-xs font-bold text-gray-600 ">
                  SN
                </span>
                <span className="py-3 text-left col-span-2 text-xs font-bold text-gray-600">
                  Name
                </span>

                <span className="py-3 col-span-2 text-left text-xs font-bold text-gray-600">
                  Course
                </span>
                <span className="py-3 text-center  text-xs font-bold text-gray-600">
                  Action
                </span>
              </div>
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
                {allFilteredActiveStudyMaterialsList.map(
                  (studyMaterial: any, index: any) => {
                    return (
                      <div
                        key={`${studyMaterial?.fileName}_${index}`}
                        className="grid grid-cols-[50px,repeat(5,1fr)] gap-2   border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
                      >
                        <span className="text-xs text-center font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <Link
                          title="View"
                          target="_blank"
                          href={`${studyMaterial?.fileUrl}`}
                          className="text-left col-span-2 text-xs font-medium text-gray-600 hover:underline hover:text-blue-500"
                        >
                          {studyMaterial?.fileType?.toLowerCase() == "image" ? (
                            <ImageOutlinedIcon
                              className=" text-gray-500"
                              fontSize="small"
                            />
                          ) : studyMaterial?.fileType?.toLowerCase() ===
                            "pdf" ? (
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
                          <span className="ml-2">
                            {studyMaterial?.fileName}
                          </span>
                        </Link>

                        <span className="text-xs col-span-2 text-gray-700">
                          {studyMaterial?.courseName || "N/A"}
                        </span>

                        <div className="addbutton text-center">
                          <Button
                            onClick={() =>
                              handleClassStudyMaterialAdd(studyMaterial?._id)
                            }
                            size="small"
                            variant="outlined"
                            className=" w-max"
                          >
                            <AddIcon sx={{ fontSize: "1rem" }} />
                            <span className="ml-1">Add</span>
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddClassStudyMaterials;
