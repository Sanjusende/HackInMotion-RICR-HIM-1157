import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    },
    windSpeed: {
      type: Number,
      default: 0
    },
    rainProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    rainfallMm: {
      type: Number,
      required: true,
      min: 0
    },
    weatherCondition: {
      type: String,
      default: 'Clear'
    },
    forecast: [
      {
        date: String,
        tempMax: Number,
        tempMin: Number,
        rainProbability: Number,
        rainfallMm: Number,
        condition: String
      }
    ],
    source: {
      type: String,
      default: 'open-meteo'
    }
  },
  {
    timestamps: true
  }
);

weatherSchema.index({ farmId: 1, fetchedAt: -1 });

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;
