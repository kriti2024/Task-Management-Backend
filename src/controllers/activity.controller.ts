import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        user: true, 
        task: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      msg: "Activities fetched successfully",
      activities,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error fetching activities",
      error: err,
    });
  }
};



export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existingActivity = await prisma.activity.findUnique({
      where: { id: Number(id) },
    });

    if (!existingActivity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    await prisma.activity.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ msg: "Activity deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: "Error deleting activity",
      error: err,
    });
  }
};
