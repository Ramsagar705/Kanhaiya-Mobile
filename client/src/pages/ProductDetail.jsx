import { useEffect, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found'));
  }, [id]);

  useEffect(() => {
    setMainImageIndex(0);
  }, [id, product?._id]);

  useEffect(() => {
    if (!cartMessage) return;

    const timer = setTimeout(() => setCartMessage(''), 2000);
    return () => clearTimeout(timer);
  }, [cartMessage]);

  const handleAddToCart = () => {
    addToCart(product);
    setCartMessage('Added to cart successfully');
  };

  if (error) return <div className="surface rounded-3xl p-8 text-red-600">{error}</div>;
  if (!product) return <div className="surface rounded-3xl p-10 text-slate-500">Loading product details...</div>;

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'];
  const currentImage = images[mainImageIndex] || images[0];
  const slidePrevious = () => setMainImageIndex((index) => (index - 1 + images.length) % images.length);
  const slideNext = () => setMainImageIndex((index) => (index + 1) % images.length);
  const specs = product.specifications || {};
  const warrantyText = product.warranty || '12 months warranty';

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface rounded-[28px] p-4 sm:p-6">
        <div className="relative overflow-hidden rounded-[22px] bg-[#f4f5f8]">
          <img src={currentImage} alt={`${product.title} view ${mainImageIndex + 1}`} className="h-100 w-full object-contain p-6 sm:h-136" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={slidePrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                aria-label="Previous product image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={slideNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                aria-label="Next product image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setMainImageIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                  index === mainImageIndex ? 'border-premium-accent' : 'border-slate-200'
                }`}
                aria-label={`Show product image ${index + 1}`}
              >
                <img src={image} alt={`${product.title} thumbnail ${index + 1}`} className="h-full w-full object-contain bg-[#f4f5f8]" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 lg:pt-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">{product.brand}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">{product.title}</h1>
        <div className="mt-4 flex items-center gap-2 text-sm"><span className="text-amber-500">★★★★★</span><span className="text-slate-500">4.8 · Highly rated</span></div>
        <p className="mt-5 max-w-xl leading-7 text-slate-500">{product.description}</p>
        <div className="mt-7 flex items-end gap-3">
          <span className="text-4xl font-black text-slate-900">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              ₹{Number(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm font-semibold text-emerald-600">{product.stock} in stock · Ready to ship</p>
        {product.type === 'second_hand' && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">Condition: {product.condition?.grade}</p>
            <p>Battery health: {product.condition?.batteryHealth}</p>
            <p>Screen: {product.condition?.screenCondition}</p>
            <p>Body: {product.condition?.bodyCondition}</p>
          </div>
        )}
        {cartMessage && (
          <p className="mt-4 text-sm font-bold text-emerald-600" aria-live="polite">
            {cartMessage}
          </p>
        )}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-premium-900 px-8 py-3.5 font-bold text-white hover:bg-premium-800 sm:w-auto"
        >
          <ShoppingBag size={18} />
          Add To Cart
        </button>
        <div className="mt-8 grid grid-cols-2 gap-3 border-y border-slate-200 py-5 text-xs text-slate-500 sm:grid-cols-4">
          {[[Truck, 'Fast delivery'], [ShieldCheck, 'Warranty'], [RotateCcw, 'Easy returns'], [BadgeCheck, 'Genuine']].map(([Icon, label]) => <div key={label} className="flex flex-col gap-2"><Icon size={18} className="text-premium-accent" /><span>{label}</span></div>)}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(specs).map(([key, value]) =>
            value ? (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-3">
                <dt className="capitalize text-slate-400">{key}</dt>
                <dd className="font-semibold">{String(value)}</dd>
              </div>
            ) : null
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <dt className="capitalize text-slate-400">warranty</dt>
            <dd className="font-semibold">{warrantyText}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProductDetail;
