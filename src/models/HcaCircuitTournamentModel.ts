import mongoose from "mongoose";

const HcaCircuitTournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, default: "" },
    tag: { type: String, default: "hcacircuit" },

    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    // year: { type: Date, default: null },

    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },

    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HcaCircuitTournament =
  mongoose.models.HcaCircuitTournament ||
  mongoose.model("HcaCircuitTournament", HcaCircuitTournamentSchema);

export default HcaCircuitTournament;
