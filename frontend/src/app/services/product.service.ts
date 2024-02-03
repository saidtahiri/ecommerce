import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL = "http://localhost:3000/api";

  constructor(private http: HttpClient) {}

// product.service.ts
getAllProducts(page: number = 1, limit: number = 12): Observable<ServerResponse> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

  return this.http.get<ServerResponse>(this.SERVER_URL + "/products", { params });
}


  // Get Single Product From the Server
  getSingleProduct(id: Number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL + "/products/" + id);
  }

  // Get Products From One Category
  getProductsByCategory(categoryName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + "/products/category/" + categoryName);
  }
}






