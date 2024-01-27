import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { cartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,RouterLinkActive,CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers:[CartService]
})
export class HeaderComponent implements OnInit {

  cartData!: cartModelServer;
  cartTotal!:number;
  constructor(protected carteService :CartService,protected router:Router){

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


  selectProduct(id: number) {
    this.router.navigate(['/products', id]).then();
  }
}
