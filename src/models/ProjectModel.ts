import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    contractType: {
      type: String,
      enum: ["Academy", "School", "Others"],
      // required: true,
    },
    name: { type: String }, // School name
    primaryContact: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    startDate: { type: String },
    duration: {
      type: Number,
    },
    address: { type: String },
    completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
    location: { type: String }, // School address
    contractPaper: { type: String }, // File URL for contract
    contractDriveLink: { type: String },
    assignedTrainers: [
      {
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        trainerName: { type: String },
        trainerRole: { type: String, enum: ["Primary", "Substitute"] }, // Track trainer type
      },
    ],
    timeSlots: [
      {
        day: { type: String }, // e.g., "Monday"
        fromTime: { type: String }, // e.g., "10:00 AM - 12:00 PM"
        toTime: { type: String }, // e.g., "10:00 AM - 12:00 PM"
      },
    ],
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
