import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  skillLevel: { type: String },
  syllabus: {
    type: [
      {
        chapter: { type: String, required: true }, // Chapter name
        subChapters: [
          {
            subChapter: { type: String, required: true }, // Sub-chapter name
          },
        ],
      },
    ],
    required: true,
  },
  nextCourseId: { type: Number, required: true }, // ID of the next course
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
