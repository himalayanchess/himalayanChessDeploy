import mongoose from "mongoose";

const HcaAffiliatedStudentSchema = new mongoose.Schema(
  {
    affiliatedTo: { type: String, enum: ["HCA", "School"] },
    name: { type: String }, // Name of the student
    dob: { type: String }, // Date of birth of the student
    gender: { type: String }, // Gender of the student
    educationalInstitute: { type: String },
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
    address: { type: String }, // End date of the student's association
    phone: { type: Number }, // End date of the student's association
    completedStatus: {
      type: String,
      enum: ["Ongoing", "Left"],
    },
    title: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    fideId: { type: Number }, // FIDE ID of the student
    guardianInfo: { type: Object },
    emergencyContactName: { type: String },
    emergencyContactNo: { type: Number },
    eventsPlayed: { type: Array, default: [] }, // Array of events played by the student
    enrolledCourses: {
      type: [
        {
          course: { type: String },
          courseId: { type: mongoose.Schema.Types.Mixed, ref: "Course" },
          completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
          activeStatus: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    history: { type: Array, default: [] },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HcaAffiliatedStudent =
  mongoose.models?.HcaAffiliatedStudent ||
  mongoose.model("HcaAffiliatedStudent", HcaAffiliatedStudentSchema);

export default HcaAffiliatedStudent;
