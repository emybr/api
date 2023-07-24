
const express = require('express');
const router = express.Router();
const { deleteUserInactivo } = require("../Controllers/mongo/user.controlers.cjs");
const { getAllUsers } = require('../Controllers/mongo/user.controlers.cjs');


router.delete('/delete', deleteUserInactivo);

router.get('/users', getAllUsers);

module.exports = router;
