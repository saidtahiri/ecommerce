import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
declare let $:any;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit,AfterViewInit {
  id!:any;
  product!:any;
  thumbImages:any[]=[];


  ngOnInit(): void {


    this.route.paramMap.pipe(map((param:ParamMap)=>{
      return param.get('id');
    })).subscribe(prodID=>{
      this.id =prodID;
      this.productService.getSingleProduct(this.id).subscribe(prod=>{
        this.product=prod;

        if(prod.images !== null){
          this.thumbImages = prod.images.split(";");
        }
      });
    });
    
  }


  constructor(private productService:ProductService,
              private carteService :CartService ,
              private route :ActivatedRoute ){

  }
  ngAfterViewInit(): void {/* 
    // Product Main img Slick
	$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs',
  });

	// Product imgs Slick
  $('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
		centerPadding: 0,
		vertical: true,
    asNavFor: '#product-main-img',
		responsive: [{
        breakpoint: 991,
        settings: {
					vertical: false,
					arrows: false,
					dots: true,
        }
      },
    ]
  });

	// Product img zoom
	var zoomMainProduct = document.getElementById('product-main-img');
	if (zoomMainProduct) {
		$('#product-main-img .product-preview').zoom();
	}
  */
} 
}
