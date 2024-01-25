import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private products: ProductResponseModel[] = [];
  private serverUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) { 
    //this is  my constructor
  }

  getSingleOrder(orderId: number): Observable<ProductResponseModel[]> {
    return this.http.get<ProductResponseModel[]>(this.serverUrl + '/orders' + orderId);
  }
}


interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}