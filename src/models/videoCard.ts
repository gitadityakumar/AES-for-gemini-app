import mongoose, { Schema, Document } from 'mongoose';

interface IVideo extends Document {
  title: string;
  thumbnailUrl: string;
  duration: string;
  processingDate: Date;
}

const videoCardSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  processingDate: {
    type: Date,
    required: true
  }
});

const Video = mongoose.model<IVideo>('VideoCard', videoCardSchema);
export default Video;
