import { DATE_TIME_VALIDATION_PROP_NAMES } from "@mui/x-date-pickers/validation/extractValidationProps";
import mongoose from "mongoose";

const HcaAffiliatedStudentSchema = new mongoose.Schema(
  {
    // DATES ARE STORED IN UTC FORMAT
    // IN FRONT END USE dayjs(dob).tz("Asia/kathmandu").format()
    affiliatedTo: { type: String, enum: ["HCA", "School"] },
    name: { type: String }, // Name of the student
    dob: { type: Date }, // Date of birth of the student
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
    joinedDate: { type: Date }, // Date when the student joined
    endDate: { type: Date }, // End date of the student's association
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
          startDate: { type: Date },
          endDate: { type: Date },
          activeStatus: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    lichessUsername: { type: String, default: "" },
    lichessUrl: { type: String, default: "" },
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },

    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HcaAffiliatedStudent =
  mongoose.models?.HcaAffiliatedStudent ||
  mongoose.model("HcaAffiliatedStudent", HcaAffiliatedStudentSchema);

export default HcaAffiliatedStudent;
