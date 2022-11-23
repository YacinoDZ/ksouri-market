const express =require("express");

const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const  Order = require("../models/order");
const  Category = require("../models/category");
const  {Product} = require("../models/product");


//add product

adminRouter.post("/admin/add-product", admin, async(req,res)=>{
    try{
        const {name, description, images,quantity,price, category}=req.body;

        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });

        product = await product.save();

        //res.json({...product, token: req.token });

        res.json(product);

    }catch(e){

        res.status(500).json({error: e.message});

    }

});

//Get all your products

adminRouter.get('/admin/get-products', admin, async(req,res) => {

    try{
        const products = await Product.find({});
        res.json(products);

    }catch(e){

        res.status(500).json({error: e.message});

    }
});

//Delete the product

adminRouter.post('/admin/delete-product', admin, async(req,res)=>{
    try{
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        
        res.json(product);

    }catch(e){

        res.status(500).json({error: e.message});

    }
});


adminRouter.get('/admin/get-orders', admin, async(req,res) => {

    try{
        const orders = await Order.find({});
        res.json(orders);

    }catch(e){

        res.status(500).json({error: e.message});

    }
});


adminRouter.get('/admin/get-orders', admin, async(req,res) => {

  try{
      const orders = await Order.find({});
      res.json(orders);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});



adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
    try {
      const { id, status } = req.body;
      let order = await Order.findById(id);
      order.status = status;
      order = await order.save();
      res.json(order);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


adminRouter.get("/admin/analytics", admin, async (req, res) => {
    try {
      const orders = await Order.find({});
      let totalEarnings = 0;
  
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].products.length; j++) {
          totalEarnings +=
            orders[i].products[j].quantity * orders[i].products[j].product.price;
        }
      }
      // CATEGORY WISE ORDER FETCHING
      let mobileEarnings = await fetchCategoryWiseProduct("Téléphone");
      let essentialEarnings = await fetchCategoryWiseProduct("Basique");
      let applianceEarnings = await fetchCategoryWiseProduct("Élec.ménager");
      let booksEarnings = await fetchCategoryWiseProduct("Livres");
      let fashionEarnings = await fetchCategoryWiseProduct("Mode");
  
      let earnings = {
        totalEarnings,
        mobileEarnings,
        essentialEarnings,
        applianceEarnings,
        booksEarnings,
        fashionEarnings,
      };
  
      res.json(earnings);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


async function fetchCategoryWiseProduct(category) {
    let earnings = 0;
    let categoryOrders = await Order.find({
      "products.product.category": category,
    });
  
    for (let i = 0; i < categoryOrders.length; i++) {
      for (let j = 0; j < categoryOrders[i].products.length; j++) {
        earnings +=
          categoryOrders[i].products[j].quantity *
          categoryOrders[i].products[j].product.price;
      }
    }
    return earnings;
  }


  ////From here me


  adminRouter.post("/admin/add-category", admin, async(req,res)=>{
    try{
        const {name, description, images,priority}=req.body;

        let category = new Category({
            name,
            description,
            images,
            priority,
        });

        category = await category.save();


        res.json(category);

    }catch(e){

        res.status(500).json({error: e.message});
    }
});


adminRouter.get('/admin/get-categories', admin, async(req,res) => {

  try{
      const categories = await Category.find({});//, { sort: 'priority' });
      res.json(categories);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});

function compare(key, order = 'asc') {
  return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) 
    return 0;
  
const first = (a[key].toLowerCase() in sortingOrder) ? sortingOrder[a[key]] : Number.MAX_SAFE_INTEGER;
const second = (b[key].toLowerCase() in sortingOrder) ? sortingOrder[b[key]] : Number.MAX_SAFE_INTEGER;
  
let result = 0;
if (first < second) 
    result = -1;
else if (first > second) 
    result = 1;
return (order === 'desc') ? ~result : result
  };
}



adminRouter.post('/admin/delete-category', admin, async(req,res)=>{
  try{
      const {id} = req.body;
      let category = await Category.findByIdAndDelete(id);
      
      res.json(category);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});


adminRouter.post('/admin/delete-order', admin, async(req,res)=>{
  try{
      const {id} = req.body;
      let order = await Order.findByIdAndDelete(id);
      
      res.json(order);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});


adminRouter.get('/admin/post-products_screen', admin, async(req,res) => {

  try{
      const products = await Product.find({});
      res.json(products);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});



module.exports=adminRouter;