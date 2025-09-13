// Deleza Joias - Stripe Configuration
import Stripe from 'stripe';

// TODO: insira SK_TEST aqui no .env.local
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'COLOQUE_SUA_CHAVE_AQUI',
  {
    apiVersion: '2025-08-27.basil',
  }
);

export const createCheckoutSession = async (sessionData: any) => {
  // This would be implemented in a proper backend
  // For now, this is a placeholder for the checkout logic
  console.log('Checkout session data:', sessionData);
  return { sessionId: 'placeholder-session-id' };
};