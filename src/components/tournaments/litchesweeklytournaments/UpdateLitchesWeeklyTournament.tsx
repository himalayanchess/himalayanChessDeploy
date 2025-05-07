import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Modal,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { notify } from "@/helpers/notify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import { Clock, Medal, MedalIcon, Trophy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches, getAllStudents } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const UpdateLitchesWeeklyTournament = ({ litchesTournamentRecord }: any) => {
  const router = useRouter();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const { allActiveHcaStudentsList, allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredStudentsListOptions, setfilteredStudentsListOptions] =
    useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  const handleConfirmModalOpen = () => setConfirmModalOpen(true);
  const handleConfirmModalClose = () => setConfirmModalOpen(false);

  const tournamentTypeOptions = ["Standard", "Rapid", "Blitz"];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<any>({
    defaultValues: {
      tournamentName: "",
      tournamentUrl: "",
      date: "",
      tag: "litches",
      time: "",
      branchName: "",
      branchId: "",
      initialTime: "",
      increment: "",
      tournamentType: "",
      litchesWeeklyWinners: [],
    },
  });

  const {
    fields: winnerFields,
    append: appendWinner,
    remove: removeWinner,
    replace: resetWinners,
  } = useFieldArray<any>({
    control,
    name: "litchesWeeklyWinners",
  });

  const handleAddWinner = () => {
    appendWinner({
      studentId: "",
      studentName: "",
      litchesUsername: "",
      litchesUrl: "",
      rank: "",
      performanceUrl: "",
    });
  };

  // Watch the litchesWeeklyWinners field to detect changes
  const litchesWeeklyWinners = watch("litchesWeeklyWinners");

  // Function to check for duplicate student names
  const isDuplicateStudentName = (studentName: string, index: number) => {
    return (
      litchesWeeklyWinners.filter(
        (winner: any, idx: number) =>
          winner.studentName === studentName && idx !== index
      ).length > 0
    );
  };

  // Function to check for duplicate ranks
  const isDuplicateRank = (rank: string, index: number) => {
    return (
      litchesWeeklyWinners.filter(
        (winner: any, idx: number) => winner.rank === rank && idx !== index
      ).length > 0
    );
  };

  const handleDeleteWinner = (index: number) => {
    setWinnerToDelete(index);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteWinner = () => {
    if (winnerToDelete !== null) {
      removeWinner(winnerToDelete);
    }
    setConfirmDeleteOpen(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log(data);

      const { data: response } = await axios.post(
        `/api/tournaments/litches/updatelitchestournament`,
        {
          ...data,
        }
      );

      if (response.statusCode === 200) {
        notify(response.msg, response.statusCode);
        handleConfirmModalClose();
        setTimeout(() => {
          router.push(
            `/${session?.data?.user?.role?.toLowerCase()}/tournaments/litchesweeklytournament`
          );
        }, 50);
      } else {
        notify(response.msg, response.statusCode);
      }
    } catch (error) {
      console.error("Error updating litches tournament:", error);
      notify("Failed to update litches tournament", 500);
    } finally {
      setLoading(false);
    }
  };

  // Load tournament data
  useEffect(() => {
    if (litchesTournamentRecord) {
      reset({
        ...litchesTournamentRecord,
        date: litchesTournamentRecord.date
          ? dayjs(litchesTournamentRecord.date)
              .tz(timeZone)
              .format("YYYY-MM-DD")
          : "",
        time: litchesTournamentRecord.time
          ? dayjs(litchesTournamentRecord.time).tz(timeZone).toISOString()
          : null,
        litchesWeeklyWinners:
          litchesTournamentRecord?.litchesWeeklyWinners?.filter(
            (winner: any) => winner.activeStatus
          ),
      });

      // clock time
      setValue("initialTime", litchesTournamentRecord?.clockTime?.initialTime);
      setValue("increment", litchesTournamentRecord?.clockTime?.increment);

      setValue("branchName", litchesTournamentRecord?.branchName);
      setValue("branchId", litchesTournamentRecord?.branchId);

      setselectedBranch(litchesTournamentRecord?.branchName);
      setLoaded(true);
    }
  }, [litchesTournamentRecord, reset]);

  // branch access
  //   useEffect(() => {
  //     const user = session?.data?.user;
  //     const isSuperOrGlobalAdmin =
  //       user?.role?.toLowerCase() === "superadmin" ||
  //       (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

  //     if (!isSuperOrGlobalAdmin) {
  //       setValue("branchName", user?.branchName);
  //       setValue("branchId", user?.branchId);
  //       setselectedBranch(user?.branchName);
  //     }
  //   }, [session?.data?.user]);

  // filter students if branch changes
  useEffect(() => {
    const tempfilteredHcaStudents =
      selectedBranch?.toLowerCase() == ""
        ? allActiveHcaStudentsList
        : allActiveHcaStudentsList.filter(
            (student: any) =>
              student?.branchName?.toLowerCase() ===
              selectedBranch?.toLowerCase()
          );
    setfilteredStudentsListOptions(tempfilteredHcaStudents);
  }, [selectedBranch, allActiveHcaStudentsList]);

  // get initial data
  useEffect(() => {
    dispatch(getAllStudents());
    dispatch(getAllBranches());
  }, []);

  if (!loaded)
    return (
      <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md"></div>
    );

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
        <div className="heading flex items-center gap-4">
          <div className="header w-full flex items-end justify-between">
            <h1 className="w-max mr-auto text-2xl flex items-center font-bold">
              <Trophy />
              <span className="ml-2">Update Litches Tournament</span>
            </h1>
            <div className="buttons flex gap-4">
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/litchesweeklytournament`}
              >
                <Button color="inherit" sx={{ color: "gray" }}>
                  <HomeOutlinedIcon />
                  <span className="ml-1">Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Divider sx={{ margin: "0.7rem 0" }} />

        <form
          className="form-fields h-fit overflow-y-auto "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-5 items-end">
            {/* tournament name */}
            <Controller
              name="tournamentName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Tournament name is required",
                },
              }}
              render={({ field }) => (
                <Input
                  label="Tournament Name"
                  type="text"
                  value={field.value || ""}
                  onChange={field.onChange}
                  required
                  error={errors.tournamentName}
                  helperText={errors.tournamentName?.message}
                />
              )}
            />

            {/* tournamentUrl */}
            <Controller
              name="tournamentUrl"
              control={control}
              render={({ field }) => (
                <Input
                  label="Tournament URL"
                  type="text"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.tournamentUrl}
                  helperText={errors.tournamentUrl?.message}
                />
              )}
            />

            {/* date-time */}
            <div className="date-time grid grid-cols-2 gap-4 items-end">
              {/* date */}
              <div>
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Date is required",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Date"
                      type="date"
                      value={field.value || ""}
                      disabled
                      onChange={field.onChange}
                      required
                      error={errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </div>
              {/* time */}
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="time"
                    control={control}
                    rules={{
                      required: "Start time is required",
                    }}
                    render={({ field }) => (
                      <TimePicker
                        label="Start Time"
                        value={
                          field.value || "" ? dayjs(field.value || "") : null
                        }
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.toISOString() : null
                          );
                        }}
                        slotProps={{
                          textField: {
                            error: !!errors.time,
                            helperText: errors.time?.message as string,
                            size: "small",
                            sx: { fontSize: "0.8rem", width: "150px" },
                          },
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "0.8rem",
                            height: "35px",
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>

            {/* tournament type */}
            <div className="grid grid-cols-2 gap-4">
              {/* Branch Name */}
              <Controller
                name="branchName"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Dropdown
                    label="Branch"
                    options={allActiveBranchesList?.map(
                      (branch: any) => branch.branchName
                    )}
                    selected={field.value || ""}
                    disabled
                    onChange={(value: any) => {
                      field.onChange(value);
                      const selectedBranch: any = allActiveBranchesList?.find(
                        (branch: any) =>
                          branch?.branchName?.toLowerCase() ==
                          value?.toLowerCase()
                      );
                      setValue("branchId", selectedBranch?._id);
                      setselectedBranch(value);
                    }}
                    error={!!(errors.branchName as any)}
                    helperText={(errors.branchName as any)?.message}
                    required
                    width="full"
                  />
                )}
              />

              {/* tournament type */}
              <Controller
                name="tournamentType"
                control={control}
                rules={{ required: "Tournament type is required" }}
                render={({ field }) => (
                  <Dropdown
                    label="Tournament Type"
                    options={tournamentTypeOptions}
                    disabled
                    selected={field.value || ""}
                    onChange={field.onChange}
                    error={!!(errors.tournamentType as any)}
                    helperText={(errors.tournamentType as any)?.message}
                    required
                    width="full"
                  />
                )}
              />
            </div>

            {/* clock information */}
            <div className="clock-information col-span-2 mt-4">
              <p className="font-bold text-gray-500 mb-1 flex items-center">
                <Clock size={18} />
                <span className="ml-1">Clock Information</span>
              </p>
              <div className="initial-increment  grid grid-cols-2 gap-4">
                {/* initial time */}
                <div>
                  <Controller
                    name="initialTime"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Initial game time is required",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        label="Initial Game Time (minutes)"
                        type="number"
                        value={field.value || ""}
                        onChange={field.onChange}
                        required
                        error={errors.initialTime}
                        helperText={errors.initialTime?.message}
                      />
                    )}
                  />
                </div>

                {/* increment */}
                <div>
                  <Controller
                    name="increment"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Increment time is required",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        label="Increment Time (seconds)"
                        type="number"
                        value={field.value || ""}
                        onChange={field.onChange}
                        required
                        error={errors.increment}
                        helperText={errors.increment?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* tournament winner */}
          <div className="mb-3 flex flex-col gap-4">
            <p className="font-bold text-gray-500 mt-3 flex items-center">
              <MedalIcon size={17} />
              <span className="ml-1">Tournament Winners</span>
            </p>

            {winnerFields.length === 0 && (
              <p className="text-gray-500 mt-2">No winners added yet</p>
            )}

            {winnerFields.map((field, index) => (
              <div
                key={field.id}
                className={`border p-3 rounded-lg bg-gray-50`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-gray-500 flex items-center">
                    <MedalIcon size={15} />
                    <span className="ml-1">Winner #{index + 1}</span>
                  </p>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteWinner(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* studentName */}
                  <Controller
                    name={`litchesWeeklyWinners.${index}.studentName`}
                    control={control}
                    rules={{
                      required: "Student name is required",
                      validate: (value: any) =>
                        !isDuplicateStudentName(value, index) ||
                        "Duplicate student name",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Student name"
                        options={filteredStudentsListOptions?.map(
                          (student: any) => student.name
                        )}
                        selected={field.value || ""}
                        onChange={(value: any) => {
                          field.onChange(value);
                          const selectedStudent: any =
                            filteredStudentsListOptions?.find(
                              (student: any) =>
                                student?.name?.toLowerCase() ===
                                value?.toLowerCase()
                            );
                          setValue(
                            `litchesWeeklyWinners.${index}.studentId`,
                            selectedStudent?._id
                          );
                          setValue(
                            `litchesWeeklyWinners.${index}.litchesUsername`,
                            selectedStudent?.litchesUsername
                          );
                          setValue(
                            `litchesWeeklyWinners.${index}.litchesUrl`,
                            selectedStudent?.litchesUrl
                          );
                          setValue(
                            `litchesWeeklyWinners.${index}.performanceUrl`,
                            ""
                          );
                        }}
                        error={
                          !!(errors.litchesWeeklyWinners as any)?.[index]
                            ?.studentName
                        }
                        helperText={
                          (errors.litchesWeeklyWinners as any)?.[index]
                            ?.studentName?.message
                        }
                        required
                        width="full"
                      />
                    )}
                  />

                  {/* rank */}
                  <Controller
                    name={`litchesWeeklyWinners.${index}.rank`}
                    control={control}
                    rules={{
                      required: "Rank is required",
                      validate: (value: any) =>
                        !isDuplicateRank(value, index) ||
                        "Duplicate rank selected",
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Rank"
                        options={[1, 2, 3]}
                        selected={field.value || ""}
                        onChange={field.onChange}
                        error={
                          !!(errors.litchesWeeklyWinners as any)?.[index]?.rank
                        }
                        helperText={
                          (errors.litchesWeeklyWinners as any)?.[index]?.rank
                            ?.message
                        }
                        required
                        width="full"
                      />
                    )}
                  />

                  {/* litchesUsername */}
                  <Controller
                    name={`litchesWeeklyWinners.${index}.litchesUsername`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Litcher Username"
                        value={field.value || ""}
                        onChange={field.onChange}
                        type="text"
                        error={
                          !!(errors.litchesWeeklyWinners as any)?.[index]
                            ?.litchesUsername
                        }
                        helperText={
                          (errors.litchesWeeklyWinners as any)?.[index]
                            ?.litchesUsername?.message
                        }
                        width="full"
                      />
                    )}
                  />

                  {/* litches url */}
                  <Controller
                    name={`litchesWeeklyWinners.${index}.litchesUrl`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Litcher URL"
                        value={field.value || ""}
                        onChange={field.onChange}
                        type="text"
                        error={
                          !!(errors.litchesWeeklyWinners as any)?.[index]
                            ?.litchesUrl
                        }
                        helperText={
                          (errors.litchesWeeklyWinners as any)?.[index]
                            ?.litchesUrl?.message
                        }
                        width="full"
                      />
                    )}
                  />

                  {/* performanceUrl */}
                  <Controller
                    name={`litchesWeeklyWinners.${index}.performanceUrl`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Performance URL"
                        value={field.value || ""}
                        onChange={field.onChange}
                        type="text"
                        error={
                          !!(errors.litchesWeeklyWinners as any)?.[index]
                            ?.performanceUrl
                        }
                        helperText={
                          (errors.litchesWeeklyWinners as any)?.[index]
                            ?.performanceUrl?.message
                        }
                        width="full"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* add new winner field */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddWinner}
          >
            Add Winner
          </Button>

          {/* Confirm Delete Modal */}
          <Modal
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            aria-labelledby="confirmdelete-modal-title"
            aria-describedby="confirmdelete-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] py-7 text-center rounded-lg bg-white">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p>You want to delete this winner?</p>
              <div className="buttons mt-4 flex justify-center gap-5">
                <Button
                  variant="outlined"
                  onClick={() => setConfirmDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={confirmDeleteWinner}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>

          {/* update tournament */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmModalOpen}
              disabled={loading}
            >
              Update Tournament
            </Button>
          </Box>

          {/* Hidden Submit Button */}
          <button type="submit" id="hiddenTournamentSubmit" hidden></button>

          {/* Confirm Submit Modal */}
          <Modal
            open={confirmModalOpen}
            onClose={handleConfirmModalClose}
            aria-labelledby="confirmupdate-modal-title"
            aria-describedby="confirmupdate-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-6 text-gray-600">
                You want to update this tournament?
              </p>
              <div className="buttons flex gap-5">
                <Button
                  variant="outlined"
                  onClick={handleConfirmModalClose}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {loading ? (
                  <LoadingButton
                    size="large"
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                  >
                    <span>Updating tournament</span>
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      document
                        .getElementById("hiddenTournamentSubmit")
                        ?.click();
                      if (!isValid) handleConfirmModalClose();
                    }}
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </Box>
          </Modal>
        </form>
      </div>
    </div>
  );
};

export default UpdateLitchesWeeklyTournament;
