import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        farmName: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        district: {
            type: String,
            required: true,
            trim: true,
        },

        village: {
            type: String,
            required: true,
            trim: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        landSize: {
            type: Number,
            required: true,
            min: 0,
        },

        landUnit: {
            type: String,
            enum: ["ACRE", "HECTARE"],
            default: "ACRE",
        },

        soilType: {
            type: String,
            enum: [
                "BLACK",
                "RED",
                "ALLUVIAL",
                "LATERITE",
                "SANDY",
                "CLAY",
                "OTHER",
            ],
            default: "OTHER",
        },

        currentCrop: {
            type: String,
            trim: true,
            default: "",
        },

        plannedCrop: {
            type: String,
            trim: true,
            default: "",
        },

        irrigationMethod: {
            type: String,
            enum: [
                "DRIP",
                "SPRINKLER",
                "FLOOD",
                "RAINFED",
                "OTHER",
            ],
            default: "OTHER",
        },
    },
    {
        timestamps: true,
    }
);

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;