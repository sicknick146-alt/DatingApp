import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store connected users: userId -> socketId
  private connectedUsers = new Map<string, string>();

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    // In production, extract user ID from JWT token via handshake headers
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      // Optional: Broadcast online status to others
      this.server.emit('userStatus', { userId, status: 'online' });
    }
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.connectedUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.connectedUsers.delete(userId);
      this.server.emit('userStatus', { userId, status: 'offline' });
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { toUserId: string; text: string; conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = [...this.connectedUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0] || 'me';
    const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Save message via service
    const savedMessage = await this.messagesService.create(data.conversationId, senderId, data.text, at);

    // Emit to recipient if online
    const recipientSocketId = this.connectedUsers.get(data.toUserId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', savedMessage);
    }

    return { event: 'messageSent', data: savedMessage };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { toUserId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = [...this.connectedUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0];
    
    const recipientSocketId = this.connectedUsers.get(data.toUserId);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('typingStatus', { userId: senderId, isTyping: data.isTyping });
    }
  }
}
