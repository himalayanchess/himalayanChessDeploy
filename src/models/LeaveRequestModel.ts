import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    nepaliDate: {
      type: String,
    },
    utcDate: {
      type: Date,
    },
    trainerName: {
      type: String,
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    fromDate: {
      type: Date,
    },
    fromDay: {
      type: String,
    },
    toDate: {
      type: Date,
    },
    toDay: {
      type: String,
    },
    leaveDurationDays: {
      type: Number,
    },
    leaveSubject: {
      type: String,
    },
    leaveReason: {
      type: String,
    },
    supportReasonFileUrl: {
      type: String,
    },
    affectedClasses: [
      {
        affectedClassName: {
          type: String,
        },
      },
    ],
    isResponded: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Define the LeaveRequest model (with capitalization)
const LeaveRequest =
  mongoose.models?.LeaveRequest ||
  mongoose.model("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
