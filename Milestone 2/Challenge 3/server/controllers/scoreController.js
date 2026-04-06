const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getScore = async (req, res) => {
  try {
    // Simple, transparent scoring: just return the actual stored value
    // No confusing dynamic bonuses - the score is earned through clear actions:
    // - Creating tasks (+1)
    // - Completing regular tasks (+5)
    // - Completing important tasks (+15)
    // - Deleting tasks (penalty)
    
    const storedScore = await prisma.score.findFirst();
    const currentValue = storedScore ? storedScore.value : 0;
    
    // Return the actual stored score without any additional calculations
    res.json({ value: Math.max(0, currentValue) }); // Prevent negative scores

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = {
  getScore
};
