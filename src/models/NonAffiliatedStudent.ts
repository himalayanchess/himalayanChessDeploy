import mongoose from "mongoose";

const NonAffiliatedStudentSchema = new mongoose.Schema(
  {
    name: { type: String }, // Name of the student
    dob: { type: String }, // Date of birth of the student
    gender: { type: String }, // Gender of the student
    joinedDate: { type: String }, // Date when the student joined
    endDate: { type: String }, // End date of the student's association
    batchId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Batch",
      //   required: true,
    }, // Reference to the Batch model
    projectId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Project",
    }, // Can be ObjectId or String (empty string)
    title: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    fideId: { type: Number }, // FIDE ID of the student
    completedStatus: {
      type: String,
      enum: ["Ongoing", "Left"],
    },
    eventsPlayed: [{ type: String }], // Array of events played by the student
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NonAffiliatedStudent =
  mongoose.models?.NonAffiliatedStudent ||
  mongoose.model("NonAffiliatedStudent", NonAffiliatedStudentSchema);

export default NonAffiliatedStudent;
