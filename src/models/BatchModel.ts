import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true }, // Name of the batch
    affiliatedTo: { type: String },
    projectId: { type: mongoose.Schema.Types.Mixed, ref: "Project" }, // Accepts any type
    projectName: { type: String }, // Project name fetched from the Project model
    completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
    batchStartDate: { type: Date }, // Start date of the batch
    batchEndDate: { type: Date }, // End date of the batch

    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },
    branchName: { type: String, default: "" },
    totalNoOfClasses: { type: Number, default: 0 },
    totalClassesTaken: { type: Number, default: 0 },
    currentCourseId: { type: mongoose.Schema.Types.Mixed, ref: "Course" }, // Accepts any type
    currentCourseName: { type: String, default: "" },
    activeStatus: { type: Boolean, default: true }, // Active status of the batch
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", BatchSchema);

export default Batch;
