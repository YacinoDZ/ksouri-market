const mongoose = require("mongoose");
const {brandSchema } = require("./brand");

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

    brands: [
        {
        brand: brandSchema,
        },
    ],

    priority: {
        type: Number,
        default: 0,
    },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
