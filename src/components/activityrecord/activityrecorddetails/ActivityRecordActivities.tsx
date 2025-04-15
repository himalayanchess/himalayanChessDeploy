import StudentRecordComponent from "@/components/trainer/trainerhistory/StudentRecordComponent";
import React from "react";

const ActivityRecordActivities = ({ activityRecord }: any) => {
  return (
    <div className="w-full">
      <div className="">
        <p className="font-bold text-xs text-gray-500 mb-2">
          Student activityRecords:
        </p>
        {activityRecord?.studentRecords?.length == 0 ? (
          <p className="text-sm">Record not available</p>
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
