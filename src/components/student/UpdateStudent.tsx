import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, Modal } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { notify } from "@/helpers/notify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBatches, fetchAllProjects } from "@/redux/allListSlice";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(timezone);
dayjs.extend(utc);

const timeZone = "Asia/Kathmandu";

const UpdateStudent = ({ studentRecord }: any) => {
  const affiliatedToOptions = ["HCA", "School"];
  const genderOptions = ["Male", "Female", "Others"];
  const statusOptions = ["Ongoing", "Left"];
  const titleOptions = ["None", "CM", "RM", "GM", "IM"];
  const coursesList = [
    { _id: "101", value: "React Basics", label: "React Basics" },
    { _id: "102", value: "Advanced JavaScript", label: "Advanced JavaScript" },
    { _id: "103", value: "Data Structures", label: "Data Structures" },
  ];

  const dispatch = useDispatch<any>();
  const { allActiveBatches, allActiveProjects } = useSelector(
    (state: any) => state.allListReducer
  );

  const [loaded, setLoaded] = useState(false);
  const [selectedAffiliatedTo, setselectedAffiliatedTo] = useState("HCA");
  const [updateStudentLoading, setupdateStudentLoading] = useState(false);
  const [hcaBatchList, sethcaBatchList] = useState([]);
  const [schoolBatchList, setschoolBatchList] = useState([]);
  const [projectList, setprojectList] = useState([]);
  // modal
  const [confirmModalOpen, setconfirmModalOpen] = useState(false);
  const [confirmBatchDeleteModalOpen, setconfirmBatchDeleteModalOpen] =
    useState(false);
  const [confirmCourseDeleteModalOpen, setconfirmCourseDeleteModalOpen] =
    useState(false);
  // selected index
  const [selectedDeleteBatchIndex, setselectedDeleteBatchIndex] = useState("");
  const [selectedDeleteCourseIndex, setselectedDeleteCourseIndex] =
    useState("");

  // handleconfirmModalOpen
  function handleconfirmModalOpen() {
    setconfirmModalOpen(true);
  }
  // handleconfirmModalClose
  function handleconfirmModalClose() {
    setconfirmModalOpen(false);
  }
  // handleconfirmBatchDeleteModalOpen
  function handleconfirmBatchDeleteModalOpen(batchIndex: any) {
    setselectedDeleteBatchIndex(batchIndex);
    setconfirmBatchDeleteModalOpen(true);
  }
  // handleconfirmBatchDeleteModalClose
  function handleconfirmBatchDeleteModalClose() {
    setconfirmBatchDeleteModalOpen(false);
  }
  // handleconfirmCourseDeleteModalOpen
  function handleconfirmCourseDeleteModalOpen(courseIndex: any) {
    setselectedDeleteCourseIndex(courseIndex);
    setconfirmCourseDeleteModalOpen(true);
  }
  // handleconfirmCourseDeleteModalClose
  function handleconfirmCourseDeleteModalClose() {
    setconfirmCourseDeleteModalOpen(false);
  }

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
      batches: [],
      projectId: "",
      projectName: "",
      fideId: 0,
      title: "None",
      rating: 0,
      completedStatus: "",
      enrolledCourses: [],
      eventsPlayed: [],
      history: [],
      guardianInfo: { name: "", phone: "", email: "" },
      emergencyContactName: "",
      emergencyContactNo: "",
    },
  });

  const { errors, isValid } = formState;

  const {
    fields: batchesFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    control,
    name: "batches",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "enrolledCourses",
  });

  const addCourse = () => {
    append({
      course: "",
      courseId: "",
      startDate: "",
      endDate: "",
      activeStatus: true,
    });
  };

  const enrolledCourses = watch("enrolledCourses");

  const isDuplicateCourse = (course: string) => {
    return enrolledCourses.filter((c) => c.course === course).length > 1;
  };

  const addBatch = () => {
    appendBatch({
      batchId: "",
      batchName: "",
      startDate: "",
      endDate: "",
      activeStatus: true,
    });
  };

  const batches = watch("batches");

  const isDuplicateBatch = (batchName: string) => {
    return batches.filter((c) => c.batchName === batchName).length > 1;
  };

  const onSubmit = async (data) => {
    try {
      setupdateStudentLoading(true);
      const { data: resData } = await axios.post(
        "/api/students/updateStudent",
        data
      );
      console.log("previous student", data);
      console.log("updated student", resData);

      if (resData.statusCode == 200) {
        // console.log("ass student", resData);
        handleconfirmModalClose();
      }
      setupdateStudentLoading(false);
      notify(resData.msg, resData.statusCode);
      return;
    } catch (error) {
      console.log("error in updateStudent component (onSubmit)", error);
    }
  };

  useEffect(() => {
    let tempHcaBatches = allActiveBatches.filter(
      (batch) => batch.affiliatedTo.toLowerCase() == "hca"
    );
    let tempSchoolBatches = allActiveBatches.filter(
      (batch) => batch.affiliatedTo.toLowerCase() == "school"
    );
    sethcaBatchList(tempHcaBatches);
    setschoolBatchList(tempSchoolBatches);

    setprojectList(allActiveProjects);
  }, [allActiveBatches, allActiveProjects, dispatch]);

  useEffect(() => {
    dispatch(fetchAllBatches());
    dispatch(fetchAllProjects());
  }, []);

  useEffect(() => {
    if (studentRecord) {
      reset({
        ...studentRecord,
        batches: studentRecord.batches || [],
        enrolledCourses: studentRecord.enrolledCourses || [],
      });
      setselectedAffiliatedTo(studentRecord.affiliatedTo);
      setLoaded(true);
    }
  }, [studentRecord, reset]);

  if (!loaded) return <div></div>;

  return (
    <div className="flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md ">
      <div className="heading ">
        <h1 className="text-xl font-bold ">Update Student</h1>
      </div>
      <Divider sx={{ margin: ".5rem 0 .7rem  " }} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleconfirmModalOpen(); // Open modal instead of submitting form
          }
        }}
        className="addstudentform form-fields flex-1 h-full overflow-y-auto grid grid-cols-2 gap-5"
      >
        {/* Form fields go here, same as in AddStudent */}
        {/* first-basic-info */}
        <div className="first-basic-info grid grid-cols-2 grid-rows-3 gap-5">
          {/* selected affiliated to */}
          <Controller
            name="affiliatedTo"
            control={control}
            rules={{}}
            render={({ field }) => (
              <Dropdown
                label="Affiliated to"
                options={affiliatedToOptions}
                selected={field.value || ""}
                disabled={true}
                onChange={(value) => {
                  setselectedAffiliatedTo(value);
                }}
                width="full"
              />
            )}
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
                value={field.value || ""}
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
                value={
                  field.value
                    ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                    : ""
                }
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
                  selected={field.value || ""}
                  onChange={(value) => {
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
          {selectedAffiliatedTo.toLowerCase() == "school" && (
            <div className="educationalInstitute col-span-2">
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
                    value={field.value || ""}
                    type="text"
                    label="Educational Insititute"
                    // required={true}
                    error={errors.educationalInstitute}
                    helperText={errors.educationalInstitute?.message}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* second-basic-info */}
        <div className="second-basic-info grid grid-cols-2 gap-5 auto-rows-min grid-auto-flow-dense">
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
                value={
                  field.value
                    ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                    : ""
                }
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
                value={
                  field.value
                    ? dayjs(field.value).tz(timeZone).format("YYYY-MM-DD")
                    : ""
                }
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
                  value={field.value || ""}
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
                  value={field.value || ""}
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
                  options={projectList.map((project) => project.name)}
                  selected={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    const selectedProject = projectList.find(
                      (project) => project.name == value
                    );

                    setValue("projectId", selectedProject._id);
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
                selected={field.value || ""}
                onChange={(value) => {
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
          <p className="text-lg  mb-2 font-bold">Chess</p>

          <div className="basic-info-fields grid grid-cols-2  gap-4">
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
                    selected={field.value || ""}
                    onChange={(value) => {
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
                    value={field.value || ""}
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
                    value={field.value || ""}
                    label="Rating"
                    type="number"
                    error={errors.rating}
                    helperText={errors.rating?.message}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Guardian info */}
        {selectedAffiliatedTo.toLowerCase() == "hca" && (
          <div className="contact">
            <p className="text-lg  mb-2 font-bold">Guardian info</p>
            <div className="basic-info-fields grid grid-cols-2  gap-4">
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
                    error={errors?.guardianInfo?.name}
                    helperText={errors?.guardianInfo?.name?.message}
                    required={true}
                  />
                )}
              />
              {/* guardian phone */}
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
                    label="Guardian Phone no"
                    type="number"
                    error={errors?.guardianInfo?.phone}
                    helperText={errors?.guardianInfo?.phone?.message}
                    required={true}
                  />
                )}
              />
              {/* guardian email */}
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
                    label="Guardian email"
                    type="text"
                    error={errors?.guardianInfo?.email}
                    helperText={errors?.guardianInfo?.email?.message}
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

            <div className="basic-info-fields grid grid-cols-2  gap-4">
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
                    value={field.value || ""}
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
                    value={field.value || ""}
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
              .filter((batch) => batch.activeStatus == true)
              .map((batch, index) => (
                <div key={batch?.id} className="col-span-2 mb-2">
                  <div className="grid grid-cols-4 items-center place-items-start gap-4">
                    {/* batch name Selection */}
                    <Controller
                      name={`batches.${index}.batchName`}
                      control={control}
                      rules={{
                        required: "Batch is required",
                        validate: (value) =>
                          (value && !isDuplicateBatch(value, index)) ||
                          "Duplicate batch selected",
                      }}
                      render={({ field }) => (
                        <Dropdown
                          label="Batch"
                          options={
                            selectedAffiliatedTo?.toLowerCase() == "hca"
                              ? hcaBatchList.map((batch) => batch.batchName)
                              : schoolBatchList.map((batch) => batch.batchName)
                          }
                          selected={field.value || ""}
                          onChange={(value) => {
                            field.onChange(value);
                            let selectedBatchList =
                              selectedAffiliatedTo.toLowerCase() == "hca"
                                ? hcaBatchList
                                : schoolBatchList;
                            const selectedBatch = selectedBatchList.find(
                              (batch) => batch.batchName == value
                            );
                            setValue(
                              `batches.${index}.batchId`,
                              selectedBatch._id
                            );
                          }}
                          width="full"
                          error={errors?.batches?.[index]?.batchName}
                          helperText={
                            errors?.batches?.[index]?.batchName?.message
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
                              ? dayjs(field.value)
                                  .tz(timeZone)
                                  .format("YYYY-MM-DD")
                              : ""
                          }
                          error={errors?.batches?.[index]?.startDate}
                          helperText={
                            errors?.batches?.[index]?.startDate?.message
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
                              ? dayjs(field.value)
                                  .tz(timeZone)
                                  .format("YYYY-MM-DD")
                              : ""
                          }
                          error={errors?.batches?.[index]?.endDate}
                          helperText={
                            errors?.batches?.[index]?.endDate?.message
                          }
                          width="full"
                        />
                      )}
                    />
                    <Button
                      onClick={() => handleconfirmBatchDeleteModalOpen(index)}
                      className="text-red-500  "
                      color="error"
                    >
                      <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                      <span className="text-sm">Delete</span>
                    </Button>
                    {/* confrim remove batch modal */}
                    <Modal
                      open={confirmBatchDeleteModalOpen}
                      onClose={handleconfirmBatchDeleteModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="flex items-center justify-center"
                    >
                      <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
                        <p className="font-semibold mb-4 text-2xl">
                          Are you sure?
                        </p>
                        <p className="mb-6 text-gray-600">
                          You want to update this student.
                        </p>
                        <div className="buttons flex gap-4">
                          <Button
                            variant="outlined"
                            onClick={handleconfirmBatchDeleteModalClose}
                            className="text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                              removeBatch(Number(selectedDeleteBatchIndex));
                              notify("Batch deleted", 200);
                              handleconfirmBatchDeleteModalClose();
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                </div>
              ))
          )}
          {/* add course button */}
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
                <div className="grid grid-cols-4 items-center place-items-start gap-4">
                  {/* Course Selection */}
                  <Controller
                    name={`enrolledCourses.${index}.course`}
                    control={control}
                    rules={{
                      required: "Course is required",
                      validate: (value) =>
                        (value && !isDuplicateCourse(value, index)) ||
                        "Duplicate course selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Course"
                        options={coursesList.map((c) => c.value)}
                        selected={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                          const selectedCourse = coursesList.find(
                            (course) => course.value == value
                          );
                          setValue(
                            `enrolledCourses.${index}.courseId`,
                            selectedCourse._id
                          );
                          trigger(`enrolledCourses.${index}.status`); // Trigger validation on status
                        }}
                        width="full"
                        error={errors?.enrolledCourses?.[index]?.course}
                        helperText={
                          errors?.enrolledCourses?.[index]?.course?.message
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
                            ? dayjs(field.value)
                                .tz(timeZone)
                                .format("YYYY-MM-DD")
                            : ""
                        }
                        error={errors?.enrolledCourses?.[index]?.startDate}
                        helperText={
                          errors?.enrolledCourses?.[index]?.startDate?.message
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
                            ? dayjs(field.value)
                                .tz(timeZone)
                                .format("YYYY-MM-DD")
                            : ""
                        }
                        error={errors?.enrolledCourses?.[index]?.endDate}
                        helperText={
                          errors?.enrolledCourses?.[index]?.endDate?.message
                        }
                        width="full"
                      />
                    )}
                  />
                  <Button
                    onClick={() => handleconfirmCourseDeleteModalOpen(index)}
                    className="text-red-500  "
                    color="error"
                  >
                    <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    <span className="text-sm">Delete</span>
                  </Button>
                  {/* confirm course delete modal */}
                  <Modal
                    open={confirmCourseDeleteModalOpen}
                    onClose={handleconfirmCourseDeleteModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="flex items-center justify-center"
                  >
                    <Box className="w-[400px] h-max p-6  flex flex-col items-center bg-white rounded-xl shadow-lg">
                      <p className="font-semibold mb-4 text-2xl">
                        Are you sure?
                      </p>
                      <p className="mb-6 text-gray-600">
                        You want to update this student.
                      </p>
                      <div className="buttons flex gap-4">
                        <Button
                          variant="outlined"
                          onClick={handleconfirmCourseDeleteModalClose}
                          className="text-gray-600 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => {
                            remove(Number(selectedDeleteCourseIndex));
                            notify("Enrolled course deleted", 200);
                            handleconfirmCourseDeleteModalClose();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </Modal>
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
            Update Student
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
              <p className="mb-6 text-gray-600">
                You want to update this student.
              </p>
              <div className="buttons flex gap-4">
                <Button
                  variant="outlined"
                  onClick={handleconfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {updateStudentLoading ? (
                  <LoadingButton
                    size="large"
                    loading={updateStudentLoading}
                    loadingPosition="start"
                    variant="contained"
                    className="mt-7"
                  >
                    <span className="">Updating student</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      document.getElementById("hiddenSubmit").click();

                      if (!isValid) {
                        handleconfirmModalClose();
                      }
                    }}
                  >
                    Update Student
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

export default UpdateStudent;
