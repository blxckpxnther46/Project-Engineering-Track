/**
 * Score calculation helper - transparent and consistent
 * 
 * Scoring system:
 * - Creating a task: +1 point (engagement bonus)
 * - Completing a regular task: +5 points
 * - Completing an important task: +15 points (3x multiplier for high-impact work)
 * - Deleting a task: -points earned from that task
 */

const SCORE_VALUES = {
  CREATE_TASK: 1,
  COMPLETE_REGULAR_TASK: 5,
  COMPLETE_IMPORTANT_TASK: 15,
  DELETE_TASK_INCOMPLETE: -1,
};

/**
 * Calculate points for completing a task
 * @param {boolean} isImportant - Whether the task is marked as important
 */
const calculateCompletionPoints = (isImportant) => {
  return isImportant 
    ? SCORE_VALUES.COMPLETE_IMPORTANT_TASK 
    : SCORE_VALUES.COMPLETE_REGULAR_TASK;
};

module.exports = {
  SCORE_VALUES,
  calculateCompletionPoints
};
