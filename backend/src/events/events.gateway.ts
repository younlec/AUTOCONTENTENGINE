import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string },
  ) {
    client.join(data.channel);
    this.logger.log(`Client ${client.id} subscribed to ${data.channel}`);
    return { event: 'subscribed', data: { channel: data.channel } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string },
  ) {
    client.leave(data.channel);
    this.logger.log(`Client ${client.id} unsubscribed from ${data.channel}`);
    return { event: 'unsubscribed', data: { channel: data.channel } };
  }

  // Broadcast to all connected clients
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Topic/Trend discovery events
  emitTrendDiscovered(data: { topics: any[]; discoveredAt: string }) {
    this.server.emit('trends.discovered', data);
    this.logger.log(
      `Broadcast trends.discovered: ${data.topics.length} topics`,
    );
  }

  // Content generation events
  emitContentGenerated(
    userId: string,
    data: { contentId: string; title: string; status: string },
  ) {
    this.server.to(`user:${userId}`).emit('content.generated', data);
    this.server.emit('content.new', data);
  }

  // Content status update events
  emitContentUpdated(contentId: string, data: any) {
    this.server.to(`content:${contentId}`).emit('content.updated', data);
    this.server.emit('content.statusChanged', { contentId, ...data });
  }

  // Post status events
  emitPostStatus(postId: string, status: string) {
    this.server.to(`post:${postId}`).emit('post.status', { postId, status });
    this.server.emit('post.statusChanged', {
      postId,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  // Post published event
  emitPostPublished(data: {
    postId: string;
    platform: string;
    publishedAt: string;
  }) {
    this.server.emit('post.published', data);
  }

  // Analytics update events
  emitAnalyticsUpdated(data: { postId: string; metrics: any }) {
    this.server.emit('analytics.updated', data);
  }

  // User-specific notification
  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // Video creation progress
  emitVideoProgress(
    userId: string,
    data: { videoId: string; status: string; progress?: number },
  ) {
    this.server.to(`user:${userId}`).emit('video.progress', data);
    this.server.emit('video.statusChanged', data);
  }
}
