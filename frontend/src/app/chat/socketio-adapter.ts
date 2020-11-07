import { ChatAdapter, User, Message, ParticipantResponse } from 'ng-chat';
import { Observable, of, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'socket.io-client/build/socket';
import { environment } from 'src/environments/environment';

export class SocketIOAdapter extends ChatAdapter {
  private socket: Socket;
  private http: HttpClient;
  private userId: string;
  private loggedUserId: string;
  private apiUrl = environment.apiUrl;

  constructor(userId: string, loggedUserId: string, socket: Socket, http: HttpClient) {
    super();
    this.socket = socket;
    this.http = http;
    this.userId = userId;
    this.loggedUserId = loggedUserId;
    console.log(userId)
    this.InitializeSocketListerners();
  }

  listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    // Sending the userId from the request body as this is just a demo

    return this.http
      .post(`${this.apiUrl}/chat/listFriends`, { userId: this.userId })
      .pipe(
        map((res: Response) => {
          return res
        }),
        catchError((error: any) => throwError(error || 'Server error'))
      ) as Observable<ParticipantResponse[]>;
  }

  getMessageHistory(userId: any): Observable<Message[]> {
    console.log('History... ' + userId);
    return this.http
      .post(`${this.apiUrl}/chat/messageHistory`, { fromId: userId, toId: this.loggedUserId })
      .pipe(
        map((res: Response) => {
          return res
        }),
        catchError((error: any) => throwError(error || 'Server error'))
      ) as Observable<Message[]>;
  }

  sendMessage(message: Message): void {
    this.socket.emit("sendMessage", message);
  }

  public InitializeSocketListerners(): void {
    this.socket.on("messageReceived", (messageWrapper) => {
      // Handle the received message to ng-chat

      this.onMessageReceived(messageWrapper.user, messageWrapper.message);
    });

    this.socket.on("friendsListChanged", (usersCollection: Array<ParticipantResponse>) => {
      // Handle the received message to ng-chat
      this.onFriendsListChanged(usersCollection.filter(x => x.participant.id != this.userId));
    });
  }
}
