import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { io } from "../http";
import { ChatGroupViewModel } from "./chatGroupViewModel/chatGroupViewModel";

export class ChatGroupController {
  async create(req: Request, res: Response) {
    const { name, description } = req.body;

    const chatGroup = await prisma.chatGroup.create({
      data: {
        name,
        description,
      },
    });

    io.emit("chat-room", chatGroup);
    return res.json(chatGroup);
  }

  async updateChatGroup(req: Request, res: Response) {
    const { groupId } = req.params;
    const { name, description } = req.body;
    console.log(groupId);

    const chatGroup = await prisma.chatGroup.update({
      where: { id: groupId },
      data: {
        name,
        description,
      },
    });
    io.emit("chat-room", chatGroup);
    return res.json(chatGroup);
  }

  async getChatGroup(req: Request, res: Response) {
    const userId = req.userId;
    const { groupId } = req.params;

    if (!groupId)
      return res.status(404).json({ error: "Chat Group not found" });

    const chatGroup = await prisma.chatGroup.findUnique({
      where: { id: groupId },
      include: {
        messages: {
          select: {
            sender: {
              select: {
                username: true,
              },
            },
            text: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        UserChatGroup: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (!chatGroup) {
      return res.status(404).json({ error: "Chat Group not found" });
    }

    const isMyGroup = chatGroup.UserChatGroup.length > 0;

    const chatGroupWithInfo = {
      ...chatGroup,
      isMyGroup: isMyGroup,
    };
     
    io.emit("chat-room", chatGroupWithInfo);
    return res.json(ChatGroupViewModel.toHttp(chatGroupWithInfo));
  }

  async getLastChatMessages(req: Request, res: Response) {
    const userId = req.userId;
    console.log(userId);
    const lastMessages = await prisma.chatGroup.findMany({
      where: {
        UserChatGroup: {
          some: {
            userId,
          },
        },
      },
      select: {
        messages: {
          select: {
            sender: true,
            text: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    console.log(lastMessages);
    return res.json(lastMessages);
  }

  async listChatGroups(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const chatGroups = await prisma.chatGroup.findMany({
      include: {
        UserChatGroup: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
        messages: {
          select: {
            sender: true,
            text: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const chatGroupWithInfo = chatGroups.map((group) => ({
      ...group,
      isMyGroup: group.UserChatGroup.length > 0,
    }));

    const mappedChats = chatGroupWithInfo.map(ChatGroupViewModel.toHttp);
    return res.json(mappedChats);
  }
}
