import mongoose from "mongoose";

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 3,
        maxLength: 30,
        lowercase: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        minLength: 3,
        maxLength: 30,
        trim: true,
        unique: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    customId: String,
    createdBy: {
        type: String,
        ref: 'user',
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

const brandModel = mongoose.model('brand', brandSchema)

export default brandModel