const express = require('express');
const bodyParser = require("body-parser");
const cluster = require('cluster');
const lodash = require('lodash');

require('console-stamp')(console);

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    console.log('using ' + numCPUs + ' cpus');
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    const server = require('http').Server(app);
    const port = process.env.PORT || 9876;

    server.listen(port, function (err) {
        console.log(`${cluster.worker.id}: Running server on port ${port}`);
    });

    app.post('/', function (req, res) {
        console.log(`will process ${req.body.type}`);
        
        let handler = null;

        const webHookType = req.body.type;

        switch(webHookType) {
            case "gym":
                handler = Promise.resolve();
                break;


            case "gym_details":
                handler = Promise.resolve();
                break;

            case "pokemon":
                handler = Promise.resolve();
                break;

            case "pokestop":
                handler = Promise.resolve();
                break;


            default:
                console.log(req.body.type);
                handler = Promise.reject('webhook not handled');
                break;
        }


        //Log error or failure
        handler
            .then(() => {
            console.log(`finished processing: ${req.body.type}`);
    })
        .catch((err) => {
            console.log(`error processing ${req.body.type}: ${JSON.stringify(err)}`);
    });

        res.end();
    });
}



