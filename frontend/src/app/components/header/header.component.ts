import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { cartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[CartService]
})
export class HeaderComponent implements OnInit {

  cartData!: cartModelServer;
  cartTotal!:number;
  constructor(protected carteService :CartService){

  }

  ngOnInit(): void {
    this.carteService.cartTotal$.subscribe(total =>this.cartTotal= total);
    this.carteService.cartDataObservable$.subscribe(data =>this.cartData = data)
    
  }
  
  clickme(){
    Swal.fire({
      title: 'Success!',
      text: 'Your data has been saved.',
      icon: 'success'
    });
  }
}
