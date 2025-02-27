import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true },
    skillLevel: { type: String, required: true },
    activeStatus: { type: Boolean, default: true },
    syllabus: {
      type: [
        {
          chapterName: { type: String, required: true }, // Chapter name
          subChapters: [
            {
              subChapter: { type: String, required: true }, // Sub-chapter name
            },
          ],
        },
      ],
      default: [],
    },
    nextCourseName: { type: String },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
