import Farm from '../models/Farm.js';
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

export const handleVoiceQuery = async (req, res) => {
  try {
    const { query, language } = req.body || {};

    // ------------------------------------------
    // Authentication Check
    // ------------------------------------------

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    // ------------------------------------------
    // Query Validation
    // ------------------------------------------

    const validation = validateQuery(query);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
      });
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

    const result = await processVoiceQuery(
      validation.value,
      language,
      farm
    );

    if (!result?.responseText) {
      throw new Error(
        'Voice service returned an invalid response.'
      );
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
      data: {
        id: voiceRecord._id,
        query: result.queryText,
        language: result.language,
        responseText: result.responseText,
        context: result.contextSnapshot || {},
      },
    });
  } catch (error) {
    console.error('[VoiceController] Query processing failed:', {
      message: error.message,
      userId: req.user?._id,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error:
        'Unable to process your voice query right now. Please try again later.',
    });
  }
};

// ------------------------------------------------------
// GET /voice/history
// ------------------------------------------------------

export const getVoiceHistory = async (req, res) => {
  try {
    // ------------------------------------------
    // Authentication Check
    // ------------------------------------------

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

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

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('[VoiceController] History retrieval failed:', {
      message: error.message,
      userId: req.user?._id,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve voice history. Please try again later.',
    });
  }
};