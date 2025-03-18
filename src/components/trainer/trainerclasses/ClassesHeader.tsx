import React, { useState, useEffect } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Dropdown from "@/components/Dropdown";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Controller, useForm } from "react-hook-form";
import StudyMaterialModal from "@/popupModals/StudyMaterialModal";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ClassesHeader = ({
  selectedTodaysClass,
  setapplyToAllClicked,
  setapplyTopic,
}: any) => {
  // state variables
  const [studyMaterialModalOpen, setstudyMaterialModalOpen] = useState(false);

  // handle study material modal open
  function handleStudyMaterailModalOpen() {
    setstudyMaterialModalOpen(true);
  }

  // handle study material modal close
  function handleStudyMaterailModalClose() {
    setstudyMaterialModalOpen(false);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      selectedStudyTopic: "",
    },
  }); // Access form context

  async function onSubmit(data) {
    console.log(data);
    setapplyToAllClicked(true);
    setapplyTopic(data?.selectedStudyTopic);
  }

  return (
    <div className="flex flex-col ">
      {/* First Row */}
      <div className="flex  justify-between items-center mt-3 ">
        {/* Left Section: Date and Affiliation */}
        <div className="flex items-center space-x-3">
          <CalendarTodayIcon sx={{ fontSize: "3rem" }} />
          <span className="text-3xl">
            {dayjs(selectedTodaysClass?.nepaliDate)
              .tz("Asia/Kathmandu")
              .format("MMMM D, YYYY dddd")}
          </span>
          {selectedTodaysClass && (
            <div className="bg-blue-100 text-blue-800 w-max px-4 py-1 text-md rounded-full">
              {selectedTodaysClass?.affiliatedTo?.toLowerCase() == "hca"
                ? "HCA"
                : selectedTodaysClass?.projectName}
            </div>
          )}
        </div>

        {/* Right Section: Study materials */}
        {selectedTodaysClass && (
          <>
            <Button
              onClick={handleStudyMaterailModalOpen}
              variant="outlined"
              size="small"
              color="info"
              className="flex items-center "
            >
              <MenuBookIcon className="" sx={{ fontSize: "1.5rem" }} />
              <span className="ml-1 ">Study Materials</span>
            </Button>

            {/* study material modal */}
            <StudyMaterialModal
              studyMaterialModalOpen={studyMaterialModalOpen}
              handleStudyMaterailModalClose={handleStudyMaterailModalClose}
              selectedTodaysClass={selectedTodaysClass}
            />
          </>
        )}
      </div>
      {/* Second Row */}
      {selectedTodaysClass ? (
        <div className="second-row">
          <div className="flex gap-5 mt-5 ">
            {/* Batch Name */}
            <div className="flex flex-col items-start w-max py-2 px-3 border shadow-md rounded-lg ">
              <p className="text-xs text-gray-500">Batch Name</p>
              <span className="text-md font-semibold text-gray-700">
                {selectedTodaysClass?.batchName}
              </span>
            </div>

            {/* Start Time */}
            <div className="flex flex-col items-start w-max py-2 px-3 border shadow-md rounded-lg ">
              <p className="text-xs text-gray-500">From</p>
              <div className="flex items-center space-x-2">
                <ScheduleOutlinedIcon className="text-gray-600" />
                <span className="text-md font-semibold text-gray-800">
                  {dayjs(selectedTodaysClass?.startTime)
                    .tz("Asia/Kathmandu")
                    .format("hh:mm A")}
                </span>
              </div>
            </div>

            {/* End Time */}
            <div className="flex flex-col items-start w-max py-2 px-3 border shadow-md rounded-lg ">
              <p className="text-xs text-gray-500">To</p>
              <div className="flex items-center space-x-2">
                <ScheduleOutlinedIcon className="text-gray-600" />
                <span className="text-md font-semibold text-gray-800">
                  {dayjs(selectedTodaysClass?.endTime)
                    .tz("Asia/Kathmandu")
                    .format("hh:mm A")}
                </span>
              </div>
            </div>
            {/* Syllabus Dropdown */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-start flex-col ml-auto"
            >
              <h1 className="text-sm">Todays Study Topic</h1>
              <div className="main-dropdown flex items-start">
                <Controller
                  name="selectedStudyTopic" // Name of the field
                  control={control}
                  rules={{ required: "Study topic is required" }} // Validation rule
                  render={({ field }) => (
                    <Dropdown
                      options={["asd", "pih", "rt"]}
                      selected={field.value}
                      onChange={(value) => field.onChange(value)}
                      error={!!errors.selectedStudyTopic} // Pass error state
                      helperText={errors.selectedStudyTopic?.message} // Error message
                    />
                  )}
                />
                <Button
                  variant="contained"
                  color="info"
                  type="submit"
                  sx={{
                    marginLeft: "1rem",
                    marginTop: "0.2rem",
                    paddingBlock: ".4rem",
                  }}
                >
                  <ChecklistRtlIcon />
                  <span className="ml-1 font-medium">Apply to all</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        "no"
      )}
    </div>
  );
};

export default ClassesHeader;
