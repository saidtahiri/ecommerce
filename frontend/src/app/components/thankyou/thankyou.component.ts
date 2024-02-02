import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [NgFor,CurrencyPipe],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css'
})
export class ThankyouComponent implements OnInit {

  message!:string;
  orderId!:number;
  cartTotal!:number;
  products:[]=[];

  constructor(private router:Router,orderService:OrderService){

  }


  ngOnInit(): void {
    
  }



}
