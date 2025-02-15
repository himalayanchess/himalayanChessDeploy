import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String }, // School name
  primaryContact: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  contractType: {
    type: String,
    enum: ["Academy", "School", "Others"],
    // required: true,
  },
  contractTo: { type: String },
  joinedDate: { type: String },
  contractPaper: { type: String }, // File URL for contract
  location: { type: String }, // School address
  assignedTrainers: [
    {
      trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      trainerName: { type: String },
      role: { type: String, enum: ["Primary", "Substitute"] }, // Track trainer type
    },
  ],
  timeSlots: [
    {
      day: { type: String }, // e.g., "Monday"
      time: { type: String }, // e.g., "10:00 AM - 12:00 PM"
      durationInWeeks: { type: Number },
    },
  ],

  attendance: [
    {
      trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date }, // Date of visit
    },
  ],
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
