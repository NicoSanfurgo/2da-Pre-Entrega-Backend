import { Router } from 'express';
import CartManager from '../persist/daos/mongoManag/CartsManager.js';
import ProductManager from '../persist/daos/mongoManag/ProductsManager.js';

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (request, response) => {
    const results = await productManager.getProducts(request.query);
    const products = (results.payload).map(product => {
        return {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: product.status
        }
    });
    response.render('home', { products })
});

router.get('/realTimeProducts', (request, response) => {
    response.render('realTimeProducts')
});

router.get('/products', async (request, response) => {
    const results = await productManager.getProducts(request.query);
    if (results.prevLink) {
        results.prevLink = (results.prevLink).replace('api', 'views')
    }
    if (results.nextLink) {
        results.nextLink = (results.nextLink).replace('api', 'views')
    }
    const products = (results.payload).map(product => {
        return {
            id: product._id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: product.status
        }
    });
    response.render('products', { products, results })
});

router.get('/carts/:cartId', async (request, response) => {
    const { cartId } = request.params;
    const cart = await cartManager.getProductsFromCart(cartId);
    const products = (cart[0].products).map(product => {
        return {
            id: product._id._id.toString(),
            title: product._id.title,
            price: product._id.price,
            thumbnail: product._id.thumbnail,
            code: product._id.code,
            quantity: product.quantity,
            sum: product.quantity * product._id.price
        }
    });
    const sumCart = products.reduce((accumulator, currentValue) => accumulator + currentValue.sum, 0);
    response.render('cart',{ products, cartId, sumCart })
});

export default router;