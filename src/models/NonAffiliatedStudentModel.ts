import mongoose from "mongoose";

const NonAffiliatedStudentSchema = new mongoose.Schema(
  {
    affiliatedTo: { type: String, enum: ["HCA", "School"] },
    name: { type: String }, // Name of the student
    dob: { type: String }, // Date of birth of the student
    gender: { type: String }, // Gender of the student
    batches: {
      type: [
        {
          batchId: { type: mongoose.Schema.Types.Mixed, ref: "Batch" },
          batchName: { type: String },
          startDate: { type: Date },
          endDate: { type: Date },
          activeStatus: { type: Boolean, default: true }, // delete status
        },
      ],
    },
    joinedDate: { type: String }, // Date when the student joined
    endDate: { type: String }, // End date of the student's association
    projectId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Project",
    }, // Can be ObjectId or String (empty string)
    projectName: { type: String },
    completedStatus: {
      type: String,
      enum: ["Ongoing", "Left"],
    },
    title: {
      type: String,
    },
    fideId: { type: Number }, // FIDE ID of the student
    rating: {
      type: Number,
      default: 0,
    },
    eventsPlayed: { type: Array, default: [] }, // Array of events played by the student
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NonAffiliatedStudent =
  mongoose.models?.NonAffiliatedStudent ||
  mongoose.model("NonAffiliatedStudent", NonAffiliatedStudentSchema);

export default NonAffiliatedStudent;
