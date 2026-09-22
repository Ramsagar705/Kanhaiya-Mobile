import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { LocateFixed, MapPin, ShieldCheck } from 'lucide-react';

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getMapTiles = ({ latitude, longitude }) => {
  const zoom = 15;
  const scale = 2 ** zoom;
  const x = ((longitude + 180) / 360) * scale;
  const y =
    ((1 - Math.asinh(Math.tan((latitude * Math.PI) / 180)) / Math.PI) / 2) * scale;
  const startX = Math.floor(x) - 1;
  const startY = Math.floor(y) - 1;

  return Array.from({ length: 6 }, (_, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const tileX = startX + column;
    const tileY = startY + row;
    return {
      key: `${tileX}-${tileY}`,
      left: `${column * 33.333}%`,
      top: `${row * 50}%`,
      src: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
    };
  });
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location services are not supported by this browser.');
      return;
    }

    setError('');
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`
          );
          if (!response.ok) throw new Error('Could not find an address for this location.');

          const data = await response.json();
          const address = data.address || {};
          const streetAddress = [address.house_number, address.road || address.neighbourhood]
            .filter(Boolean)
            .join(' ');

          setForm((prev) => ({
            ...prev,
            address: streetAddress || data.display_name || '',
            city: address.city || address.town || address.village || address.municipality || '',
            state: address.state || '',
            pincode: address.postcode || '',
          }));
          setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        } catch (locationError) {
          setError(locationError.message || 'Could not find an address for this location.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setError('Unable to access your location. Please allow location access and try again.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: form,
      };

      if (paymentMethod === 'cod') {
        await api.post('/orders/cod', orderData);
        clearCart();
        navigate('/orders');
        return;
      }

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        throw new Error('Online payment is unavailable. Please try again.');
      }

      const { data } = await api.post('/payment/create-order', { amount: total });
      const payment = new window.Razorpay({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'MobiShop',
        description: 'Mobile Shop order',
        order_id: data.order.id,
        prefill: { name: form.fullName, contact: form.phone },
        handler: async (response) => {
          try {
            await api.post('/orders', { ...orderData, ...response });
            clearCart();
            navigate('/orders');
          } catch (err) {
            setError(err.response?.data?.message || 'Could not verify payment');
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => setIsSubmitting(false) },
      });
      payment.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not place order');
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="surface rounded-[28px] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Step 1 of 2</p>
        <h1 className="mt-2 text-4xl font-black">Shipping details</h1>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-premium-900 text-white">1</span><span className="h-px w-10 bg-slate-200" /><span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">2</span><span>Payment</span></div>
        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={isLocating}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-premium-accent py-3 font-bold text-premium-900 disabled:opacity-60"
        >
          <LocateFixed size={18} />
          {isLocating ? 'Finding your address...' : 'Use current location'}
        </button>
        {location && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700">
              <MapPin size={16} className="text-premium-accent" />
              Location selected
            </div>
            <div className="relative h-48 overflow-hidden bg-gray-100">
              {getMapTiles(location).map((tile) => (
                <img
                  key={tile.key}
                  src={tile.src}
                  alt=""
                  className="absolute w-1/3 h-1/2 object-cover"
                  style={{ left: tile.left, top: tile.top }}
                  loading="lazy"
                />
              ))}
              <MapPin className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full text-red-600 drop-shadow" size={30} fill="currentColor" />
            </div>
            <p className="px-3 py-1 text-[10px] text-gray-500">Map data © OpenStreetMap contributors</p>
          </div>
        )}
        {['fullName', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
          <input
            key={field}
            required
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 capitalize outline-none focus:border-premium-accent"
          />
        ))}
        <fieldset className="space-y-3 pt-2">
          <legend className="font-black">Payment method</legend>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Cash on delivery</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Online payment</span>
          </label>
        </fieldset>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-premium-900 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {isSubmitting ? 'Processing...' : `${paymentMethod === 'cod' ? 'Place COD order' : 'Pay online'} · ₹${total.toLocaleString()}`}
        </button>
      </form>
      <aside className="surface h-fit rounded-[22px] p-6 lg:sticky lg:top-24"><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Your order</p><p className="mt-2 text-2xl font-black">₹{total.toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">{items.length} item{items.length > 1 ? 's' : ''}</p><div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-500"><p className="flex justify-between"><span>Subtotal</span><span className="font-bold text-slate-900">₹{total.toLocaleString()}</span></p><p className="flex justify-between"><span>Delivery</span><span className="font-bold text-emerald-600">Free</span></p></div><div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700"><ShieldCheck size={16} /> Secure payment powered by Razorpay</div></aside>
      <div className="bg-white rounded-3xl border border-gray-100 p-8 h-fit">
        <h2 className="font-bold text-lg mb-4">Order</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.product} className="flex justify-between text-sm">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Checkout;
