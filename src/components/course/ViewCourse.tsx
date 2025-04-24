import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import DownloadIcon from "@mui/icons-material/Download";
import utc from "dayjs/plugin/utc";
import { Button, Divider } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { CircleArrowRight, Book, BookCopy, Edit } from "lucide-react";

import Link from "next/link";
import { exportCourseToExcel } from "@/helpers/exportToExcel/exportCourseToExcel";
import { useSession } from "next-auth/react";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = "Asia/Kathmandu";

const ViewCourse = ({ courseRecord }: any) => {
  // console.log(courseRecord);
  const session = useSession();
  const isSuperOrGlobalAdmin =
    session?.data?.user?.role?.toLowerCase() === "superadmin" ||
    (session?.data?.user?.role?.toLowerCase() === "admin" &&
      session?.data?.user?.isGlobalAdmin);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (courseRecord) {
      setLoaded(true);
    }
  }, [courseRecord]);

  if (!loaded)
    return (
      <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-14 py-7"></div>
    );

  return (
    <div className="bg-white rounded-md shadow-md flex-1 h-full flex flex-col w-full px-7 py-5">
      <div className="header flex items-end justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <BookCopy />
          <span className="ml-2 mr-3">Course Details</span>
          {isSuperOrGlobalAdmin && (
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/courses/updatecourse/${
                courseRecord?._id
              }`}
            >
              <Button variant="text" size="small">
                <Edit />
                <span className="ml-1">Edit</span>
              </Button>
            </Link>
          )}
        </h1>

        <div className="buttons flex gap-4">
          {/* home button */}
          <Link href={`/${session?.data?.user?.role?.toLowerCase()}/courses`}>
            <Button
              className="homebutton"
              color="inherit"
              sx={{ color: "gray" }}
            >
              <HomeOutlinedIcon />
              <span className="ml-1">Home</span>
            </Button>
          </Link>

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
      </div>

      {/* divider */}
      <Divider style={{ margin: ".7rem 0" }} />

      <div className=" h-full  flex flex-col overflow-y-auto">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-2">
            {/* name */}
            <div className="col-span-3">
              <p className="text-xs text-gray-500">Name</p>
              <div className="name-role flex justify-between items-start">
                {/* name */}
                <div className="detail flex items-center">
                  <Book className="text-gray-500" />
                  <p className="font-bold ml-1 text-xl">
                    {courseRecord?.name || "N/A"}
                  </p>
                </div>
              </div>
              {/* role */}
            </div>
            {/* affiliated to */}
            <div>
              <p className="text-xs text-gray-500">Affilaited to</p>
              <div className="detail flex items-center">
                {/* <EventOutlinedIcon sx={{ color: "gray " }} /> */}
                <p className="font-medium ml-1">
                  {courseRecord?.affiliatedTo || "N/A"}
                </p>
              </div>
            </div>
            {/* Duration */}
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <div className="detail flex items-center">
                <HistoryIcon sx={{ color: "gray " }} />
                <p className="font-medium ml-1">
                  {courseRecord?.duration || "N/A"} weeks
                </p>
              </div>
            </div>
            {/* Next course */}
            <div>
              <p className="text-xs text-gray-500">Next course</p>
              <div className="detail flex items-center">
                <CircleArrowRight className="text-gray-500" />
                <p className="font-medium ml-1">
                  {courseRecord?.nextCourseName || "N/A"}
                </p>
              </div>
            </div>
          </div>
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
            {courseRecord?.chapters?.map((chapter: any, chapterIndex: any) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCourse;
