import mongoose from 'mongoose';
const milestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'SimulationPath', default: null },
  quarter: { type: String, required: true }, year: { type: Number, required: true }, category: { type: String, required: true },
  title: { type: String, required: true }, description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in_progress', 'complete'], default: 'todo' }, orderIndex: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false });
export default mongoose.model('Milestone', milestoneSchema);
