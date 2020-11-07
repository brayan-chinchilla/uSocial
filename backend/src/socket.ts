import { Server as SockerServer } from "socket.io";
import { Server } from "http";
import UserModel from "./controllers/database/User";
import MessageModel from "./controllers/database/Message";

function createSocketServer(server: Server, usersCollection: any[]) {
    const io = new SockerServer({}).listen(server, {
        cors: {
            origin: process.env.CLIENT_URL
        }
    });

    // Socket.io operations
    io.on('connection', (socket) => {
        console.log('A user has connected to the server.');

        socket.on('join', async function (userid: any) {
            const user = await UserModel.findOne({ _id: userid });

            if (!user) return;
            // Same contract as ng-chat.User
            usersCollection.push({
                participant: {
                    id: socket.id, // Assigning the socket ID as the user ID in this example
                    displayName: user.name,
                    userid,
                    status: 0, // ng-chat UserStatus.Online,
                    avatar: user.photo
                }
            });

            socket.broadcast.emit("friendsListChanged", usersCollection);

            console.log(user.username + " has joined the chat room.");

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

        socket.on("sendMessage", async function (message: any) {
            console.log("Message received:");
            console.log(message);

            const fromPart = usersCollection.find(x => x.participant.id == message.fromId).participant;
            const toPart = usersCollection.find(x => x.participant.id == message.toId).participant;

            await MessageModel.create({
                fromId: fromPart.userid,
                toId: toPart.userid,
                message: message.message,
                dateSent: message.dateSent
            })

            io.to(message.toId).emit("messageReceived", {
                user: fromPart,
                message: message
            });

            console.log("Message dispatched.");
        });
    });
}

export {
    createSocketServer
}