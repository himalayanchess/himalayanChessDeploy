import mongoose from "mongoose";

const ActivityRecordSchema = new mongoose.Schema(
  {
    affiliatedTo: {
      type: String,
    },
    nepaliDate: {
      type: String,
    },
    utcDate: {
      type: Date,
    },
    weekNumber: {
      type: Number,
    },
    weekStartDate: {
      type: Date,
    },
    weekEndDate: {
      type: Date,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    // project may or may not be present depending on affilatedTo
    projectName: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Project",
    },
    batchName: {
      type: String,
    },
    batchId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Batch",
    },
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },
    trainerName: {
      type: String,
    },
    trainerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    courseName: {
      type: String,
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Course",
    },
    trainerRole: {
      type: String,
      enum: ["Primary", "Substitute"],
      default: "Primary",
    },
    mainStudyTopic: { type: String, default: "" },
    holidayStatus: { type: Boolean },
    holidayDescription: { type: String },
    assignedByName: { type: String },
    assignedById: { type: mongoose.Schema.Types.Mixed, ref: "User" },
    studentRecords: {
      type: Array,
    },
    userPresentStatus: {
      type: String,
      enum: ["present", "absent", "holiday"],
    },
    activeStatus: { type: Boolean, default: true },
    recordUpdatedByTrainer: { type: Boolean, default: false },
    studyMaterials: {
      type: Array,
      default: [],
    },

    // working one
    classStudyMaterials: {
      type: Array,
      default: [],
    },
    isPlayDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Define the ActivityRecord model (with capitalization)
const ActivityRecord =
  mongoose.models?.ActivityRecord ||
  mongoose.model("ActivityRecord", ActivityRecordSchema);

export default ActivityRecord;
