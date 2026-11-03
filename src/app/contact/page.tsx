'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Share2, Heart } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(t('contact.toastSuccess'));
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-14 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-4 shadow-lg">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          {t('contact.title')}
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {[
            {
              icon: <Phone className="w-6 h-6" />,
              bg: 'from-blue-100 to-cyan-100',
              title: t('contact.phone'),
              desc: t('contact.phoneHours'),
              value: '+855 (0) 23 888 999',
              delay: '0ms'
            },
            {
              icon: <Mail className="w-6 h-6" />,
              bg: 'from-indigo-100 to-blue-100',
              title: t('contact.email'),
              desc: t('contact.emailResponse'),
              value: 'support@eshop-demo.com',
              delay: '100ms'
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              bg: 'from-purple-100 to-indigo-100',
              title: t('contact.address'),
              desc: 'Preah Monivong Boulevard, Daun Penh, Phnom Penh, Cambodia',
              value: null,
              delay: '200ms'
            },
            {
              icon: <Clock className="w-6 h-6" />,
              bg: 'from-amber-100 to-orange-100',
              title: t('contact.hours'),
              desc: t('contact.hoursWeekday'),
              value: t('contact.hoursSunday'),
              delay: '300ms'
            },
          ].map((item, idx) => (
            <div 
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all animate-in fade-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: item.delay }}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${item.bg} text-blue-600 mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.desc}</p>
              {item.value && (
                <p className="text-sm font-semibold text-blue-600">{item.value}</p>
              )}
            </div>
          ))}

          {/* Social Links */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '400ms' }}>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: <Share2 className="w-5 h-5" />, label: 'Share', color: 'hover:bg-blue-50 hover:text-blue-500' },
                { icon: <Heart className="w-5 h-5" />, label: 'Like', color: 'hover:bg-rose-50 hover:text-rose-500' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className={`p-3 border border-gray-200 rounded-lg text-gray-400 transition-all ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '100ms' }}>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              {t('contact.sendMessage')}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              {t('contact.formDesc')}
            </p>

            {submitted ? (
              <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in fade-in scale-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-emerald-900 text-lg">{t('contact.successTitle')}</h3>
                <p className="text-sm text-emerald-700 max-w-sm mx-auto">
                  {t('contact.successMsg')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-semibold text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '0ms' }}>
                    <label className="text-xs font-semibold text-gray-700 block mb-2">
                      {t('contact.yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
                    <label className="text-xs font-semibold text-gray-700 block mb-2">
                      {t('contact.yourEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about order delivery"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '150ms' }}>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe how we can assist you..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
