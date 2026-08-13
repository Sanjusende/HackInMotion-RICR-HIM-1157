/**
 * Utility to calculate price percentage change and classify trend
 * Bands per PRD Section 14.2:
 * 7-day % change >= +2% -> Rising ("Recent prices have been trending upward")
 * 7-day % change <= -2% -> Falling ("Recent prices have been trending downward")
 * between -2% and +2% -> Stable ("Recent prices have been stable")
 *
 * CRITICAL CONSTRAINT (PRD Quality Rule): Never use predictive phrasing like "Price will increase".
 * Only use past/recent trend framing.
 */
export const calculatePriceTrend = (currentPrice, previousPrice) => {
  if (!previousPrice || previousPrice <= 0) {
    return {
      trend: 'Stable',
      changePercent: 0,
      displayText: 'Recent prices have been stable.',
      sellingInsightText: 'Market price is steady. Compare against your target selling price and storage cost before making a decision.'
    };
  }

  const changePercent = Number((((currentPrice - previousPrice) / previousPrice) * 100).toFixed(1));

  let trend = 'Stable';
  let displayText = 'Recent prices have been stable.';
  let sellingInsightText = 'Market price is steady. Compare current mandi rates against your target threshold and harvest storage timeline.';

  if (changePercent >= 2.0) {
    trend = 'Rising';
    displayText = 'Recent prices have been trending upward.';
    sellingInsightText = 'Recent prices have been trending upward. Compare current market rates with your local mandi and target selling price.';
  } else if (changePercent <= -2.0) {
    trend = 'Falling';
    displayText = 'Recent prices have been trending downward.';
    sellingInsightText = 'Recent prices have been trending downward. Evaluate holding capacity versus immediate liquidity needs before selling.';
  }

  return {
    trend,
    changePercent,
    displayText,
    sellingInsightText
  };
};
