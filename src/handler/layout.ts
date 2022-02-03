import fs from "fs";
import http from "http";
import { requestMapping } from "helper-js/dist/src/Https/decorators"

@requestMapping({ location: 'layout' })
export default class Handler {

    @requestMapping({ method: 'GET' })
    static get(_:http.IncomingMessage, res:http.ServerResponse) {
        fs.promises.readFile('layout1.json')
            .then((content) => {
                res.writeHead(200);
                res.end(content);
            });
    }

    @requestMapping({ method: 'PATCH' })
    static patch(_:http.IncomingMessage, res:http.ServerResponse, opt:any) {
        opt.body()
            .then((body:any) => body.text())
            .then((text:string) => {
                fs.promises.writeFile('layout.json', text)
                    .then((content) => {
                        res.writeHead(200);
                        res.end(content);
                    });
            });
    }
}