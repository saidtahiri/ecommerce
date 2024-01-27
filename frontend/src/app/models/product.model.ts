export interface ProductModelServer{
    Category:string;
    Name :string;
    price : number;
    description:string;
    quantity:number;
    image:string;
    images:string;
    id :number;
}

export interface ServerResponse{
    count:number;
    products:ProductModelServer[];
}


/* {
    "Category":"Shoes",
    "Name":"PEGASUS 33 Running Shoes For Men",
    "price":59.99,
    "description":"The Nike Zoom Pegasus Turbo 2 is updated with a feather-light upper, while innovative foam brings revolutionary responsiveness to your long-distance training",
    "quantity":1,
    "image":"https://i.pinimg.com/originals/43/40/8e/43408ee5a8d234752ecf80bbc3832e65.jpg",
    "images":null,
    "id":6
 } */