const { PrismaClient } = require('@prisma/client');
const { SCORE_VALUES, calculateCompletionPoints } = require('../utils/scoreHelper');
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, important = false } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, important }
    });
    
    // Award points for creating a task (engagement bonus)
    const currentScore = await prisma.score.findFirst();
    if (currentScore) {
      await prisma.score.update({
        where: { id: currentScore.id },
        data: { value: currentScore.value + SCORE_VALUES.CREATE_TASK }
      });
    } else {
      await prisma.score.create({ data: { value: SCORE_VALUES.CREATE_TASK } });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed, important } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(completed !== undefined && { completed }),
        ...(important !== undefined && { important })
      }
    });

    // Award or adjust points based on status change
    if (completed !== undefined && completed === true) {
      // Task was just marked as complete - award points based on importance
      const pointsEarned = calculateCompletionPoints(task.important);
      const currentScore = await prisma.score.findFirst();
      if (currentScore) {
        await prisma.score.update({
          where: { id: currentScore.id },
          data: { value: currentScore.value + pointsEarned }
        });
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    // Get the task before deleting to check its state
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (task) {
      // If task was completed, deduct the points earned from it
      if (task.completed) {
        const pointsEarned = calculateCompletionPoints(task.important);
        const currentScore = await prisma.score.findFirst();
        if (currentScore) {
          await prisma.score.update({
            where: { id: currentScore.id },
            data: { value: Math.max(0, currentScore.value - pointsEarned) }
          });
        }
      } else {
        // If task was not completed, deduct the creation bonus
        const currentScore = await prisma.score.findFirst();
        if (currentScore) {
          await prisma.score.update({
            where: { id: currentScore.id },
            data: { value: Math.max(0, currentScore.value - SCORE_VALUES.CREATE_TASK) }
          });
        }
      }
    }
    
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
