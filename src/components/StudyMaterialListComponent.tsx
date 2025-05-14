import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const StudyMaterialListComponent = ({ studyMaterials }: any) => {
  return (
    <div className="">
      <div className="table-headings  mb-2 grid grid-cols-[70px,repeat(5,1fr)] w-full bg-gray-200">
        <span className="py-3 text-center text-sm font-bold text-gray-600">
          SN
        </span>
        <span className="py-3 text-left col-span-2 text-sm font-bold text-gray-600">
          Name
        </span>
        <span className="py-3 text-left text-sm font-bold text-gray-600">
          Type
        </span>
        <span className="py-3 col-span-2 text-left text-sm font-bold text-gray-600">
          Course
        </span>
      </div>
      <div className="table-contents flex-1 grid grid-cols-1 grid-rows-7">
        {studyMaterials.map((studyMaterial: any, index: any) => {
          return (
            <div
              key={`${studyMaterial?.fileName}_${index}`}
              className="py-3 grid grid-cols-[70px,repeat(5,1fr)] border-b  border-gray-200 py-1 items-center cursor-pointer transition-all ease duration-150 hover:bg-gray-100"
            >
              <span className="text-sm text-center font-medium text-gray-600">
                {index + 1}
              </span>
              <Link
                title="View"
                target="_blank"
                href={`${studyMaterial?.fileUrl}`}
                className="text-left col-span-2 text-sm font-medium text-gray-600 hover:underline hover:text-blue-500"
              >
                {studyMaterial?.fileType?.toLowerCase() == "image" ? (
                  <ImageOutlinedIcon
                    className=" text-gray-500"
                    fontSize="small"
                  />
                ) : studyMaterial?.fileType?.toLowerCase() === "pdf" ? (
                  <PictureAsPdfOutlinedIcon
                    className=" text-gray-500"
                    fontSize="small"
                  />
                ) : (
                  <InsertDriveFileOutlinedIcon
                    className=" text-gray-500"
                    fontSize="small"
                  />
                )}
                <span className="ml-2">{studyMaterial?.fileName}</span>
              </Link>
              <span className="text-sm text-gray-700">
                {studyMaterial?.fileType || "N/A"}
              </span>

              <span className="text-sm col-span-2 text-gray-700">
                {studyMaterial?.courseName || "N/A"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyMaterialListComponent;
