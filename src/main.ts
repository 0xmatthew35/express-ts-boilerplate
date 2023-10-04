import Server from './server';

const server = new Server();

server.initialize()
    .then(() => {
        server.start();
    })
    .catch((error) => {
        console.error('Server initialization failed:', error);
    });
