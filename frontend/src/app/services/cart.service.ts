import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { cartModelPublic, cartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { json } from 'stream/consumers';
import { ProductModelServer } from '../models/product.model';

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
  //Data Variable To Store the cart information on the Server
  private cartDataServer: cartModelServer = {
    total: 0,
    data: [{
      product: undefined,
      numInCart: 0
    }]
  }

  //Observables for the component To Subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartDataObservable$ = new BehaviorSubject<cartModelServer>(this.cartDataServer)



  constructor(private http: HttpClient, private productService: ProductService, private orderService: OrderService,
    private router: Router) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObservable$.next(this.cartDataServer);

    let info = JSON.parse(localStorage.getItem('cart') + '');
    //let infoo = JSON.parse(localStorage.getItem('cart')!);
    if (info === ! null && info === !undefined && info.prodData[0].incart === !0) {
      //this means that my localStorage is not empty. and has some information
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actuelProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actuelProductInfo;
            //TODO create calculateTotal function and replace it here 
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
  addProductToCard(id: number, quantity: number) {

    this.cartDataClient.total = this.cartDataClient.total + (quantity);





    this.productService.getSingleProduct(id).subscribe(product => {
      //1. if the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {


        this.cartDataServer.data[0].product = product;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;

        //TODO Calculate Total Amount 

        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = product.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObservable$.next({ ... this.cartDataServer });
        //Display a TOAST notification
      }
      //2. if the cart has some items
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product?.id === product.id)// -1 or a positive value

        //a . if that item is already in the cart ==> index variabl is a positive value
        if (index !== -1) {
          if (quantity !== undefined && quantity <= product.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < product.quantity ? quantity : product.quantity;

          } else {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < product.quantity ? this.cartDataServer.data[index].numInCart++ : product.quantity;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          //Display a TOAST notification
        }
        //b . if that item is not already in the cart.
        else {

          this.cartDataServer.data.push({
            numInCart: 1,
            product: product
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: product.id
          });
          //Display a TOAST notification

          //TODO Calculate Total Amount 
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartDataObservable$.next({ ... this.cartDataServer });
        }
      }
    });

  }

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < Number(data.product?.quantity) ? data.numInCart++ : data.product?.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      //TODO Calculate Total Amount 
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObservable$.next({ ... this.cartDataServer });
    }
    else {
      data.numInCart--;
      if (data.numInCart < 1) {
        //TODO Delete the product from the cart
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }
      else {
        this.cartDataObservable$.next({ ... this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        //TODO Calculate Total Amount 
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      }
    }
  }

  deleteProductFromCart(index: number) {
    if (window.confirm('Are You Sure you want to Remove The item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      //TODO Calculate Total Amount 
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { total: 0, prodData: [{ id: 0, incart: 0 }] }
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {total: 0,data: [{product: undefined,numInCart: 0}]};
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }
      else{
        this.cartDataObservable$.next({ ... this.cartDataServer });
      }

    }
    else{
      //if the user clicks the cancel button
      return;
    }

  }

  private calculateTotal(){
    let total = 0 ;
    this.cartDataServer.data.forEach(pro =>{
      const numInCart = pro.numInCart;
      const price:any =pro.product?.price;
      total *= numInCart *price;
    });
    this.cartDataServer.total= total;
    this.cartTotal$.next(this.cartDataServer.total);
  }
}
