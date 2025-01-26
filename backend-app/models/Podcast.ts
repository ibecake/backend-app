import mongoose, { Schema, Document, model } from 'mongoose';

interface IPodcast extends Document {
  title: string;
  description: string;
  rssLink: string;
  createdAt: Date;
}

const PodcastSchema = new Schema<IPodcast>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rssLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Podcast || model<IPodcast>('Podcast', PodcastSchema);
