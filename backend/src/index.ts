import { createServer } from "http";
import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
config();
import "./controllers/database";
import routes from './routes';
import { createSocketServer } from "./socket";
import MessageModel from "./controllers/database/Message";

// Create servers
const app = express();
const server = createServer(app);

// Config
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

var usersCollection: any[] = [];

// Socket io
createSocketServer(server, usersCollection);

// Routes
app.use('/api', routes);

app.post('/api/chat/listFriends', (req, res) => {
    var clonedArray = usersCollection.slice();

    console.log(usersCollection);
    var i = usersCollection.findIndex((x: any) => x.participant.id == req.body.userId);
    clonedArray.splice(i, 1);
    res.json(clonedArray);
});

app.post('/api/chat/messageHistory', async (req, res) => {
    const fromId = usersCollection.find(x => x.participant.id == req.body.fromId).participant.userid;
    const messages = await MessageModel.find({
        $or: [{
            fromId,
            toId: req.body.toId
        }, {
            fromId: req.body.toId,
            toId: fromId
        }]
    }).sort({dateSent: 1});
    res.json(messages)
});

// Listen
server.listen(app.get('port'), () => { console.log('Servidor levantado en el puerto', app.get('port')) });