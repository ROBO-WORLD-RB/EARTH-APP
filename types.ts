
export interface Message {
  role: 'user' | 'model';
  content: string;
  files?: FileMessage[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface FileMessage {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string; // base64 or text content
  uploadDate: Date;
  conversationId?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  conversationId?: string;
}
