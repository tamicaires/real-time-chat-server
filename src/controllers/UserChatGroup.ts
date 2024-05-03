import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { io } from "../http";

export class UserChatGroupController {
  async addUserToGroup(req: Request, res: Response) {
    const userId = req.userId;
    const chatGroupId = req.params.groupId;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!chatGroupId) {
      return res.status(404).json({ error: "Chat Group not found" });
    }

    const userGroup = await prisma.userChatGroup.create({
      data: {
        userId,
        chatGroupId,
      },
    });

    io.emit("add-user-room", userGroup);

    return res.json(userGroup);
  }
}
