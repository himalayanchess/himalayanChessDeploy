import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true }, // Name of the batch
    affiliatedTo: { type: String },
    projectId: { type: mongoose.Schema.Types.Mixed, ref: "Project" }, // Accepts any type
    projectName: { type: String }, // Project name fetched from the Project model
    completedStatus: { type: String, enum: ["Ongoing", "Completed"] },
    batchStartDate: { type: String, required: true }, // Start date of the batch
    batchEndDate: { type: String }, // End date of the batch
    activeStatus: { type: Boolean, default: true }, // Active status of the batch
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model("Batch", BatchSchema);

export default Batch;
