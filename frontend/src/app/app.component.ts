import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet,RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [  RouterLink,CommonModule, RouterOutlet, HomeComponent,HeaderComponent, FooterComponent,HttpClientModule],
    providers:[ProductService]
})  
export class AppComponent {
  title = 'frontend';
}
