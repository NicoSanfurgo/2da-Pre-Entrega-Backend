const socketClient = io();

const productsContainer = document.getElementById('real-time-products-list');
const addProductForm = document.getElementById('add-product-form');
const deleteProductForm = document.getElementById('delete-product-form');

const addProduct = async (formDataObj) => {
    return await fetch('/api/products', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            body: JSON.stringify(formDataObj)
        })
    .then(response => response.json())
}

addProductForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(addProductForm);
    formData.append('status', true);
    const formDataObj = {};
    for (const pair of formData) {
        formDataObj[pair[0]] = pair[1]
    }
    console.log(JSON.stringify(formDataObj))
    await addProduct(formDataObj);
    socketClient.emit('updateProducts')
});

deleteProductForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(deleteProductForm);
    const productId = formData.get('id');

    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    socketClient.emit('updateProducts')
});

socketClient.on('fetchProducts', () => {
    fetch('/api/products', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
        let products = response.results.payload;
        let productList = products.map(product => {
            return `<p>ID: ${product._id} - TITLE: ${product.title} - DESCRIPTION: ${product.description} - PRICE: ${product.price} - CODE: ${product.code} - STOCK: ${product.stock} - CATEGORY: ${product.category} - STATUS: ${product.status}</p>`
        }).join(' ');
        productsContainer.innerHTML = productList;
    })
})