import mongoose from 'mongoose';

// ------------------------------------------------------
// Constants
// ------------------------------------------------------

const SUPPORTED_LANGUAGES = [
  'en-IN',
  'en-US',
  'hi-IN',
  'mr-IN',
  'gu-IN',
  'pa-IN',
];

const MAX_QUERY_LENGTH = 500;
const MAX_RESPONSE_LENGTH = 5000;

// ------------------------------------------------------
// Voice Query Schema
// ------------------------------------------------------

const voiceQuerySchema = new mongoose.Schema(
  {
    // ------------------------------------------
    // User Reference
    // ------------------------------------------

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },

    // ------------------------------------------
    // Farm Reference
    // ------------------------------------------

    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      default: null,
    },

    // ------------------------------------------
    // User Voice/Text Query
    // ------------------------------------------

    query: {
      type: String,
      required: [true, 'Voice query is required'],
      trim: true,
      minlength: [1, 'Query cannot be empty'],
      maxlength: [
        MAX_QUERY_LENGTH,
        `Query cannot exceed ${MAX_QUERY_LENGTH} characters`,
      ],
    },

    // ------------------------------------------
    // Query Language
    // ------------------------------------------

    language: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'hi-IN',
      enum: {
        values: SUPPORTED_LANGUAGES,
        message: 'Unsupported voice assistant language',
      },
    },

    // ------------------------------------------
    // Assistant Response
    // ------------------------------------------

    responseText: {
      type: String,
      required: [true, 'Response text is required'],
      trim: true,
      maxlength: [
        MAX_RESPONSE_LENGTH,
        `Response cannot exceed ${MAX_RESPONSE_LENGTH} characters`,
      ],
    },

    // ------------------------------------------
    // Farm/Weather/Market Context Snapshot
    // ------------------------------------------

    contextSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

// ------------------------------------------------------
// Indexes
// ------------------------------------------------------
//
// Optimizes:
//
// VoiceQuery.find({ userId })
//   .sort({ createdAt: -1 })
//   .limit(15)
//

voiceQuerySchema.index({
  userId: 1,
  createdAt: -1,
});

// ------------------------------------------------------
// Farm-specific Voice History
// ------------------------------------------------------
//
// Useful for future queries like:
//
// VoiceQuery.find({
//   userId,
//   farmId,
// }).sort({ createdAt: -1 })
//

voiceQuerySchema.index({
  userId: 1,
  farmId: 1,
  createdAt: -1,
});

// ------------------------------------------------------
// Model
// ------------------------------------------------------

const VoiceQuery = mongoose.model(
  'VoiceQuery',
  voiceQuerySchema
);

export default VoiceQuery;