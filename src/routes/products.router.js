import { Router } from 'express';
import ProductManager from '../persist/daos/mongoManag/ProductsManager.js';

const router = Router();

const productManager = new ProductManager();

router.get('/', async (request, response) => {
    const results = await productManager.getProducts(request.query);
    if (results) {
        response.json({ message: 'Productos encontrados.', results })
    } else {
        response.json({ message: 'No hay productos disponibles.' })
    }
});

router.get('/:productId', async (request, response) => {
    const { productId } = request.params;
    const productFound = await productManager.getProductById(productId);
    if (productFound) {
        response.json({ message: 'Producto encontrado.', product: productFound })
    } else {
        response.json({ message: 'Producto no encontrado.' })
    }
});

router.post('/', async (request, response) => {
    const newProduct = request.body;
    const addedProduct = await productManager.addProduct(newProduct);
    if (addedProduct) {
        response.json({ message: 'Producto agregado exitosamente.', product: addedProduct })
    } else {
        response.json({ message: 'El producto no se ha podido agregar.' })
    }
});

router.put('/:productId', async (request, response) => {
    const { productId } = request.params;
    const newValuesObject = request.body;
    const updatedProduct = await productManager.updateProduct(productId, newValuesObject);
    if (updatedProduct) {
        response.json({ message: 'Se ha actualizado el producto exitosamente.', product: updatedProduct })
    } else {
        response.json({ message: 'El producto no se ha podido actualizar.' })  
    }    
});

router.delete('/:productId', async (request, response) => {
    const { productId } = request.params;
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
        response.json({ message: 'Se ha eliminado el producto exitosamente.', product: deletedProduct })
    } else {
        response.json({ message: 'El producto no se ha podido eliminar.' })
    }
});

export default router;