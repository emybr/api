const session = require('express-session');
const MongoStore = require('connect-mongo');
// const { collection } = require('../dao/mongo/models/user.models.cjs');
require('dotenv').config();

const sessionConfig = (app) => {
    const store = MongoStore.create({
        mongoUrl: "mongodb+srv://emy82ar:aSvp7zNoOouhsg8r@testcluster0.tjbi9zz.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 60 * 24 * 7, // 1 week
        collectionName: 'sessions'

    });

    app.use(session({
        secret: 'secreto',
        resave: false,
        saveUninitialized: false,
        store: store
    }));
};

module.exports = sessionConfig