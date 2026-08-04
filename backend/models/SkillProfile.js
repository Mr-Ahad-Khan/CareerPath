import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  educationLevel: { type: String, required: true }, educationField: { type: String, required: true },
  graduationYear: Number, currentRole: String, experienceYears: { type: Number, default: 0 },
  skills: { type: [mongoose.Schema.Types.Mixed], default: [] }, interests: { type: [String], default: [] },
  constraints: { type: mongoose.Schema.Types.Mixed, default: {} }, location: String, targetRole: String,
  currency: { type: String, default: 'INR' },
}, { timestamps: true, versionKey: false });

export default mongoose.model('SkillProfile', skillProfileSchema);
