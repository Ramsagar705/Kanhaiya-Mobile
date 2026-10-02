import {
  BatteryCharging,
  Cable,
  Camera,
  Droplets,
  Mic,
  Settings2,
  Smartphone,
} from 'lucide-react';
import { FaAndroid, FaApple } from 'react-icons/fa';

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
    ],
  },
];

const RepairServices = () => (
  <div className="mx-auto max-w-6xl space-y-10">
    <header className="max-w-2xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">Expert care, right here</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Professional Mobile Repair Services</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
        Fast, reliable and professional repair services for your smartphone.
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
              <h2 className="text-xl font-black">{name}</h2>
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
  </div>
);

export default RepairServices;
