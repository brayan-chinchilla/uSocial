import express, { Application } from 'express';
import cors from 'cors';
import { config } from "dotenv";
import routes from './routes';

class Server {
    public app: Application;
    
    constructor() {
        const env = config();
        console.log('Variables de entorno:', env)
        this.app = express();
        this.config();
        this.middlewares();
        this.routes();
    }

    private config(): void {
        this.app.set('port', process.env.PORT || 4000);
        this.app.set('json spaces', 2);
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({ extended: false }));
        // this.app.use(express.static(path.join(__dirname, 'public')));
    }

    private routes(): void {
        this.app.use('/api', routes);
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor levantado en el puerto', this.app.get('port'))
        });
    }
}

const server = new Server();
server.start();