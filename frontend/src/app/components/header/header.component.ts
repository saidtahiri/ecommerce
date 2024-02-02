import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { cartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductModelServer } from '../../models/product.model';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,RouterLinkActive,CommonModule,RouterLink,NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
  
})
export class HeaderComponent implements OnInit {

  cartData!: cartModelServer;
  cartTotal!:number;
  constructor(protected carteService :CartService,protected router:Router, private cdRef: ChangeDetectorRef){

  
  }
  ngOnInit(): void {
    this.carteService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.carteService.cartDataObservable$.subscribe(data => {
      this.cartData = data;
      // Trigger change detection after updating cart data
      this.cdRef.detectChanges();
    });
  }


  selectProduct(id: number) {
    this.router.navigate(['/products', id]).then();
    
  }
}
