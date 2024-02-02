import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { cartModelPublic, cartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serverUrl = "http://localhost:3000/api";

  private cartDataClient: cartModelPublic = {
    total: 0,
    prodData: [{ id: 0, incart: 0 }]
  }

  private productModelServer = {  
    Category: '',
    Name: '',
    price: 0,
    description: '',
    quantity: 0,
    image: '',
    images: '',
    id: 0,
  }

  private cartDataServer: cartModelServer = {
    total: 0,
    data: [{
      product: this.productModelServer,
      numInCart: 0
    }]
  }

  cartTotal$ = new BehaviorSubject<number>(0);
  cartDataObservable$ = new BehaviorSubject<cartModelServer>(this.cartDataServer);

  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObservable$.next(this.cartDataServer);

    if (typeof localStorage !== 'undefined') {
      var info = JSON.parse(localStorage.getItem('cart') + '');
    } else {
      console.error('localStorage is not supported in this environment');
    }

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObservable$.next({ ...this.cartDataServer });
        });
      });
    }
  }

  addProductToCard(id: number, quantity?: number) {
  this.cartDataClient.total = this.cartDataClient.total + (quantity ? quantity : 0);

  this.productService.getSingleProduct(id).subscribe(
    (product) => {
      let existingItemIndex = this.cartDataServer.data.findIndex(p => p.product.id === product.id);

      if (existingItemIndex !== -1) {
        // Product already exists in the cart, update the quantity
        this.cartDataServer.data[existingItemIndex].numInCart += quantity || 1;
        this.cartDataClient.prodData[existingItemIndex].incart = this.cartDataServer.data[existingItemIndex].numInCart;
        Swal.fire({
          title: "ProductUpdated",
          text: product.Name + " Updated the quantity of the product in the cart",
          icon: "info",
          timer: 1500,
          timerProgressBar: true,
        });

      } else {
        // Product is not in the cart, add it
        this.cartDataServer.data.push({
          numInCart: quantity !== undefined ? quantity : 1,
          product: product
        });

        this.cartDataClient.prodData.push({
          id: product.id,
          incart: quantity !== undefined ? quantity : 1
        });
        Swal.fire({
          title: "Product Added",
          text: product.Name + " Added To the cart",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
        });
      }

      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObservable$.next({ ...this.cartDataServer });
      this.cartTotal$.next(this.cartDataServer.total);

      // Display a TOAST notification
      

      // Added this line to trigger the update
      this.cartDataObservable$.next({ ...this.cartDataServer });
    },
    (err) => {
      console.error(err);
    }
  );
}


  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < Number(data.product?.quantity) ? data.numInCart++ : data.product?.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObservable$.next({ ...this.cartDataServer });
    } else {
      data.numInCart--;
      if (data.numInCart < 1) {
        this.deleteProductFromCart(index, true);
        this.cartDataObservable$.next({ ...this.cartDataServer });
      } else {
        this.cartDataObservable$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  deleteProductFromCart(index: number, yes: boolean) {
    if (yes) {
      Swal.fire({
        title: "Remove product from the cart?",
        text: "Are You Sure you want to Remove This item from the cart ? You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: " #d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartDataServer.data.splice(index, 1);
          this.cartDataClient.prodData.splice(index, 1);
          this.calculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          if (this.cartDataClient.total === 0) {
            this.cartDataClient = { total: 0, prodData: [{ id: 0, incart: 0 }] }
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataClient.total = this.cartDataServer.total;
            this.calculateTotal();
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          if (this.cartDataServer.total === 0) {
            this.cartDataServer = { total: 0, data: [{ product: this.productModelServer, numInCart: 0 }] };
            this.cartDataObservable$.next({ ...this.cartDataServer });
          } else {
            this.cartDataObservable$.next({ ...this.cartDataServer });
          }
          Swal.fire({
            title: "Deleted!",
            text: "item has been deleted.",
            icon: "success"
          });
        }
      });
    }
  }

  private calculateTotal() {
    var total = 0;
    this.cartDataServer.data.forEach(pro => {
      const numInCart = pro.numInCart;
      const price = pro.product.price;
      total += numInCart * price;
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(total);
  }

  public checkoutFromCart(userID: number) {
    // ... (existing code)
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        product: {
          Category: '',
          Name: '',
          price: 0,
          description: '',
          quantity: 0,
          image: '',
          images: '',
          id: 0,
        },
        numInCart: 0
      }]
    }
    this.cartDataObservable$.next({ ...this.cartDataServer });
  }

  public calculateSubTotal(index: number): number {
    let subTotal = 0;
    let product = this.cartDataServer.data.find(p => p.product.id === index);
  
    if (product) {
      subTotal = product.numInCart * product.product.price;
    }
  
    return subTotal;
  }
  
}

interface Success {
  success: boolean
}

interface OrderRespons {
  order_id: number;
  success: boolean;
  messsage: string;
  products: [{
    id: string,
    numInCart: string
  }];
}
