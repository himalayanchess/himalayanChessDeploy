import mongoose from "mongoose";

const clockTimeSchema = new mongoose.Schema(
  {
    initialTime: { type: Number }, // in minutes
    increment: { type: Number }, // in seconds
  },
  { _id: false }
);

const PrizeSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  position: { type: String, default: "" },
  otherTitleStatus: { type: Boolean, default: false },
  otherTitle: { type: String, default: "" },
});

const ChiefArbiterSchema = new mongoose.Schema(
  {
    chiefArbiterName: { type: String, default: "" },
    chiefArbiterPhone: { type: Number, default: "" },
    chiefArbiterEmail: { type: String, default: "" },
  },
  { _id: false }
);

const ParticipantsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent",
    },
    studentName: { type: String, default: "" },
    fideId: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    circuitPoints: { type: Number, default: 0 },

    participantType: {
      type: String,
      enum: ["Top 10 Rank", "Category Winner", "Regular Participant"],
      default: "Regular Participant",
    },
    performanceUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    prize: { type: PrizeSchema, default: null },
    totalPoints: { type: Number, default: "" },
    activeStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const HcaCircuitSeriesTournamentSchema = new mongoose.Schema(
  {
    mainHcaCircuitTournamentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaCircuitTournament",
    },
    mainHcaCircuitTournamentName: {
      type: String,
      default: "",
    },

    tournamentName: { type: String, default: "" },
    tournamentUrl: { type: String, default: "" },
    tag: { type: String, default: "hcacircuitseries" },

    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    branchName: { type: String, default: "" },
    branchId: { type: mongoose.Schema.Types.Mixed, ref: "Branch" },
    tournamentType: {
      type: String,
      enum: ["Standard", "Rapid", "Blitz"],
      default: "",
    },

    clockTime: { type: clockTimeSchema },

    totalRounds: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },

    chiefArbiter: { type: ChiefArbiterSchema },

    isRated: { type: Boolean, default: false },
    fideUrl: { type: String, default: "" },
    chessResultsUrl: { type: String, default: "" },

    participants: { type: [ParticipantsSchema], default: [] },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HcaCircuitSeriesTournament =
  mongoose.models.HcaCircuitSeriesTournament ||
  mongoose.model(
    "HcaCircuitSeriesTournament",
    HcaCircuitSeriesTournamentSchema
  );

export default HcaCircuitSeriesTournament;
