import { useState, useEffect, useCallback } from 'react';
import { loadState, saveState } from '@/utils/storage';
import { useModel } from 'umi';

export type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface OrderItem {
	productId: number;
	productName: string;
	quantity: number;
	price: number;
}

export interface Order {
	id: string;
	customerName: string;
	phone: string;
	address: string;
	products: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	createdAt: string;
}

const STORAGE_KEY = 'app_orders';

const seedOrders: Order[] = [
	{
		id: 'DH001',
		customerName: 'Nguyễn Văn A',
		phone: '0912345678',
		address: '123 Nguyễn Huệ, Q1, TP.HCM',
		products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
		totalAmount: 25000000,
		status: 'Chờ xử lý',
		createdAt: '2024-01-15',
	},
];

export default () => {
	const [orders, setOrders] = useState<Order[]>(() => loadState(STORAGE_KEY, seedOrders));
	const { updateStock } = useModel('products');

	useEffect(() => {
		saveState(STORAGE_KEY, orders);
	}, [orders]);

	const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
		const newId = `DH${String(Date.now()).slice(-3)}${Math.floor(Math.random() * 100)}`;
		const today = new Date().toISOString().split('T')[0];

		const newOrder: Order = {
			id: newId,
			createdAt: today,
			status: 'Chờ xử lý',
			...orderData,
		};

		setOrders((prev) => [newOrder, ...prev]);
	}, []);

	const updateOrderStatus = useCallback(
		(orderId: string, newStatus: OrderStatus) => {
			const order = orders.find((o) => o.id === orderId);
			if (!order) return;

			const oldStatus = order.status;

			if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
				order.products.forEach((item) => {
					updateStock(item.productId, -item.quantity);
				});
			} else if (oldStatus === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
				order.products.forEach((item) => {
					updateStock(item.productId, item.quantity);
				});
			}

			setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
		},
		[orders, updateStock],
	);

	return {
		orders,
		addOrder,
		updateOrderStatus,
	};
};
