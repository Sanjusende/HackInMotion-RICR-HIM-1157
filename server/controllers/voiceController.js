import Farm from '../models/Farm.js';
import ApiResponse from '../utils/apiResponse.js';
import VoiceQuery from '../models/VoiceQuery.js';
import { processVoiceQuery } from '../services/voice/voiceService.js';

const DEFAULT_HISTORY_LIMIT = 15;
const MAX_QUERY_LENGTH = 500;

// ------------------------------------------------------
// Helper: Validate Query
// ------------------------------------------------------

const validateQuery = (query) => {
  if (typeof query !== 'string') {
    return {
      valid: false,
      message: 'Query must be a text value.',
    };
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      valid: false,
      message: 'Query text is required.',
    };
  }

  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      message: `Query cannot exceed ${MAX_QUERY_LENGTH} characters.`,
    };
  }

  return {
    valid: true,
    value: trimmedQuery,
  };
};

// ------------------------------------------------------
// POST /voice/query
// ------------------------------------------------------

export const handleVoiceQuery = async (req, res, next) => {
  try {
    const { query, language } = req.body || {};

    // ------------------------------------------
    // Query Validation
    // ------------------------------------------

    const validation = validateQuery(query);

    if (!validation.valid) {
      return ApiResponse.error(res, validation.message, 400, 'VALIDATION_ERROR');
    }

    // ------------------------------------------
    // Fetch User Farm Context
    // ------------------------------------------

    const farm = await Farm.findOne({
      userId: req.user._id,
    }).lean();

    // ------------------------------------------
    // Process Voice Query
    // ------------------------------------------

    const result = await processVoiceQuery(validation.value, language, farm);

    if (!result?.responseText) {
      throw new Error('Voice service returned an invalid response.');
    }

    // ------------------------------------------
    // Save Voice Query
    // ------------------------------------------

    const voiceRecord = await VoiceQuery.create({
      userId: req.user._id,
      farmId: farm?._id || null,
      query: result.queryText,
      language: result.language,
      responseText: result.responseText,
      contextSnapshot: result.contextSnapshot || {},
    });

    // ------------------------------------------
    // Success Response
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      message: 'Voice query processed successfully',
      intent: result.intent,
      response: result.responseText,
      language: result.language,
      data: {
        id: voiceRecord._id,
        query: result.queryText,
        language: result.language,
        responseText: result.responseText,
        context: result.contextSnapshot || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------
// GET /voice/history
// ------------------------------------------------------

export const getVoiceHistory = async (req, res, next) => {
  try {
    // ------------------------------------------
    // Fetch Voice History
    // ------------------------------------------

    const history = await VoiceQuery.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_HISTORY_LIMIT)
      .lean();

    // ------------------------------------------
    // Success Response
    // ------------------------------------------

    return ApiResponse.success(res, history, 'Voice history retrieved successfully');
  } catch (error) {
    next(error);
  }
};
