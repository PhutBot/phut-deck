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

server.mapDirectory('./dist/www/', { alias: '/' });
server.mapDirectory('./components/', { alias: '/components' });

server.defineHandler(Https.RequestMethod.GET, '/stop', (_:http.IncomingMessage, res:http.ServerResponse) => {
    res.writeHead(200);
    res.end('Stopping the server');
    setTimeout(() => {
        server.stop();
    }, Millis.fromSec(3));
});

server.start();
