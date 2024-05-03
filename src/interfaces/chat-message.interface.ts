export interface ChatMessage {
  text: string;
  senderId: string;
  fromMe: boolean;
  chatGroupId: string;
  createdAt: Date;
}

export interface IChatMessage {
  text: string;
  senderId: string;
  sender: string;
  fromMe: boolean;
  chatGroupId: string;
  createdAt: Date;
}