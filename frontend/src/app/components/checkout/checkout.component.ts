  import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import Swal from 'sweetalert2';
  import { cartModelServer } from '../../models/cart.model';
  import { CartService } from '../../services/cart.service';
  import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';

  @Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CurrencyPipe,NgFor,NgIf,RouterLink],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
  })
  export class CheckoutComponent implements OnInit {

    cartTotal:number=0;
    cartData!: cartModelServer;
    constructor(private carteService :CartService,
                private router:Router,
                private orderService:OrderService){
    }

    ngOnInit(): void {
      this.carteService.cartDataObservable$.subscribe(data => this.cartData = data);
      this.carteService.cartTotal$.subscribe(total => this.cartTotal= total);
      
    }

    onCheckout() {
      Swal.fire({
        title: "Placing your order, please wait...", // Customize the loading message
        allowOutsideClick: false, // Prevent clicking outside the modal to close
        willOpen: () => {
          
          // Set showConfirmButton to false during loading
          Swal.update({ showConfirmButton: false });
          Swal.showLoading();
        },
      });
    
      this.orderService. getSingleOrder(1);
      // Simulate an asynchronous operation (replace this with your actual async logic)
      setTimeout(() => {
        // Close the Swal.fire modal when the async operation is complete
        Swal.close();
    
        // Display your actual Swal.fire dialog with the "OK" button
        Swal.fire({
          title: "Operation Complete",
          text: "Your order has been placed successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          showConfirmButton: true, // Show the "OK" button
        });
      }, 2000);
    }
    
    
    


  }
