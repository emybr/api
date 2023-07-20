
const express = require('express');
const router = express.Router();
const { deleteUserInactivo } = require("../Controllers/mongo/user.controlers.cjs");
const { getAllUsers } = require('../Controllers/mongo/user.controlers.cjs');

// pasar a router  mongo

router.delete('/delete', deleteUserInactivo);

// agrego ruta para obtener todos los usuarios y sus datos nombre, correo y rol

router.get('/users', getAllUsers);




module.exports = router;
