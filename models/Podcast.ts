import mongoose, { Schema, Document, model } from 'mongoose';

interface IPodcast extends Document {
  title: string;
  description: string;
  rssLink: string;
  createdAt: Date;
}

const PodcastSchema = new Schema({
  title: String,
  description: String,
  rssLink: String,
  likes: { type: [String], default: [] },
  favorites: { type: [String], default: [] }, // User IDs who favorited this
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Podcast || model<IPodcast>('Podcast', PodcastSchema);
