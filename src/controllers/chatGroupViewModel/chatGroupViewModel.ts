interface ChatGroup {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  messages: {
    text: string;
    createdAt: Date;
    sender: {
      username: string;
    };
  }[];
  UserChatGroup: {
    userId: string;
  }[];
  isMyGroup: boolean;
}

export class ChatGroupViewModel {
  static toHttp(chatGroup: ChatGroup) {
    console.log(chatGroup);
    return {
      id: chatGroup.id,
      name: chatGroup.name,
      description: chatGroup.description,
      createdAt: chatGroup.createdAt,
      isMyGroup: chatGroup.isMyGroup,
      lastMessage:
        chatGroup.messages.length > 0 ? chatGroup.messages[0].text : null,
      sentLastMessage:
        chatGroup.messages.length > 0 ? chatGroup.messages[0].createdAt : null,
      sender:
        chatGroup.messages.length > 0
          ? chatGroup.messages[0].sender.username
          : null,
    };
  }
}
