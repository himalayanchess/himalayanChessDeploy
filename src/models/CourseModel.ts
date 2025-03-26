import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, default: 12 },
    affiliatedTo: { type: String, required: true },
    activeStatus: { type: Boolean, default: true },
    chapters: {
      type: [
        {
          chapterName: { type: String }, // Chapter name
          subChapters: { type: Array, default: [] },
          activeStatus: { type: Boolean, default: true },
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
