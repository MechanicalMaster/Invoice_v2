export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  dimensions?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  itemId: string;
  name: string;
  hsn?: string;
  grossWeight?: number;
  netWeight?: number;
  purity?: string;
  rate: number;
  labour?: number;
  quantity: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  gstNumber: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  stateCode: string;
  
  // Customer details
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerStateCode: string;
  
  // Payment details
  paymentMode: 'CASH' | 'CARD' | 'UPI' | 'BANK TRANSFER';
  
  // Items
  items: InvoiceItem[];
  
  // Calculations
  cgst: number;
  sgst: number;
  totalGst: number;
  subTotal: number;
  additionalDiscount: number;
  totalAmount: number;
  
  notes?: string;
}

export interface Label {
  id: string;
  itemId: string;
  format: 'small' | 'medium' | 'large';
  quantity: number;
  customText?: string;
  createdAt: Date;
} 