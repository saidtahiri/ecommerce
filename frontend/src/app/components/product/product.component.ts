import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
declare let $:any;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit,AfterViewInit {




  ngOnInit(): void {
    
  }


  constructor(private productService:ProductService,
              private carteService :CartService ,
              private route :ActivatedRoute ){

  }
  ngAfterViewInit(): void {
    
  }

}
