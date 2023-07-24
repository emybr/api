const { postAddCards, postCardbyEmail } = require('../Controllers/mongo/cars.controlers.cjs');
const { putPoducsDB, deleteProduct, postProduc } = require('../Controllers/mongo/products.controlers.cjs');
const { deleteUser } = require('../Controllers/mongo/user.controlers.cjs')

const express = require('express');
const mongoRoutes = express.Router();
const { route } = require('./routes.cjs');
const { postSetAdminRole, postSetRoleByEmail } = require('../Controllers/mongo/user.controlers.cjs');
const { de } = require('@faker-js/faker');



mongoRoutes.put('/mongo/products/:id', putPoducsDB);

mongoRoutes.delete('/mongo/products/:id', deleteProduct)

mongoRoutes.post('/mongo/carts', postAddCards)

mongoRoutes.post('/mongo/carts/:email', postCardbyEmail)

mongoRoutes.post('/mongo/products/addproduts', postProduc)

mongoRoutes.post('/mongo/products/setAdmin', postSetAdminRole)

mongoRoutes.post('/delet/users/:email', deleteUser)

mongoRoutes.post('/mongo/setRoleByEmail/:email', postSetRoleByEmail)

module.exports = mongoRoutes;