import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

cartsSchema.pre('find', function (next) {
    this.populate({ path:'products._id' });
    next()
});

export const cartsModel = mongoose.model('Carts', cartsSchema);