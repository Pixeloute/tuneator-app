import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });

export class BillingService {
  async createCustomer(email: string) {
    return stripe.customers.create({ email });
  }

  async createInvoice(customerId: string, amount: number, currency = 'usd') {
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount,
      currency,
      description: 'Tuneator Enterprise Service',
    });
    return stripe.invoices.create({ customer: customerId, auto_advance: true });
  }

  async payInvoice(invoiceId: string) {
    return stripe.invoices.pay(invoiceId);
  }
} 