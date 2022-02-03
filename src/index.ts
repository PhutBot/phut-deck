import * as http from 'http';
import { Env, Https, Millis } from 'helper-js';
// import npmlog from 'npmlog';
// npmlog.level = "error";

Env.load('.env');
const hostname = new Env.EnvBackedValue('HOSTNAME');
const port = new Env.EnvBackedValue('PORT');
const useCache = new Env.EnvBackedValue('CACHING');

const server = new Https.SimpleServer({
    hostname,
    port,
    useCache
});

function Stop(force:boolean) {
    server.stop().finally(() => {
        if (force) process.exit();
    });
}

server.mapDirectory('./dist/www/', { alias: '/' });
server.mapDirectory('./components/', { alias: '/components' });

server.defineHandler(Https.RequestMethod.GET, '/stop', (_:http.IncomingMessage, res:http.ServerResponse) => {
    res.writeHead(200);
    res.end('Stopping the server');
    Stop(false);
});


process.on('SIGTERM', () => Stop(true));
process.on('SIGINT', () => Stop(true));

server.start();
