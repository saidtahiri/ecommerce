import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL="http://localhost:3000/api";
  constructor(private http:HttpClient ) { }


  //Get All Products
  getAllProducts(numberOfResults=10):Observable<ServerResponse>{

    return this.http.get<ServerResponse>(this.SERVER_URL+"/products",{
      params:{limit : numberOfResults.toString()}
    });
  }


//Get Single Product From the Server
getSingleProduct(id:number):Observable<ProductModelServer>{
  return this.http.get<ProductModelServer>(this.SERVER_URL+"/products/"+id);
}



//Get Products From One Category
getProductsByCategory(categoryName:string):Observable<ProductModelServer[]>{
  return this.http.get<ProductModelServer[]>(this.SERVER_URL+"/products/category/"+categoryName);

}



}
