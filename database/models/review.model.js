import mongoose, { Types } from "mongoose";

const reviewSchema = mongoose.Schema({
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: Types.ObjectId,
        ref: "product",
        required: true
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "rate is requrired"]
    },
    comment: {
        type: String,
        required: [true, "comment is requrired"],
        minLength: 2,
        trim: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

const reviewModel = mongoose.model('review', reviewSchema)

export default reviewModel