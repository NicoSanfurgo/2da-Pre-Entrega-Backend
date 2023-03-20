import fs from 'fs';
import ProductManager from './ProductsManager.js'

const productManager = new ProductManager('./utils/products.json');

export default class CartManager {
    constructor(path){
        this.path = path;
        if(!fs.existsSync(path)) fs.writeFileSync(path, '[]')
    }

    #setId = async () => {
        const cartsArray = await this.#getCarts();
        if(cartsArray.length !== 0){
            let id = 0;
            cartsArray.forEach(cart => {
                if(cart.id >= id){
                    id = cart.id + 1
                }
            });
            return id
        }else{
            return 1
        }
    }

    #getCarts = async () => {
        const cartsFromFile = await fs.promises.readFile(this.path, 'utf-8');
        const cartsArray = JSON.parse(cartsFromFile);
        if (!cartsArray) console.log('Error. Not found.')
        else return cartsArray    
    }

    #getCartById = async (id) => {
        const cartsArray = await this.#getCarts();
        const cartFound = cartsArray.find(cart => cart.id === id);
        if (cartFound) return cartFound
    }

    async addCart(){
        const cartsArray = await this.#getCarts();
        const cart = {
            id: await this.#setId(),
            products: []
        }
        cartsArray.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(cartsArray));
        console.log('Se ha creado el carrito exitosamente.');
        return cart
    }

    async getProductsFromCart(cartId){
        const cart = await this.#getCartById(cartId);
        if (!cart) console.log('Error. Carrito no encontrado.')
        else return cart.products
    }

    async addProductToCart(cartId, productId){
        const cartsArray = await this.#getCarts();
        const cartFound = cartsArray.find(cart => cart.id === cartId)
        if (!cartFound) console.log('Error. Carrito no encontrado.')
        else{
            const product = await productManager.getProductById(productId);
            if (product) {
                let i = 0;
                let productFound = false;
                while (i < cartFound.products.length && productFound === false) {
                    if (cartFound.products[i].product === product.id){
                        cartFound.products[i].quantity += 1;
                        productFound = true
                    }
                    i += 1
                }
                if (productFound === false) {
                    const newProduct = {
                        product: product.id,
                        quantity: 1
                    }
                    cartFound.products.push(newProduct)
                }
                await fs.promises.writeFile(this.path, JSON.stringify(cartsArray));
                console.log('Se ha agregado el producto al carrito exitosamente.')
                return true
            }
        }
    }
}