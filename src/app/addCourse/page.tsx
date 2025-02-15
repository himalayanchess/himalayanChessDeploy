"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const Select = dynamic(() => import("react-select"), { ssr: false });

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    name: "",
    duration: "",
    syllabus: [{ chapter: "", subChapters: [{ subChapter: "" }] }],
    nextCourseId: "None",
  });
  const courseOptions = [
    { value: "None", label: "None" },
    { value: 1, label: "JavaScript for Beginners" },
    { value: 2, label: "React Basics" },
    { value: 3, label: "Advanced React" },
    { value: 4, label: "Node.js and Express" },
  ];

  const handleChapterChange = (index, value) => {
    const updatedSyllabus = [...courseData.syllabus];
    updatedSyllabus[index].chapter = value;
    setCourseData({ ...courseData, syllabus: updatedSyllabus });
  };

  const handleSubChapterChange = (chapterIndex, subChapterIndex, value) => {
    const updatedSyllabus = [...courseData.syllabus];
    updatedSyllabus[chapterIndex].subChapters[subChapterIndex].subChapter =
      value;
    setCourseData({ ...courseData, syllabus: updatedSyllabus });
  };

  const addChapter = () => {
    const newSyllabus = [
      ...courseData.syllabus,
      { chapter: "", subChapters: [{ subChapter: "" }] },
    ];
    setCourseData({ ...courseData, syllabus: newSyllabus });
  };

  const removeChapter = (index) => {
    const newSyllabus = courseData.syllabus.filter((_, i) => i !== index);
    setCourseData({ ...courseData, syllabus: newSyllabus });
  };

  const addSubChapter = (chapterIndex) => {
    const updatedSyllabus = [...courseData.syllabus];
    updatedSyllabus[chapterIndex].subChapters.push({ subChapter: "" });
    setCourseData({ ...courseData, syllabus: updatedSyllabus });
  };

  const removeSubChapter = (chapterIndex, subChapterIndex) => {
    const updatedSyllabus = [...courseData.syllabus];
    updatedSyllabus[chapterIndex].subChapters = updatedSyllabus[
      chapterIndex
    ].subChapters.filter((_, i) => i !== subChapterIndex);
    setCourseData({ ...courseData, syllabus: updatedSyllabus });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(courseData);

    const { data: resData } = await axios.post(
      "api/courses/addNewCourse",
      courseData
    );
    console.log(resData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Add Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Course Name
            </label>
            <input
              type="text"
              value={courseData.name}
              onChange={(e) =>
                setCourseData({ ...courseData, name: e.target.value })
              }
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Course Duration (weeks)
            </label>
            <input
              type="text"
              value={courseData.duration}
              onChange={(e) =>
                setCourseData({ ...courseData, duration: e.target.value })
              }
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* React Select Dropdown for Next Course */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Next Course
            </label>
            <Select
              options={courseOptions}
              value={courseOptions.find(
                (course) => course.value === courseData.nextCourseId
              )}
              onChange={(selectedOption) =>
                setCourseData({
                  ...courseData,
                  nextCourseId: selectedOption.value,
                })
              }
              className="mt-2"
              placeholder="Select Next Course"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-700">Syllabus</h3>

          {courseData.syllabus.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-600">
                  Chapter {chapterIndex + 1}
                </label>
                <input
                  type="text"
                  value={chapter.chapter}
                  onChange={(e) =>
                    handleChapterChange(chapterIndex, e.target.value)
                  }
                  placeholder="Chapter Title"
                  className="w-4/5 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeChapter(chapterIndex)}
                  className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  del
                </button>
              </div>

              {/* Subchapters */}
              {chapter.subChapters.map((subChapter, subChapterIndex) => (
                <div
                  key={subChapterIndex}
                  className="flex items-center space-x-4 mt-4"
                >
                  <label className="text-sm font-medium text-gray-600">
                    Sub-chapter {chapterIndex + 1}.{subChapterIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={subChapter.subChapter}
                    onChange={(e) =>
                      handleSubChapterChange(
                        chapterIndex,
                        subChapterIndex,
                        e.target.value
                      )
                    }
                    placeholder="Sub-chapter Title"
                    className="w-4/5 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeSubChapter(chapterIndex, subChapterIndex)
                    }
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    del
                  </button>
                </div>
              ))}

              {/* Add Sub-chapter Button */}
              <button
                type="button"
                onClick={() => addSubChapter(chapterIndex)}
                className="flex items-center space-x-2 mt-2 text-blue-600 hover:text-blue-800"
              >
                add
                <span>Add Sub-chapter</span>
              </button>
            </div>
          ))}

          {/* Add Chapter Button */}
          <button
            type="button"
            onClick={addChapter}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            add
            <span>Add Chapter</span>
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
          >
            Submit Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
