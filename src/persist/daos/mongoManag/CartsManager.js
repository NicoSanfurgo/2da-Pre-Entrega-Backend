import { cartsModel } from '../../models/carts.model.js';
import ProductManager from './ProductsManager.js';

const productManager = new ProductManager();

export default class CartManager {
    async addCart() {
        try{
            const newCart = await cartsModel.create({ products: [] });
            return newCart
        } catch (error) {
            console.log(error)
        }
    }

    async getProductsFromCart(cartId) {
        try {
            const cart = await cartsModel.find({ _id: cartId });
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId);
            if ((cart.products).find(product => JSON.stringify(product._id).replace('"', '').replace('"', '') === productId)) {
                throw new Error('Este producto ya está en el carrito.')
            }
            cart.products.push({ _id: productId, quantity: 1 });
            cart.save();
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId);
            const filteredProducts = cart.products.filter(product => product._id === productId);
            cart.products = filteredProducts;
            cart.save();
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async replaceProductsInCart(cartId, products) {
        try {
            const cart = await cartsModel.findById(cartId);
            cart.products = products;
            cart.save();
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async updateProductInCart(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId); 
            const product = cart.products.find(product => product._id === productId);
            product.quantity = quantity;
            cart.save();
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await cartsModel.findById(cartId);
            cart.products = [];
            cart.save();
            return cart
        } catch (error) {
            console.log(error)
        }
    }
}