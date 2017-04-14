
var socket = io(); // initialisation de la liaison client/server


socket.on('connect', function () { // quand recoit message de connection 
    console.log('connecté'); // -> ok
});


// Réception de la nouvelle liste des connectés
// de type [{id, nickname}, ...]

var usersUl = document.querySelector('#users ul');
var users = [];
socket.on('users', function (_users) {
    // Liste des anciens ids de users pour supprimer les <div> des users déconnectés
    var oldIds = users.map(function (u) {
        return u.id;
    });
    users = _users;
    usersUl.innerHTML = _users.map(u => '<li>' + u.nickname + '</li>').join('');

    // Affichage des users à l'écran selon leurs positions
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        // Suppression de l'id du user de la liste des anciens ids
        var oldIdIndex = oldIds.indexOf(user.id);
        if (oldIdIndex !== -1) {
            oldIds.splice(oldIdIndex, 1);
        }
        var userDiv = document.getElementById('user-' + user.id);
        var nickDiv;
        // Si le <div> du user n'existe pas encore, on le crée
        if (!userDiv) {
            // Div à positionner
            userDiv = document.createElement('div');
            userDiv.id = 'user-' + user.id;
            userDiv.className = 'user';

            // Nickname
            nickDiv = document.createElement('span');
            userDiv.appendChild(nickDiv);

            // Bulle de texte
            var bubble = document.createElement('p');
            bubble.className = 'bubble';
            bubble.style.display = 'none'; // cachée au début
            userDiv.appendChild(bubble);

            // Affichage du <div>
            document.body.appendChild(userDiv);
        } else {
            nickDiv = userDiv.getElementsByTagName('span')[0];
        }

        // Mise à jour du nickname
        nickDiv.innerText = user.nickname;

        // Mise à jour de la position
        userDiv.style.left = user.position.x + '%';
        userDiv.style.top = user.position.y + '%';



    }

    // Suppression des anciens users
    for (var i = 0; i < oldIds.length; i++) {
        var userDiv = document.getElementById('user-' + oldIds[i]);
        if (userDiv) {
            userDiv.parentNode.removeChild(userDiv);
        }
    }
});


// Creation de l'evenement de message

var msgform = document.getElementById("msgform"); // on recupère l'element du formulaire
msgform.addEventListener('submit', function (e) { // creation de l'evenement d'envoi
    e.preventDefault();
    const msg = this.message.value; // injection de la valeur du message dans msg
    const startnick = msg.indexOf('/nick'); // retour 0 si présence
    if (startnick === 0) { // si nick = présence.
        var nickname = msg.substr(6);
        socket.emit('nick', nickname); // emission de la valeur du message au serveur
    } else {
        socket.emit('msg', this.message.value); // emission de la valeur du message au serveur  
    }
    this.message.value = ''; // vide le champ texte

});

//Reception du retour de l'entité message
socket.on('message', function (message) { // à reception du message venant du serveur
    var user = users.filter(function (user) {
        return user.id === message.userId;
    })[0];
    // Ajout du message Ã  la liste
    var nickname = user ? user.nickname : ' :) ';
    var messages = document.getElementById('messages'); // récupère l'id Messages (liste)
    var li = document.createElement('li'); // creer un element pour la liste  
    li.innerText = message.txt; // inclu le texte dans cet element
    messages.appendChild(li); // imbrique l'element dans la liste

    // Scroll en bas de la liste
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;

    // Affichage de la bulle à côté du user
    var bubble = document.querySelector('#user-' + socket.id + ' .bubble');
    if (bubble) {
        // Annulation du setTimeout précédent s'il y en a un
        clearTimeout(bubble.getAttribute('data-timeout'));

        // Affichage de la bulle avec le texte du message
        bubble.style.display = 'block';
        bubble.innerText = message.txt;

        // Délai avant de cacher la bulle à nouveau
        var timeout = setTimeout(function () {
            bubble.style.display = 'none';
        }, 2000);
        bubble.setAttribute('data-timeout', timeout);
    }

});


// coordonnées de la souris

var page = document.body; // on recupère l'element du formulaire
page.addEventListener('click', function (e) { // creation de l'evenement d'envoi
    var x = (e.clientX / window.innerWidth) * 100;
    var y = (e.clientY / window.innerHeight) * 100;
    const position = {
        x,
        y
    };
    console.log(position);
    socket.emit('move', position);
});


