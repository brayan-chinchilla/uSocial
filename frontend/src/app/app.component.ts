import { Component } from '@angular/core';
import { ChatAdapter } from 'ng-chat';
import { AuthService } from './auth/auth.service';
import { io } from "socket.io-client";
import { Socket } from 'socket.io-client/build/socket';
import { SocketIOAdapter } from './chat/socketio-adapter';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'usocial';
  serverUrl = environment.serverUrl;
  userId: string;
  socket: Socket;
  public adapter: ChatAdapter;

  constructor(public authService: AuthService, private http: HttpClient) {
    this.socket = io(this.serverUrl);
    this.InitializeSocketListerners();
    this.socket.emit('join', this.authService.getLoggedUserId())
  }

  public InitializeSocketListerners(): void {
    this.socket.on("generatedUserId", (userId: string) => {
      // Initializing the chat with the userId and the adapter with the socket instance
      this.adapter = new SocketIOAdapter(userId, this.authService.getLoggedUserId(), this.socket, this.http);
      this.userId = userId;
    });
  }
}
