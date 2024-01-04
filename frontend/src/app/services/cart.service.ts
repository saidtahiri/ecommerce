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
  private cartDataClient:cartModelPublic={
    total:0,
    prodData:[{id:0,incart:0}]
  }
  //Data Variable To Store the cart information on the Server
  private cartDataServer:cartModelServer={
    total:0,
    data:[{
        product:undefined,
        numInCart:0
    }]
}

//Observables for the component To Subscribe
cartTotal$= new BehaviorSubject<number>(0);
cartDataObservable$ = new BehaviorSubject<cartModelServer>(this.cartDataServer)



  constructor(private http:HttpClient,private productService:ProductService,private orderService:OrderService,
     private router:Router) {
      this.cartTotal$.next(this.cartDataServer.total);
      this.cartDataObservable$.next(this.cartDataServer);

     let info = JSON.parse(localStorage.getItem('cart')+'');
      if(info ===! null && info===! undefined && info.prodData[0].incart ===!0 ){
        //this means that my localStorage is not empty. and has some information
        this.cartDataClient = info;

        this,this.cartDataClient.prodData.forEach(p=>{
          this.productService.getSingleProduct(p.id).subscribe((actuelProductInfo:ProductModelServer)=>{
            if(this.cartDataServer.data[0].numInCart===0 ){
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product =actuelProductInfo;
              //TODO create calculateTotal function and replace it here 
              this.cartDataClient.total =this.cartDataServer.total;
              localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            }
            else {
              //cart DataServer has already some entery on it
              this.cartDataServer.data.push({
                numInCart:p.incart,
                product:actuelProductInfo
              })
              //TODO create calculateTotal function and replace it here 
              this.cartDataClient.total =this.cartDataServer.total;
              localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            }

            this.cartDataObservable$.next({... this.cartDataServer});
          });
        });

      }




   }

  //Get infos from localstorage

  

  //check if thr variabl is null or has data on it






}
