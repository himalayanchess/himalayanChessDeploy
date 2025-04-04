import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const ProjectTimeSlots = ({ projectRecord }: any) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (projectRecord) {
      setLoaded(true);
    }
  }, [projectRecord]);

  if (!loaded) return <div></div>;

  return (
    <div className="flex-1 overflow-y-auto h-max">
      {/* Time Slots */}
      <h3 className="font-bold text-sm text-gray-500 mb-2">Time Slots</h3>

      {projectRecord?.timeSlots?.length === 0 ? (
        <p className="text-gray-500">No time slots available</p>
      ) : (
        <div className="overflow-y-auto w-full mt-2 border flex-1 flex flex-col bg-white rounded-lg">
          {/* Table Headings */}
          <div className="table-headings mb-2 grid grid-cols-[70px,1fr,1fr,1fr] w-full bg-gray-200">
            <span className="py-3 text-center text-sm font-bold text-gray-600">
              SN
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              Day
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              From Time
            </span>
            <span className="py-3 text-left text-sm font-bold text-gray-600">
              To Time
            </span>
          </div>

          {/* Time Slot List */}
          <div className="table-contents flex-1 grid grid-cols-1">
            {projectRecord?.timeSlots?.map((slot: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-[70px,1fr,1fr,1fr] border-b border-gray-200 py-3 items-center transition-all duration-150 hover:bg-gray-100"
              >
                <span className="text-sm text-center font-medium text-gray-600">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">
                  {slot?.day || "N/A"}
                </span>
                <span className="text-sm text-gray-700">
                  {slot?.fromTime || "N/A"}
                </span>
                <span className="text-sm text-gray-700">
                  {slot?.toTime || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeSlots;
