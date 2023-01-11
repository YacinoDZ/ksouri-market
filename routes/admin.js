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



adminRouter.post("/admin/update-category", admin, async (req, res) => {
  try {
    const { id, updatedName,updatedImageUrls, updatedDescription, updatedPriority,
    } = req.body;

    let category = await Category.findById(id);

    let categoryProduct = await Product.find({
      "category": category.name,
    });

    let categoryBrand = await Brand.find({
      "category": category.name,
    });

    let categoryOrder = await Order.find({
      "products.product.category": category.name,
    });

    /*console.log(category.name);
    console.log(categoryProduct.length);
    console.log(categoryBrand.length);
    console.log(categoryOrder.length);*/

    if(category.name != updatedName)
    {
        for (let i = 0; i < categoryOrder.length; i++) {
          for (let j = 0; j < categoryOrder[i].products.length; j++) {
            if(categoryOrder[i].products[j].product.category==category.name)
              {
                categoryOrder[i].products[j].product.category=updatedName;
                categoryOrder[i] = await categoryOrder[i].save();
                //continue;
              }
          }
        }

        for (let i = 0; i < categoryBrand.length; i++) {
            if(categoryBrand[i].category==category.name)
              {
                categoryBrand[i].category=updatedName;
                categoryBrand[i] = await categoryBrand[i].save();
                //continue;
              }
        }
        for (let i = 0; i < categoryProduct.length; i++) {
          if(categoryProduct[i].category==category.name)
            {
              categoryProduct[i].category=updatedName;
              categoryProduct[i] = await categoryProduct[i].save();
              //continue;
            }
      }
    }

    
    category.name = updatedName;
    if(updatedImageUrls && updatedImageUrls.length != 0)
            {category.images = updatedImageUrls;}
    category.description = updatedDescription;
    category.priority = updatedPriority;
    
    
    category = await category.save();
    res.json(category);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//get categories

adminRouter.get('/admin/get-categories', admin, async(req,res) => {

try{
    const categories = await Category.find({"priority": { $gt: -1 }});//, { sort: 'priority' });
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
    const { id, shouldBeDeleted } = req.body;

    if(shouldBeDeleted){
      //console.log(shouldBeDeleted);
      let category = await Category.findByIdAndDelete(id);
    
      res.json(category);
    }
    else{
      //console.log(shouldBeDeleted);
      let category = await Category.findById(id);
      category.priority = -1;

      category = await category.save();
      res.json(category);
    }
    

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


adminRouter.post("/admin/update-brand", admin, async (req, res) => {
  try {
    const { id, updatedName,updatedImageUrls, updatedDescription,
    } = req.body;

    let brand = await Brand.findById(id);

    let brandProduct = await Product.find({
      "brand": brand.name,
    });

    let brandOrder = await Order.find({
      "products.product.brand": brand.name,
    });

    /*console.log(category.name);
    console.log(categoryProduct.length);
    console.log(categoryBrand.length);
    console.log(categoryOrder.length);*/

    if(brand.name != updatedName)
    {
        for (let i = 0; i < brandOrder.length; i++) {
          for (let j = 0; j < brandOrder[i].products.length; j++) {
            if(brandOrder[i].products[j].product.brand==brand.name)
              {
                brandOrder[i].products[j].product.brand=updatedName;
                brandOrder[i] = await brandOrder[i].save();
                //continue;
              }
          }
        }

        for (let i = 0; i < brandProduct.length; i++) {
          if(brandProduct[i].brand==brand.name)
            {
              brandProduct[i].brand=updatedName;
              brandProduct[i] = await brandProduct[i].save();
              //continue;
            }
      }
    }
    
    brand.name = updatedName;
    if(updatedImageUrls && updatedImageUrls.length != 0)
            {brand.images = updatedImageUrls;}
    brand.description = updatedDescription;
    
    
    brand = await brand.save();
    res.json(brand);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
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
        const products = await Product.find({"addedAt": { $gt: 0 }});
        res.json(products);

    }catch(e){

        res.status(500).json({error: e.message});

    }
});


//Update the product

adminRouter.post("/admin/update-product", admin, async (req, res) => {
  try {
    const { id, updatedName,updatedImageUrls,updatedQrCode, updatedDescription,
       updatedPurchasePrice, updatedPrice, updatedQuantity,updatedExpiresAt,
    } = req.body;
    let product = await Product.findById(id);

    /*let productOrders = await Order.find({
      "products.product.name": product.name,
    });*/
    let productOrder = await Order.find({
      "products.product.category": product.category,
      "products.product.brand": product.brand,
      "products.product.name": product.name,
    });

    //console.log(productOrder.length);

    for (let i = 0; i < productOrder.length; i++) {
      for (let j = 0; j < productOrder[i].products.length; j++) {
        if(
          productOrder[i].products[j].product.category==product.category 
          && productOrder[i].products[j].product.brand==product.brand 
          && productOrder[i].products[j].product.name==product.name)
          {
            productOrder[i].products[j].product.name=updatedName;
            if(updatedImageUrls && updatedImageUrls.length != 0) {productOrder[i].products[j].product.images=updatedImageUrls;}
            productOrder[i].products[j].product.qrCode=updatedQrCode;
            productOrder[i].products[j].product.description=updatedDescription;
            productOrder[i].products[j].product.purchasePrice=updatedPurchasePrice;
            productOrder[i].products[j].product.price = updatedPrice;
            productOrder[i].products[j].product.quantity = updatedQuantity;
            productOrder[i].products[j].product.quantity = updatedExpiresAt;
            

            productOrder[i] = await productOrder[i].save();
            continue;
          }
      }
    }
    
    product.name = updatedName;
    if(updatedImageUrls && updatedImageUrls.length != 0){product.images = updatedImageUrls;}
    product.qrCode=updatedQrCode;
    product.description=updatedDescription;
    product.purchasePrice=updatedPurchasePrice;
    product.price = updatedPrice;
    product.quantity = updatedQuantity;
    product.expiresAt = updatedExpiresAt;
    
    product = await product.save();
    res.json(product);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//Delete the product

adminRouter.post('/admin/delete-product', admin, async(req,res)=>{
    try{
        //const {id} = req.body;
        const { id, shouldBeDeleted } = req.body;

        if(shouldBeDeleted){
          //console.log(shouldBeDeleted);
          let product = await Product.findByIdAndDelete(id);
        
          res.json(product);
        }
        else{
          //console.log(shouldBeDeleted);
          let product = await Product.findById(id);
          product.addedAt = 0.0;
          
          product = await product.save();

          res.json(product);
        }


        
    }catch(e){

        res.status(500).json({error: e.message});

    }
});



adminRouter.get('/admin/post-products_screen', admin, async(req,res) => {

  try{
      const products = await Product.find({"addedAt": { $gt: 0 }});
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

adminRouter.get('/admin/get-specific-orders/:productId', admin, async(req,res) => {

  try{
      let productId = req.params.productId;
     // console.log(productId);
     let productToDelete = await Product.findById(productId);
   
      let productOrder = await Order.find({
        "products.product.category": productToDelete.category,
        "products.product.brand": productToDelete.brand,
        "products.product.name": productToDelete.name,
      });

      res.json(productOrder);

  }catch(e){

      res.status(500).json({error: e.message});

  }
});

adminRouter.get('/admin/get-specific-category-orders/:categoryId', admin, async(req,res) => {

  try{
      let categoryId = req.params.categoryId;
     // console.log(productId);
     let categoryToDelete = await Category.findById(categoryId);
   
      let categoryOrder = await Order.find({
        "products.product.category": categoryToDelete.name,
      });

      res.json(categoryOrder);

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


adminRouter.post('/admin/cancel-order', admin, async(req,res)=>{
  try{
      const {id} = req.body;

      let order = await Order.findById(id);

      for (let j = 0; j < order.products.length; j++) {
        let product = await Product.findById(order.products[j].product.id);
        product.quantity += order.products[j].quantity;

        product = await product.save();
      }

      order = await Order.findByIdAndDelete(id);
      
      res.json(order);

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

adminRouter.get("/admin/range-analytics/:showAllProducts/:startPickedDate/:endPickedDate", admin, async (req, res) => {
  try {


  let showAllProducts = req.params.showAllProducts;
  
  //if(showAllProducts=="true") console.log(showAllProducts);  
  let startPickedDate = new Date(req.params.startPickedDate);
    // start date
    // adjust 0 before single digit date
    let startDay = ("0" + startPickedDate.getDate()).slice(-2);
  //  console.log(startDay);

    // start month
    let startMonth = ("0" + (startPickedDate.getMonth() + 1)).slice(-2);
    //console.log(startMonth);

    // start year
    let startYear = startPickedDate.getFullYear();
    //console.log(startYear);

    let endPickedDate = new Date(req.params.endPickedDate);
    // end date
    // adjust 0 before single digit date
    let endDay = ("0" + endPickedDate.getDate()).slice(-2);
    //console.log(endDay);

    // end month
    let endMonth = ("0" + (endPickedDate.getMonth() + 1)).slice(-2);
    //console.log(endMonth);

    // end year
    let endYear = endPickedDate.getFullYear();
    //console.log(endYear);

    const orders = await Order.find({});
    const products = await Product.find({});
    let totalEarnings = 0;
    let totalProfits = 0;

   /* let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let currentDay = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let currentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let currentYear = date_ob.getFullYear();
    //console.log(year);*/

    for (let i = 0; i < orders.length; i++) {

      let orderDate= new Date(orders[i].orderedAt) 
      let orderDay = ("0" + orderDate.getDate()).slice(-2);
      let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
      let orderYear = orderDate.getFullYear();

  /*    if( startDay  <= orderDay   && orderDay<=endDay &&
        startMonth<= orderMonth && orderMonth <= endMonth &&  
        startYear <= orderYear  && orderYear<= endYear)*/
    

      if(
        (startYear < orderYear || 
        (startYear == orderYear && startMonth < orderMonth)||
        (startYear == orderYear && startMonth == orderMonth &&  startDay  <= orderDay) ) && 
        (orderYear < endYear || 
        (orderYear == endYear && orderMonth < endMonth)||
        (orderYear == endYear && orderMonth == endMonth &&  orderDay  <= endDay) ))
       {
        /*console.log(startDay); 
        console.log(orderDay); 
        console.log(endDay); */

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

    for (let i = 0; i < products.length; i++) {

      let value = await fetchCategoryBrandWiseProduct(
        category = products[i].category,
        brand = products[i].brand,
        product = products[i].name,
        startDay, startMonth, startYear,endDay, endMonth, endYear);
      
      
      if(value[2]!=0 || showAllProducts=="true")
      {  
      let key = [products[i].category,products[i].brand,products[i].name];
      map[key] = map[key] || [];
      map[key].push(
        products[i].category,products[i].brand,products[i].name,value[2],value[0],value[1],products[i].quantity,products[i].expiresAt);

      
      let  categoryKey='category';
      let arrayCategory= map[categoryKey]|| [];
      //console.log(arrayCategory);
      map[categoryKey] = map[categoryKey] || [];

      let brandKey   = products[i].category;
      let arrayBrand = map[brandKey]|| [];
      //console.log(arrayBrand);
      map[brandKey]  = map[brandKey] || [];

      if(!arrayCategory.includes(products[i].category))
      {
      
      map[categoryKey].push(products[i].category);
      map[brandKey].push(products[i].brand);

      }
      else{
        if(!arrayBrand.includes(products[i].brand))
        {
          map[brandKey].push(products[i].brand);

        }

      } 
      /*console.log(value[0]);
      console.log(value[1]);
      console.log(value[2]);
      console.log(key);
      console.log(map[key]);*/
    }
  }
    
   /* for (let i = 0; i < categories.length; i++) {

      let value = await fetchCategoryWiseProduct(categories[i].name);
      let key=categories[i].name;
      map[key] = map[key] || [];
      map[key].push(value);
    }*/
    //console.log(map);
    res.json(map);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


async function fetchCategoryBrandWiseProduct(category, brand,product,
                startDay, startMonth, startYear,endDay, endMonth, endYear)
{
  let earnings = 0;
  let profits = 0;
  let soldQuantity=0;
  let categoryBrandProductOrders = await Order.find({
    "products.product.category": category,
    "products.product.brand": brand,
    "products.product.name": product,
  });

  

  for (let i = 0; i < categoryBrandProductOrders.length; i++) {

    let orderDate= new Date(categoryBrandProductOrders[i].orderedAt) 
    let orderDay = ("0" + orderDate.getDate()).slice(-2);
    let orderMonth = ("0" + (orderDate.getMonth() + 1)).slice(-2);
    let orderYear = orderDate.getFullYear();
    if(
      (startYear < orderYear || 
      (startYear == orderYear && startMonth < orderMonth)||
      (startYear == orderYear && startMonth == orderMonth &&  startDay  <= orderDay) ) && 
      (orderYear < endYear || 
      (orderYear == endYear && orderMonth < endMonth)||
      (orderYear == endYear && orderMonth == endMonth &&  orderDay  <= endDay) ))
     {
      //console.log(categoryBrandProductOrders[i].products.length);
      for (let j = 0; j < categoryBrandProductOrders[i].products.length; j++) {
        if(
          categoryBrandProductOrders[i].products[j].product.name==product
          &&categoryBrandProductOrders[i].products[j].product.category==category
          &&categoryBrandProductOrders[i].products[j].product.brand==brand
          )
        { earnings +=
          categoryBrandProductOrders[i].products[j].quantity *
          categoryBrandProductOrders[i].products[j].product.price;

          profits +=
            categoryBrandProductOrders[i].products[j].quantity *
            (categoryBrandProductOrders[i].products[j].product.price -
              categoryBrandProductOrders[i].products[j].product.purchasePrice) ;
          soldQuantity +=
              categoryBrandProductOrders[i].products[j].quantity;
          break;
       }
      }
      }
  }
  return [earnings,profits,soldQuantity];
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