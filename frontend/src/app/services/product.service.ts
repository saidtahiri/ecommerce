import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL="http://localhost:3000/api";
  constructor(private http:HttpClient ) { }


  getAllProducts(numberOfResults=10){

    return this.http.get(this.SERVER_URL+"/products",{
      params:{limit : numberOfResults.toString()}
    });
  }
}
