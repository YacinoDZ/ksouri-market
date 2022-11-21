const mongoose = require("mongoose");
const { productSchema } = require("./product");

const categorySchema = mongoose.Schema({

    name:{
        type: String,
        required: true,
        trim:true,
        },    

    images:[
        {
            type: String,
            required: true,
        },
    ],


    description:{
        type: String,
        required: true,
        trim:true,
    },

    products: [
        {
        product: productSchema,
        },
    ],

    priority: {
        type: Number,
        default: 0,
    },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
