import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaiementService } from '../service/paiement/paiement.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment',
  template: `
    <div class="stripe-container">
      <div class="card-element" #cardElement></div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
      <button
        (click)="handlePayment()"
        [disabled]="!cardComplete || processing"
        class="btn btn-primary mt-3">
        {{ processing ? 'Processing...' : 'Pay with Card' }}
      </button>
      <div class="success-message" *ngIf="paymentSuccess">
        Payment successful!
      </div>
    </div>
  `,
  styles: [`
    .stripe-container {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 20px 0;
    }
    .card-element {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
    .error-message {
      color: red;
      margin-top: 10px;
    }
    .success-message {
      color: green;
      margin-top: 10px;
    }
  `]
})
export class StripePaymentComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() factureId: number = 0;
  @ViewChild('cardElement') cardElement!: ElementRef;

  private stripe!: Stripe;
  private card!: StripeCardElement;
  error: string = '';
  cardComplete: boolean = false;
  processing: boolean = false;
  paymentSuccess: boolean = false;

  constructor(private paiementService: PaiementService) {}

  async ngOnInit() {
    const stripeInstance = await loadStripe('pk_test_51REcYgIVISgMihBDP83L1z5bZIijXc2ZHEJLAubfaqMvXOnRhWoVwclxrXD28Zadi6WWoIINDPy3MGTHPhpeMD8s00A7JRoeh1');
    if (!stripeInstance) {
      this.error = 'Stripe failed to load';
      return;
    }
    this.stripe = stripeInstance;

    const elements = this.stripe.elements();
    this.card = elements.create('card');

    // Wait for component to render
    setTimeout(() => {
      this.card.mount(this.cardElement.nativeElement);

      this.card.on('change', (event) => {
        this.cardComplete = event.complete;
        if (event.error) {
          this.error = event.error.message;
        } else {
          this.error = '';
        }
      });
    });
  }

  async handlePayment() {
    this.processing = true;
    this.error = '';
    this.paymentSuccess = false;

    try {
      // Create payment intent
      const intentResponse = await this.paiementService.createPaymentIntent(
        this.amount,
        this.factureId
      ).toPromise();

      // Confirm the payment
      const result = await this.stripe.confirmCardPayment(intentResponse.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Negzaoui2' // You can make this dynamic
          }
        }
      });

      if (result.error) {
        this.error = result.error.message || 'Payment failed';
      } else {
        // Payment successful
        this.paymentSuccess = true;

        // Confirm the payment on your backend
        await this.paiementService.confirmPayment(
          result.paymentIntent.id,
          this.factureId
        ).toPromise();

        // Emit success event or handle success
        window.location.reload(); // Or use a better way to refresh the payments list
      }
    } catch (e: any) {
      this.error = e.message || 'An error occurred';
    } finally {
      this.processing = false;
    }
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }
}
