import mongoose from 'mongoose';

const fertilizerPlanSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true
    },
    crop: {
      type: String,
      required: true
    },
    soilType: {
      type: String,
      required: true
    },
    growthStage: {
      type: String,
      required: true
    },
    recommendations: [
      {
        nutrientType: String,
        applicationWindow: String,
        method: String,
        generalGuidance: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const FertilizerPlan = mongoose.model('FertilizerPlan', fertilizerPlanSchema);

export default FertilizerPlan;
