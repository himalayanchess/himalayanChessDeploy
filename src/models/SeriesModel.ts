import mongoose from "mongoose";

// Player Record Schema
const PlayerRecordSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "HcaAffiliatedStudent",
    },
    playerName: { type: String, default: "" },
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  { _id: false }
);

// Main Series Schema
const SeriesSchema = new mongoose.Schema(
  {
    seriesName: { type: String },
    seriesStartDate: { type: Date },
    seriesEndDate: { type: Date },

    activeStatus: { type: Boolean, default: true },

    tournamentId: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Tournament",
    },
    tournamentName: { type: String, default: "" },

    players: [PlayerRecordSchema],
  },
  { timestamps: true }
);

// Export model
const Series = mongoose.models.Series || mongoose.model("Series", SeriesSchema);

export default Series;
