
const Database = require('../../config/config.cjs');


class ProductManagerDb {
    constructor() {
        this.db = new Database();
    }

    async getProducts(limit = 10, page = 1, sort, query) {
        const skip = (page - 1) * limit;
        const filter = query ? { $text: { $search: query } } : {};
        const sortOption = sort ? { [sort]: 1 } : {};

        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }

            const products = await this.db.database
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort(sortOption)
                .toArray();

            return products;
        } catch (e) {
            console.error(e);
        }
    }

    async createProduct(id, title, description, price, thumbnail, code, stock) {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const result = await this.db.database.insertOne({ id, title, description, price, thumbnail, code, stock });
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async updateProduct(id, name, price) {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const result = await this.db.database.updateOne(
                { _id: id },
                { $set: { name: name, price: price } }
            );
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async deleteProduct(id) {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const result = await this.db.database.deleteOne({ _id: id });
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getTotalProducts() {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const totalProducts = await this.db.database.countDocuments();
            return totalProducts;
        } catch (e) {
            console.error(e);
        }
    }


    async getAllProducts() {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const products = await this.db.database.find({}).toArray();
            return products;
        } catch (e) {
            console.error(e);
        }
    }


    async getProductById(id) {
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const product = await this.db.database.findOne({ id: id });
            return product;
        } catch (e) {
            console.error(e);
        }
    }

    async updateProductStock(productId, quantity) {
        console.log(productId, quantity);
        try {
            if (!this.db.database) {
                await this.db.connectToDatabase();
            }
            const product = await this.db.database.findOne({ id: productId });
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
            product.stock -= quantity;
            await this.db.database.replaceOne({ id: productId }, product);
        } catch (e) {
            console.error(e);
            throw new Error(`Error al actualizar el stock del producto: ${e.message}`);
        }
    }

}

module.exports = ProductManagerDb;


