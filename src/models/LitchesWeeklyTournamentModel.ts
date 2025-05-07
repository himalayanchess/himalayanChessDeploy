import mongoose from "mongoose";

const clockTimeSchema = new mongoose.Schema(
  {
    initialTime: { type: Number }, // in minutes
    increment: { type: Number }, // in seconds
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent",
    },
    studentName: { type: String, default: "" },
    litchesUrl: { type: String, default: "" },
    litchesUsername: { type: String, default: "" },
    medalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    performanceUrl: { type: String, default: "" },
    activeStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const LitchesWeeklyTournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, default: "" },
    date: { type: Date, default: null },
    tag: { type: String, default: "litches" },
    day: { type: String, default: "" },
    tournamentUrl: { type: String, default: "" },
    time: { type: String, default: "" },
    clockTime: { type: clockTimeSchema },
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },

    tournamentType: {
      type: String,
      enum: ["Standard", "Rapid", "Blitz"],
      default: "",
    },
    weekNo: { type: Number },
    year: { type: Number },
    litchesWeeklyWinners: { type: [winnerSchema], default: [] },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LitchesWeeklyTournament =
  mongoose.models.LitchesWeeklyTournament ||
  mongoose.model("LitchesWeeklyTournament", LitchesWeeklyTournamentSchema);

export default LitchesWeeklyTournament;
