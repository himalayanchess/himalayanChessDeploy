import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      //   enum
      //   required: [true, "Please provide a title"],
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
      //   required: [true, "Please provide phone no."],
    },
    rating: {
      type: Number,
      default: 0,
    },
    joinedDate: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    skillLevel: {
      type: String,
    },
    fideId: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["Student", "Trainer", "Admin", "Superadmin"],
    },
    status: {
      type: String,
      enum: ["Ongoing", "Left"],
    },
    guardianInfo: {
      type: Object,
    },
    trainerTitle: {
      type: String,
      // enum
    },
    emergencyContact: {
      type: String,
    },
    emergencyContactName: {
      type: String,
    },
    enrolledCourses: {
      type: Array,
    },
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
