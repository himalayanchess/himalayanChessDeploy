import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    nepaliDate: {
      type: String,
    },
    utcDate: {
      type: Date,
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    userRole: {
      type: String,
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
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },

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
