import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, "code is required"],
        minLength: 3,
        maxLength: 30,
        trim: true,
        unique: true
    },
    amount: {
        type: Number,
        required: [true, "amount is required"],
        min: 1,
        max: 100
    },
    createdBy: {
        type: String,
        ref: 'user',
        required: true
    },
    usedBy: {
        type: String,
        ref: "user",
    },
    fromDate: {
        type: String,
        required: [true, "fromDate is required"]
    },
    toDate: {
        type: String,
        required: [true, "toDate is required"]
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

const couponModel = mongoose.model('coupon', couponSchema)

export default couponModel