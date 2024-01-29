import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { cartModelPublic, cartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serverUrl = "http://localhost:3000/api";


  //Data Variable To Store the cart information on the client's local Storage
  private cartDataClient: cartModelPublic = {
    total: 0,
    prodData: [{ id: 0, incart: 0 }]
  }
  
  private productModelServer ={
     
      Category:'',
      Name :'',
      price : 0,
      description:'',
      quantity:0,
      image:'',
      images:'',
      id :0,
  }
  //Data Variable To Store the cart information on the Server
  private cartDataServer: cartModelServer = {
    total: 0,
    data: [{
      product: this.productModelServer,
      numInCart: 0  
    }]
  }

  //Observables for the component To Subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartDataObservable$ = new BehaviorSubject<cartModelServer>(this.cartDataServer)



  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObservable$.next(this.cartDataServer);


    /* console.log(this.productModelServer); */
    if (typeof localStorage !== 'undefined') {
      // Your code that uses localStorage
      var info = JSON.parse(localStorage.getItem('cart') + '');
    } else {
      console.error('localStorage is not supported in this environment');
    }
    //let infoo = JSON.parse(localStorage.getItem('cart')!);
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      //this means that my localStorage is not empty. and has some information
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actuelProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actuelProductInfo;
            //TODO create calculateTotal function and replace it here 

            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          else {
            //cart DataServer has already some entery on it
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actuelProductInfo
            })
            //TODO create calculateTotal function and replace it here 
            this.calculateTotal()
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }

          this.cartDataObservable$.next({ ... this.cartDataServer });
        });
      });
    }
  }

  //Get infos from localstorage



  //check if thr variabl is null or has data on it

  //method that Adds the Products to the card
  addProductToCard(id: number, quantity?: number) {

    
    this.cartDataClient.total = this.cartDataClient.total + (quantity ? quantity : 0);
    let m =this.cartDataClient.total;
    

    this.productService.getSingleProduct(id).subscribe((product) => {

      /* debugger; */
      
      /* console.log(this.cartDataServer.data[0].product); */
      //1. if the cart is empty
      if (this.cartDataServer.data.length > 0) {
        console.log("the card is empty , and this is the first add!");
        this.cartDataServer.data[0].product = product;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        //TODO Calculate Total Amount 
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = product.id;
        this.calculateTotal()
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObservable$.next({ ... this.cartDataServer });
        this.cartTotal$.next(this.cartDataServer.data.length)
        
        

      /*   private cartDataServer: cartModelServer = {
          total: 0,
          data: [{
            product: this.productModelServer,
            numInCart: 0  
          }]
        } */
        
        //Display a TOAST notification
        Swal.fire({
          title: "Product Added",
          text: product.Name + " " + " Added To the card",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
        
        
        
      }
      //2. if the cart has some items
      else {
        console.log("the card is not  empty");
        let index = this.cartDataServer.data.findIndex(p => p.product.id === product.id)// -1 or a positive value

        //a . if that item is already in the cart ==> index variabl is a positive value
        if (index !== -1) {
          console.log("the card is not  empty and the added item is already on the card");
          if (quantity !== undefined && quantity <= product.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < product.quantity ? quantity : product.quantity;

          } else {
            this.cartDataServer.data[index].numInCart < product.quantity ? this.cartDataServer.data[index].numInCart++ : product.quantity;
          }
          this.calculateTotal();
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

          //Display a TOAST notification
          Swal.fire({
            title: "Product updated",
            text: product.Name + "updated To the card",
            icon: "info",
            timer: 1500,
            timerProgressBar: true,
          });

          this.cartDataClient.total = this.cartDataServer.total;
          this.calculateTotal()
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
        //b . if that item is not already in the cart.
        else {

          this.cartDataServer.data.push({
            numInCart: 1,
            product: product
          });
          this.cartDataClient.prodData.push({
            id: product.id
            , incart: 1
          });
          this.calculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          //Display a TOAST notification
          Swal.fire({
            title: "Product Updated",
            text: product.Name + " Quantity updated in the card",
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
          });

          //TODO Calculate Total Amount 

          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartDataObservable$.next({ ... this.cartDataServer });
        }
      }
    },err=>{
      console.error(err)
    });
  }


  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < Number(data.product?.quantity) ? data.numInCart++ : data.product?.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      //TODO Calculate Total Amount 
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObservable$.next({ ... this.cartDataServer });
    }
    else {
      data.numInCart--;
      if (data.numInCart < 1) {
        //TODO Delete the product from the cart
        this.deleteProductFromCart(index,true);
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }
      else {
        this.cartDataObservable$.next({ ... this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        //TODO Calculate Total Amount 
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }






  deleteProductFromCart(index: number,yes:boolean) {

    if(yes){
      Swal.fire({
        title: "Are You Sure you want to Remove The item?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: " #d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            this.cartDataServer.data.splice(index, 1);
        this.cartDataClient.prodData.splice(index, 1);
        //TODO Calculate Total Amount 
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        if (this.cartDataClient.total === 0) {
          this.cartDataClient = { total: 0, prodData: [{ id: 0, incart: 0 }] }
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
        else {
          //localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartDataClient.total = this.cartDataServer.total;
          this.calculateTotal();
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
        if (this.cartDataServer.total === 0) {
          this.cartDataServer = { total: 0, data: [{ product: this.productModelServer, numInCart: 0 }] };
          this.cartDataObservable$.next({ ... this.cartDataServer });
        }
        else {
          this.cartDataObservable$.next({ ... this.cartDataServer });
        }        
          Swal.fire({
            title: "Deleted!",
            text: "item has been deleted.",
            icon: "success"
          });
        }
      });
    }

    
    /* if (window.confirm('Are You Sure you want to Remove The item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      //TODO Calculate Total Amount 
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { total: 0, prodData: [{ id: 0, incart: 0 }] }
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      else {
        //localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataClient.total = this.cartDataServer.total;
        this.calculateTotal()
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = { total: 0, data: [{ product: this.productModelServer, numInCart: 0 }] };
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }
      else {
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }
    } 
    else {
      //if the user clicks the cancel button
      return;
    }*/
  }




  private calculateTotal() {
    
    let total = 0;
    this.cartDataServer.data.forEach(pro => {
      const numInCart = pro.numInCart;
      const price= pro.product.price;
      total += numInCart * price;
      /* console.log(total); */
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(total);

  }










  private checkoutFromCart(userID: number) {
    this.http.post(`${this.serverUrl}/orders/payment`, null).subscribe((res: any) => {
      if (res.success) {
        this.resetServerData();
        this.http.post(`${this.serverUrl}/orders/new`, {
          userID: userID,
          products: this.cartDataClient.prodData
        }).subscribe((data: any) => {
          this.orderService.getSingleOrder(data.order_id).subscribe(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.messsage,
                  products: prods,
                  total: this.cartDataClient.total,
                  orderId: data.order_id
                }
              };
              //TODO Hide spinner
              this.spinner.hide().then();
              this.router.navigate(['thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {
                  total: 0,
                  prodData: [{ id: 0, incart: 0 }]
                };
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
            else {
              this.spinner.hide().then();
              this.router.navigateByUrl('/checkout').then();
              Swal.fire({
                title: "Order Status",
                text: " Sorry Failed to book the Order",
                icon: "error",
                timer: 1500,
                timerProgressBar: true,
              });
            }
          })
        });
      }
    });
  }





  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        product:{ 
            Category:'',
            Name :'',
            price : 0,
            description:'',
            quantity:0,
            image:'',
            images:'',
            id :0,
        },
        numInCart: 0
      }]
    }
    this.cartDataObservable$.next({ ... this.cartDataServer });
  }




  public  calculateSubTotal(index:number):number{
    /* debugger; */
    let subTotal=0;
    let p = this.cartDataServer.data;



    p.forEach(p=>{
      console.log(p)
      if(p.product.id === index){
        console.log('good')
      }
      else{
        console.log('bad')
      }
    })
    
/*     console.log(index);
    console.log(this.cartDataServer.data); */
    /* console.log(p) */
    //subTotal+= p.product.price * p.numInCart;
    /* console.log(p.numInCart) */
    return subTotal;
  }
  
 /*  let subTotal = 0;

  let p = this.cartDataServer.data[index];
  // @ts-ignore
  subTotal = p.product.price * p.numInCart;

  return subTotal; */




}









interface Success {
  success: boolean
}







interface OrderRespons {
  order_id: number;
  success: boolean;
  messsage: string;
  products: [{
    id: string,
    numInCart: string
  }];
}