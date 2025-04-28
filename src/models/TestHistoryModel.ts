import mongoose from "mongoose";

const TestHistorySchema = new mongoose.Schema(
  {
    affiliatedTo: { type: String },
    examUtcDate: { type: Date },
    examNepaliDate: { type: String },
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent", // Reference to the HCAAffiliatedStudent model
    },
    studentName: { type: String }, // Name of the student
    branchName: { type: String }, // Name of the branch
    branchId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Branch", // Reference to the Branch model
    },
    batchName: { type: String }, // Name of the batch
    batchId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Batch", // Reference to the Branch model
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Course", // Reference to the Course model (assuming it exists)
    },
    courseName: { type: String }, // Name of the course
    checkedById: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User", // Reference to the Course model (assuming it exists)
    },
    checkedByName: { type: String }, // Name of the course
    testMaterialUrl: { type: String },
    examTitle: { type: String }, // Title of the exam
    totalMarks: { type: Number }, // Pass marks for the exam
    passMarks: { type: Number }, // Pass marks for the exam
    obtainedScore: { type: Number }, // Total score in the exam
    resultStatus: {
      type: String,
      enum: ["Pass", "Below Pass Marks"],
    }, // Status of the exam
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const TestHistory =
  mongoose.models.TestHistory ||
  mongoose.model("TestHistory", TestHistorySchema);

export default TestHistory;
