import mongoose from 'mongoose';

const URI = 'mongodb+srv://fedeeribeiro:coderhouse@cluster0.hj7njhs.mongodb.net/preEntrega2?retryWrites=true&w=majority';

(async () => {
    try {
        await mongoose.connect(URI);
        console.log('Conectado a la base de datos correctamente.');
    } catch (error) {
        console.log('Error de conexión a la base de datos.');
        console.log(error)
    }
})();