// require
const uuid = require('uuid/v4');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const settings = require('./settings');

// Instanciation du serveur web, de Express et de Socket.io
const app = express();
const server = http.Server(app);
const io = socketio(server);


// Lancement du serveur HTTP
server.listen(settings.port, () => {
    console.log('Listening on port ' + settings.port);
});

// Contenu du dossier public accessible sur le web
app.use('/', express.static(__dirname + '/public'));

// Liste des connectÃ©s
const users = []; // définition d'une miste de users Vide

// Connexion des clients socket.io
io.on('connection', (socket) => { // emission d'une connexion au client
    console.log('User (' + socket.id + ') vient de se connecter'); // mesage précisant la connexion d'un user



// ajout du connecté
    
    const user = {// nouvel utilisateur       
        ID: socket.id, // définition de son ID
        nickname: settings.defaultNicknames[Math.floor(Math.random() * settings.defaultNicknames.length)], // définition de son nickname
        // Position initiale du user à l'écran
        position: {
            x: Math.random() * 100,
            y: Math.random() * 100
        }
    };
    users.push(user); // ajout de l'utilisateur au tableau des users
    io.emit('users', users); // emission de la liste des users    



// reception du nick
    socket.on('nick', (nickname) => { // à la reception du message venant du client
        user.nickname = nickname; // injection du nickname dans la propriété nickname de user
        io.emit('users', users); // emission de la liste des users    
        console.log(users);
    });


// reception du message
    socket.on('msg', (txt) => { // à la reception du message venant du client

        const message = {// construction de l'objet message
            msgId: uuid(),
            userId: user.id,
            date: new Date().getTime(),
            txt
        };
        io.emit('message', message); // emission d'un message précisant le contenu du message
        console.log(message);
    });







// suppression du connecté
    socket.on('disconnect', () => { // l'utilisateur de déconnecte
        console.log('User (' + socket.id + ') vient de se déconnecter'); // mesage précisant la déconnexion d'un user
        const userplace = users.indexOf(user); // recherche de l'index du user dans le tableau
        users.splice(userplace, 1); // suppresion de l'utilisateur dans le tableau
        console.log(users);
        io.emit('users', users); // emission d'un message précisant la deconnection du user
    });


// recpetion du mouvement
    socket.on('move', (position) => {
        user.position = position; 
        io.emit('users', users); // emission d'un message précisant les nouvelles propriété du user (position)
    });


});





















