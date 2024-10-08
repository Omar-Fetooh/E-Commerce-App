import mongoose from 'mongoose'

const subCategorySchema = mongoose.Schema({
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
    category: {
        type: mongoose.Types.ObjectId,
        ref: "category",
        required: true
    },
    createdBy: {
        type: String,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const subCategoryModel = mongoose.model('subCategory', subCategorySchema)

export default subCategoryModel;