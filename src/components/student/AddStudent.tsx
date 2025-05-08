import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import LockResetIcon from "@mui/icons-material/LockReset";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBatches,
  fetchAllProjects,
  getAllBranches,
  getAllCourses,
} from "@/redux/allListSlice";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";

const AddStudent = () => {
  const router = useRouter();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const affiliatedToOptions = ["HCA", "School"];
  const genderOptions = ["Male", "Female", "Others"];
  const statusOptions = ["Ongoing", "Left"];
  const titleOptions = [
    "None",
    // Grandmaster titles
    "GM",
    "IM",
    "FM",
    "CM",

    // Women-specific titles
    "WGM",
    "WIM",
    "WFM",
    "WCM",

    // Arbiters
    "IA",
    "FA",

    // Trainers
    "FST",
    "FT",
    "FI",
    "NI",
    "DI",
  ];

  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const {
    allActiveBatches,
    allActiveProjects,
    allActiveCoursesList,
    allActiveBranchesList,
  } = useSelector((state: any) => state.allListReducer);

  // state variable
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("");
  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(""); // Example state

  const [addStudentLoading, setaddStudentLoading] = useState(false);
  const [addStudentFileLoading, setaddStudentFileLoading] = useState(false);

  // batchlist
  const [hcaBatchList, sethcaBatchList] = useState([]);
  const [schoolBatchList, setschoolBatchList] = useState([]);
  //projectList
  const [projectList, setprojectList] = useState([]);
  // student json file
  const [studentFile, setstudentFile] = useState<File | null>();

  // fileupload modal
  const [fileUploadModalOpen, setfileUploadModalOpen] = useState(false);
  // confirm modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }

  // handlefileUploadModalOpen
  function handlefileUploadModalOpen() {
    setfileUploadModalOpen(true);
  }
  // handlefileUploadModalClose
  function handlefileUploadModalClose() {
    setstudentFile(null);
    setfileUploadModalOpen(false);
  }

  // handle student file change
  function handleStudentFileChange(e: any) {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      setstudentFile(file);
    }
  }

  // add student by file
  async function handleAddStudentByFile() {
    try {
      setaddStudentFileLoading(true);
      if (!studentFile) {
        notify("File is required", 204);
        return;
      }
      // Check MIME type
      if (studentFile?.type !== "application/json") {
        notify("Please upload a valid JSON file", 204);
        return;
      }

      // Check studentFile extension (extra validation)
      const validExtensions = ["json"];
      const studentFileExtension = studentFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (
        !studentFileExtension ||
        !validExtensions.includes(studentFileExtension)
      ) {
        notify("Invalid file extension. Please upload a .json file.", 204);
        return;
      }

      // send file to addNewStudent route
      const formData = new FormData();
      formData.append("file", studentFile);
      const { data: resData } = await axios.post(
        "/api/uploadbyfile/addNewFileStudent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resData?.statusCode == 200) {
        notify(resData?.msg, resData?.statusCode);
        handlefileUploadModalClose();
        setTimeout(() => {
          router.push(`/${session?.data?.user?.role?.toLowerCase()}/students`);
        }, 50);
        setaddStudentFileLoading(false);
        return;
      }
      setaddStudentFileLoading(false);
      notify(resData?.msg, resData?.statusCode);
      return;
    } catch (error) {
      notify("Invaid data inside JSON file", 204);
      console.log("Error in handleAddStudentByFile function", error);
    }
  }

  // react hook form
  const {
    register,
    handleSubmit,
    control,
    formState,
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<any>({
    defaultValues: {
      affiliatedTo: "HCA",
      name: "",
      dob: "",
      gender: "",
      address: "",
      phone: "",
      joinedDate: "",
      endDate: "",
      educationalInstitute: "",
      branchId: "",
      branchName: "",
      batches: [],
      projectId: "",
      projectName: "",

      fideId: 0,
      title: "None",
      rating: 0,
      completedStatus: "",
      enrolledCourses: [],
      // add file in studentform in (onSubmit)
      eventsPlayed: [],
      lichessUsername: "",
      lichessUrl: "",
      guardianInfo: { name: "", phone: "", email: "" },
      emergencyContactName: "",
      emergencyContactNo: "",
    },
  });
  const { errors, isValid } = formState;

  // Handle batches dynamically
  const {
    fields: batchesFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    control,
    name: "batches",
  });
  console.log("batchesFields", batchesFields);

  // Handle enrolledCourses dynamically
  const { fields, append, remove } = useFieldArray({
    control,
    name: "enrolledCourses",
  });

  // Function to add a new course
  const addCourse = () => {
    append({
      course: "",
      courseId: "",
      startDate: "",
      endDate: "",
      activeStatus: true,
    });
  };
  // Watch enrolledCourses for validation
  const enrolledCourses = watch("enrolledCourses");

  // Function to check for duplicate courses
  const isDuplicateCourse = (course: string) => {
    return enrolledCourses.filter((c: any) => c.course === course).length > 1;
  };

  // Function to add a new batch
  const addBatch = () => {
    appendBatch({
      batchId: "",
      batchName: "",
      startDate: "",
      endDate: "",
      activeStatus: true,
    });
  };
  // Watch batches for validation
  const batches = watch("batches");

  // Function to check for duplicate courses
  const isDuplicateBatch = (batchName: string) => {
    return batches.filter((c: any) => c.batchName === batchName).length > 1;
  };

  // onSubmit Function
  async function onSubmit(data: any) {
    try {
      setaddStudentLoading(true);
      const { data: resData } = await axios.post(
        "/api/students/addNewStudent",
        {
          ...data,
          selectedAffiliatedTo,
        }
      );
      if (resData.statusCode == 200) {
        // console.log("ass student", resData);
        notify(resData.msg, resData.statusCode);
        handleconfirmModalClose();
        setTimeout(() => {
          router.push(`/${session?.data?.user?.role?.toLowerCase()}/students`);
        }, 50);
        setaddStudentLoading(false);
        return;
      }
      setaddStudentLoading(false);
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in addsudent component (onSubmit)", error);
    }
  }

  //filter batches
  useEffect(() => {
    // Filter batches based on the selected affiliatedTo, branch, and project
    const filtered =
      selectedAffiliatedTo?.toLowerCase() === "hca"
        ? allActiveBatches
            .filter(
              (batch: any) =>
                batch.affiliatedTo.toLowerCase() === "hca" &&
                batch.branchName?.toLowerCase() ===
                  selectedBranch?.toLowerCase()
            )
            .map((batch: any) => batch)
        : allActiveBatches
            .filter(
              (batch: any) =>
                batch.affiliatedTo.toLowerCase() === "school" &&
                batch.projectName?.toLowerCase() ===
                  selectedProject?.toLowerCase()
            )
            .map((batch: any) => batch);
    // console.log("filtered bat", filtered);

    setFilteredBatches(filtered); // Update filteredBatches state
  }, [allActiveBatches, selectedAffiliatedTo, selectedBranch, selectedProject]);

  // set project list
  useEffect(() => {
    setprojectList(allActiveProjects);
  }, [allActiveProjects]);

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);

    let affiliatedTo = "HCA";
    if (!isSuperOrGlobalAdmin) {
      affiliatedTo = "HCA";
      setValue("branchName", user?.branchName);
      setValue("branchId", user?.branchId);
    }
    setselectedAffiliatedTo(affiliatedTo);
  }, [session?.data?.user]);

  // fetch initial data
  useEffect(() => {
    dispatch(fetchAllBatches());
    dispatch(fetchAllProjects());
    dispatch(getAllCourses());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      <div className="heading flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold  flex items-center ">
          <Users />
          <span className="ml-2">Add Student</span>
        </h1>

        <div className="buttons flex gap-4">
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/students`}>
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>

          {isSuperOrGlobalAdmin && (
            <Button
              onClick={handlefileUploadModalOpen}
              color="info"
              variant="contained"
              size="medium"
            >
              <FileUploadIcon />
              <span>Upload JSON file</span>
            </Button>
          )}
        </div>

        {/* file upload modal */}
        {/* confirm modal */}
        <Modal
          open={fileUploadModalOpen}
          onClose={handlefileUploadModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <Box className="w-[400px] h-max p-6  flex flex-col gap-5 items-start bg-white rounded-xl shadow-lg">
            <p className="text-xl w-full font-bold text-center">
              Add students by uploading file
            </p>
            {/* file input */}
            <input
              // accept="application/pdf,image/*"
              onChange={handleStudentFileChange}
              type="file"
              id="addStudentFile"
              name="addStudentFile"
              className="mt-1"
            />
            <div className="buttons flex   gap-5">
              <Button
                variant="outlined"
                onClick={handlefileUploadModalClose}
                className="text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {addStudentFileLoading ? (
                <LoadingButton
                  size="large"
                  loading={addStudentFileLoading}
                  loadingPosition="start"
                  variant="contained"
                  className="mt-7"
                >
                  <span className="">Adding student</span>
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAddStudentByFile}
                >
                  Add Student
                </Button>
              )}
            </div>
          </Box>
        </Modal>
      </div>
      <Divider sx={{ margin: "0.7rem 0" }} />
      {/* form-fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        className="addstudentform form-fields flex-1 h-full overflow-y-auto grid grid-cols-2 gap-4"
      >
        {/* first-basic-info */}
        <div className="first-basic-info grid grid-cols-2 grid-rows-3 gap-3">
          {/* selected affiliated to */}
          <Dropdown
            label="Affiliated to"
            options={affiliatedToOptions}
            selected={selectedAffiliatedTo}
            disabled={!isSuperOrGlobalAdmin}
            onChange={(value: any) => {
              if (value === selectedAffiliatedTo) return;

              setselectedAffiliatedTo(value);
              reset((prevValues: any) => {
                if (value === "HCA") {
                  return {
                    ...prevValues,
                    affiliatedTo: value,
                    address: prevValues.address,
                    phone: prevValues.phone,
                    guardianInfo: prevValues.guardianInfo,
                    projectName: "",
                    projectId: "",
                    branchName: "",
                    branchId: "",
                    emergencyContact: prevValues.emergencyContact,
                    emergencyContactName: prevValues.emergencyContactName,
                    educationalInstitute: prevValues.educationalInstitute,
                    enrolledCourses: [],
                    batches: [],
                    lichessUsername: prevValues?.lichessUsername,
                    lichessUrl: prevValues?.lichessUrl,
                  };
                } else {
                  return {
                    ...prevValues,
                    affiliatedTo: value,
                    address: "",
                    phone: "",
                    guardianInfo: { name: "", phone: "", email: "" },
                    projectName: "",
                    projectId: "",
                    branchName: "",
                    branchId: "",
                    emergencyContact: "",
                    emergencyContactName: "",
                    educationalInstitute: "",
                    enrolledCourses: [],
                    batches: [],
                    lichessUsername: "",
                    lichessUrl: "",
                  };
                }
              });
            }}
            width="full"
          />

          {/* full name */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              pattern: {
                value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                message: "Invalid Full Name",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Full Name"
                type="text"
                placeholder="Full Name"
                required={true}
                error={errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          {/* dob */}
          <Controller
            name="dob"
            control={control}
            rules={{
              required: "Dob is required",
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Date of Birth"
                error={errors.dob}
                helperText={errors.dob?.message}
                required={true}
              />
            )}
          />
          {/* Gender */}
          <Controller
            name="gender"
            control={control}
            rules={{
              required: "Gender is required",
            }}
            render={({ field }) => {
              return (
                <Dropdown
                  label="Gender"
                  options={genderOptions}
                  selected={field.value}
                  onChange={(value: any) => {
                    field.onChange(value);
                  }}
                  error={errors.gender}
                  helperText={errors.gender?.message}
                  required={true}
                  width="full"
                />
              );
            }}
          />

          {/* batch */}
          {/* <div className="batch col-span-2">
            <Controller
              name="batchName"
              control={control}
              rules={
                {
                  // required: "Gender is required",
                }
              }
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Batch"
                    options={
                      selectedAffiliatedTo?.toLowerCase() == "hca"
                        ? hcaBatchList.map((batch) => batch.batchName)
                        : schoolBatchList.map((batch) => batch.batchName)
                    }
                    selected={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      let selectedBatchList =
                        selectedAffiliatedTo.toLowerCase() == "hca"
                          ? hcaBatchList
                          : schoolBatchList;
                      const selectedBatch = selectedBatchList.find(
                        (batch) => batch.batchName == value
                      );
                      setValue("batchId", selectedBatch._id);
                    }}
                    error={errors.batchName}
                    helperText={errors.batchName?.message}
                    width="full"
                  />
                );
              }}
            />
          </div> */}
          {/* educationalInstitute */}
          {selectedAffiliatedTo.toLowerCase() == "hca" && (
            <>
              <div className="educationalInstitute col-span-1">
                <Controller
                  name="educationalInstitute"
                  control={control}
                  rules={
                    {
                      // required: "School Name is required",
                    }
                  }
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Educational Insititute"
                      // required={true}
                      error={errors.educationalInstitute}
                      helperText={errors.educationalInstitute?.message}
                    />
                  )}
                />
              </div>
              {/*  branch */}
              <div className="branch col-span-1">
                <Controller
                  name="branchName"
                  control={control}
                  rules={{
                    required: "Branch is required",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Branch"
                      options={allActiveBranchesList?.map(
                        (branch: any) => branch.branchName
                      )}
                      disabled={!isSuperOrGlobalAdmin}
                      selected={field.value || ""}
                      onChange={(value: any) => {
                        field.onChange(value);
                        const selectedBranch: any = allActiveBranchesList.find(
                          (branch: any) => branch.branchName == value
                        );

                        setValue("branchId", selectedBranch?._id || "");
                        setselectedBranch(value);
                      }}
                      error={errors.branchName}
                      helperText={errors.branchName?.message}
                      required={true}
                      width="full"
                    />
                  )}
                />
              </div>
            </>
          )}
        </div>

        {/* second-basic-info */}
        <div className="second-basic-info grid grid-cols-2 gap-3 auto-rows-min grid-auto-flow-dense">
          {/* joinedDate */}
          <Controller
            name="joinedDate"
            control={control}
            rules={{
              required: "Joined Date is required",
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Joined Date"
                required={true}
                error={errors.joinedDate}
                helperText={errors.joinedDate?.message}
              />
            )}
          />
          {/* endDate */}
          <Controller
            name="endDate"
            control={control}
            rules={
              {
                //   required: "End Date is required",
              }
            }
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="End Date"
                error={errors.endDate}
                helperText={errors.endDate?.message}
              />
            )}
          />
          {/* address (for hca students) (mandatory) */}
          {selectedAffiliatedTo.toLowerCase() == "hca" && (
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Address is required",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Address"
                  error={errors.address}
                  required={true}
                  helperText={errors.address?.message}
                />
              )}
            />
          )}
          {/* phone (for hca students) (Optional)*/}
          {selectedAffiliatedTo.toLowerCase() == "hca" && (
            <Controller
              name="phone"
              control={control}
              rules={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid Phone no.",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="phone"
                  error={errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          )}

          {/* project (for school students) (Optional)*/}
          {selectedAffiliatedTo.toLowerCase() == "school" && (
            <Controller
              name="projectName"
              control={control}
              rules={{}}
              render={({ field }) => (
                <Dropdown
                  label="Project name"
                  options={projectList.map((project: any) => project.name)}
                  selected={field.value}
                  onChange={(value: any) => {
                    field.onChange(value);
                    const selectedProject: any = projectList.find(
                      (project: any) => project.name == value
                    );

                    setValue("projectId", selectedProject._id);
                    setSelectedProject(value);
                  }}
                  error={errors.projectName}
                  helperText={errors.projectName?.message}
                  width="full"
                />
              )}
            />
          )}

          {/* completedStatus (ongoing,left) */}
          <Controller
            name="completedStatus"
            control={control}
            rules={{
              required: "Status is required",
            }}
            render={({ field }) => (
              <Dropdown
                label="Status"
                options={statusOptions}
                selected={field.value}
                onChange={(value: any) => {
                  field.onChange(value);
                }}
                required={true}
                error={errors.completedStatus}
                helperText={errors.completedStatus?.message}
                width="full"
              />
            )}
          />
        </div>

        {/* Chess Information */}
        <div className="info">
          <p className="text-lg  mb-2 font-bold">Chess Information</p>

          <div className="basic-info-fields grid grid-cols-2  gap-3">
            {/* title */}

            <Controller
              name="title"
              control={control}
              rules={{
                required: "Title is required",
              }}
              render={({ field }) => {
                return (
                  <Dropdown
                    label="Title"
                    options={titleOptions}
                    selected={field.value}
                    onChange={(value: any) => {
                      field.onChange(value);
                    }}
                    error={errors.title}
                    helperText={errors.title?.message}
                    // required={true}
                    width="full"
                  />
                );
              }}
            />

            {/* Fide Id (no validation)*/}
            <Controller
              name="fideId"
              control={control}
              rules={
                {
                  // required: "fide id is required",
                }
              }
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="FIDE ID"
                    type="number"
                    error={errors.fideId}
                    helperText={errors.fideId?.message}
                  />
                );
              }}
            />
            {/* rating (no validation) */}
            <Controller
              name="rating"
              control={control}
              rules={
                {
                  // required: "Skill level is required",
                }
              }
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Rating"
                    type="number"
                    error={errors.rating}
                    helperText={errors.rating?.message}
                  />
                );
              }}
            />
            {selectedAffiliatedTo.toLowerCase() == "hca" && (
              <>
                <Controller
                  name="lichessUsername"
                  control={control}
                  rules={
                    {
                      // required: "Title is required",
                    }
                  }
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        label="Lichess Username"
                        type="text"
                        error={errors.lichessUsername}
                        helperText={errors.lichessUsername?.message}
                      />
                    );
                  }}
                />

                <Controller
                  name="lichessUrl"
                  control={control}
                  rules={
                    {
                      // required: "Title is required",
                    }
                  }
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        label="Lichess URL"
                        type="text"
                        error={errors.lichessUrl}
                        helperText={errors.lichessUrl?.message}
                      />
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Guardian info */}
        {selectedAffiliatedTo.toLowerCase() === "hca" && (
          <div className="contact">
            <p className="text-lg mb-2 font-bold">Guardian info</p>
            <div className="basic-info-fields grid grid-cols-2 gap-3">
              {/* Guardian Name */}
              <Controller
                name="guardianInfo.name"
                control={control}
                rules={{
                  required: "Guardian name is required",
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                    message: "Invalid guardian full name",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian Full Name"
                    type="text"
                    error={
                      !!(
                        errors.guardianInfo && (errors.guardianInfo as any).name
                      )
                    }
                    helperText={(errors.guardianInfo as any)?.name?.message}
                    required
                  />
                )}
              />

              {/* Guardian Phone */}
              <Controller
                name="guardianInfo.phone"
                control={control}
                rules={{
                  required: "Guardian phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone no",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian Phone No"
                    type="tel"
                    error={
                      !!(
                        errors.guardianInfo &&
                        (errors.guardianInfo as any).phone
                      )
                    }
                    helperText={(errors.guardianInfo as any)?.phone?.message}
                    required
                  />
                )}
              />

              {/* Guardian Email */}
              <Controller
                name="guardianInfo.email"
                control={control}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    label="Guardian Email"
                    type="email"
                    error={
                      !!(
                        errors.guardianInfo &&
                        (errors.guardianInfo as any).email
                      )
                    }
                    helperText={(errors.guardianInfo as any)?.email?.message}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Emergency Information */}
        {selectedAffiliatedTo.toLowerCase() == "hca" && (
          <div className="info">
            <p className="text-lg  mb-2 font-bold">Emergency Contact</p>

            <div className="basic-info-fields grid grid-cols-2  gap-3">
              {/* emergency contact name */}
              <Controller
                name="emergencyContactName"
                control={control}
                rules={{
                  required: "Emergency contact required",
                  pattern: {
                    value: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
                    message: "Invalid full name",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Emergency Contact Full Name"
                    error={errors.emergencyContactName}
                    helperText={errors.emergencyContactName?.message}
                    required={true}
                  />
                )}
              />

              {/* emergencyContact */}
              <Controller
                name="emergencyContactNo"
                control={control}
                rules={{
                  required: "Emergency contact no required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid contact no",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label="Emergency Contact no"
                    error={errors.emergencyContactNo}
                    helperText={errors.emergencyContactNo?.message}
                    required={true}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* batches */}
        <div className="batches col-span-2">
          <div className="flex items-center">
            <h3 className="text-lg text-gray-500 font-semibold mr-2">
              Batches
            </h3>
          </div>
          {batchesFields.length === 0 ? (
            <p className="text-gray-500 mb-2  ">No Batch yet.</p>
          ) : (
            batchesFields
              .filter((batch: any) => batch.activeStatus == true)
              .map((batch, index) => (
                <div key={batch?.id} className="col-span-2 mb-2">
                  <div className="grid grid-cols-4 items-center place-items-start gap-3">
                    {/* batch name Selection */}
                    <Controller
                      name={`batches.${index}.batchName`}
                      control={control}
                      rules={{
                        required: "Batch is required",
                        validate: (value: any) =>
                          (value && !isDuplicateBatch(value)) ||
                          "Duplicate batch selected",
                      }}
                      render={({ field }) => (
                        <Dropdown
                          label="Batch"
                          options={filteredBatches?.map(
                            (batch: any) => batch?.batchName
                          )}
                          selected={field.value || ""}
                          onChange={(value: any) => {
                            field.onChange(value);

                            const selectedBatch: any = filteredBatches.find(
                              (batch: any) => batch.batchName == value
                            );
                            setValue(
                              `batches.${index}.batchId`,
                              selectedBatch._id
                            );
                          }}
                          width="full"
                          // error={errors?.batches?.[index]?.batchName}
                          // helperText={
                          //   errors?.batches?.[index]?.batchName?.message
                          // }
                          error={!!(errors.batches as any)?.[index]?.batchName}
                          helperText={
                            (errors.batches as any)?.[index]?.batchName
                              ?.message as string
                          }
                        />
                      )}
                    />
                    {/* batch start date */}
                    <Controller
                      name={`batches.${index}.startDate`}
                      control={control}
                      rules={{
                        required: "Date is required",
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Start date"
                          type="date"
                          required={true}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          // error={errors?.batches?.[index]?.startDate}
                          // helperText={
                          //   errors?.batches?.[index]?.startDate?.message
                          // }
                          error={!!(errors.batches as any)?.[index]?.startDate}
                          helperText={
                            (errors.batches as any)?.[index]?.startDate
                              ?.message as string
                          }
                          width="full"
                        />
                      )}
                    />
                    {/* batch end date */}
                    <Controller
                      name={`batches.${index}.endDate`}
                      control={control}
                      rules={
                        {
                          // required: "Date is required",
                        }
                      }
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="End date"
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          // error={errors?.batches?.[index]?.endDate}
                          // helperText={
                          //   errors?.batches?.[index]?.endDate?.message
                          // }
                          error={!!(errors.batches as any)?.[index]?.endDate}
                          helperText={
                            (errors.batches as any)?.[index]?.endDate
                              ?.message as string
                          }
                          width="full"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeBatch(index)}
                      className="text-red-500  "
                    >
                      <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))
          )}
          {/* add batch button */}
          <Button title="Add Batch" variant="outlined" onClick={addBatch}>
            <AddIcon />
            <span>Add batch</span>
          </Button>
        </div>

        {/* enrolled courses */}
        {selectedAffiliatedTo.toLowerCase() == "hca" && (
          <div className="enrolledcourses col-span-2">
            <div className="flex items-center">
              <h3 className="text-lg text-gray-500 font-semibold mr-2">
                Enrolled Courses
              </h3>
            </div>
            {fields.length === 0 && (
              <p className="text-gray-500 mb-2  ">No courses yet.</p>
            )}
            {fields.map((course, index) => (
              <div key={course.id} className="col-span-2 mb-2">
                <div className="grid grid-cols-4 items-center place-items-start gap-3">
                  {/* Course Selection */}
                  <Controller
                    name={`enrolledCourses.${index}.course`}
                    control={control}
                    rules={{
                      required: "Course is required",
                      validate: (value) =>
                        (value && !isDuplicateCourse(value)) ||
                        "Duplicate course selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Course"
                        options={allActiveCoursesList.map((c: any) => c.name)}
                        selected={field.value}
                        onChange={(value: any) => {
                          field.onChange(value);
                          const selectedCourse = allActiveCoursesList.find(
                            (course: any) => course.name == value
                          );
                          setValue(
                            `enrolledCourses.${index}.courseId`,
                            selectedCourse._id
                          );
                          trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                        }}
                        width="full"
                        // error={errors?.enrolledCourses?.[index]?.course}
                        // helperText={
                        //   errors?.enrolledCourses?.[index]?.course?.message
                        // }
                        error={
                          !!(errors.enrolledCourses as any)?.[index]?.course
                        }
                        helperText={
                          (errors.enrolledCourses as any)?.[index]?.course
                            ?.message as string
                        }
                      />
                    )}
                  />
                  {/* enrolled course start date */}
                  <Controller
                    name={`enrolledCourses.${index}.startDate`}
                    control={control}
                    rules={{
                      required: "Date is required",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Start date"
                        type="date"
                        required={true}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        // error={errors?.enrolledCourses?.[index]?.startDate}
                        // helperText={
                        //   errors?.enrolledCourses?.[index]?.startDate?.message
                        // }
                        error={
                          !!(errors.enrolledCourses as any)?.[index]?.startDate
                        }
                        helperText={
                          (errors.enrolledCourses as any)?.[index]?.startDate
                            ?.message as string
                        }
                        width="full"
                      />
                    )}
                  />{" "}
                  {/* enrolled course start date */}
                  <Controller
                    name={`enrolledCourses.${index}.endDate`}
                    control={control}
                    rules={
                      {
                        // required: "Date is required",
                      }
                    }
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="End date"
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        // error={errors?.enrolledCourses?.[index]?.endDate}
                        // helperText={
                        //   errors?.enrolledCourses?.[index]?.endDate?.message
                        // }
                        error={
                          !!(errors.enrolledCourses as any)?.[index]?.endDate
                        }
                        helperText={
                          (errors.enrolledCourses as any)?.[index]?.endDate
                            ?.message as string
                        }
                        width="full"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500  "
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))}
            {/* add course button */}
            <Button title="Add Course" variant="outlined" onClick={addCourse}>
              <AddIcon />
              <span>Add course</span>
            </Button>
          </div>
        )}
        {/* add or edit button */}
        <div className="button mt-3 col-span-2">
          <Button
            onClick={handleconfirmModalOpen}
            variant="contained"
            className=""
          >
            Add Student
          </Button>
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
              <p className="mb-6 text-gray-600">You want to add new student.</p>
              <div className="buttons flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleconfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {addStudentLoading ? (
                  <LoadingButton
                    size="large"
                    loading={addStudentLoading}
                    loadingPosition="start"
                    variant="contained"
                    className="mt-7"
                  >
                    <span className="">Adding student</span>
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
                    Add Student
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
