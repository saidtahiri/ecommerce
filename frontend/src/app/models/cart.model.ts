import { ProductModelServer } from "./product.model";

export interface cartModelServer{
    total:number;
    data:[{
        product:ProductModelServer,
        numInCart:number
    }]
}

export interface cartModelPublic{
    total:number,
    prodData:[{
        id:number,
        incart:number
    }]
}