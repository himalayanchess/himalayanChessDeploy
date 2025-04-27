import mongoose from "mongoose";

// Define the LoginRecord schema
const LoginRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
    },
    branchName: {
      type: String,
    },
    branchId: {
      type: String,
    },
    isGlobalAdmin: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timeZone: {
      type: String,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Define the LoginRecord model
const LoginRecord =
  mongoose.models.LoginRecord ||
  mongoose.model("LoginRecord", LoginRecordSchema);

export default LoginRecord;
