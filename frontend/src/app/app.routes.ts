import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import path from 'path';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { NewarrivalsComponent } from './components/newarrivals/newarrivals.component';
import { FossilsComponent } from './components/fossils/fossils.component';
import { MineralsComponent } from './components/minerals/minerals.component';
import { MeteoritesComponent } from './components/meteorites/meteorites.component';
import { FaqComponent } from './components/faq/faq.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactusComponent } from './components/contactus/contactus.component';

export const routes: Routes = [
   {
    path:'',component:HomeComponent
   },
   {
    path:'home',component:HomeComponent
   },
   {
    path:'products/:id',component:ProductComponent
   },
   {
    path:'cart',component:CartComponent
   },
   {
    path:'checkout',component:CheckoutComponent
   },
   {
    path:'thankyou',component:ThankyouComponent
   }, 
   {
      path:'newarrivals',component:NewarrivalsComponent
     }, 
     {
      path:'fossils',component:FossilsComponent
     }, 
     {
      path:'minerals',component:MineralsComponent
     }, 
     {
      path:'meteorites',component:MeteoritesComponent
     }, 
     {
      path:'faq',component:FaqComponent
     }, 
     {
      path:'aboutus',component:AboutusComponent
     }, 
     {
      path:'contactus',component:ContactusComponent
     }, 
   
];
