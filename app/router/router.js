const EventEmmiter = require('events');
const eventEmmiter = new EventEmmiter();
const url = require('url');
const fs = require('fs');
const File = require('../miscellaneous/file.js');
const FireBase = require('../miscellaneous/firebase.js');

module.exports = {
    handleRequest: (request, response) => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        switch (request.method) {
            case 'GET':
                eventEmmiter.emit('onGetPetition', {
                    request,
                    response
                });
                break;
            case 'POST':
                onPostPetition(request, response);
                break;
            case 'PUT':
                onPutPetition(request, response);
                break;
            case 'DELETE':
                onDeletePetition(request, response);
                break;
            case 'OPTIONS':
                response.end();
                break;
        }
    }
}

function onPostPetition(request, response) {
    let path = url.parse(request.url).pathname;
}

function onPutPetition(request, response) {
    let path = url.parse(request.url).pathname;
    switch (path) {
        case '/updateMovie':
            let data = []
            request.on('data', chunk => {
                data.push(chunk);
            })
            request.on('end', async () => {
                let movie = JSON.parse(data).body.movie;
                await FireBase.updateMovie(movie);
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
}

eventEmmiter.on('onGetPetition', async data => {
    let {
        request,
        response
    } = data;
    let path = url.parse(request.url).pathname;
    switch (path) {
        case '/getMoviesFromFile':
            File.readFile(__dirname + '/../database/', 'movies.json')
                .then(data => {
                    response.write(JSON.stringify({
                        data
                    }));
                    response.end();
                }).catch(error => {
                    response.writeHead(500);
                    response.write(error);
                    response.end();
                })
            break;
        case '/getMovies':
            let movies = await FireBase.getMovies();
            response.write(JSON.stringify({
                data: movies
            }));
            response.end();
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
    }
});

function onDeletePetition(request, response) {
    let path = url.parse(request.url).pathname;
    switch (path) {
        case '/delete-movie':
            let data = []
            request.on('data', chunk => {
                data.push(chunk);
            })
            request.on('end', async () => {
                let movie = JSON.parse(data).body.movie;
                await FireBase.deleteMovie(movie);
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write('Error');
            response.end();
     }
};