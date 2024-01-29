import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { cartModelPublic, cartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf,RouterLink,NgFor,CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartData!: cartModelServer;
  cartTotal:number=0;
  subTotal:number=0;

  constructor(protected carteService :CartService,protected router:Router){
    
  }
  ngOnInit(): void {
    this.carteService.cartTotal$.subscribe(total =>this.cartTotal= total);
    this.carteService.cartDataObservable$.subscribe((data:cartModelServer) =>this.cartData = data);
  }
  changequantity(index: number,increase: boolean) {
    this.carteService.updateCartItems(index,increase)
    
    }
    


}
