import { Server as SockerServer } from "socket.io";
import { Server } from "http";

var usersCollection: any[] = [];

function createSocketServer(server: Server) {
    const io = new SockerServer({}).listen(server, {
        cors: {
            origin: process.env.CLIENT_URL
        }
    });

    // Socket.io operations
    io.on('connection', (socket) => {
        console.log('A user has connected to the server.');

        socket.on('join', function (username: any) {
            // Same contract as ng-chat.User
            usersCollection.push({
                participant: {
                    id: socket.id, // Assigning the socket ID as the user ID in this example
                    displayName: username,
                    status: 0, // ng-chat UserStatus.Online,
                    avatar: null
                }
            });

            socket.broadcast.emit("friendsListChanged", usersCollection);

            console.log(username + " has joined the chat room.");

            // This is the user's unique ID to be used on ng-chat as the connected user.
            socket.emit("generatedUserId", socket.id);

            // On disconnect remove this socket client from the users collection
            socket.on('disconnect', function () {
                console.log('User disconnected!');

                var i = usersCollection.findIndex(x => x.participant.id == socket.id);
                usersCollection.splice(i, 1);

                socket.broadcast.emit("friendsListChanged", usersCollection);
            });
        });

        socket.on("sendMessage", function (message: any) {
            console.log("Message received:");
            console.log(message);

            console.log(usersCollection.find(x => x.participant.id == message.fromId));

            io.to(message.toId).emit("messageReceived", {
                user: usersCollection.find(x => x.participant.id == message.fromId).participant,
                message: message
            });

            console.log("Message dispatched.");
        });
    });
}

export {
    createSocketServer
}