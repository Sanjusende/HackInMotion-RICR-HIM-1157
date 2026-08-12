import mongoose from "mongoose";

const FarmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    },
    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true
    },
    village: {
      type: String,
      required: [true, "Village is required"],
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"]
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"]
    },
    landSize: {
      type: Number,
      required: [true, "Land size is required"],
      min: [0, "Land size must be a positive number"]
    },
    landUnit: {
      type: String,
      enum: {
        values: ["ACRE", "HECTARE", "BIGHA"],
        message: "{VALUE} is not a valid land unit"
      },
      default: "ACRE"
    },
    soilType: {
      type: String,
      enum: {
        values: ["ALLUVIAL", "BLACK", "RED", "LATERITE", "CLAYEY", "SANDY", "LOAMY", "OTHER"],
        message: "{VALUE} is not a valid soil type"
      },
      default: "OTHER"
    },
    currentCrop: {
      type: String,
      default: ""
    },
    plannedCrop: {
      type: String,
      default: ""
    },
    irrigationMethod: {
      type: String,
      enum: {
        values: ["DRIP", "SPRINKLER", "FLOOD", "RAIN-FED", "OTHER"],
        message: "{VALUE} is not a valid irrigation method"
      },
      default: "OTHER"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Farm", FarmSchema);
