import mongoose from "mongoose";

const ActivityRecordSchema = new mongoose.Schema(
  {
    affiliatedTo: {
      type: String,
    },
    date: {
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
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Batch",
      required: true,
    },
    trainerName: {
      type: String,
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Course",
      required: true,
    },
    holidayStatus: { type: Boolean },
    holidayDescription: { type: String },
    arrivalTime: { type: Date },
    departureTime: { type: Date },
    studentRecords: {
      type: Array,
    },
    trainerPresentStatus: {
      type: String,
      enum: ["present", "absent", "holiday"],
    },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Define the ActivityRecord model (with capitalization)
const ActivityRecord =
  mongoose.models?.ActivityRecord ||
  mongoose.model("ActivityRecord", ActivityRecordSchema);

export default ActivityRecord;
