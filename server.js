const express = require('express');
const path = require('path');

const app = express();

//definir protocolo http
const server = require('http').createServer(app);
// define protocolo do socket
const io = require('socket.io')(server);

// caminho pros arquivos frontend
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));

// para usar html, por padrao o socket usa ejs
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});


let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    // enviar evente apenas para a pagina que conectou as mensages
    socket.emit('previousMessages', messages);

    //escuta o evendo sendMessage, oque o emit envia 
    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data);

        // envia evento para todos conectados
        socket.broadcast.emit('receivedMessage', data);
    });
})

server.listen(3000);