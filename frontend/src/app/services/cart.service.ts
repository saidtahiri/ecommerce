import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { cartModelPublic, cartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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



  constructor(private http:HttpClient,
    productService:ProductService,
     private orderService:OrderService,
     private router:Router) {
      this.cartTotal$.next(this.cartDataServer.total);
      this.cartDataObservable$.next(this.cartDataServer);


   }





}
