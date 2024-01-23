import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, CurrencyPipe, RouterLink, RouterLinkActive, HttpClientModule, NgxSpinnerModule, ToastrModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: any = [];
  constructor(private cartService: CartService, private productService: ProductService, private router: Router) {
  }
  ngOnInit() {
    this.productService.getAllProducts().subscribe((prods) => {
      this.products = prods;
      //console.log(this.products)

    });
  }
  selectProduct(id: number) {
    this.router.navigate(['/products', id]).then();
  }
  addedToCart(id: number) {
    
    this.cartService.addProductToCard(id,1);

    Swal.fire({
      title: "Product Added",
      text: id + " Added To the card",
      icon: "success",
      timer: 1500,
      timerProgressBar: true
    });
  }


}


