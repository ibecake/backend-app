import mongoose, { Schema, Document, model } from 'mongoose';

interface IEpisode extends Document {
  podcastId: string;
  title: string;
  description: string;
  releaseDate: string;
  audioUrl?: string;
  createdAt: Date;
}

const EpisodeSchema = new Schema({
  podcastId: String,
  title: String,
  description: String,
  releaseDate: String,
  audioUrl: String,
  likes: { type: [String], default: [] },
  favorites: { type: [String], default: [] }, // User IDs who favorited this
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.Episode || model<IEpisode>('Episode', EpisodeSchema);
