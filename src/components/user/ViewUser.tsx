import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
const ViewUser = ({ user }: any) => {
  return (
    <>
      {/* first */}
      <div className="first">
        <p className="bg-gray-400 text-white w-max text-xs py-1 px-4 font-bold  rounded-full">
          {user?.role}
        </p>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <div className="basic-info">
          {/* email */}
          <div className="email flex items-center">
            <MailOutlineIcon className="mr-1.5" sx={{ color: "gray" }} />
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
          {/* phone */}
          {user?.phone && (
            <div className="email flex items-center">
              <LocalPhoneIcon className="mr-1.5" sx={{ color: "gray" }} />
              <span className="text-sm text-gray-500">{user?.phone}</span>
            </div>
          )}
        </div>
      </div>
      {/* temp empty grid col */}
      <div></div>
      {/* second */}
      <div className="basic-details second ">
        {/* dob */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Date of Birth:</span>
          <span>{user?.dob}</span>
        </p>
        {/* address */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Address:</span>
          <span>{user?.address}</span>
        </p>
        {/* gender */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Gender:</span>
          <span>{user?.gender}</span>
        </p>
        {/* joined Date */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Joined Date:</span>
          <span>{user?.joinedDate}</span>
        </p>
        {/* Active Status */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Active Status:</span>
          <span>{user?.activeStatus ? "Active" : "Inactive"}</span>
        </p>
      </div>

      {/*  guardian third */}
      {user?.guardianInfo && user?.role.toLowerCase() == "student" && (
        <div className="gurardian-info">
          {/* guardian name */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Guardian Name:</span>
            <span>{user?.guardianInfo?.name}</span>
          </p>
          {/* guardian email */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Guardian Email:</span>
            <span>{user?.guardianInfo?.email}</span>
          </p>
          {/* guardian phone */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Guardian Phone:</span>
            <span>{user?.guardianInfo?.phone}</span>
          </p>
        </div>
      )}
      {/*  chess info fourth (students) */}
      {user?.role.toLowerCase() == "student" && (
        <div className="chess-info ">
          {/* FIDE ID */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">FIDE ID:</span>
            <span>{user?.fideId}</span>
          </p>
          {/* title */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Title:</span>
            <span>{user?.title}</span>
          </p>
          {/* Skill level */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Skill level:</span>
            <span>{user?.skillLevel}</span>
          </p>
          {/* Rating */}
          <p className="grid grid-cols-2 text-gray-500">
            <span className="font-bold mr-auto">Rating:</span>
            <span>{user?.rating}</span>
          </p>
        </div>
      )}
      {/*  emergency fifth */}
      <div className="emergency-info">
        {/* Emergency contanct name */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Emergency Contact:</span>
          <span>{user?.emergencyContactName}</span>
        </p>
        {/* emeergency contact */}
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Emergency No:</span>
          <span>{user?.emergencyContact}</span>
        </p>
      </div>
      {/*  enrolled courses sixth */}
      {user?.role.toLowerCase() == "student" && (
        <div className="enrolled-courses col-span-2">
          <p className="text-gray-500 font-bold">Enrolled Courses</p>
          {user?.enrolledCourses.length == 0 ? (
            <p className="text-gray-500">No courses</p>
          ) : (
            user?.enrolledCourses.map((course: any, i: any) => {
              return (
                <div key={`course${i}`} className=" text-gray-500">
                  <span>{course.course}</span>
                  <span className="ml-2">
                    {"("}
                    {course.status}
                    {")"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default ViewUser;
