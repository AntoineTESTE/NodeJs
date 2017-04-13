// require
const uuid = require('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');


// var
const port = 8080;


// Instanciation du serveur web, de Express et de Socket.io
const app = express();
const server = http.Server(app);
const io = socketio(server);


// Lancement du serveur HTTP
server.listen(port, () => {
    console.log('Listening on port' + port);
});


// Contenu du dossier public accessible sur le web
app.use('/', express.static(__dirname + '/public'));


// Connexion des clients socket.io
io.on('connection', (socket) => { // emission d'une connexion au client
    console.log('User (' + socket.id + ') vient de se connecter'); // mesage précisant la connexion d'un user


// creation d'une liste de users
    const users = [];


// ajout du connecté
    const user = {// nouvel utilisateur
        ID: socket.id, // définition de son ID
        nickname: socket.id // définition de son nickname
    };
    users.push(user); // ajout de l'utilisateur au tableau des users
    console.log(users);
    io.emit('users', users); // emission d'un message précisant l'arrivé d'un nouvel user    




    socket.on('msg', (txt) => { // à la reception du message venant du client

        const date = new Date().getTime();


        console.log(txt);
        console.log(uuid());
        console.log(txt);
        console.log(date);








// suppression du connecté
        socket.on('disconnect', () => { // k'utilisateur de déconnecte
            console.log('User (' + socket.id + ') vient de se déconnecter'); // mesage précisant la déconnexion d'un user
            const userplace = users.indexOf(user); // recherche de l'index du user dans le tableau
            users.splice(userplace, 1); // suppresion de l'utilisateur dans le tableau
            console.log(users);
            io.emit('users', users); // emission d'un message précisant l'arrivé d'un nouvel user
        });


    });
});


















