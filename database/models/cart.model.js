import mongoose, { Types } from "mongoose";

const cartSchema = mongoose.Schema({
    user: {
        type: String,
        ref: 'user',
        required: true
    },
    products: [{
        productId: {
            type: Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
)

const cartModel = mongoose.model('cart', cartSchema)

export default cartModel