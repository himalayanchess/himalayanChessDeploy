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
    fideId: { type: Number, default: 0 },
    lichessUrl: { type: String, default: "" },
    lichessUsername: { type: String, default: "" },
    medalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    lichessPoints: { type: Number, default: 0 },
    performanceUrl: { type: String, default: "" },
    activeStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const LichessWeeklyTournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, default: "" },
    date: { type: Date, default: null },
    tag: { type: String, default: "lichess" },
    day: { type: String, default: "" },
    tournamentUrl: { type: String, default: "" },
    time: { type: String, default: "" },
    clockTime: { type: clockTimeSchema },
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },
    totalParticipants: { type: Number, default: 0 },

    tournamentType: {
      type: String,
      enum: ["Standard", "Rapid", "Blitz"],
      default: "",
    },
    weekNo: { type: Number },
    year: { type: Number },
    lichessWeeklyWinners: { type: [winnerSchema], default: [] },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LichessWeeklyTournament =
  mongoose.models.LichessWeeklyTournament ||
  mongoose.model("LichessWeeklyTournament", LichessWeeklyTournamentSchema);

export default LichessWeeklyTournament;
