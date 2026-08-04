import mongoose from 'mongoose';
const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) }, activity: { type: String, required: true },
  skill: String, durationMinutes: { type: Number, default: 30 }, note: String,
}, { timestamps: true, versionKey: false });
export default mongoose.model('JournalEntry', journalEntrySchema);
