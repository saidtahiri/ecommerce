export interface ProductModelServer {
    Category: string;
    Name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;
    images: string;
    id: number;
  }
  
  export interface ServerResponse {
    count: number;
    products: ProductModelServer[];
  }
  