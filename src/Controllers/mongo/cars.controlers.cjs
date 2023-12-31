const CartsManagerDb = require ('../../dao/mongo/carts-manager.db.cjs')
const cartsManagerDb = new CartsManagerDb
const {winstonLogger} = require('../../middleware/logger.cjs')


async function getCartsByEmail (req, res) {
    {
        try {
            const { email } = req.params;
            const carts = await cartsManagerDb.getCartsByEmail(email);
            const total = carts.products.reduce((acc, curr) => acc + parseInt(curr.price), 0);
            res.render('vistaCarrito', { carts, email, total });
        } catch (error) {
            winstonLogger.http('Carrito no encontrado');
        }
    }
}

async function postAddCards (req, res) {
    cartsManagerDb.addCart();
    res.send({ message: 'Carrito agregado' });
}

async function postCardbyEmail (req, res) {
    await cartsManagerDb.addProductToCart(req.params.email, req.body);
    await cartsManagerDb.updateCartIdUser(req.params.email);
    res.redirect(`/carts/${req.params.email}`);
    winstonLogger.debug('Producto agregado al carrito');
}


module.exports = {getCartsByEmail,postAddCards,postCardbyEmail}