require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const { engine } = require('express-handlebars');
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const sessionConfig = require('../src/sessions/sessionConfig.cjs');
const passportConfig = require('../src/passport/passportConfig.cjs');
const routes = require('../src/routes/routes.cjs');
const { webRouter } = require('../src/routes/webRouters.cjs');
const mongoRoutes = require('../src/routes/routes-mongo.cjs');
const Database = require('../src/config/config.cjs')
const userManagerDb = require('./dao/mongo/user-manager-db.cjs');
const ChatManagerDb = require('./dao/mongo/chat-manager.db.cjs');
const db = new Database();
const chatManagerDb = new ChatManagerDb
const path = require('path');
const { env } = require('process');
const io = new Server(httpServer);


sessionConfig(app);
passportConfig(app, userManagerDb);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');


const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


app.use('/db', mongoRoutes);
app.use('/api', routes);
app.use('/', webRouter);


db.connectToDatabase()
    .then(() => {
        httpServer.listen(port, "0.0.0.0", () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado!');

    socket.on('chat message', async (message, username) => {
        console.log(`${username}: ${message}`);
        await chatManagerDb.insertMessage(message, username);
        io.emit('chat message', message, username);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

});



