import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, startDate, dueDate } = req.body;

    const lastTask = await prisma.task.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const lastNumber = parseInt(lastTask?.code.split("-")[1] ?? "0", 10);
    const newCode = `TASK-${String(lastNumber + 1).padStart(3, "0")}`;

    const task = await prisma.task.create({
      data: {
        code: newCode,
        title,
        description,
        priority,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
      },
    });

    return res.status(201).json({
      msg: "Task created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in creating Task",
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true },
    });

    return res.status(200).json({
      msg: "Users fetched successfully.",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in fetching users.",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!existingTask) {
      return res.status(404).json({
        msg: "Task not found",
      });
    }
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: { user: true },
    });

    await prisma.activity.create({
      data: {
        action: "update",
        taskId: updatedTask.id,
        userId: req.user.userId,
        description: "Task updated",
        beforeState: JSON.stringify(existingTask),
        afterState: JSON.stringify(updatedTask),
      },
    });
    return res.status(200).json({
      msg: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in updating task",
      error: err,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(404).json({
        msg: "Task not found",
      });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({
      msg: "Task deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in deleting task",
    });
  }
};

export const statusUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const exisitingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!exisitingTask) {
      return res.status(404).json({
        msg: "Task not found",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });

    await prisma.activity.create({
      data: {
        action: "update status",
        taskId: updatedTask.id,
        userId: req.user.userId,
        beforeState: JSON.stringify(exisitingTask),
        afterState: JSON.stringify(updatedTask),
      },
    });
    return res.status(200).json({
      msg: "Status updated",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error is updating status.",
    });
  }
};

export const assignToUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, status, title, priority } = req.body;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    let assignedUserId: number | null = null;

    if (userId) {
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!existingUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      assignedUserId = Number(userId);
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        userId: assignedUserId, 
        status,
        title,
        priority,
      },
    });

    await prisma.activity.create({
      data: {
        action: userId ? "assign task" : "unassign task",
        taskId: updatedTask.id,
        userId: req.user.userId,
        beforeState: JSON.stringify(existingTask),
        afterState: JSON.stringify(updatedTask),
      },
    });

    return res.status(200).json({
      msg: userId
        ? "Task assigned successfully"
        : "Task unassigned successfully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error updating task assignment",
      error: err,
    });
  }
};
