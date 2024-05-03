interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  senderId: string;
  chatGroupId: string;
  createdAt: Date;
  sender: {
    username: string;
  };
}

export class MessageViewModel {
  static toHttp(message: Message) {
    return {
      id: message.id,
      text: message.text,
      fromMe: message.fromMe,
      senderId: message.senderId,
      chatGroupId: message.chatGroupId,
      createdAt: message.createdAt,
      sender: message.sender.username
    };
  }
}

