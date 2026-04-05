const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getTaskProgress = async (req, res) => {
  try {
    const allTasks = await prisma.task.findMany();
    const completedTasks = await prisma.task.findMany({
      where: { completed: true }
    });

    const total = allTasks.length;
    const completed = completedTasks.length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      total,
      completed,
      pending,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task progress" });
  }
};
