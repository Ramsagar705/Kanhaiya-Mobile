import { ArrowLeftRight, ArrowRight, MessageCircle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Exchange = () => {
  const submitExchangeRequest = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const model = formData.get('model');
    const condition = formData.get('condition');
    const message = `Hi Kanhaiya Mobile, I would like an exchange estimate for my phone.\nModel: ${model}\nCondition: ${condition}`;
    const whatsappUrl = `https://wa.me/919300006031?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/repair-services" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-premium-accent">
        <ArrowLeftRight size={17} aria-hidden="true" /> Exchange & Repair
      </Link>
      <div className="mt-6 grid overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-900/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-premium-900 p-6 text-white sm:p-9 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Upgrade your phone</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Check Your Exchange Value</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
            Share a few details about your current phone. Our team will help estimate its value and guide you through your upgrade.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
              <Smartphone size={23} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black">Old phone to new phone</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">A clear estimate after a physical inspection.</p>
            </div>
          </div>
        </div>

        <form onSubmit={submitExchangeRequest} className="p-6 sm:p-9 lg:p-10">
          <h2 className="text-xl font-black">Your current phone</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Tell us what you have and we’ll take it from there.</p>
          <label className="mt-6 block text-sm font-bold text-slate-700" htmlFor="exchange-model">Brand and model</label>
          <input
            id="exchange-model"
            name="model"
            required
            placeholder="e.g. iPhone 13, Samsung Galaxy S23"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-premium-accent"
          />
          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="exchange-condition">Overall condition</label>
          <select id="exchange-condition" name="condition" required defaultValue="" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-premium-accent">
            <option value="" disabled>Select a condition</option>
            <option>Like new</option>
            <option>Good, with light wear</option>
            <option>Fair, with visible wear</option>
            <option>Damaged or not working properly</option>
          </select>
          <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-premium-900 px-5 py-3 text-sm font-bold text-white hover:bg-premium-800">
            <MessageCircle size={17} aria-hidden="true" /> Request Exchange Estimate <ArrowRight size={17} aria-hidden="true" />
          </button>
          <p className="mt-4 text-xs leading-5 text-slate-500">Final exchange value may vary after physical inspection of the device.</p>
        </form>
      </div>
    </div>
  );
};

export default Exchange;
