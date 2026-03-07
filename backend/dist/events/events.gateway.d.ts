import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, data: {
        channel: string;
    }): {
        event: string;
        data: {
            channel: string;
        };
    };
    handleUnsubscribe(client: Socket, data: {
        channel: string;
    }): {
        event: string;
        data: {
            channel: string;
        };
    };
    emitContentUpdated(contentId: string, data: any): void;
    emitPostStatus(postId: string, status: string): void;
    emitNotification(userId: string, notification: any): void;
}
