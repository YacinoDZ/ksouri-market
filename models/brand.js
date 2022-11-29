const mongoose = require("mongoose");
const { productSchema } = require("./product");

const brandSchema = mongoose.Schema({

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

    category:{
        type: String,
        required: true,
    },


});

const Brand = mongoose.model("Brand",brandSchema);
module.exports = {Brand, brandSchema};
