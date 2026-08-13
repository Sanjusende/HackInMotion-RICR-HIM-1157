import Farm from '../models/Farm.js';
import VoiceQuery from '../models/VoiceQuery.js';
import { processVoiceQuery } from '../services/voice/voiceService.js';

export const handleVoiceQuery = async (req, res) => {
  try {
    const { query, language } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query text is required'
      });
    }

    const farm = await Farm.findOne({ userId: req.user._id });
    const result = await processVoiceQuery(query, language, farm);

    const voiceRecord = await VoiceQuery.create({
      userId: req.user._id,
      farmId: farm?._id,
      query: result.queryText,
      language: result.language,
      responseText: result.responseText,
      contextSnapshot: result.contextSnapshot
    });

    return res.status(200).json({
      success: true,
      data: {
        id: voiceRecord._id,
        query: result.queryText,
        language: result.language,
        responseText: result.responseText,
        context: result.contextSnapshot
      }
    });
  } catch (error) {
    console.error('Voice controller error:', error);
    return res.status(500).json({
      success: false,
      error: "We couldn't understand your query. Please try speaking or typing again."
    });
  }
};

export const getVoiceHistory = async (req, res) => {
  try {
    const history = await VoiceQuery.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(15);
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve voice history'
    });
  }
};
