import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { cartModelServer } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  clickme(){
    Swal.fire({
      title: 'Success!',
      text: 'Your data has been saved.',
      icon: 'success'
    });
  }
}
