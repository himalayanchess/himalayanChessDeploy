import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    branchName: { type: String }, // Name of the branch
    branchCode: { type: String }, // Unique code like BR001, KTM01
    address: {
      type: String,
    },
    country: { type: String, default: "Nepal" },
    establishedDate: { type: Date }, // When branch was established
    contactName: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    isMainBranch: { type: Boolean, default: false },
    affiliatedTo: { type: String, default: "HCA" },

    mapLocation: { type: String, default: "" },
    activeStatus: { type: Boolean, default: true }, // Is the branch active?
  },
  { timestamps: true }
);

const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);

export default Branch;
