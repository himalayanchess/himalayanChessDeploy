import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    utcDate: {
      type: Date,
    },
    nepaliDate: {
      type: String,
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
    activeStatus: {
      type: Boolean,
      default: true,
    },
    userAttendance: [
      {
        userId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "User",
        },
        userName: { type: String },
        userRole: { type: String },
        status: {
          type: String,
          enum: ["present", "absent", "leave", "holiday"],
        },
      },
    ],
    updatedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "User",
        },
        userName: { type: String },
        userRole: { type: String },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
