import mongoose from 'mongoose';

const cropHealthSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    possibleIssue: {
      type: String,
      required: true
    },
    confidence: {
      type: String,
      default: 'Moderate'
    },
    whatToCheck: {
      type: String,
      required: true
    },
    nextAction: {
      type: String,
      required: true
    },
    location: {
      lat: Number,
      lng: Number
    },
    reportedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

cropHealthSchema.index({ farmId: 1, reportedAt: -1 });

const CropHealth = mongoose.model('CropHealth', cropHealthSchema);

export default CropHealth;
