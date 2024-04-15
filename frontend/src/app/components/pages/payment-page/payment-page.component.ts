import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { onErrorResumeNext } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {

  order:Order = new Order();
  constructor(private orderService: OrderService, 
    private router: Router, private cartService: CartService,
    private toastrService: ToastrService) {
      orderService.getNewOrderForCurrentUser().subscribe({
        next: (order) => {
          this.order = order;
        },
        error:() => {
          router.navigateByUrl('/chekcout');
        }
      })

   }

  payOrder(){

    this.order.paymentId='static payment string';
    this.orderService.payOrderAndSave(this.order).subscribe({
      next:(orderId)=>{
        this.cartService.clearCart();
        this.router.navigateByUrl('/track/' + orderId);
        this.toastrService.success(
          'Payment Saved Successfully',
          'Success'
        )

      },
      error: (error)=>{
        this.toastrService.error(
          'Payment Save Failed',
          'Error'
        )
        console.log(error);
      }
    });
    
    
    
  };
  ngOnInit(): void {
  }

}