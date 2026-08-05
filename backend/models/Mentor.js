import mongoose from 'mongoose';
const { Schema } = mongoose;
const mentorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, name: { type: String, required: true }, title: { type: String, required: true },
  company: { type: String, required: true }, industry: { type: String, required: true }, specialty: { type: String, required: true },
  experienceYears: { type: Number, required: true }, location: { type: String, required: true }, bio: { type: String, required: true },
  expertise: { type: [String], default: [] }, languages: { type: [String], default: [] }, avatarColor: { type: String, default: '#ffb340' },
  rating: { type: Number, default: 4.7 }, menteeCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
const connectionRequestSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  message: { type: String, required: true }, status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
export const Mentor = mongoose.model('Mentor', mentorSchema);
export const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
export default Mentor;
