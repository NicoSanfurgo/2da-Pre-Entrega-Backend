import { productsModel } from '../../models/products.model.js';

export default class ProductManager {
    async addProduct(product) {
        try {
            const newProduct = await productsModel.create(product);
            return newProduct
        } catch (error) {
            console.log(error)
        }
    }

    async getProducts(queries) {
        try {
            const { limit = 10, page = 1, order, category } = queries;
            let products;
            let prevLink;
            let nextLink;
            if (order && category) {
                products = await productsModel.paginate({ category: category }, { limit: limit, page: page, sort: { price: order } });
                prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&category=${category}&order=${order}` : null;
                nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&category=${category}&order=${order}` : null
            } else if (order) {
                products = await productsModel.paginate({}, { limit: limit, page: page, sort: { price: order } });
                prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&order=${order}` : null;
                nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&order=${order}` : null
            } else if (category) {
                products = await productsModel.paginate({ category: category }, { limit: limit, page: page });
                prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&category=${category}` : null;
                nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&category=${category}` : null
            } else {
                products = await productsModel.paginate({}, { limit: limit, page: page });
                prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}` : null;
                nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}` : null
            }
            const results = {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
            }
            return results
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(id){
        try {
            const product = productsModel.findById(id);
            return product
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(id, newProduct){
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate(id, {
                title: newProduct.title,
                description: newProduct.description,
                price: newProduct.price,
                thumbnail: newProduct.thumbnail, 
                code: newProduct.code,
                stock: newProduct.stock,
                category: newProduct.category
            }, { new: true });
            updatedProduct.save();
            return updatedProduct
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(id){
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            return deletedProduct
        } catch (error) {
            console.log(error)
        }
    }
}