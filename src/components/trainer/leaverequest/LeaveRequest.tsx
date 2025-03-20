import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Divider,
  Modal,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { notify } from "@/helpers/notify";
import Dropdown from "@/components/Dropdown";
import TrainersLeaveRequestList from "./TrainersLeaveRequestList";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { addLeaveRequest } from "@/redux/leaveRequestSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const LeaveRequest = () => {
  // dispatch
  const dispatch = useDispatch<any>();
  // session
  const { data: sessionData } = useSession();

  // state vars
  const [nepaliTodaysDate, setNepaliTodaysDate] = useState(
    dayjs().tz(timeZone).startOf("day")
  );
  const [supportReasonFile, setsupportReasonFile] = useState<File | any>(null);
  const [selectedAffectedClass, setselectedAffectedClass] = useState("");
  // modal
  const [affectedClassModalOpen, setaffectedClassModalOpen] = useState(false);
  // modal operations
  // handleaffectedClassModalOpen
  function handleaffectedClassModalOpen() {
    setaffectedClassModalOpen(true);
  }

  // handleaffectedClassModalClose
  function handleaffectedClassModalClose() {
    setaffectedClassModalOpen(false);
  }

  // hook form
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      fromDate: "",
      toDate: "",
      leaveReason: "",
      leaveSubject: "",
      affectedClasses: [],
    },
  });

  // field array for affectedClasses
  const {
    fields: affectedClassesFields,
    append: appendaffectedClasses,
    remove: removeaffectedClasses,
  } = useFieldArray({
    control,
    name: "affectedClasses",
  });

  // Watching form values
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  // Function to validate dates
  const validateFromDate = (fromDate) => {
    if (!fromDate) return "From date is required";
    return dayjs(fromDate).isBefore(nepaliTodaysDate)
      ? "Date cannot be in the past"
      : true;
  };

  const validateToDate = (toDate) => {
    if (!toDate) return "To date is required";
    if (!fromDate) return "Select a from date first";

    const from = dayjs(fromDate);
    const to = dayjs(toDate);

    if (to.isBefore(nepaliTodaysDate)) return "Date cannot be in the past";
    if (to.isBefore(from)) return "To date must be after or same as From date";

    return true;
  };

  // Function to calculate days difference (including same-day leave)
  const calculateleaveDurationDays = (from, to) => {
    return from && to ? dayjs(to).diff(dayjs(from), "day") + 1 : 0;
  };

  const leaveDurationDays = calculateleaveDurationDays(fromDate, toDate);

  //handle file change
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setsupportReasonFile(file);
    }
  };

  //handleaffectedClassAdd
  function handleaffectedClassAdd() {
    // check if selectedAffectedClass exists
    if (!selectedAffectedClass || selectedAffectedClass.trim() == "") {
      notify("Enter valid class name", 204);
      return;
    }

    const affectedClassNameExists = affectedClassesFields.find(
      (affectedClass: any) =>
        affectedClass.affectedClassName == selectedAffectedClass
    );

    if (affectedClassNameExists) {
      notify("Class name already exists", 204);
      return;
    } else {
      appendaffectedClasses({ affectedClassName: selectedAffectedClass });
      notify("Affected class added", 200);
      handleaffectedClassModalClose();
      return;
    }
  }

  //   submit function
  async function onSubmit(data) {
    // check if affectedClassesFields is empty or not
    if (affectedClassesFields?.length == 0) {
      notify("Include affected classes", 204);
      return;
    }
    let fileUrl = "";

    const fromDay = dayjs(data.fromDate).tz(timeZone).format("dddd");
    const toDay = dayjs(data.toDate).tz(timeZone).format("dddd");
    const temp = {
      ...data,
      date: dayjs(nepaliTodaysDate).tz(timeZone).format(),
      fromDay,
      toDay,
      leaveDurationDays,
      trainerId: sessionData?.user?._id,
      trainerName: sessionData?.user?.name,
    };

    // add new leave request record api
    const { data: resData } = await axios.post(
      "/api/leaverequest/addNewLeaveRequest",
      temp
    );

    // new request added
    if (resData?.statusCode == 200) {
      console.log(
        "New leave request added, now addding supportreasonfile to cloudinary"
      );

      // add file to cloudinary
      if (supportReasonFile) {
        let tempsavedLeaveRequest = resData.savedNewLeaveRequest;

        const formData = new FormData();
        formData.append("file", supportReasonFile);
        const extractedDate = dayjs(nepaliTodaysDate)
          .tz(timeZone)
          .format("YYYY-MM-DD");
        const folderName = `leaveSupportReasons/${extractedDate}/${sessionData?.user?.name}`;
        formData.append("folderName", folderName);

        const { data: supporReasonFileResData } = await axios.post(
          "/api/fileupload/uploadfile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // cloudinary error
        if (supporReasonFileResData.error) {
          notify("Error uploading support file", 204);
          return;
        }
        // file added to cloudinary
        else {
          fileUrl = supporReasonFileResData.res.secure_url;
          tempsavedLeaveRequest = {
            ...tempsavedLeaveRequest,
            supportReasonFileUrl: fileUrl,
          };
          const { data: updateLeaveRequestResData } = await axios.post(
            "/api/leaverequest/updateLeaveRequest",
            tempsavedLeaveRequest
          );
          // no resData.statusCode in cloudinary response
          console.log(
            "updated just added leave request with supportReasonFileUrl"
          );
        }
        //update redux state
        // it adds just added leaveRequest with or without supportReasonFileUrl
        dispatch(addLeaveRequest(tempsavedLeaveRequest));
      }
      // resData from addLeqveRequest (not file api)
      notify(resData?.msg, resData?.statusCode);
      return;
    }
    // failed to add request
    else {
      notify(resData?.msg, resData?.statusCode);
      return;
    }
  }

  return (
    <div className="flex w-full ">
      {/* request form */}
      <div className="requestForm flex-[0.7] flex flex-col mr-4 py-5 px-10 rounded-md shadow-md bg-white ">
        <h1 className="text-2xl font-bold">Request for leave</h1>
        <p className="text-xs mt-1 text-gray-500">
          This will be sent to superadmin for approval.
        </p>
        {/* divider */}
        <Divider sx={{ margin: ".7rem 0" }} />
        {/* form */}
        <form
          className="grid grid-cols-2 gap-4   overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* nepaliTodaysDate */}
          <div className="nepaliTodaysDate col-span-2 text-lg mt-1">
            <span className="mr-1 font-bold">Date:</span>
            {nepaliTodaysDate.format("MMMM D, YYYY dddd")}
          </div>
          {/* from date */}
          <Controller
            name="fromDate"
            control={control}
            rules={{ validate: validateFromDate }}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  label="From"
                  type="date"
                  required
                  error={errors.fromDate}
                  helperText={errors.fromDate?.message}
                />
                {/* Display the day of the week in Nepali timezone */}
                {field.value && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-bold">Day: </span>
                    {dayjs(field.value).tz(timeZone).format("dddd")}
                  </div>
                )}
              </div>
            )}
          />
          {/* to date */}
          <Controller
            name="toDate"
            control={control}
            rules={{ validate: validateToDate }}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  label="To"
                  type="date"
                  required
                  error={errors.toDate}
                  helperText={errors.toDate?.message}
                />
                {/* Display the day of the week in Nepali timezone */}
                {field.value && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-bold">Day: </span>
                    {dayjs(field.value).tz(timeZone).format("dddd")}
                  </div>
                )}
              </div>
            )}
          />
          {/* Display number of days */}
          {fromDate && toDate && (
            <div className="col-span-2 text-sm mt-2 flex items-center">
              <TimelapseIcon />
              <span className={`font-semibold ml-2 `}>
                Leave Duration:
              </span>{" "}
              <span
                className={`days ml-2 ${
                  leaveDurationDays < 0 && " text-red-600 "
                }`}
              >
                {leaveDurationDays} day(s)
              </span>
            </div>
          )}

          {/* leave subject */}
          <div className="leaveSubject col-span-2">
            <Controller
              name="leaveSubject"
              control={control}
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Subject"
                  type="text"
                  required
                  error={errors.leaveSubject}
                  helperText={errors.leaveSubject?.message}
                />
              )}
            />
          </div>
          {/* leave reason */}
          <div className="leavereason col-span-2">
            <p className="text-sm mb-1 font">Reason *</p>
            <Controller
              name="leaveReason"
              control={control}
              rules={{ required: "Leave reason is required" }}
              render={({ field }) => (
                <div>
                  <TextareaAutosize
                    {...field}
                    minRows={4}
                    placeholder="Your reason for leave"
                    className="w-full p-4 text-sm border border-gray-300 rounded-md outline-blue-300 "
                  />
                  {errors?.leaveReason && (
                    <p className="text-xs text-red-500">
                      {errors?.leaveReason?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* affectedClasses */}
          <div className="affectedClasses col-span-2">
            <p className="text-sm font-bold">Affected Classes</p>
            {/* affected class list */}
            <div className="affectedClassList flex flex-wrap my-2 gap-2">
              {affectedClassesFields?.map((field: any, index) => (
                <div
                  key={field.id}
                  className="text-black border text-xs shadow-sm outline-none w-max h-max py-1 px-2 rounded-full flex items-center gap-1"
                >
                  <p>{field?.affectedClassName}</p>{" "}
                  {/* Access the property here */}
                  <button
                    title="Delete"
                    onClick={() => removeaffectedClasses(index)} // Remove by index
                  >
                    <CloseIcon
                      className=" border border-gray-400 text-black rounded-full p-0.5 ml-1s"
                      sx={{ fontSize: "0.9rem" }}
                    />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="outlined"
              size="small"
              onClick={handleaffectedClassModalOpen}
            >
              + Add Class
            </Button>

            {/* add affected class modal */}
            <Modal
              open={affectedClassModalOpen}
              onClose={handleaffectedClassModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="flex items-center justify-center"
              BackdropProps={{
                style: { backgroundColor: "rgba(0,0,0,0.4)" },
              }}
            >
              <div className="w-[450px] h-max p-6 rounded-lg shadow-md bg-white">
                <p className="text-lg font-bold mb-3">Add Affected Class</p>

                <Dropdown
                  label="Project name"
                  options={["asd", "34"]}
                  selected={selectedAffectedClass}
                  onChange={(value: any) => {
                    setselectedAffectedClass(value);
                  }}
                  width="full"
                />

                <Button
                  className=""
                  variant="contained"
                  sx={{ marginTop: "1rem" }}
                  onClick={handleaffectedClassAdd}
                >
                  Add
                </Button>
              </div>
            </Modal>
          </div>

          {/* support for reason */}
          <div className="support-reason col-span-2">
            <p className="text-sm mb-1 font-bold">Support for reason</p>
            <input
              accept="application/pdf,image/*" // allow pdf and image
              onChange={handleFileChange}
              type="file"
              id="supportreasonfile"
              name="supportreasonfile"
              className="mt-1"
            />
          </div>

          {/* submit button */}
          <Button type="submit" className="w-max" variant="contained">
            Submit
          </Button>
        </form>
      </div>
      {/* requested leave list */}
      <div className="requestedLeaveList flex-[0.3] px-6 py-5 rounded-md shadow-md bg-white">
        <TrainersLeaveRequestList />
      </div>
    </div>
  );
};

export default LeaveRequest;
