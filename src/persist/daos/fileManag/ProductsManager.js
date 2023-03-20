import fs from 'fs';

export default class ProductManager {
    constructor(path){
        this.path = path;
        if(!fs.existsSync(path)) fs.writeFileSync(path, '[]')
    }

    #setId = async () => {
        const productsArray = await this.getProducts();
        if(productsArray.length !== 0){
            let id = 0;
            productsArray.forEach(product => {
                if(product.id >= id){
                    id = product.id + 1
                }
            });
            return id
        }else{
            return 1
        }
    }

    #isCodeInUse = async (code) => {
        const productsArray = await this.getProducts();
        return productsArray.some(product => product.code === code)
    } 

    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        console.log(title, description, price, thumbnail, code, stock, category, status);
        if(!title || !description || !price || !code || !stock || !category || !status){
            console.log('Error. No se pueden dejar campos vacíos al agregar un nuevo producto.')
        }else if(await this.#isCodeInUse(code)){
            console.log('Error. No se pueden ingresar dos productos con el mismo code.')    
        }else{
            const product = {
                id: await this.#setId(),
                title,
                description,
                price,
                thumbnail: [thumbnail],
                code,
                stock,
                category,
                status: true
            }
            const productsArray = await this.getProducts();
            productsArray.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
            console.log('Se ha agregado el producto exitosamente.')
            return product
        }
    }

    async getProducts(queries){
        const productsFromFile = await fs.promises.readFile(this.path, 'utf-8');
        const productsArray = JSON.parse(productsFromFile);
        if (!productsArray) console.log('Error. Not found.')
        else{
            if(queries){
                const { limit } = queries;
                return productsArray.slice(0, limit)
            }else{
                return productsArray
            }
        }    
    }

    async getProductById(id){
        const productsArray = await this.getProducts();
        const productFound = productsArray.find(product => product.id === id);
        if (!productFound) console.log('Error. Producto no encontrado.')
        else return productFound
    }

    async updateProduct(id, prop, value){
        const productsArray = await this.getProducts();
        const productFound = productsArray.find(product => product.id === id);
        if(productFound){
            if(prop === 'title'){
                productFound.title = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'description'){
                productFound.description = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'price'){
                productFound.price = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'thumbnail'){
                productFound.thumbnail.push(value);
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'code'){
                productFound.code = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'stock'){
                productFound.stock = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'category'){
                productFound.category = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else if(prop === 'status'){
                productFound.status = value;
                await fs.promises.writeFile(this.path, JSON.stringify(productsArray));
                console.log('Se ha actualizado el producto exitosamente.');
                return productFound
            }else{
                console.log('Error. Se ha ingresado una propiedad no válida.')
            }
        }else{
            console.log('Error. No se ha encontrado ningún producto con el id ingresado.')
        }
    }

    async deleteProduct(id){
        const productsArray = await this.getProducts();
        if(productsArray.find(product => product.id === id)){
            const newProductsArray = productsArray.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray));
            console.log('Se ha eliminado el producto exitosamente.');
            return true
        }else{
            console.log('Error. No se ha encontrado ningún producto con el id ingresado.')
        }
    }
}