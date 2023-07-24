const { getChat } = require('../Controllers/mongo/chat.controlers.cjs');
const express = require('express');
const webRouter = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/autenticacion.cjs');
const { getUserController, getRegisterUser, postRegisterUser, postLoginUser, postLogout, getGenerateResetLink, getResetToken, postResetPassword, postResetToken, updateUserFile, postPremiumUser, } = require('../Controllers/mongo/user.controlers.cjs');
const { getCartsByEmail } = require('../Controllers/mongo/cars.controlers.cjs')
const { getProducDB, getUpProducts } = require('../Controllers/mongo/products.controlers.cjs');
const { postTiketDB } = require('../Controllers/mongo/tickets.controlers.cjs');
const { upload } = require('../middleware/multer.cjs');
const { getAdmin } = require('../Controllers/mongo/user.controlers.cjs')


webRouter.get('/login', getUserController);

webRouter.post('/login', postLoginUser)

webRouter.get('/register', getRegisterUser);

webRouter.post('/register', postRegisterUser);

webRouter.get('/login/github', passport.authenticate('github'));

webRouter.get('/login/github/callback',
    passport.authenticate('github'),
    function (req, res) {
        res.redirect('/products/db');
    }
);

webRouter.get('/generate-reset-link', getGenerateResetLink);

webRouter.post('/logout', postLogout);

webRouter.get('/reset/:token', getResetToken);

webRouter.post('/reset/token', postResetToken);

webRouter.post(`/reset-password`, postResetPassword);

webRouter.post('/upload', upload.fields([
    { name: 'dni', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'comprobanteCuenta', maxCount: 1 }
]), updateUserFile);

webRouter.post('/premium', postPremiumUser);

webRouter.get('/chat', getChat);

webRouter.get('/products/db', ensureAuthenticated, getProducDB);

webRouter.get('/carts/:email', ensureAuthenticated, getCartsByEmail);

webRouter.post('/mongo/tickets', postTiketDB);

webRouter.get('/products/upload', getUpProducts);

webRouter.get('/admin', getAdmin);

module.exports = { webRouter };





