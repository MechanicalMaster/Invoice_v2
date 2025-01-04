export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  dimensions?: string;
  category?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 