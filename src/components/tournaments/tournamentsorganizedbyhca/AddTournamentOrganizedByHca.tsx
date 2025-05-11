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
  FormControlLabel,
  Checkbox,
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
import {
  Clock,
  Medal,
  MedalIcon,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches, getAllStudents } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const AddTournamentOrganizedByHca = () => {
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

  // prize options
  const titlePositionMap: any = {
    "Boys Winner": ["U11", "U13", "U15"],
    "Girls Winner": ["13", "U13435", "U15465"],
  };

  const [selectedBranch, setselectedBranch] = useState("");
  const [filteredStudentsListOptions, setfilteredStudentsListOptions] =
    useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<any>(null);
  const [customPrizeMode, setCustomPrizeMode] = useState<any[]>([]);
  const [isRated, setIsRated] = useState(false);

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
      tag: "tournamentsorganizedbyhca",

      startDate: "",
      endDate: "",
      branchName: "",
      branchId: "",
      tournamentType: "",

      initialTime: "",
      increment: "",

      totalParticipants: "",
      totalRounds: "",

      chiefArbiter: {
        chiefArbiterName: "",
        chiefArbiterPhone: "",
        chiefArbiterEmail: "",
      },

      isRated: false,
      fideUrl: "",
      chessResultsUrl: "",

      participants: [],
    },
  });

  const {
    fields: participantsFields,
    append: appendParticipant,
    remove: removeParticipant,
    replace: resetParticipant,
  } = useFieldArray<any>({
    control,
    name: "participants",
  });

  const handleAddParticipant = () => {
    appendParticipant({
      studentId: "",
      studentName: "",
      rank: "",
      performanceUrl: "",
      prize: {
        title: "",
        position: "",
        otherTitleStatus: false,
        otherTitle: "",
      },
      totalPoints: "",
    });
    setCustomPrizeMode((prev) => [...prev, false]); // default is not custom
  };

  // Watch the participants field to detect changes
  const participants = watch("participants");

  // Function to check for duplicate student names
  const isDuplicateStudentName = (studentName: string, index: number) => {
    // Check if any other participant has the same student name
    return (
      participants.filter(
        (participant: any, idx: number) =>
          participant.studentName === studentName && idx !== index
      ).length > 0
    );
  };

  // Function to check for duplicate ranks
  const isDuplicateRank = (rank: string, index: number) => {
    // Check if any other participant has the same rank
    return (
      participants.filter(
        (participant: any, idx: number) =>
          participant.rank === rank && idx !== index
      ).length > 0
    );
  };

  const handleDeleteParticipant = (index: number) => {
    setParticipantToDelete(index);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteParticipant = () => {
    if (participantToDelete !== null) {
      removeParticipant(participantToDelete);
      setCustomPrizeMode((prev) =>
        prev.filter((_, i) => i !== participantToDelete)
      );
    }
    setConfirmDeleteOpen(false);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log("add other tournamentdata", data);
      const { data: response } = await axios.post(
        "/api/tournaments/tournamentsorganizedbyhca/addtournamentorganizedbyhca",
        {
          ...data,
        }
      );
      if (response.statusCode === 200) {
        notify(response.msg, response.statusCode);
        handleConfirmModalClose();
        setTimeout(() => {
          router.push(
            `/${session?.data?.user?.role?.toLowerCase()}/tournaments/tournamentsorganizedbyhca`
          );
        }, 50);
      } else {
        notify(response.msg, response.statusCode);
      }
    } catch (error) {
      console.error("Error submitting lichess  tournament:", error);
      notify("Failed to submit lichess tournament", 500);
    } finally {
      setLoading(false);
    }
  };

  // branch access
  useEffect(() => {
    const user = session?.data?.user;
    const isSuperOrGlobalAdmin =
      user?.role?.toLowerCase() === "superadmin" ||
      (user?.role?.toLowerCase() === "admin" && user?.isGlobalAdmin);

    // console.log("isSuperOrGlobalAdmin", isSuperOrGlobalAdmin, user);
    let branchName = "";
    if (!isSuperOrGlobalAdmin) {
      setValue("branchName", user?.branchName);
      setValue("branchId", user?.branchId);
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // also filter students if branchchanges
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

    // Reset the participants field array
    // replace this logic in update lichess tournament
    resetParticipant([]);
  }, [selectedBranch, allActiveHcaStudentsList]);

  // get initial data
  useEffect(() => {
    dispatch(getAllStudents());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
        <div className="heading flex items-center gap-4">
          <div className="header w-full flex items-end justify-between">
            <h1 className="w-max mr-auto text-2xl flex items-center font-bold">
              <Trophy />
              <span className="ml-2">Add Tournament Organized By HCA</span>
            </h1>
            <div className="buttons flex gap-4">
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/tournamentsorganizedbyhca`}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleConfirmModalOpen(); // Open modal instead of submitting form
            }
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-5 items-end">
            {/* tournamet name */}
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
              rules={
                {
                  // required: {
                  //   value: true,
                  //   message: "Tournament URL is required",
                  // },
                }
              }
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

            {/* start-end-date */}
            <div className="date-time grid grid-cols-2 gap-4 items-end">
              {/* start date */}
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Start Date is required",
                  },
                }}
                render={({ field }) => (
                  <Input
                    label="Start Date"
                    type="date"
                    value={field.value || ""}
                    onChange={field.onChange}
                    required
                    error={errors.startDate}
                    helperText={errors.startDate?.message}
                  />
                )}
              />
              {/* end date */}
              <Controller
                name="endDate"
                control={control}
                // rules={{
                //   required: {
                //     value: true,
                //     message: "End Date is required",
                //   },
                // }}
                render={({ field }) => (
                  <Input
                    label="End Date"
                    type="date"
                    value={field.value || ""}
                    onChange={field.onChange}
                    // required
                    error={errors.endDate}
                    helperText={errors.endDate?.message}
                  />
                )}
              />
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
                    disabled={!isSuperOrGlobalAdmin}
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

              {/* tournamen type */}
              <Controller
                name="tournamentType"
                control={control}
                rules={{ required: "Tournament type is required" }}
                render={({ field }) => (
                  <Dropdown
                    label="Tournament Type"
                    options={tournamentTypeOptions}
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
            <div className="clock-information col-span-1 mt-4">
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

            {/* Participalnts and rounds information */}
            <div className="participants-information col-span-1 mt-4">
              <p className="font-bold text-gray-500 mb-1 flex items-center">
                <Users size={18} />
                <span className="ml-1">Participants & Rounds</span>
              </p>
              <div className="totalParticipants  grid grid-cols-2 gap-4">
                {/* totalParticipants */}
                <div>
                  <Controller
                    name="totalParticipants"
                    control={control}
                    // rules={{
                    //   required: {
                    //     value: true,
                    //     message: "Total participants is required",
                    //   },
                    // }}
                    render={({ field }) => (
                      <Input
                        label="Total Participants"
                        type="number"
                        value={field.value || ""}
                        onChange={field.onChange}
                        // required
                        error={errors.totalParticipants}
                        helperText={errors.totalParticipants?.message}
                      />
                    )}
                  />
                </div>

                {/* totalRounds */}
                <div>
                  <Controller
                    name="totalRounds"
                    control={control}
                    // rules={{
                    //   required: {
                    //     value: true,
                    //     message: "Total participants is required",
                    //   },
                    // }}
                    render={({ field }) => (
                      <Input
                        label="Total Rounds"
                        type="number"
                        value={field.value || ""}
                        onChange={field.onChange}
                        // required
                        error={errors.totalRounds}
                        helperText={errors.totalRounds?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* chief arbiter information */}
            <div className="clock-information col-span-2 mt-1">
              <p className="font-bold text-gray-500 mb-1 flex items-center">
                <User size={18} />
                <span className="ml-1">Chief Arbiter</span>
              </p>
              <div className="chief-arbiter-info grid grid-cols-4 gap-4">
                {/* Chief Arbiter Name (Required) */}
                <div>
                  <Controller
                    name="chiefArbiter.chiefArbiterName"
                    control={control}
                    rules={
                      {
                        //   required: {
                        //     value: true,
                        //     message: "Chief Arbiter name is required",
                        //   },
                      }
                    }
                    render={({ field }) => (
                      <Input
                        label="Chief Arbiter Name"
                        value={field.value || ""}
                        onChange={field.onChange}
                        // required
                        error={
                          !!(
                            errors?.chiefArbiter &&
                            (errors.chiefArbiter as any)?.chiefArbiterName
                          )
                        }
                        helperText={
                          (errors?.chiefArbiter as any)?.chiefArbiterName
                            ?.message
                        }
                      />
                    )}
                  />
                </div>

                {/* Chief Arbiter Phone (Optional, but must be 10 digits if filled) */}
                <div>
                  <Controller
                    name="chiefArbiter.chiefArbiterPhone"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone must be a 10-digit number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        label="Chief Arbiter Phone"
                        type="number"
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={
                          !!(
                            errors?.chiefArbiter &&
                            (errors.chiefArbiter as any)?.chiefArbiterPhone
                          )
                        }
                        helperText={
                          (errors?.chiefArbiter as any)?.chiefArbiterPhone
                            ?.message
                        }
                      />
                    )}
                  />
                </div>

                {/* Chief Arbiter Email (Optional, but must be valid if filled) */}
                <div>
                  <Controller
                    name="chiefArbiter.chiefArbiterEmail"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        label="Chief Arbiter Email"
                        type="email"
                        value={field.value || ""}
                        onChange={field.onChange}
                        error={
                          !!(
                            errors?.chiefArbiter &&
                            (errors.chiefArbiter as any)?.chiefArbiterEmail
                          )
                        }
                        helperText={
                          (errors?.chiefArbiter as any)?.chiefArbiterEmail
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* is rated */}
          <div className="mb-3 flex flex-col gap-0">
            <p className="font-bold text-gray-500 mt-3 flex items-center">
              <Star size={17} />
              <span className="ml-1">Rated Information</span>
            </p>
            <div className="israted w-max">
              <Controller
                name="isRated"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label="This is rated tournament"
                    control={
                      <Checkbox
                        checked={isRated}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsRated(checked); // Update local state
                          field.onChange(checked); // Update react-hook-form state

                          // Reset only on user toggle
                          setValue("fideUrl", "");
                          setValue("chessResultsUrl", "");
                        }}
                      />
                    }
                  />
                )}
              />
            </div>

            {/* rated url fields */}
            <div className="rated-url-fields grid grid-cols-4 gap-4">
              {isRated && (
                <Controller
                  name="fideUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Fide URL"
                      type="text"
                      value={field.value || ""}
                      onChange={field.onChange}
                      required
                      width="full"
                      error={errors.fideUrl}
                      helperText={errors.fideUrl?.message}
                    />
                  )}
                />
              )}

              <Controller
                name="chessResultsUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Chess Results URL"
                    type="text"
                    value={field.value || ""}
                    onChange={field.onChange}
                    required
                    width="full"
                    error={errors.chessResultsUrl}
                    helperText={errors.chessResultsUrl?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* tournament participant */}
          <div className="mb-3 flex flex-col gap-4">
            <p className="font-bold text-gray-500 mt-3 flex items-center">
              <MedalIcon size={17} />
              <span className="ml-1">Tournament Participants</span>
            </p>

            {participantsFields.length === 0 && (
              <p className="text-gray-500 mt-2">No participants added yet</p>
            )}

            {participantsFields.map((field, index) => (
              <div
                key={field.id}
                className={`border p-3 rounded-lg bg-gray-50`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-gray-500 flex items-center">
                    <MedalIcon size={15} />

                    <span className="ml-1">Participant #{index + 1}</span>
                  </p>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteParticipant(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* studentName */}
                  <Controller
                    name={`participants.${index}.studentName`}
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
                            `participants.${index}.studentId`,
                            selectedStudent?._id
                          );
                        }}
                        error={
                          !!(errors.participants as any)?.[index]?.studentName
                        }
                        helperText={
                          (errors.participants as any)?.[index]?.studentName
                            ?.message
                        }
                        required
                        width="full"
                      />
                    )}
                  />

                  <div className="rank-lichesspoints grid grid-cols-2 gap-4">
                    {/* rank */}
                    <Controller
                      name={`participants.${index}.rank`}
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
                          options={[
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16, 17, 18, 19, 20,
                          ]}
                          selected={field.value || ""}
                          onChange={field.onChange}
                          error={!!(errors.participants as any)?.[index]?.rank}
                          helperText={
                            (errors.participants as any)?.[index]?.rank?.message
                          }
                          required
                          width="full"
                        />
                      )}
                    />

                    {/* Total points */}
                    <Controller
                      name={`participants.${index}.totalPoints`}
                      control={control}
                      // rules={{
                      //   required: "Total points is required",
                      // }}
                      render={({ field }) => (
                        <Input
                          label="Total Points"
                          value={field.value || ""}
                          onChange={field.onChange}
                          type="number"
                          error={
                            !!(errors.participants as any)?.[index]?.totalPoints
                          }
                          helperText={
                            (errors.participants as any)?.[index]?.totalPoints
                              ?.message
                          }
                          // required
                          width="full"
                        />
                      )}
                    />
                  </div>

                  {/* participant prize */}

                  {/* performanceUrl */}
                  <div className="col-span-2">
                    <Controller
                      name={`participants.${index}.performanceUrl`}
                      control={control}
                      // rules={{ required: "Lichess URL is required" }}
                      render={({ field }) => (
                        <Input
                          label="Performance URL"
                          value={field.value || ""}
                          onChange={field.onChange}
                          type="text"
                          error={
                            !!(errors.participants as any)?.[index]
                              ?.performanceUrl
                          }
                          helperText={
                            (errors.participants as any)?.[index]
                              ?.performanceUrl?.message
                          }
                          // required
                          width="full"
                        />
                      )}
                    />
                  </div>

                  {/* prize */}
                  <div className="col-span-2 grid grid-cols-4 gap-4 items-start">
                    {/* checkbox-title */}
                    <div className="checkbox-title">
                      {/* Prize Title */}
                      <Controller
                        name={`participants.${index}.prize.title`}
                        control={control}
                        rules={{
                          required: {
                            value: !watch(
                              `participants.${index}.prize.otherTitleStatus`
                            ),
                            message: "Prize Title is required",
                          },
                        }}
                        render={({ field }) => (
                          <Dropdown
                            label="Prize Title"
                            options={Object.keys(titlePositionMap)}
                            selected={field.value || ""}
                            onChange={(val: any) => {
                              field.onChange(val);
                              setValue(
                                `participants.${index}.prize.position`,
                                ""
                              ); // Reset position
                            }}
                            disabled={watch(
                              `participants.${index}.prize.otherTitleStatus`
                            )}
                            required
                            error={
                              !!(errors.participants as any)?.[index]?.prize
                                ?.title
                            }
                            helperText={
                              (errors.participants as any)?.[index]?.prize
                                ?.title?.message
                            }
                            width="full"
                          />
                        )}
                      />
                      {/* Checkbox for Custom Prize (Other) */}
                      <Controller
                        name={`participants.${index}.prize.otherTitleStatus`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              id={`otherTitleStatus-${index}`} // ✅ Make ID unique per participant
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);

                                // Reset prize fields
                                setValue(
                                  `participants.${index}.prize.title`,
                                  ""
                                );
                                setValue(
                                  `participants.${index}.prize.position`,
                                  ""
                                );
                                setValue(
                                  `participants.${index}.prize.otherTitle`,
                                  ""
                                );
                              }}
                            />
                            <label
                              htmlFor={`otherTitleStatus-${index}`} // ✅ Match the dynamic ID
                              className="text-md ml-2 cursor-pointer text-gray-800"
                            >
                              Other title
                            </label>
                          </div>
                        )}
                      />
                    </div>
                    {/* Prize Position */}
                    <Controller
                      name={`participants.${index}.prize.position`}
                      control={control}
                      rules={{
                        required: {
                          value: !watch(
                            `participants.${index}.prize.otherTitleStatus`
                          ),
                          message: "Prize position is required",
                        },
                      }}
                      render={({ field }) => {
                        const selectedTitle = watch(
                          `participants.${index}.prize.title`
                        );
                        const positionOptions =
                          titlePositionMap[selectedTitle] || [];

                        return (
                          <Dropdown
                            label="Prize Position"
                            options={positionOptions}
                            selected={field.value || ""}
                            onChange={field.onChange}
                            disabled={watch(
                              `participants.${index}.prize.otherTitleStatus`
                            )}
                            required
                            error={
                              !!(errors.participants as any)?.[index]?.prize
                                ?.position
                            }
                            helperText={
                              (errors.participants as any)?.[index]?.prize
                                ?.position?.message
                            }
                            width="full"
                          />
                        );
                      }}
                    />

                    {/* Custom Prize Title Input */}
                    {watch(`participants.${index}.prize.otherTitleStatus`) ? (
                      <Controller
                        name={`participants.${index}.prize.otherTitle`}
                        control={control}
                        rules={{
                          required: "Custom title is required in 'Other' mode",
                        }}
                        render={({ field }) => (
                          <Input
                            label="Other Prize Title"
                            value={field.value || ""}
                            onChange={field.onChange}
                            required
                            error={
                              !!(errors.participants as any)?.[index]?.prize
                                ?.otherTitle
                            }
                            helperText={
                              (errors.participants as any)?.[index]?.prize
                                ?.otherTitle?.message
                            }
                            width="full"
                          />
                        )}
                      />
                    ) : (
                      // Leave one column empty
                      <div />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* add new participant field */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddParticipant}
          >
            Add Participant
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
              <p>You want to delete this participant?</p>
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
                  onClick={confirmDeleteParticipant}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>

          {/* add tournament */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmModalOpen}
              disabled={loading}
            >
              Add Tournament
            </Button>
          </Box>

          {/* Hidden Submit Button */}
          <button type="submit" id="hiddenTournamentSubmit" hidden></button>

          {/* Confirm Submit Modal */}
          <Modal
            open={confirmModalOpen}
            onClose={handleConfirmModalClose}
            aria-labelledby="confirmadd-modal-title"
            aria-describedby="confirmadd-modal-description"
            className="flex items-center justify-center"
          >
            <Box className="w-[400px] h-max p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
              <p className="font-semibold mb-4 text-2xl">Are you sure?</p>
              <p className="mb-6 text-gray-600">
                You want to add this tournament?
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
                    <span>Adding tournament</span>
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

export default AddTournamentOrganizedByHca;
