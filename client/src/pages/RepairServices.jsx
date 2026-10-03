import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  BatteryCharging,
  Battery,
  Cable,
  Camera,
  Check,
  CircleDot,
  Droplets,
  Mic,
  MessageCircle,
  ShieldCheck,
  Settings2,
  Smartphone,
} from 'lucide-react';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const exchangeSteps = [
  { title: 'Select Your Phone', text: 'Tell us the brand and model of your old phone.' },
  { title: 'Check Phone Condition', text: 'Share details about the display, battery, camera and overall condition.' },
  { title: 'Get Exchange Value', text: 'Our team checks your device and provides an estimated exchange value.' },
  { title: 'Upgrade Your Phone', text: 'Use the exchange value toward your next smartphone.' },
];

const exchangeChecks = [
  { label: 'Phone Model', Icon: Smartphone },
  { label: 'Display Condition', Icon: CircleDot },
  { label: 'Battery Health', Icon: Battery },
  { label: 'Camera', Icon: Camera },
  { label: 'Speaker & Microphone', Icon: Mic },
  { label: 'Charging Port', Icon: Cable },
  { label: 'Physical Damage', Icon: ShieldCheck },
  { label: 'Overall Working Condition', Icon: Check },
];

const repairPlatforms = [
  {
    name: 'iOS Repair',
    device: 'iPhone',
    Icon: FaApple,
    accent: 'text-slate-900',
    iconBackground: 'bg-slate-100',
    services: [
      { label: 'iPhone Screen Replacement', Icon: Smartphone },
      { label: 'Battery Replacement', Icon: BatteryCharging },
      { label: 'Charging Port Repair', Icon: Cable },
      { label: 'Camera Repair', Icon: Camera },
      { label: 'Speaker & Microphone Repair', Icon: Mic },
      { label: 'Software Issues', Icon: Settings2 },
      { label: 'Water Damage Diagnosis', Icon: Droplets },
      { label: 'Other Hardware & Software Issues', Icon: Settings2 },
    ],
  },
  {
    name: 'Android Repair',
    device: 'Android phone',
    Icon: FaAndroid,
    accent: 'text-emerald-700',
    iconBackground: 'bg-emerald-50',
    services: [
      { label: 'Screen Replacement', Icon: Smartphone },
      { label: 'Battery Replacement', Icon: BatteryCharging },
      { label: 'Charging Port Repair', Icon: Cable },
      { label: 'Camera Repair', Icon: Camera },
      { label: 'Speaker & Microphone Repair', Icon: Mic },
      { label: 'Software Issues', Icon: Settings2 },
      { label: 'Water Damage Diagnosis', Icon: Droplets },
      { label: 'Other Hardware & Software Issues', Icon: Settings2 },
    ],
  },
];

