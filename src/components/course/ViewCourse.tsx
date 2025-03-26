import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import DownloadIcon from "@mui/icons-material/Download";

import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import Link from "next/link";
import { exportCourseToExcel } from "@/helpers/exportToExcel/exportCourseToExcel";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewCourse = ({ courseRecord }: any) => {
  console.log(courseRecord);

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold">Course Details</h1>

        <Button
          variant="contained"
          color="success"
          onClick={() => exportCourseToExcel(courseRecord)}
          className="bg-blue-500 text-white rounded-md mb-4"
        >
          <DownloadIcon fontSize="small" />
          <span className="ml-2">Download Excel</span>
        </Button>
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className="space-y-4 h-full mt-4 flex flex-col overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {/* Basic Course Information */}
          <div>
            <p className="font-bold text-xs text-gray-500">Course Name:</p>
            <p>{courseRecord?.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Affiliated to:</p>
            <p>{courseRecord?.affiliatedTo || "N/A"}</p>
          </div>

          <div>
            <p className="font-bold text-xs text-gray-500">Duration:</p>
            <p>{courseRecord?.duration || "N/A"} (weeks)</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Next course:</p>
            <p>{courseRecord?.nextCourseName || "N/A"}</p>
          </div>

          <table className="col-span-3 mt-3 table-auto border border-collapse ">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 border-b text-center">SN</th>
                <th className="py-2 border-b text-left">Chapter Name</th>
                <th className="py-2 border-b text-left">Sub Chapters</th>
              </tr>
            </thead>
            <tbody>
              {courseRecord?.chapters?.map(
                (chapter: any, chapterIndex: any) => (
                  <tr
                    key={chapterIndex}
                    className="border-b transition-all ease duration-150 hover:bg-gray-100"
                  >
                    <td className="py-2 text-center">{chapterIndex + 1}</td>
                    <td className="py-2 text-md font-semibold text-gray-700">
                      {chapter.chapterName}
                    </td>
                    <td className="py-2">
                      <ul className="list-disc pl-6">
                        {chapter.subChapters?.map(
                          (subChapter: any, subChapterIndex: any) => (
                            <li
                              key={subChapterIndex}
                              className="text-gray-600 py-1"
                            >
                              {subChapter}
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
