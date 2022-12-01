const express =require("express");

const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const  Order = require("../models/order");
const  Category = require("../models/category");
const  {Brand} = require("../models/brand");
const  {Product} = require("../models/product");


//Category //Category //Category //Category //Category 
//Category //Category //Category //Category //Category 
//Category //Category //Category //Category //Category 

//add category


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


//get categories

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

//delete category

adminRouter.post('/admin/delete-category', admin, async(req,res)=>{
try{
    const {id} = req.body;
    let category = await Category.findByIdAndDelete(id);
    
    res.json(category);

}catch(e){

    res.status(500).json({error: e.message});

}
});


//Brands //Brands//Brands//Brands//Brands//Brands//Brands//Brands//Brands
//Brands //Brands//Brands//Brands//Brands//Brands//Brands//Brands//Brands 
//Brands //Brands//Brands//Brands//Brands//Brands//Brands//Brands//Brands


//add brand

adminRouter.post("/admin/add-brand", admin, async(req,res)=>{
  try{
      const {name, description, images, category}=req.body;

      let brand = new Brand({
          name,
          description,
          images,
          category,
      });

      brand = await brand.save();

      res.json(brand);

  }catch(e){

      res.status(500).json({error: e.message});

  }

});


//Get all your brands

adminRouter.get('/admin/get-brands', admin, async(req,res) => {

  try{
      const brands = await Brand.find({});
      res.json(brands);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});

//Delete the brand

adminRouter.post('/admin/delete-brand', admin, async(req,res)=>{
  try{
      const {id} = req.body;
      let brand = await Brand.findByIdAndDelete(id);
      
      res.json(brand);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});






//Products //Products//Products //Products//Products //Products
//Products //Products//Products //Products//Products //Products
//Products //Products//Products //Products//Products //Products

//add product

adminRouter.post("/admin/add-product", admin, async(req,res)=>{
    try{
        const {name, description, images,quantity,price, category, brand,
          purchasePrice,addedAt,expiresAt,qrCode}=req.body;

        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            purchasePrice,
            addedAt,
            expiresAt,
            qrCode,
            category,
            brand,
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



adminRouter.get('/admin/post-products_screen', admin, async(req,res) => {

  try{
      const products = await Product.find({});
      res.json(products);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});


//Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders 
//Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders 
//Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders //Orders 

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


adminRouter.post('/admin/delete-order', admin, async(req,res)=>{
  try{
      const {id} = req.body;
      let order = await Order.findByIdAndDelete(id);
      
      res.json(order);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});




adminRouter.get("/admin/analytics", admin, async (req, res) => {
    try {
      const orders = await Order.find({});
      const categories = await Category.find({});
      let totalEarnings = 0;
      let totalProfits = 0;
  
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].products.length; j++) {
          totalEarnings +=
            orders[i].products[j].quantity * orders[i].products[j].product.price;
          
          totalProfits += orders[i].products[j].quantity * 
            (orders[i].products[j].product.price - orders[i].products[j].product.purchasePrice);
        }
      }
      // CATEGORY WISE ORDER FETCHING
      let map = {};//new Map();
      let key='totalEarnings';
      map[key] = map[key] || [];
      map[key].push(totalEarnings);

      key='totalProfits';
      map[key] = map[key] || [];
      map[key].push(totalProfits);
      
      /*mappping.set("totalEarnings",totalEarnings);
      for (let i = 0; i < categories.length; i++) {

        let value = await fetchCategoryWiseProduct(categories[i].name);
        mappping.set(categories[i].name,value);
      
      }

      const arr = Array.from(mappping);

      */
      for (let i = 0; i < categories.length; i++) {

        let value = await fetchCategoryWiseProduct(categories[i].name);
        let key=categories[i].name;
        map[key] = map[key] || [];
        map[key].push(value);
        //console.log(key);
        //console.log(value);
      
      }
      //console.log(mappping);
      /*let mobileEarnings = await fetchCategoryWiseProduct("Téléphone");
      
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
      };*/
  
      res.json(map);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });



adminRouter.get("/admin/today-analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    const categories = await Category.find({});
    let totalEarnings = 0;
    let totalProfits = 0;

    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let currentDay = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let currentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let currentYear = date_ob.getFullYear();
    //console.log(year);

    for (let i = 0; i < orders.length; i++) {

      let orderDate= new Date(orders[i].orderedAt) 
      let orderDay = ("0" + orderDate.getDate()).slice(-2);
      let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
      let orderYear = orderDate.getFullYear();
      
     if(orderDay==currentDay &&
       orderMonth == currentMonth && orderYear == currentYear)
      {
        for (let j = 0; j < orders[i].products.length; j++) 
        {
          totalEarnings +=
            orders[i].products[j].quantity * orders[i].products[j].product.price;
          
          totalProfits += orders[i].products[j].quantity * 
           (orders[i].products[j].product.price - orders[i].products[j].product.purchasePrice);
        }
      }
    }
    // CATEGORY WISE ORDER FETCHING
    let map = {};//new Map();
    let key='totalEarnings';
    map[key] = map[key] || [];
    map[key].push(totalEarnings);

    key='totalProfits';
    map[key] = map[key] || [];
    map[key].push(totalProfits);

    for (let i = 0; i < categories.length; i++) {

      let value = await fetchCategoryWiseProduct(categories[i].name);
      let key=categories[i].name;
      map[key] = map[key] || [];
      map[key].push(value);
    }
    res.json(map);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


async function fetchCategoryWiseProduct(category) {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
  });


  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let currentDay = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let currentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let currentYear = date_ob.getFullYear();


  for (let i = 0; i < categoryOrders.length; i++) {

    let orderDate= new Date(categoryOrders[i].orderedAt) 
    let orderDay = ("0" + orderDate.getDate()).slice(-2);
    let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
    let orderYear = orderDate.getFullYear();
    if(orderDay==currentDay &&
      orderMonth == currentMonth && orderYear == currentYear)
     {
      for (let j = 0; j < categoryOrders[i].products.length; j++) {
        earnings +=
          categoryOrders[i].products[j].quantity *
          categoryOrders[i].products[j].product.price;
       }
      }
  }
  return earnings;
}



adminRouter.get("/admin/today-sold-products", admin, async (req, res) => {
  try {
    let map = {};
    let totalSoldProducts = 0;
    let orders = await Order.find({});

    let date_ob = new Date();
  
    // current date
    // adjust 0 before single digit date
    let currentDay = ("0" + date_ob.getDate()).slice(-2);
  
    // current month
    let currentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
    // current year
    let currentYear = date_ob.getFullYear();
    //console.log(year);
   
    for (let i = 0; i < orders.length; i++) {
  
      let orderDate= new Date(orders[i].orderedAt) 
      let orderDay = ("0" + orderDate.getDate()).slice(-2);
      let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
      let orderYear = orderDate.getFullYear();
      
    if(orderDay==currentDay &&
      orderMonth == currentMonth && orderYear == currentYear)
      {
        //console.log(productOrders[i].products.length);
        for (let j = 0; j < orders[i].products.length; j++) 
        {
          let key=orders[i].products[j].product.name;
          let value = orders[i].products[j].quantity;
          map[key] = map[key] || [];
          //if(map[key]==0)
          //console.log(key);
          
          
          if(map[key]==0)
          {
            totalSoldProducts++;
            map[key].push(value);
          }
          else{
          //console.log(map[key]);
          newValue= parseInt(map[key][0]) + value;
            map[key].pop();
            map[key].push(newValue);
          }
          //console.log(map);
          //console.log(map[key][0]);
        }

      }
    }
    
    let key='totalSoldProducts';
    map[key] = map[key] || [];
    map[key].push(totalSoldProducts);

    res.json(map);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



  adminRouter.get("/admin/today-sold2-products", admin, async (req, res) => {
    try {
      let map = {};
      let totalSoldProducts = 0;
      let products = await Product.find({});
      
      //console.log(products.length);

      for (let k = 0; k < products.length; k++)
      //for (let k = 1; k < 2; k++)  
      {
        //console.log(products[k].name);
        let name=products[k].name;
        let quantityCurrentProduct = 0;
        /*while (quantityCurrentProduct==null)
        {quantityCurrentProduct = await fetchProductsWiseOrder(name);}*/
        
        //console.log(quantityCurrentProduct);

        if(quantityCurrentProduct!=0){
          totalSoldProducts++;
          let value = quantityCurrentProduct;
          let key=products[k].name;
          map[key] = map[key] || [];
          map[key].push(value);
        }
      }
      
      let key='totalSoldProducts';
      map[key] = map[key] || [];
      map[key].push(totalSoldProducts);
  
      res.json(map);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });






async function fetchProductsWiseOrder(product) {
  let productOrders = await Order.find({
    "products.product.name": product,
  });
  let quantityCurrentProduct=0;

        
  let date_ob = new Date();
  
  // current date
  // adjust 0 before single digit date
  let currentDay = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let currentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let currentYear = date_ob.getFullYear();
  //console.log(year);
 
  for (let i = 0; i < productOrders.length; i++) {

    let orderDate= new Date(productOrders[i].orderedAt) 
    let orderDay = ("0" + orderDate.getDate()).slice(-2);
    let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
    let orderYear = orderDate.getFullYear();
    
  if(orderDay==currentDay &&
    orderMonth == currentMonth && orderYear == currentYear)
    {
      //console.log(productOrders[i].products.length);
      for (let j = 0; j < productOrders[i].products.length; j++) 
      {
        quantityCurrentProduct += productOrders[i].products[j].quantity;
      }
    }
  }
  console.log(quantityCurrentProduct);
  return quantityCurrentProduct;
}
  





module.exports=adminRouter;