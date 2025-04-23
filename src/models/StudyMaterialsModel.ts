import mongoose from "mongoose";

const StudyMaterialSchema = new mongoose.Schema(
  {
    fileName: { type: String }, // Name of the file
    fileUrl: { type: String }, // URL of the uploaded file (S3, Cloudinary, etc.)
    fileType: { type: String }, // e.g., pdf, docx, mp4
    activeStatus: { type: Boolean, default: true }, // Whether the material is active or not

    uploadedBy: { type: String }, // Name or role of the uploader (e.g., "Admin", "Teacher")
    uploadedById: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Course",
    },
    courseName: { type: String },
  },
  { timestamps: true } // adds createdAt and updatedAt fields
);

const StudyMaterial =
  mongoose.models.StudyMaterial ||
  mongoose.model("StudyMaterial", StudyMaterialSchema);

export default StudyMaterial;
