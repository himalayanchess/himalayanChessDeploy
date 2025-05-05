import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import { Box, Button, Divider, Modal } from "@mui/material";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

import { LoadingButton } from "@mui/lab";
import { BookOpenCheck, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

import {
  fetchAllBatches,
  fetchAllTrainers,
  getAllBranches,
  getAllCourses,
  getAllStudents,
} from "@/redux/allListSlice";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
const timeZone = "Asia/Kathmandu";

const AddTestHistory = () => {
  const router = useRouter();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const {
    allActiveBranchesList,
    allActiveBatches,
    allActiveCoursesList,
    allActiveStudentsList,
    allActiveTrainerList,
  } = useSelector((state: any) => state.allListReducer);

  const [filteredStudents, setfilteredStudents] = useState([]);
  const [filteredBatches, setfilteredBatches] = useState([]);
  const [selectedBranch, setselectedBranch] = useState("");
  const [selectedBatch, setselectedBatch] = useState("");
  const [addTestLoading, setAddTestLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [testMaterialFile, settestMaterialFile] = useState<File | any>(null);
  const [testMaterialFileName, settestMaterialFileName] =
    useState("Not Selected");

  // handle modal open/close
  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);

  // handle file change (add)
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      settestMaterialFile(file);
      settestMaterialFileName(file.name);
    }
  };

  // handle file remove (add)
  const handleFileRemove = (e: any) => {
    settestMaterialFile(null);
    settestMaterialFileName("Not Selected");
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<any>({
    defaultValues: {
      // resultStatus from server side
      affiliatedTo: "HCA",
      examDate: "",
      // sent examDate string from front end
      // genereate examUtcDate and examNepaliDate from server
      studentId: "",
      studentName: "",
      branchId: "",
      branchName: "",
      batchId: "",
      batchName: "",
      courseId: "",
      courseName: "",
      checkedById: "",
      checkedByName: "",
      examTitle: "",
      totalMarks: "100",
      passMarks: "40",
      obtainedScore: "",
      activeStatus: true,
    },
  });

  // on submit function
  async function onSubmit(data: any) {
    setAddTestLoading(true);
    try {
      // update test material first
      let testMaterialUrl = "";
      if (testMaterialFile) {
        try {
          const formData = new FormData();
          formData.append("file", testMaterialFile);
          const folderName = `testMaterials/${data?.branchName}/${
            data?.courseName
          }/${dayjs(data?.examUtcDate).tz(timeZone).format("YYYY-MM-DD")}/${
            data?.studentName
          }`;
          formData.append("folderName", folderName);
          // test material also in studtmaterials google account
          formData.append("cloudinaryFileType", "studyMaterials");

          const { data: uploadresData } = await axios.post(
            "/api/fileupload/uploadfile",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          // cloudinary error
          if (uploadresData.error) {
            notify("Error uploading file", 204);
          }
          // cloudinary success
          else {
            testMaterialUrl = uploadresData.res.secure_url;
          }
        } catch (error) {
          console.log("Failed to upload test material in cloudinary");
        }
      }

      const { data: resData } = await axios.post(
        "/api/testhistory/addNewTestRecord",
        { ...data, testMaterialUrl }
      );

      if (resData.statusCode === 200) {
        notify(resData.msg, resData.statusCode);
        handleConfirmModalClose();
        setTimeout(() => {
          router.push(
            `/${session?.data?.user?.role?.toLowerCase()}/testhistory`
          );
        }, 50);
      } else {
        notify(resData.msg, resData.statusCode);
      }
    } catch (error) {
      notify("An error occurred while adding test record", 500);
    } finally {
      setAddTestLoading(false);
    }
  }

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    let branchName = "";
    if (!isSuperOrGlobalAdmin) {
      setValue("branchName", user?.branchName);
      setValue("branchId", user?.branchId);
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // filtered batch, Hca Students
  useEffect(() => {
    // filter student
    // filter by branch
    let tempFilteredHcaStudents = allActiveStudentsList?.filter(
      (student: any) =>
        student?.affiliatedTo?.toLowerCase() == "hca" &&
        student?.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
    );

    // filter by branch
    tempFilteredHcaStudents = tempFilteredHcaStudents?.filter((student: any) =>
      student?.batches?.some(
        (batch: any) =>
          batch?.batchName?.toLowerCase() === selectedBatch?.toLowerCase() &&
          batch?.activeStatus === true &&
          !batch?.endDate
      )
    );

    // filter batch
    let tempFilteredBatches = allActiveBatches?.filter(
      (batch: any) =>
        batch?.affiliatedTo?.toLowerCase() == "hca" &&
        batch?.branchName?.toLowerCase() == selectedBranch?.toLowerCase()
    );

    setfilteredStudents(tempFilteredHcaStudents);
    setfilteredBatches(tempFilteredBatches);
  }, [
    allActiveStudentsList,
    allActiveBatches,
    selectedBatch,
    selectedBranch,
    session?.data?.user,
  ]);

  // fetch initial data
  useEffect(() => {
    dispatch(getAllBranches());
    dispatch(getAllCourses());
    dispatch(getAllStudents());
    dispatch(fetchAllBatches());
    dispatch(fetchAllTrainers());
  }, []);

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
      <div className="heading flex items-center gap-4">
        <div className="header w-full flex items-end justify-between">
          <h1 className="w-max mr-auto text-2xl font-bold flex items-center">
            <FileSpreadsheet />
            <span className="ml-2">Add Test Record</span>
          </h1>
          <Link
            href={`/${session?.data?.user?.role?.toLowerCase()}/testhistory`}
          >
            <Button color="inherit" sx={{ color: "gray" }}>
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>
        </div>
      </div>

      <Divider sx={{ margin: "0.7rem 0" }} />

      <form
        className="add-test-form  flex-1 form-fields mt-1 grid grid-cols-2 gap-4 w-full h-full overflow-y-auto"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleConfirmModalOpen();
          }
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* affiliated to */}
        <Dropdown
          label="Affiliated To"
          options={["HCA"]}
          selected={"HCA"}
          onChange={() => {}}
          required
          disabled
          width="full"
        />

        {/* exam date */}
        <Controller
          name="examDate"
          control={control}
          rules={{ required: "Exam Date is required" }}
          render={({ field }) => (
            <Input
              {...field}
              label="Exam Date"
              type="date"
              required
              error={errors.examDate}
              helperText={errors.examDate?.message}
            />
          )}
        />

        {/* branch name */}
        <Controller
          name="branchName"
          control={control}
          rules={{ required: "Branch is required" }}
          render={({ field }) => (
            <Dropdown
              label="Branch"
              options={allActiveBranchesList.map(
                (branch: any) => branch.branchName
              )}
              disabled={!isSuperOrGlobalAdmin}
              selected={field.value || ""}
              onChange={(value: any) => {
                field.onChange(value);
                setselectedBranch(value);
                const selectedBranch: any = allActiveBranchesList.find(
                  (branch: any) =>
                    branch.branchName?.toLowerCase() == value?.toLowerCase()
                );
                if (selectedBranch) {
                  setValue("branchId", selectedBranch?._id);
                }
                // reset batch and student if branch change
                setValue("batchName", "");
                setValue("batchId", "");
                setValue("studentName", "");
                setValue("studentId", "");
              }}
              error={errors.branchName}
              helperText={errors.branchName?.message}
              required
              width="full"
            />
          )}
        />
        {/* Batch name */}
        <Controller
          name="batchName"
          control={control}
          rules={{ required: "Batch is required" }}
          render={({ field }) => (
            <Dropdown
              label="Batch"
              options={filteredBatches.map((batch: any) => batch.batchName)}
              selected={field.value || ""}
              onChange={(value: any) => {
                field.onChange(value);
                setselectedBatch(value);
                const selectedBatch: any = filteredBatches.find(
                  (batch: any) =>
                    batch.batchName?.toLowerCase() == value?.toLowerCase()
                );
                if (selectedBatch) {
                  setValue("batchId", selectedBatch?._id);
                }
                setValue("studentId", "");
                setValue("studentName", "");
              }}
              error={errors.batchName}
              helperText={errors.batchName?.message}
              required
              width="full"
            />
          )}
        />
        {/* Student Information */}
        <Controller
          name="studentName"
          control={control}
          rules={{ required: "Student is required" }}
          render={({ field }) => (
            <Dropdown
              label="Student"
              options={filteredStudents.map((student: any) => student.name)}
              selected={field.value || ""}
              onChange={(value: any) => {
                field.onChange(value);
                const selectedStudent: any = filteredStudents.find(
                  (s: any) => s.name?.toLowerCase() == value?.toLowerCase()
                );
                if (selectedStudent) {
                  setValue("studentId", selectedStudent?._id);
                }
              }}
              error={errors.studentName}
              helperText={errors.studentName?.message}
              required
              width="full"
            />
          )}
        />

        {/* Course Information */}
        <Controller
          name="courseName"
          control={control}
          rules={{ required: "Course is required" }}
          render={({ field }) => (
            <Dropdown
              label="Course"
              options={allActiveCoursesList.map((course: any) => course.name)}
              selected={field.value || ""}
              onChange={(value: any) => {
                field.onChange(value);
                const selectedCourse = allActiveCoursesList.find(
                  (course: any) =>
                    course.name?.toLowerCase() === value?.toLowerCase()
                );
                if (selectedCourse) {
                  setValue("courseId", selectedCourse._id);
                }
              }}
              error={errors.courseName}
              helperText={errors.courseName?.message}
              required
              width="full"
            />
          )}
        />

        {/* checked by Information */}
        <Controller
          name="checkedByName"
          control={control}
          rules={{ required: "Checked by is required" }}
          render={({ field }) => (
            <Dropdown
              label="Checked By"
              options={allActiveTrainerList.map((trainer: any) => trainer.name)}
              selected={field.value || ""}
              onChange={(value: any) => {
                field.onChange(value);
                const selectedTrainer = allActiveTrainerList.find(
                  (trainer: any) =>
                    trainer.name?.toLowerCase() === value?.toLowerCase()
                );
                if (selectedTrainer) {
                  setValue("checkedById", selectedTrainer._id);
                }
              }}
              error={errors.checkedByName}
              helperText={errors.checkedByName?.message}
              required
              width="full"
            />
          )}
        />

        {/* test material */}
        <div className="pdf-file h-full w-full  col-span-1 flex flex-col items-start justify-end ">
          <p className="text-sm">Choose PDF file</p>
          <div className=" flex items-center">
            <label
              htmlFor="contractInput"
              className="flex items-center cursor-pointer mt-1 w-max p-1 px-4 bg-blue-500 rounded-md text-white hover:bg-blue-600"
            >
              <DriveFolderUploadIcon sx={{ fontSize: "2rem" }} />
              <span className="ml-2">Select</span>
            </label>
            <input
              accept="application/pdf,image/*" // allow pdf and image
              onChange={handleFileChange}
              type="file"
              id="contractInput"
              name="contractInput"
              className="hidden"
            />
            {/* file name */}
            <p className="mx-4 text-xs">{testMaterialFileName}</p>
            {/* delete */}
            {testMaterialFile && (
              <div
                onClick={handleFileRemove}
                className="cursor-pointer hover:bg-red-50 rounded-md p-2"
              >
                <DeleteIcon className="text-red-500" />
                <span className="ml-1 text-xs text-red-600">Remove</span>
              </div>
            )}
          </div>
        </div>

        {/* Exam Information */}
        <div className="exam-info col-span-2 grid grid-cols-2 gap-4">
          <Controller
            name="examTitle"
            control={control}
            rules={{ required: "Exam title is required" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Exam Title"
                type="text"
                required
                error={errors.examTitle}
                helperText={errors.examTitle?.message}
              />
            )}
          />
          <Controller
            name="totalMarks"
            control={control}
            rules={{
              required: "Total marks is required",
              min: { value: 0, message: "Total marks must be positive" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Total Marks"
                type="number"
                required
                error={errors.totalMarks}
                helperText={errors.totalMarks?.message}
              />
            )}
          />
          <Controller
            name="passMarks"
            control={control}
            rules={{
              required: "Pass marks are required",
              min: { value: 0, message: "Pass marks must be positive" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Pass Marks"
                type="number"
                required
                error={errors.passMarks}
                helperText={errors.passMarks?.message}
              />
            )}
          />
          <Controller
            name="obtainedScore"
            control={control}
            rules={{
              required: "Obtained score is required",
              min: { value: 0, message: "Obtained score must be positive" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Obtained Score"
                type="number"
                required
                error={errors.obtainedScore}
                helperText={errors.obtainedScore?.message}
              />
            )}
          />
        </div>

        <Button
          onClick={handleConfirmModalOpen}
          variant="contained"
          color="info"
          size="medium"
          className="col-span-2 w-max h-max"
        >
          Submit
        </Button>

        <button type="submit" id="hiddenSubmit" hidden></button>

        {/* Confirmation Modal */}
        <Modal
          open={confirmModalOpen}
          onClose={handleConfirmModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
            <p className="mb-6 text-gray-600">
              You want to add this test record.
            </p>
            <div className="buttons flex gap-5">
              <Button
                variant="outlined"
                onClick={handleConfirmModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {addTestLoading ? (
                <LoadingButton
                  size="large"
                  loading={addTestLoading}
                  loadingPosition="start"
                  variant="contained"
                >
                  <span>Adding record</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    document.getElementById("hiddenSubmit")?.click();
                    if (!isValid) {
                      handleConfirmModalClose();
                    }
                  }}
                >
                  Add Record
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default AddTestHistory;
