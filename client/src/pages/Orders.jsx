import { useEffect, useState } from 'react';
import { Check, Clock3, PackageCheck } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my-orders')
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setError('Could not load orders'));
  }, []);

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Your journey</p><h1 className="mt-2 text-4xl font-black">My orders</h1><p className="mt-2 text-sm text-slate-500">Track every purchase from our store to your door.</p></div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      {!orders.length && !error && <div className="surface rounded-[28px] py-16 text-center"><PackageCheck className="mx-auto text-premium-accent" size={32} /><p className="mt-4 font-black">No orders yet</p><p className="mt-1 text-sm text-slate-500">Your next great phone is waiting.</p></div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="surface rounded-[22px] p-5 sm:p-6">
            <div className="flex justify-between gap-4 flex-wrap">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Order #{order._id.slice(-6).toUpperCase()}</p><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
              <p className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black capitalize text-premium-accent">{order.orderStatus}</p>
            </div>
            <p className="mt-5 text-2xl font-black">
              ₹{Number(order.totalAmount).toLocaleString()} · {order.paymentStatus}
            </p>
            <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.title || item.product?.title} × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-slate-500"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={14} /></span> Order placed <span className="h-px w-8 bg-slate-200" /><span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-premium-accent"><Clock3 size={14} /></span> {order.orderStatus}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
