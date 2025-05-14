import StudyMaterialListComponent from "@/components/StudyMaterialListComponent";
import { Ban } from "lucide-react";
import React from "react";

const ActivityRecordStudyMaterials = ({ activityRecord }: any) => {
  return (
    <div className="w-full mt-2">
      <p className="font-bold text-md text-gray-500">Study Materials:</p>
      {activityRecord?.classStudyMaterials?.length == 0 ? (
        <p className="w-full py-4 flex items-center justify-center">
          <Ban />
          <span className="ml-2">No records found</span>
        </p>
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
