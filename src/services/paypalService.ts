/**
 * PayPal Developer Platform Integration (Sandbox Environment)
 * 
 * Endpoints and payload schemas based on the PayPal REST API v2:
 * - Orders API: https://api-m.sandbox.paypal.com/v2/checkout/orders
 * - Webhooks API: https://api-m.sandbox.paypal.com/v1/notifications/webhooks
 */

export interface PayPalOrderPayload {
  intent: 'CAPTURE';
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
  }>;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED';
  payer: {
    email_address: string;
    payer_id: string;
  };
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

export const PAYPAL_SANDBOX_CLIENT_ID = 'test'; // PayPal Free Sandbox Client ID
export const PAYPAL_SANDBOX_API_BASE = 'https://api-m.sandbox.paypal.com';

/**
 * Creates an order structure formatted for PayPal Sandbox Orders API v2
 */
export function buildPayPalOrder(amountInINR: number, merchantDesc: string): PayPalOrderPayload {
  // Convert INR to USD approximate for PayPal standard sandbox test currency (1 USD ~ 85 INR)
  const usdValue = (amountInINR / 85).toFixed(2);
  
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: `pacepay_${Date.now()}`,
        description: `PacePay Checkout: ${merchantDesc}`,
        amount: {
          currency_code: 'USD',
          value: usdValue,
        },
      },
    ],
  };
}

/**
 * Handles incoming PayPal Sandbox Webhook event (PAYMENT.CAPTURE.COMPLETED)
 */
export function parsePayPalWebhookEvent(eventPayload: any): {
  merchant: string;
  amountINR: number;
  captureId: string;
  timestamp: string;
} {
  const resource = eventPayload?.resource || {};
  const usdAmount = parseFloat(resource?.amount?.value || '15.00');
  const amountINR = Math.round(usdAmount * 85);
  const captureId = resource?.id || `PAYID-${Date.now().toString(36).toUpperCase()}`;

  return {
    merchant: resource?.custom_id || 'PayPal Sandbox Merchant',
    amountINR,
    captureId,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
}

