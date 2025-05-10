import mongoose from "mongoose";

const clockTimeSchema = new mongoose.Schema(
  {
    initialTime: { type: Number }, // in minutes
    increment: { type: Number }, // in seconds
  },
  { _id: false }
);

const ChiefArbiterSchema = new mongoose.Schema(
  {
    chiefArbiterName: { type: String, default: "" },
    chiefArbiterPhone: { type: Number, default: "" },
    chiefArbiterEmail: { type: String, default: "" },
  },
  { _id: false }
);

const PrizeSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  position: { type: String, default: "" },
  otherTitleStatus: { type: Boolean, default: false },
  otherTitle: { type: String, default: "" },
});

const ParticipantsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent",
    },
    studentName: { type: String, default: "" },
    rank: { type: Number, default: 0 },
    performanceUrl: { type: String, default: "" },
    prize: { type: PrizeSchema, default: null },
    totalPoints: { type: Number, default: "" },
    activeStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const OtherTournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String, default: "" },
    tournamentUrl: { type: String, default: "" },
    tag: { type: String, default: "othertournaments" },

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

    participants: { type: [ParticipantsSchema], default: [] },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const OtherTournament =
  mongoose.models.OtherTournament ||
  mongoose.model("OtherTournament", OtherTournamentSchema);

export default OtherTournament;
