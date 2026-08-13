import mongoose from 'mongoose';

const voiceQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm'
    },
    query: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'en-US'
    },
    responseText: {
      type: String,
      required: true
    },
    contextSnapshot: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

voiceQuerySchema.index({ userId: 1, createdAt: -1 });

const VoiceQuery = mongoose.model('VoiceQuery', voiceQuerySchema);

export default VoiceQuery;
