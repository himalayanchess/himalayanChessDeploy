import React from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Button } from "@mui/material";

const StudyMaterialListComponent = ({ studyMaterials }: any) => {
  console.log("study material", studyMaterials);

  return (
    <div className="w-full grid grid-cols-3 gap-5">
      {studyMaterials?.map((studyMaterial: any, index: any) => {
        return (
          <a
            href={studyMaterial?.fileUrl}
            target="_blank"
            key={studyMaterial?.fileName}
            className="p-2 flex justify-between items-between bg-blue-50 rounded-md cursor-pointer transition-all ease duration hover:bg-blue-100"
          >
            <div className="title-type w-full flex justify-between items-center">
              {/* title */}
              <div>
                <InsertDriveFileOutlinedIcon sx={{ fontSize: "1.6rem" }} />
                <span className="ml-2 text-sm">{studyMaterial?.fileName}</span>
              </div>
              {/* type */}
              <p className="text-xs px-2 py-1 rounded-full font-bold bg-gray-400 text-white">
                {studyMaterial?.fileType}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default StudyMaterialListComponent;
