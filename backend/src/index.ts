import { createServer } from "http";
import express from 'express';
import cors from 'cors';
import { config } from "dotenv";
config();
import "./controllers/database";
import routes from './routes';
import { createSocketServer } from "./socket";

// Create servers
const app = express();
const server = createServer(app);

// Socket io
createSocketServer(server);

// Config
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', routes);

// Listen
server.listen(app.get('port'), () => { console.log('Servidor levantado en el puerto', app.get('port')) });