import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    pathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SimulationPath",
      default: null,
    },
    quarter: {
      type: String,
      required: [true, "Quarter is required"],
      trim: true,
    },
    year: { type: Number, required: [true, "Year is required"] },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    title: { type: String, required: [true, "Title is required"], trim: true },

    // Required string field
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "complete"],
      default: "todo",
    },
    orderIndex: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Milestone", milestoneSchema);