const RepairServices = () => (
  <div className="mx-auto max-w-6xl space-y-14 sm:space-y-16">
    <section aria-labelledby="exchange-heading">
      <header className="mb-7 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Upgrade your phone</p>
        <h1 id="exchange-heading" className="mt-2 text-3xl font-black sm:text-4xl">Get Best Exchange Value for Your Phone</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Exchange your old smartphone and upgrade to your next phone with a simple, transparent and hassle-free process.
        </p>
      </header>

      <div className="grid overflow-hidden rounded-[28px] bg-premium-900 text-white shadow-xl shadow-slate-900/10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-9 lg:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-indigo-200">
            <ArrowLeftRight size={25} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-black sm:text-3xl">Exchange Your Old Phone</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
            Get an estimated value for your old smartphone and use it toward your next phone.
          </p>
          <Link to="/exchange" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-premium-900 hover:bg-indigo-100 sm:w-auto">
            Check Exchange Value <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <p className="mt-4 text-xs font-semibold leading-5 text-slate-300">Quick evaluation <span className="px-1 text-indigo-300">•</span> Transparent pricing <span className="px-1 text-indigo-300">•</span> Easy process</p>
        </div>

        <div className="flex items-center justify-center border-t border-white/10 bg-white/4 p-5 sm:p-8 lg:border-l lg:border-t-0">
          <div className="flex w-full max-w-xs flex-col items-center gap-2.5 text-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-9 items-center justify-center rounded-lg border-2 border-white/50 bg-white/10 text-slate-200">
                <Smartphone size={22} aria-hidden="true" />
              </div>
              <span className="text-xs font-black tracking-wide text-slate-300">OLD PHONE</span>
            </div>
            <ArrowDown className="h-4 w-4 text-indigo-300" aria-hidden="true" />
            <div className="flex min-h-12 w-full items-center justify-center rounded-xl border border-indigo-200/30 bg-indigo-300/15 px-3 text-xs font-black tracking-wide text-indigo-100">
              EXCHANGE VALUE
            </div>
            <ArrowDown className="h-4 w-4 text-indigo-300" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-9 items-center justify-center rounded-lg border-2 border-indigo-300 bg-indigo-300/15 text-white">
                <Smartphone size={24} aria-hidden="true" />
              </div>
              <span className="text-xs font-black tracking-wide text-indigo-200">NEW PHONE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="steps-heading">
      <header className="mb-6 max-w-2xl">
        <h2 id="steps-heading" className="text-2xl font-black sm:text-3xl">How Phone Exchange Works</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">Upgrade your smartphone in just a few simple steps.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exchangeSteps.map(({ title, text }, index) => (
          <article key={title} className="surface rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium-lilac text-sm font-black text-premium-accent">{index + 1}</span>
            <h3 className="mt-5 text-base font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="repair-heading">
      <header className="mb-7 max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Expert care, right here</p>
        <h2 id="repair-heading" className="mt-2 text-3xl font-black sm:text-4xl">Professional Mobile Repair Services</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          We handle all types of hardware and software-related issues with quality service at affordable prices.
        </p>
        <p className="mt-4 inline-flex rounded-xl border border-premium-accent/15 bg-premium-lilac px-4 py-2 text-sm font-black text-premium-900">
          Quality Repairs. Affordable Prices.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          From screen and battery replacement to charging, camera, software and other smartphone issues, our experienced technicians provide reliable repair solutions.
        </p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {repairPlatforms.map(({ name, device, Icon, accent, iconBackground, services }) => (
          <article
            key={name}
            className="surface group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBackground} ${accent}`}>
                <Icon size={30} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-black">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">Professional care for your {device}</p>
              </div>
            </div>
            <ul className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2 sm:p-6">
              {services.map(({ label, Icon: ServiceIcon }) => (
                <li key={label} className="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-700">
                  <ServiceIcon className={`h-4 w-4 shrink-0 ${accent}`} aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm sm:flex-row sm:justify-center sm:gap-3">
        <p className="text-sm font-black text-premium-900">All Types of Hardware &amp; Software Issues</p>
        <span className="hidden text-premium-accent sm:inline" aria-hidden="true">•</span>
        <p className="text-xs font-bold text-slate-500">Quality Service <span className="px-1 text-premium-accent">•</span> Affordable Pricing <span className="px-1 text-premium-accent">•</span> Reliable Repairs</p>
      </div>
    </section>

    <section aria-labelledby="checks-heading">
      <header className="mb-6 max-w-2xl">
        <h2 id="checks-heading" className="text-2xl font-black sm:text-3xl">What We Check Before Exchange</h2>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {exchangeChecks.map(({ label, Icon }) => (
          <div key={label} className="surface flex min-h-24 min-w-0 items-center gap-3 rounded-2xl p-3 sm:p-4">
            <Icon className="h-5 w-5 shrink-0 text-premium-accent" aria-hidden="true" />
            <span className="text-xs font-bold leading-5 text-slate-700 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Final exchange value may vary after physical inspection of the device.</p>
    </section>

    <section className="rounded-[28px] bg-premium-lilac px-6 py-9 sm:px-10 sm:py-12" aria-labelledby="service-cta-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="service-cta-heading" className="text-2xl font-black sm:text-3xl">Ready to Upgrade or Repair Your Phone?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Get the best value for your old phone or get your current smartphone repaired by Kanhaiya Mobile.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/exchange" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-premium-900 px-5 py-3 text-sm font-bold text-white hover:bg-premium-800">
            Check Exchange Value <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/store" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-premium-900/15 bg-white px-5 py-3 text-sm font-bold text-premium-900 hover:border-premium-accent">
            <MessageCircle size={17} aria-hidden="true" /> Contact Us
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default RepairServices;
