import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Box, Button, Divider, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";

import { Book, Edit } from "lucide-react";
import { notify } from "@/helpers/notify";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects, getAllCourses } from "@/redux/allListSlice";
import { LoadingButton } from "@mui/lab";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UpdateCourse = ({ courseRecord }: any) => {
  const session = useSession();
  const router = useRouter();

  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const { allActiveCoursesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const affiliatedToOptions = ["HCA", "School"];

  const [loaded, setLoaded] = useState(false);
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const [updateCourseLoading, setupdateCourseLoading] = useState(false);
  // course json file
  const [courseFile, setcourseFile] = useState<File | null>();

  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [removeChaperModalOpen, setremoveChaperModalOpen] = useState(false);
  const [removeChapterIndex, setremoveChapterIndex] = useState<any>(null);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // handleconfirmModalOpen
  function handleremoveChaperModalOpen(removeChapterId: any) {
    setremoveChapterIndex(removeChapterId);
    setremoveChaperModalOpen(true);
  }
  // handleconfirmModalClose
  function handleremoveChaperModalClose() {
    setremoveChaperModalOpen(false);
  }

  // handle course file change
  function handleCourseFileChange(e: any) {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      setcourseFile(file);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      affiliatedTo: "HCA",
      name: "",
      duration: 12,
      nextCourseName: "None",
      chapters: [{ chapterName: "", subChapters: [""], activeStatus: true }],
    },
  });

  // Handle courses dynamically
  const {
    fields: chaptersFields,
    append: addChapter,
    remove: removeChapter,
  } = useFieldArray({
    control,
    name: "chapters",
  });

  // Function to add a new subchapter dynamically
  const addSubChapter = (chapterIndex: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].subChapters = [
      ...updatedChapters[chapterIndex].subChapters,
      "",
    ];
    setValue("chapters", updatedChapters);
  };

  // Function to remove a specific subchapter
  const removeSubChapter = (chapterIndex: any, subIndex: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].subChapters = updatedChapters[
      chapterIndex
    ].subChapters.filter((_, i) => i !== subIndex);
    setValue("chapters", updatedChapters);
  };

  // watch syllabus
  const chapters = watch("chapters");

  // on submit function
  async function onSubmit(data: any) {
    setupdateCourseLoading(true);
    const { data: resData } = await axios.post(
      "/api/courses/updateCourse",
      data
    );
    if (resData.statusCode == 200) {
      handleconfirmModalClose();
      setupdateCourseLoading(false);
      setTimeout(() => {
        router.push(`/${session?.data?.user?.role?.toLowerCase()}/courses`);
      }, 50);
      notify(resData.msg, resData.statusCode);
      return;
    }
    setupdateCourseLoading(false);
    notify(resData.msg, resData.statusCode);
    return;
  }

  useEffect(() => {
    if (courseRecord) {
      reset({
        ...courseRecord,
        chapters: courseRecord.chapters || [],
      });
      setLoaded(true);
    }
  }, [courseRecord, reset]);

  // fetch initial data
  useEffect(() => {
    dispatch(getAllCourses());
  }, []);

  if (!loaded)
    return (
      <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md "></div>
    );

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      <div className="header  w-full flex items-end justify-between">
        <h1 className="text-xl font-bold flex items-center">
          <Edit />
          <span className="ml-2">Update Course</span>
        </h1>

        <Link href={`/${session?.data?.user?.role?.toLowerCase()}/courses`}>
          <Button className="homebutton" color="inherit" sx={{ color: "gray" }}>
            <HomeOutlinedIcon />
            <span className="ml-1">Home</span>
          </Button>
        </Link>
      </div>

      {/* divider */}
      <Divider sx={{ margin: "0.7rem 0" }} />

      {/* Form */}
      <form
        className="updateCourseform form-fields h-fit overflow-y-auto grid grid-cols-2 gap-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* first rows */}
        <div className="first col-span-2 grid grid-cols-2 gap-4">
          {/* affiliated to */}
          <Controller
            name="affiliatedTo"
            control={control}
            rules={{
              required: "Affiliated to is required",
            }}
            render={({ field }) => {
              return (
                <Dropdown
                  label="Affiliated to"
                  options={affiliatedToOptions}
                  selected={field.value || ""}
                  onChange={(value: any) => {
                    field.onChange(value);
                    setValue("nextCourseName", "None");
                    setselectedAffiliatedTo(value);
                  }}
                  error={errors.affiliatedTo}
                  helperText={errors.affiliatedTo?.message}
                  required={true}
                  width="full"
                />
              );
            }}
          />

          {/* batch name */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Course name is required",
            }}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Course Name"
                  type="text"
                  required={true}
                  error={errors?.name}
                  helperText={errors?.name?.message}
                />
              );
            }}
          />
        </div>

        {/* second row */}

        {/* third row */}
        <div className="third col-span-2 grid grid-cols-2 gap-4">
          {/* Project start date */}
          <Controller
            name="duration"
            control={control}
            rules={{
              required: "Duration is required",
            }}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  value={field.value || ""}
                  label="Duration (weeks)"
                  type="number"
                  required={true}
                  error={errors?.duration}
                  helperText={errors?.duration?.message}
                />
              );
            }}
          />
          {/* Project start date  (optional)*/}
          {selectedAffiliatedTo.toLowerCase() == "hca" && (
            <Controller
              name="nextCourseName"
              control={control}
              rules={
                {
                  // required: "End date is required",
                }
              }
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Next Course"
                    options={[
                      "None",
                      ...allActiveCoursesList?.map(
                        (course: any) => course.name
                      ),
                    ]}
                    selected={field.value || ""}
                    onChange={(value: any) => {
                      field.onChange(value);
                    }}
                    error={errors.nextCourseName}
                    helperText={errors.nextCourseName?.message}
                    width="full"
                  />
                );
              }}
            />
          )}
        </div>

        {/* fourth col */}
        <h1 className="col-span-2 text-lg font-bold mt-4">Chapters</h1>
        {chaptersFields.map((chapter, chapterIndex) => (
          <div
            key={chapter.id}
            className="border p-4 bg-gray-50 rounded-md mt-3"
          >
            <h1 className="font-bold mb-1">Chapter {chapterIndex + 1}</h1>
            <div className="flex items-center gap-3">
              {/* Chapter Name */}
              <Controller
                name={`chapters.${chapterIndex}.chapterName`}
                control={control}
                rules={{ required: "Chapter name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Chapter name"
                    type="text"
                    required={true}
                    placeholder={`Chapter ${chapterIndex + 1}`}
                    error={errors.chapters?.[chapterIndex]?.chapterName}
                    helperText={
                      errors.chapters?.[chapterIndex]?.chapterName?.message
                    }
                  />
                )}
              />
              <Button
                variant="text"
                color="error"
                title="Delete chapter"
                className="bg-red-500 text-white"
                onClick={() => handleremoveChaperModalOpen(chapterIndex)}
              >
                <DeleteIcon />
              </Button>

              {/* confirm modal */}
              <Modal
                open={removeChaperModalOpen}
                onClose={handleremoveChaperModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                  style: {
                    backgroundColor: "rgba(0,0,0,0.1)", // Make the backdrop transparent
                  },
                }}
                className="flex items-center justify-center"
              >
                <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
                  <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
                  <p className="mb-6 text-gray-600">
                    You want to delete chapter.
                  </p>
                  <div className="buttons flex gap-5">
                    <Button
                      variant="outlined"
                      onClick={handleremoveChaperModalClose}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>{" "}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        removeChapter(removeChapterIndex);
                        handleremoveChaperModalClose();
                      }}
                    >
                      <span>Delete</span>
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>

            {/* Subchapters */}
            <h4 className="mt-3 font-bold">Sub Chapters</h4>
            {chapter.subChapters.length == 0 && <p>No sub chapters</p>}
            {chapter.subChapters.map((_, subIndex) => (
              <div key={subIndex} className="flex items-center gap-3 mt-2 ml-6">
                <Controller
                  name={`chapters.${chapterIndex}.subChapters.${subIndex}`}
                  rules={{ required: "Sub chapter is required" }}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      label="Sub chapter"
                      type="text"
                      required={true}
                      placeholder={`Subchapter ${subIndex + 1}`}
                      error={
                        errors.chapters?.[chapterIndex]?.subChapters?.[subIndex]
                      }
                      helperText={
                        errors.chapters?.[chapterIndex]?.subChapters?.[subIndex]
                          ?.message
                      }
                    />
                  )}
                />
                <Button
                  variant="text"
                  color="error"
                  title="Delete subchapter"
                  className="bg-red-400 text-white"
                  onClick={() => removeSubChapter(chapterIndex, subIndex)}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}

            {/* Add Subchapter Button */}
            <div className="addsubchapter-button mt-3">
              <Button
                variant="outlined"
                className="bg-blue-500 text-white mt-2"
                onClick={() => addSubChapter(chapterIndex)}
              >
                + Add Sub Chapter
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outlined"
          className="mt-4 col-span-2 w-max h-max"
          onClick={() =>
            addChapter({
              chapterName: "",
              subChapters: [""],
              activeStatus: true,
            })
          }
        >
          + Add Chapter
        </Button>

        {/* add  button */}
        <div className="submitbutton mt-3">
          <Button
            onClick={handleconfirmModalOpen}
            variant="contained"
            color="info"
            size="large"
            className="col-span-2 w-max"
          >
            Submit
          </Button>
        </div>
        {/* Hidden Submit Button (Inside Form) */}
        <button type="submit" id="hiddenSubmit" hidden></button>
        {/* confirm modal */}
        <Modal
          open={confirmModalOpen}
          onClose={handleconfirmModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
            <p className="mb-6 text-gray-600">
              You want to update this course.
            </p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleconfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {updateCourseLoading ? (
                <LoadingButton
                  size="large"
                  loading={updateCourseLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Updating course</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    document.getElementById("hiddenSubmit")?.click();

                    if (!isValid) {
                      handleconfirmModalClose();
                    }
                  }}
                >
                  Update course
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default UpdateCourse;
