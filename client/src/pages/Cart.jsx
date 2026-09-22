import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (!items.length) {
    return (
      <div className="surface rounded-[28px] py-20 text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Your bag is ready</p>
        <h1 className="mt-3 text-3xl font-black">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Explore the latest smartphones and find a device that fits your life.</p>
        <Link to="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-premium-900 px-5 py-3 text-sm font-bold text-white">
          Continue shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Your selection</p><h1 className="mt-2 text-4xl font-black">Shopping bag</h1><p className="mt-2 text-sm text-slate-500">{items.length} item{items.length > 1 ? 's' : ''} reserved for checkout.</p></div>
        {items.map((item) => (
          <div key={item.product} className="surface flex items-center gap-4 rounded-2xl p-4 sm:p-5">
            <div className="h-24 w-24 shrink-0 rounded-xl bg-[#f4f5f8] p-2 sm:h-28 sm:w-28"><img src={item.image} alt={item.title} className="h-full w-full object-contain" /></div>
            <div className="flex-1">
              <h3 className="font-black">{item.title}</h3>
              <p className="mt-2 font-black text-slate-900">₹{item.price.toLocaleString()}</p>
              <button onClick={() => removeFromCart(item.product)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500"><Trash2 size={14} /> Remove</button>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 p-1"><button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="rounded-full p-1.5 hover:bg-slate-100" aria-label="Decrease quantity"><Minus size={14} /></button><span className="w-5 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="rounded-full p-1.5 hover:bg-slate-100" aria-label="Increase quantity"><Plus size={14} /></button></div>
          </div>
        ))}
      </div>
      <div className="surface h-fit rounded-[22px] p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-black">Order summary</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-500"><p className="flex justify-between"><span>Subtotal</span><span className="font-bold text-slate-900">₹{total.toLocaleString()}</span></p><p className="flex justify-between"><span>Delivery</span><span className="font-bold text-emerald-600">Free</span></p></div>
        <div className="mt-5 flex justify-between border-t border-slate-200 pt-5"><span className="font-bold">Total</span><span className="text-2xl font-black">₹{total.toLocaleString()}</span></div>
        <Link to="/checkout" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-premium-900 py-3.5 font-bold text-white hover:bg-premium-800">
          Proceed to checkout <ArrowRight size={16} />
        </Link>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck size={14} className="text-emerald-500" /> Secure checkout</p>
      </div>
    </div>
  );
};

export default Cart;
