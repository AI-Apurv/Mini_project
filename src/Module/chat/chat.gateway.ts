import { ChatsService } from './chat.service';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    constructor(private chatsService: ChatsService) { }




    async handleConnection(socket: Socket) {
        await this.chatsService.getUserFromSocket(socket)
    }




    @SubscribeMessage('send_message')
    async listenForMessages(@MessageBody() messageDto: MessageDto, @ConnectedSocket() socket: Socket) {
        const user = await this.chatsService.getUserFromSocket(socket);
        const receiver = messageDto.receiverId;
        const newmessage = await this.chatsService.createMessage(messageDto.message, user.id, receiver)
        socket.broadcast.emit('receive_message', newmessage);
        return newmessage
    }



    @SubscribeMessage('get_all_messages')
    async getAllMessages(@ConnectedSocket() socket: Socket) {
        await this.chatsService.getUserFromSocket(socket)
        const messages = await this.chatsService.getAllMessages()
        socket.broadcast.emit('receive_message', messages);
        return messages
    }


}