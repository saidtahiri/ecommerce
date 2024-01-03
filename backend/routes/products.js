var express = require('express');
var router = express.Router();
var {database} = require('../config/helpers');

/* GET All Products. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  //set the current page number
  let page = ( req.query.page !== undefined && req.query.page !==0) ? req.query.page : 1;

  //set the limit of items to 10 per page
  const limit =(req.query.limit !== undefined && req.query.limit !==0) ? req.query.limit : 10 ;

  let startValue,endValue;
  if(page>0){
    startValue = (page*limit) -limit; // 0,10,20,30....
    endValue = page*limit;
  }else{
    startValue=0;
    endValue = 10;
  }

  database.table('products as p').join([{
    table:'categories as c',
    on :'c.id = p.cat_id'
  }]).withFields(['c.title as Category', 
    'p.title as Name',
    'p.price',
    'p.description',
    'p.quantity',
    'p.image',
    'p.id']).slice(startValue,endValue).sort({id: .1}).getAll().then(prods =>{
      if(prods.length>0){
        res.status(200).json({
          count:prods.length,
          products:prods
        })
      }else{
        res.json({message:'No products Founds'})
      }
    }).catch(err=>{
      console.log(err);
    })
}); 



/* GET a Single Product. */
router.get('/:productId',(req,res,next)=>{

  let proId = req.params.productId;
  console.log(proId)

  database.table('products as p')
  .join([{table:'categories as c',
    on :'c.id = p.cat_id'
  }])
    .withFields(['c.title as Category', 
    'p.title as Name',
    'p.price',
    'p.quantity',
    'p.image',
    'p.images',
    'p.id']).filter({'p.id':proId})
    .get().then(prod =>{
      if(prod){
        res.status(200).json(prod)
      }else{
        res.json({message:'No product found with that ID ' + proId})
      }
    }).catch(err=>{
      console.log(err);
    })

})



/* GET all Products from one category */
router.get('/category/:catName',(req,res,next)=>{

  //fetch the category name from the URL
  const catTitle =req.params.catName;

  //set the current page number
  let page = ( req.query.page !== undefined && req.query.page !==0) ? req.query.page : 1;

  //set the limit of items to 10 per page
  const limit =(req.query.limit !== undefined && req.query.limit !==0) ? req.query.limit : 10 ;

  let startValue,endValue;
  if(page>0){
    startValue = (page*limit) -limit; // 0,10,20,30....
    endValue = page*limit;
  }else{
    startValue=0;
    endValue = 10;
  }

  database.table('products as p').join([{
    table:'categories as c',
    on : ` c.id = p.cat_id WHERE c.title LIKE '%${catTitle}%'` 
  }]).withFields(['c.title as Category', 
    'p.title as Name',
    'p.price',
    'p.quantity',
    'p.image',
    'p.id']).slice(startValue,endValue).sort({id: .1}).getAll().then(prods =>{
      if(prods.length>0){
        res.status(200).json({
          count:prods.length,
          products:prods
        });
        console.log(prods);
      }else{
        res.json({message:'No products Found from given Category'})
      }
    }).catch(err=>{
      console.log(err);
    })

})

module.exports = router;
