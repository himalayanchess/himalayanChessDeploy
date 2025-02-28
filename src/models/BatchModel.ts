import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true }, // Name of the batch
    projectDetails: { type: Object },
    projectName: { type: String, required: true }, // Project name fetched from the Project model
    completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
    projectStartDate: { type: String, required: true }, // Start date of the project
    projectEndDate: { type: String }, // End date of the course
    activeStatus: { type: Boolean, default: true }, // Active status of the batch
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", BatchSchema);

export default Batch;
