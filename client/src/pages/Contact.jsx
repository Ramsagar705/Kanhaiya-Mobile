import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject') || 'General enquiry';
    const message = formData.get('message');
    const whatsappMessage = [
      'New message from MobiShop website',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Message: ${message}`,
    ].join('\n');

    window.open(
      `https://wa.me/916268480010?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-premium-accent">We are here to help</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">Let&apos;s talk mobile.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-500">
          Have a question about a phone, an order, or our certified second-hand range? Send us a message and our team will get back to you.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] bg-premium-900 p-8 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">KANHAIYA MOBILE</p><h2 className="mt-3 text-2xl font-black">Get in touch</h2>
          <div className="mt-10 space-y-7 text-sm text-slate-300">
            <div className="flex gap-3">
              <Mail className="text-premium-accent shrink-0" size={20} />
              <div>
                <p className="text-white font-semibold">Email</p>
                <p>hello@mobishop.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="text-premium-accent shrink-0" size={20} />
              <div>
                <p className="text-white font-semibold">Phone</p>
                <p>+91 9300006031</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="text-premium-accent shrink-0" size={20} />
              <div>
                <p className="text-white font-semibold">Store</p>
                <p>Beside India Coffee House shop No 101 Supela Bhilai</p>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-white/10 pt-5 text-sm text-slate-400">
            Our support team is available Monday to Saturday, 10:00 AM to 10:00 PM.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/kanhaiya__mobile_bhilai/"
              target="_blank"
              rel="noreferrer"
              aria-label="KANHAIYA MOBILE on Instagram"
              title="KANHAIYA MOBILE on Instagram"
              className="p-2 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-premium-accent transition-colors"
            >
              <FaInstagram size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@kanhaiyamobile"
              target="_blank"
              rel="noreferrer"
              aria-label="KANHAIYA MOBILE on YouTube"
              title="KANHAIYA MOBILE on YouTube"
              className="p-2 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-premium-accent transition-colors"
            >
              <FaYoutube size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="surface rounded-[28px] p-6 md:p-8">
          <h2 className="text-2xl font-black">Send a message</h2>
          {submitted && (
            <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Thanks for reaching out. We will get back to you soon.
            </p>
          )}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-3" />
              <input name="email" required type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-xl px-4 py-3" />
            </div>
            <input name="subject" placeholder="Subject" className="w-full border border-gray-200 rounded-xl px-4 py-3" />
            <textarea name="message" required rows="5" placeholder="How can we help?" className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-y" />
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-premium-900 px-6 py-3.5 font-bold text-white hover:bg-premium-800 sm:w-auto">
              Send to WhatsApp <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;