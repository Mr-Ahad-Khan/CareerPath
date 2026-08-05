import mongoose from "mongoose";

const { Schema } = mongoose;

const simulationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    profileId: { type: Schema.Types.ObjectId, ref: "SkillProfile" },
    name: { type: String, default: "Untitled simulation" },
    whatIf: Schema.Types.Mixed,
    summary: Schema.Types.Mixed,
    isStarred: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const simulationPathSchema = new Schema(
  {
    simulationId: {
      type: Schema.Types.ObjectId,
      ref: "Simulation",
      required: true,
      index: true,
    },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    riskLevel: { type: Number, required: true },
    satisfactionScore: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    trajectory: { type: [Schema.Types.Mixed], default: [] },
    skillGaps: { type: [Schema.Types.Mixed], default: [] },
    finalSalary: { type: Number, required: true },
    startSalary: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Simulation = mongoose.model("Simulation", simulationSchema);
export const SimulationPath = mongoose.model(
  "SimulationPath",
  simulationPathSchema,
);

export default Simulation;
