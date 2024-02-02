var express = require('express');
var router = express.Router();
var {database} = require('../config/helpers');



/* GET all orders */
router.get('/',(req,res,next)=>{
    database.table('orders_details as od').join([{
        table : 'orders as o',
        on:'o.id = od.order_id'
    },{
        table : 'products as p',
        on:'p.id = od.product_id'
    },{
        table : 'users as u',
        on:'u.id = o.user_id'
    }]).withFields(['o.id','p.title as name','p.description','p.price','u.username']).sort({price : -1})
    .getAll()
    .then(orders=>{
        if(orders.length>0){
            res.status(200).json({
                length:orders.length ,
                    orders:orders
                
            })
        }
    }).catch(error=>{
        console.log(error+' error1')
    }) 
})



/* GET Single Order */
router.get('/:id',(req,res,next)=>{

    let id = req.params.id;
    database.table('orders_details as od').join([{
        table : 'orders as o',
        on:'o.id = od.order_id'
    },{
        table : 'products as p',
        on:'p.id = od.product_id'
    },{
        table : 'users as u',
        on:'u.id = o.user_id '/* WHERE o.id ='+id */
    }]).withFields(['od.order_id','o.id','p.title as name','p.description','p.price','u.username'])
    .filter({'o.id' :id}).getAll()
    .then(orders=>{
        if(orders.length>0){
            res.status(200).json({
                    orders:orders
            })
        }
        else{
            res.status(404).json({
                message:'No Orders for the OrderId = '+id
                
            })
        }
          
        
    }).catch(error=>{
        console.log(error+' error2')
    }) 

})

router.post('/new',(req,res,next)=>{
    let {u , products} = req.body;

    /* let u = req.body.u;
    let products = req.body.products; */ 
    console.log(req.body + "error 3");
    if( u>0 && !isNaN(u) && u !== undefined){
        database.table('orders')
        .insert({
            user_id :u
        }).then((newOrderId) =>{
            if(newOrderId){
                products.forEach(async (p) => {
                    let data = await database.table('products').filter({id:p.id})
                    .withFields(['quantity']).get();
                    let inCart =p.incart;
                    //deduct the number of pieces ordered from the quantity column in database
                    if(data.quantity>0){
                            data.quantity = data.quantity- inCart;
                            if(data.quantity<0){
                                data.quantity = 0;
                            }
                    }else{
                        data.quantity = 0;
                        //return;
                    }

                    //insert the details to the newly generated ordre ID
                    database.table('orders_details').insert({
                        order_id: newOrderId,
                        product_id :p.id,
                        quantity :inCart
                    }).then(newId=>{
                            database.table('products').filter({id:p.id})
                            .update({quantity:data.quantity}).then(successNum=>{

                            }).catch(err=>console.log(err +" error 4"))
                    }).catch(err=>console.log(err+" error 5"))
                });
            }   
            else{
                res.json({message:"new order failed while adding ordre details" ,
                success :false})

            }
            res.json({
                message:"Order successfuly placed with order ID :" +newOrderId+' ' ,
                success : true,
                order_id : newOrderId,
                products:products
            })

        }).catch(err=>{
            console.log(err+" error 6")
        })
    }
    else{
        res.json({
            message:"new order Faileddd",
            success:false
        })
    }
    console.log(u,products + "error 7");

})

/* Fake Payement Gatway */
router.get('/payement',(req,res,next)=>{
    setTimeout(()=>{
        res.status(200).json({success:true})
    },3000);
});

module.exports= router;