import mongoose, { Schema, Document, model } from 'mongoose';

interface IReview extends Document {
  userId: string;
  podcastId: string;
  episodeId?: string;
  rating: number;
  review: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  podcastId: { type: String, required: true },
  episodeId: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || model<IReview>('Review', ReviewSchema);
