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
import { Trophy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranches } from "@/redux/allListSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const AddHcaCircuitTournament = () => {
  const router = useRouter();
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);

  // dispatch
  const dispatch = useDispatch<any>();

  // use selector
  const { allActiveBranchesList } = useSelector(
    (state: any) => state.allListReducer
  );

  const [selectedBranch, setselectedBranch] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      tag: "hcacircuit",

      startDate: "",
      endDate: "",
      //   year: "",

      branchName: "",
      branchId: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/tournaments/hcacircuit/addhcacircuittournament",
        {
          ...data,
        }
      );
      if (response.statusCode === 200) {
        notify(response.msg, response.statusCode);
        handleConfirmModalClose();
        setTimeout(() => {
          router.push(
            `/${session?.data?.user?.role?.toLowerCase()}/tournaments/hcacircuit`
          );
        }, 50);
      } else {
        notify(response.msg, response.statusCode);
      }
    } catch (error) {
      console.error("Error submitting hca circuit  tournament:", error);
      notify("Failed to submit hca circuit tournament", 500);
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
    let branchName = "";
    if (!isSuperOrGlobalAdmin) {
      setValue("branchName", user?.branchName);
      setValue("branchId", user?.branchId);
      branchName = user?.branchName;
    }
    setselectedBranch(branchName);
  }, [session?.data?.user]);

  // get initial data
  useEffect(() => {
    // dispatch(getAllStudents());
    dispatch(getAllBranches());
  }, []);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex w-full flex-col h-full overflow-hidden bg-white px-10 py-5 rounded-md shadow-md">
        <div className="heading flex items-center gap-4">
          <div className="header w-full flex items-end justify-between">
            <h1 className="w-max mr-auto text-2xl flex items-center font-bold">
              <Trophy />
              <span className="ml-2">Add HCA Circuit Tournament</span>
            </h1>
            <div className="buttons flex gap-4">
              <Link
                href={`/${session?.data?.user?.role?.toLowerCase()}/tournaments/hcacircuit`}
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
            <div className="col-span-2">
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
            </div>

            {/* start-end-date */}
            <div className="date-time grid grid-cols-2 gap-4 items-start">
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

            {/* branch type */}
            <div className="grid grid-cols-1 gap-4">
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
            </div>
          </div>

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

export default AddHcaCircuitTournament;
