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

  async getMyChats(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatsUsers = await prisma.userChatGroup.findMany({
      where: { userId: userId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        chatGroup: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log("Passei aqui", chatsUsers);
    return res.json(chatsUsers);
  }

  async leaveChatGroup(req: Request, res: Response) {
    const userId = req.userId;
    const chatGroupId = req.params.groupId;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!chatGroupId) {
      return res.status(404).json({ error: "Chat Group not found" });
    }

    const userChatGroup = await prisma.userChatGroup.findFirst({
      where: {
        userId,
        chatGroupId,
      },
    });

    if (!userChatGroup) {
      return res.status(404).json({ error: "Has no group for this user" });
    }

    await prisma.userChatGroup.delete({
      where: { id: userChatGroup.id },
    });

    io.emit("group-deleted", userChatGroup.id);
    
    return res.json(userChatGroup);
  }
}
