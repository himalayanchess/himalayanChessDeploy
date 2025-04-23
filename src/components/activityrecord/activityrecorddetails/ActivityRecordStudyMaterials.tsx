import StudyMaterialListComponent from "@/components/StudyMaterialListComponent";
import React from "react";

const ActivityRecordStudyMaterials = ({ activityRecord }: any) => {
  return (
    <div className="w-full mt-2">
      <p className="font-bold text-xs text-gray-500">Study Materials:</p>
      {activityRecord?.classStudyMaterials?.length == 0 ? (
        <p className="text-sm">Study materials not available</p>
      ) : (
        <div className="mt-3 w-full">
          <StudyMaterialListComponent
            studyMaterials={activityRecord?.classStudyMaterials}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityRecordStudyMaterials;
