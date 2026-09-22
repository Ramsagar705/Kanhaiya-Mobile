import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const fallbackSlides = [
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85',
    title: 'Upgrade to something brilliant',
    subtitle: 'Fresh arrivals, honest prices, and phones ready for your next chapter.',
    link: '/products/new',
  },
];

const BannerCarousel = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    api.get('/banners').then((response) => {
      const nextSlides = response.data.slides || [];
      if (nextSlides.length) setSlides(nextSlides);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  const goToSlide = (index) => setActiveIndex((index + slides.length) % slides.length);
  const slide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden bg-premium-900" aria-label="Store offers and new mobile phones">
      <div className="relative mx-auto h-[260px] max-w-7xl sm:h-[340px] lg:h-[420px]">
        <img src={slide.image} alt={slide.title || 'Mobile phone offer'} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-premium-900/90 via-premium-900/55 to-transparent" />
        <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 text-white sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-premium-accent">KANHAIYA MOBILE</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{slide.title}</h2>
          <p className="mt-3 max-w-md text-sm text-slate-200 sm:text-base">{slide.subtitle}</p>
          {slide.link && (
            <a href={slide.link} className="mt-6 w-fit rounded-full bg-premium-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-premium-800">
              Shop now
            </a>
          )}
        </div>
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => goToSlide(activeIndex - 1)} aria-label="Previous banner" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2 text-premium-900 shadow hover:bg-white sm:left-6">
              <ArrowLeft size={20} />
            </button>
            <button type="button" onClick={() => goToSlide(activeIndex + 1)} aria-label="Next banner" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2 text-premium-900 shadow hover:bg-white sm:right-6">
              <ArrowRight size={20} />
            </button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((item, index) => (
                <button key={`${item.image}-${index}`} type="button" onClick={() => goToSlide(index)} aria-label={`Show banner ${index + 1}`} className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-7 bg-premium-accent' : 'w-2 bg-white/70'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerCarousel;
