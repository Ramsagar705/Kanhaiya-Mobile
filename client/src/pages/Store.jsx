import {
  ArrowRight,
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Tag,
  Wrench,
  Smartphone,
} from 'lucide-react';

const store = {
  address: 'Beside India Coffee House, Shop No. 101, Supela, Bhilai, Chhattisgarh',
  phone: '+91 93000 06031',
  phoneHref: 'tel:+919300006031',
  whatsappHref: 'https://wa.me/919300006031',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Kanhaiya+Mobile+Supela+Bhilai',
  heroImage: 'https://res.cloudinary.com/ddutcbbhl/image/upload/f_auto/q_auto/c64ca83d-e5a9-4b8a-a8ff-8bf2c8ce62fe.png',
  gallery: [
    'https://images.unsplash.com/photo-1592286927505-2fd0b56e9b4e?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=85',
  ],
};

const features = [
  { icon: Smartphone, title: 'New & Second-Hand Mobiles', text: 'Compare carefully checked devices in one place.' },
  { icon: ShieldCheck, title: 'Genuine Products', text: 'Shop with confidence from a trusted local team.' },
  { icon: Tag, title: 'Competitive Prices', text: 'Get clear pricing and value across every range.' },
  { icon: Wrench, title: 'Expert Assistance', text: 'Find the right phone with advice that fits you.' },
  { icon: Sparkles, title: 'Mobile Accessories', text: 'Complete your setup with useful everyday essentials.' },
];

const Store = () => (
  <div className="mx-auto max-w-6xl space-y-14 sm:space-y-20">
    <section className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Our store</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Visit Our Store</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
          Shop online or visit our physical store for mobiles, accessories and expert assistance.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={store.mapsHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-premium-900 px-5 py-3 text-sm font-bold text-white hover:bg-premium-800">
            <Navigation size={17} /> Get Directions
          </a>
          <a href={store.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-premium-accent hover:text-premium-accent">
            <MessageCircle size={17} /> WhatsApp Us
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-[30px] bg-slate-200 shadow-xl shadow-slate-900/10">
        <img src={store.heroImage} alt="Modern mobile phone store display" className="h-75 w-full object-cover sm:h-107.5" />
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[28px] bg-premium-900 p-7 text-white sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Kanhaiya Mobile</p>
        <h2 className="mt-3 text-2xl font-black">Everything you need, close by.</h2>
        <div className="mt-8 space-y-6">
          <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-indigo-300" size={20} /><div><p className="text-sm font-bold">Store Address</p><p className="mt-1 text-sm leading-6 text-slate-300">{store.address}</p></div></div>
          <div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-indigo-300" size={20} /><div><p className="text-sm font-bold">Opening Hours</p><p className="mt-1 text-sm leading-6 text-slate-300">Monday - Sunday<br />10:00 AM - 9:00 PM</p></div></div>
          <div className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-indigo-300" size={20} /><div><p className="text-sm font-bold">Contact</p><a href={store.phoneHref} className="mt-1 block text-sm text-slate-300 hover:text-white">{store.phone}</a></div></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <a href={store.mapsHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-premium-900 hover:bg-indigo-100"><Navigation size={16} /> Get Directions</a>
          <a href={store.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:border-white"><MessageCircle size={16} /> WhatsApp Us</a>
        </div>
      </div>
      <div>
        <div className="mb-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Why visit us?</p><h2 className="mt-2 text-3xl font-black">A better way to choose your next phone.</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="surface rounded-2xl p-5 last:sm:col-span-2">
              <Icon className="text-premium-accent" size={22} />
              <h3 className="mt-4 text-sm font-black">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section>
      <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Inside Kanhaiya Mobile</p><h2 className="mt-2 text-3xl font-black">Take a look around.</h2></div><a href={store.mapsHref} target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-sm font-bold text-premium-accent sm:flex">Find us <ArrowRight size={16} /></a></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {store.gallery.map((image, index) => <img key={image} src={image} alt={`Kanhaiya Mobile store view ${index + 1}`} className="h-44 w-full rounded-2xl object-cover shadow-sm sm:h-56" />)}
      </div>
    </section>

    <section className="rounded-[28px] bg-premium-lilac px-6 py-10 text-center sm:px-10 sm:py-14">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Need a quick answer?</p>
      <h2 className="mt-3 text-3xl font-black">Have questions before visiting?</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">Contact us on WhatsApp or call us for availability and pricing.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={store.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-premium-900 px-5 py-3 text-sm font-bold text-white hover:bg-premium-800"><Phone size={17} /> Call Now</a>
        <a href={store.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-premium-900/10 bg-white px-5 py-3 text-sm font-bold text-premium-900 hover:border-premium-accent"><MessageCircle size={17} /> WhatsApp Us</a>
      </div>
    </section>

    <section className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1.2fr]">
      <div className="p-7 sm:p-9"><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Find us</p><h2 className="mt-2 text-3xl font-black">Drop by and say hello.</h2><p className="mt-4 max-w-md leading-7 text-slate-500">We are easy to find in Supela. Use the directions button for the quickest route from your location.</p><p className="mt-6 flex gap-2 text-sm font-bold leading-6 text-slate-700"><MapPin className="mt-0.5 shrink-0 text-premium-accent" size={18} />{store.address}</p><a href={store.mapsHref} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-premium-900 px-5 py-3 text-sm font-bold text-white hover:bg-premium-800"><Navigation size={17} /> Get Directions</a></div>
      <iframe title="Kanhaiya Mobile location map" src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`} className="min-h-75 w-full border-0 bg-slate-100 lg:min-h-full" loading="lazy" />
    </section>
  </div>
);

export default Store;