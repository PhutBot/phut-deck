import * as http from 'http';
import * as fs from 'fs';
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

server.defineHandler(Https.RequestMethod.GET, '/layout',
    (_:http.IncomingMessage, res:http.ServerResponse) => {
        fs.promises.readFile('layout.json')
            .then((content) => {
                res.writeHead(200);
                res.end(content);
            });
    });
server.defineHandler(Https.RequestMethod.PATCH, '/layout',
    (_:http.IncomingMessage, res:http.ServerResponse, opt:any) => {
        opt.body().then((body:any) => body.text()).then((text:string) => {
            fs.promises.writeFile('layout.json', text)
                .then((content) => {
                    res.writeHead(200);
                    res.end(content);
                });
        })
    });
server.defineHandler(Https.RequestMethod.POST, '/stop',
    (_:http.IncomingMessage, res:http.ServerResponse) => {
        res.writeHead(200);
        res.end('Stopping the server');
        Stop(false);
    });


process.on('SIGTERM', () => Stop(true));
process.on('SIGINT', () => Stop(true));

server.start();
