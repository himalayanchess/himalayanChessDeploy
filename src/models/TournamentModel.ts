import mongoose from "mongoose";

//  Arbiter Schema
const ArbiterSchema = new mongoose.Schema(
  {
    name: { type: String },
    fideId: { type: String },
    email: { type: String },
    phone: { type: String },
    title: { type: String },
  },
  { _id: false }
);

// Contact Person Schema
const ContactPersonSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

// Series Info
const SeriesInfoSchema = new mongoose.Schema(
  {
    seriesId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Series",
    },
    seriesName: { type: String, default: "" },
    activeStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

// Time Control
const TimeControlSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Rapid", "Blitz", "Standard"],
    },
    minutes: Number,
    increment: Number,
  },
  { _id: false }
);

// Main Tournament Schema
const TournamentSchema = new mongoose.Schema(
  {
    tournamentName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },

    isSeries: { type: Boolean, default: false },

    series: { type: [SeriesInfoSchema], default: [] },

    tournamentDirector: { type: ArbiterSchema },
    chiefArbiter: { type: ArbiterSchema },

    deputyChiefArbiters: {
      type: [ArbiterSchema],
      validate: (v: any) => v.length <= 2,
    },
    arbiters: {
      type: [ArbiterSchema],
      validate: (v: any) => v.length <= 15,
    },

    location: { type: String },
    googleMapsLink: { type: String },

    contactPerson: { type: ContactPersonSchema, default: null },

    organizersName: { type: String },
    isRated: { type: Boolean, default: false },

    chessResultsUrl: { type: String },
    fideUrl: { type: String },

    timeControl: { type: TimeControlSchema, default: null },
  },
  { timestamps: true }
);

const Tournament =
  mongoose.models.Tournament || mongoose.model("Tournament", TournamentSchema);

export default Tournament;
