import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatPaginator } from '@angular/material/paginator';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone :true,
  styleUrls: ['./home.component.css'],
  imports:[MatPaginator,NgFor,CurrencyPipe]
})
export class HomeComponent implements OnInit {
  products: any = [];
  pageSize = 10; // Set your desired page size
  currentPage = 1; // Set the initial page

  constructor(private cartService: CartService, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts(this.currentPage, this.pageSize).subscribe((prods) => {
      this.products = prods;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/products', id]).then();
  }

  addedToCart(id: number) {
    this.cartService.addProductToCard(id);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.loadProducts();
  }
}
