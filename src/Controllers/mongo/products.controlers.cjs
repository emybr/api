const ProductManagerDb = require('../../dao/mongo/product-manager-db.cjs')
const productManagerDb = new ProductManagerDb
const { winstonLogger } = require('../../middleware/logger.cjs')
const mensajes = require('../../config/config.cjs')
const UserManagerDb = require('../../dao/mongo/user-manager-db.cjs');
const { sendEmail } = require('../../service/email.service.cjs');


async function getProducDB(req, res) {

    try {
        const limit = parseInt(req.query.limit) || 8;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;

        const products = await productManagerDb.getProducts(limit, page, sort, query)

        const totalProducts = await productManagerDb.getTotalProducts({
            $text: { $search: query },
        });
        const email = req.session.email;
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevLink = hasPrevPage
            ? `${req.protocol}://${req.get('host')}${req.path}?limit=${limit}&page=${prevPage}`
            : null;
        const nextLink = hasNextPage
            ? `${req.protocol}://${req.get('host')}${req.path}?limit=${limit}&page=${nextPage}`
            : null;

        res.render('vistaProductos', {
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            message: req.session.message,
            email,
        });
    } catch (error) {
        winstonLogger.http('El producto no existe');
    }
}


async function postProduc(req, res) {
    try {
        const { id, title, description, price, thumbnail, code, stock } = req.body;
        const userEmail = req.session.email;
        const userRole = req.session.role;
        const result = await productManagerDb.createProduct(id, title, description, price, thumbnail, code, stock, userEmail, userRole);

        res.status(200).json(result);
    } catch (error) {
        winstonLogger.info('Error al agregar el producto');
    }
}


async function putPoducsDB(req, res) {
    try {
        const id = parseInt(req.params.id);
        const { title, price, description, thumbnail, code, stock } = req.body;
        const result = await productManagerDb.updateProduct(id, title, price, description, thumbnail, code, stock);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(mensajes.ERROR_ACTUALIZAR_PRODUCTO);
        winstonLogger.info('Error al actualizar el producto');
    }
}



async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        console.log(id);
        const numericId = parseInt(id);
        const product = await productManagerDb.getProductById(numericId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const result = await productManagerDb.deleteProduct(numericId);
        if (result && product.creatorRole === 'premium') {
            const emailSubject = 'Producto Eliminado';
            const emailText = `Estimado Usuario Premium,\n\nEl producto con los siguientes detalles ha
            sido eliminado:\n\nID del Producto: ${product.id}\nDescripción: ${product.description}\nPrecio: 
            ${product.price}\n\nLamentamos la inconveniencia causada. Si necesita más información, por favor 
            contáctenos.\n\nGracias,\nEl equipo de nuestro sitio.`;

            await sendEmail(product.creatorEmail, emailSubject, emailText);

            console.log('Correo enviado al usuario premium:', product.creatorEmail);
        }
        return res.status(200).json(result);
    } catch (error) {
        winstonLogger.info('Error al eliminar el producto');
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}


async function getUpProducts(req, res) {
    try {
        const userEmail = req.session.email;
        const userRole = req.session.role;
        if (userRole === 'admin' || userRole === 'premium') {
            res.render('vistaUpProducts', { userEmail, userRole });
        } else {
            res.render('vistaUpdateUserPremium', { email: userEmail });
        }
    } catch (error) {
        winstonLogger.http('El producto no existe');
    }
}



module.exports = { getProducDB, postProduc, putPoducsDB, deleteProduct, getUpProducts }