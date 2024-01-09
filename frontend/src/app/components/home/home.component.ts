import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink, RouterLinkActive } from '@angular/router';





@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor,CurrencyPipe,RouterLink,RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products:any = [];
  constructor(private productService :ProductService,private router:Router){
  }
  ngOnInit() {
    this.productService.getAllProducts().subscribe((prods)=>{
      this.products = prods;
      //console.log(this.products)
      
    });
  }
  selectProduct(id: Number) {
    this.router.navigate(['/products',id]).then();
  }
  addedToCart(id:number){
    Swal.fire({
      title: 'Success!',
      text: 'Product has been added to your cart',
      icon: 'success'
    });
  }
  

  }


