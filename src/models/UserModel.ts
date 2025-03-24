import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Trainer", "Admin", "Superadmin"],
    },
    name: {
      type: String,
      unique: true,
    },
    dob: { type: Date },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },

    joinedDate: { type: Date },
    endDate: { type: Date },
    phone: {
      type: Number,
      //   required: [true, "Please provide phone no."],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    completedStatus: {
      type: String,
      enum: ["Ongoing", "Left"],
    },

    title: {
      type: String,
    },
    fideId: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },

    emergencyContactName: { type: String },
    emergencyContactNo: { type: Number },

    activeStatus: {
      type: Boolean,
      default: true,
    },
    // add later when login
    loginLogRecord: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Define the User model (with capitalization)
const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
