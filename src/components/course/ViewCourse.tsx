import React from "react";

const ViewCourse = ({ course }) => {
  return (
    <>
      <div className="first">
        <h1 className="text-xl font-medium mb-3">{course?.name}</h1>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Level:</span>
          <span>{course?.skillLevel}</span>
        </p>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Duration:</span>
          <span>{course?.duration} (weeks)</span>
        </p>
        <p className="grid grid-cols-2 text-gray-500">
          <span className="font-bold mr-auto">Next Course:</span>
          <span>{course?.nextCourseName} </span>
        </p>
      </div>
    </>
  );
};

export default ViewCourse;
