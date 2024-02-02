  import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  
  import { cartModelServer } from '../../models/cart.model';
  import { CartService } from '../../services/cart.service';
  import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CurrencyPipe,NgFor,NgIf],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
  })
  export class CheckoutComponent implements OnInit {

    cartTotal:number=0;
    cartData!: cartModelServer;
    constructor(private carteService :CartService,
                private router:Router,
                private orderService:OrderService){
    }

    ngOnInit(): void {
      this.carteService.cartDataObservable$.subscribe(data => this.cartData = data);
      this.carteService.cartTotal$.subscribe(total => this.cartTotal= total);
      console.log(this.cartData);
    }

    onCheckout() {
      
      }


  }
