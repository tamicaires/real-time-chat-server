import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { ChatMessage } from "../interfaces/chat-message.interface";
import { MessageViewModel } from "./messageViewModel/messageViewModel";
import { io } from "../http";

export class MessageController {
  async create(req: Request, res: Response) {
    const { text, chatGroupId } = req.body;
    const senderId = req.userId;

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const message: ChatMessage = await prisma.message.create({
      data: {
        text,
        senderId,
        chatGroupId,
      },
    });

    const messageWithSender = {
      ...message,
      sender: sender.username,
    };

    io.emit("message", messageWithSender);

    return res.json(messageWithSender);
  }

  async listMessages(req: Request, res: Response) {
    const { groupId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        chatGroupId: groupId,
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const mapperMessages = messages.map(MessageViewModel.toHttp);
    res.json(mapperMessages);
  }
}
