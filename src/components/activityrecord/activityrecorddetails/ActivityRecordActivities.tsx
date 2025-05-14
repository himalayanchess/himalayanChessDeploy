import StudentRecordComponent from "@/components/trainer/trainerhistory/StudentRecordComponent";
import React from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const ActivityRecordActivities = ({ activityRecord }: any) => {
  return (
    <div className="w-full">
      <div className="">
        <p className="font-bold text-md text-gray-500 mb-2">
          Student activityRecords:
        </p>
        {activityRecord?.studentRecords?.length == 0 ? (
          <div className="flex-1 flex items-center text-gray-500 w-max mx-auto my-3">
            <SearchOffIcon className="mr-1" sx={{ fontSize: "1.5rem" }} />
            <p className="text-md">No records found</p>
          </div>
        ) : (
          <StudentRecordComponent
            studentRecords={activityRecord?.studentRecords}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityRecordActivities;
