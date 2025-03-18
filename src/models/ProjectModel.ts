import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    contractType: {
      type: String,
      // required: true,
    },
    name: { type: String }, // School name
    primaryContact: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    startDate: { type: String },
    endDate: { type: String },
    duration: {
      type: Number,
    },
    completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
    address: { type: String },
    mapLocation: { type: String }, // School address
    contractPaper: { type: String }, // File URL for contract
    contractDriveLink: { type: String },
    assignedTrainers: [
      {
        trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        trainerName: { type: String },
        trainerRole: { type: String, enum: ["Primary", "Secondary"] }, // Track trainer type
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
