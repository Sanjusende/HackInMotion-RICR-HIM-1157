import mongoose from "mongoose";

const FarmerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: "{VALUE} is not a valid gender value"
      }
    },
    dateOfBirth: {
      type: Date
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
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, "Experience years cannot be negative"]
    },
    preferredLanguage: {
      type: String,
      enum: {
        values: ["EN", "HI", "MR", "TE", "TA", "KN", "BN", "PA"],
        message: "{VALUE} is not a valid preferred language code"
      }
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const FarmerProfile = mongoose.model("FarmerProfile", FarmerProfileSchema);

export default FarmerProfile;
