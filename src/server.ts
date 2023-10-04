import express from 'express';
import { env } from './config/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { UserService } from './services/impl/UserService';
import { UserRouter } from './routers/v1/UserRouter';
import { MasterRouter } from './routers/v1/MasterRouter';
import { mysqlDataSource } from './database/MyDataSource';
import { errorHandlerMiddleware } from './middlewares/ErrorHandlerMiddlewares';
import { UserRepo } from './repositories/impl/UserRepo';
import { requestTimeMiddleware } from './middlewares/RequestTimeMiddleware';

class Server {
    public app = express();
    public router: MasterRouter;

    constructor() {}

    public async initialize(): Promise<void> {
        await this.setupDataSource();
        await this.setupRoutes();
        await this.setupMiddleware();
    }

    private async setupMiddleware(): Promise<void> {
        // Set up middleware and routing
        this.app.use(cors({
            credentials: true,
            origin: true,
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["token"],
        }));
        this.app.use(helmet()); // Set various HTTP security headers
        this.app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
        this.app.use(bodyParser.json()); // Parse JSON request bodies
        this.app.use(compression()); // Compress response bodies
        this.app.use(requestTimeMiddleware); // Record request time
        this.app.use('/api/v1', this.router.router); // Use the main router for routes
        this.app.use(errorHandlerMiddleware); // Handle errors using custom middleware
    }

    private async setupDataSource(): Promise<void> {
        await mysqlDataSource.initialize();
        console.log('Data Source is initialized successfully');
    }

    private async setupRoutes(): Promise<void> {
        this.router = new MasterRouter(new UserRouter(new UserService(new UserRepo(mysqlDataSource))))
    }

    public start(): void {
        this.app.listen(env.port, () => console.log(`> Listening on port ${env.port}`));
    }

}

export default Server;
