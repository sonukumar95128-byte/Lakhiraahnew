export type OrderStatus = "Pending" | "Paid" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

export type DummyOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { slug: string; name: string; quantity: number; price: string }[];
  totalInPaise: number;
  status: OrderStatus;
  createdAt: string;
};

export const orderStatuses: OrderStatus[] = ["Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"];

// No orders yet — this fills in as real orders come through checkout.
export const dummyOrders: DummyOrder[] = [];
