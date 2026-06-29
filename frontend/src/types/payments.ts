export type CreateOrderPayload = {
  items: {
    course_id: number;
    negotiation_paise?: number;
  }[];
  sales_link_token?: string | null;
};

export type CreateOrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  payment_order_id: number;
};

export type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type PaymentHistoryItem = {
  order_id: number;
  razorpay_order_id: string;
  amount_paise: number;
  status: string;
  paid_at: string | null;
};

export type PaymentHistoryResponse = {
  orders: PaymentHistoryItem[];
};
